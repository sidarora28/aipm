/**
 * Exercises the REAL lib/ledger.js + lib/roster.js against an in-memory sheet.
 * googleapis is replaced in the require cache before the modules load.
 */
const path = require('path');
const Module = require('module');

const PROJECT = __dirname;
const BUILD = path.join(__dirname, '.testbuild');

// ---- in-memory spreadsheet -------------------------------------------------
const sheet = {
  Roster: [
    ['Name', 'Email', 'Cohort'],
    ['Ishanya Anthapur', 'Ishanya@Example.com ', '2'],
    ['Dana Two-Cohorts', 'dana@example.com', '1'],
    ['Dana Two-Cohorts', 'DANA@example.com', '3'],
    ['Nobody Yet', 'nobody@example.com', '2'],
  ],
  issued: [['cert_id', 'email_lower', 'cohort', 'name', 'issued_at', 'drive_file_id']],
};

let apiCalls = { get: 0, append: 0, update: 0 };

function parseTab(range) {
  return String(range).split('!')[0].replace(/^'|'$/g, '');
}
function colIndex(letters) {
  let n = 0;
  for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

const fakeGoogleapis = {
  google: {
    auth: { JWT: class {} },
    drive: () => ({}),
    sheets: () => ({
      spreadsheets: {
        values: {
          async get({ range }) {
            apiCalls.get++;
            return { data: { values: sheet[parseTab(range)] ?? [] } };
          },
          async append({ range, requestBody }) {
            apiCalls.append++;
            const tab = parseTab(range);
            sheet[tab].push(requestBody.values[0]);
            const rowNumber = sheet[tab].length;
            return { data: { updates: { updatedRange: `${tab}!A${rowNumber}:F${rowNumber}` } } };
          },
          async update({ range, requestBody }) {
            apiCalls.update++;
            const tab = parseTab(range);
            const cell = String(range).split('!')[1];
            const m = /^([A-Z]+)(\d+)$/.exec(cell);
            sheet[tab][Number(m[2]) - 1][colIndex(m[1])] = requestBody.values[0][0];
            return { data: {} };
          },
        },
      },
    }),
  },
};

const resolved = require.resolve('googleapis', { paths: [PROJECT] });
require.cache[resolved] = new Module(resolved, null);
require.cache[resolved].exports = fakeGoogleapis;
require.cache[resolved].loaded = true;

process.env.SHEET_ID = 'test-sheet';
process.env.ROSTER_TAB = 'Roster';
process.env.LEDGER_TAB = 'issued';
process.env.GOOGLE_SERVICE_ACCOUNT_B64 = Buffer.from(
  JSON.stringify({ client_email: 'a@b.com', private_key: 'k' }),
).toString('base64');

const ledger = require(path.join(BUILD, 'ledger.js'));
const roster = require(path.join(BUILD, 'roster.js'));

// ---- assertions ------------------------------------------------------------
let failures = 0;
function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
  if (!ok) console.log(`        expected ${JSON.stringify(expected)}\n        actual   ${JSON.stringify(actual)}`);
}

/** What the /api/lookup route does, minus PDF generation and Drive. */
async function lookup(rawEmail) {
  const email = roster.normalizeEmail(rawEmail);
  if (!roster.looksLikeEmail(email)) return [];
  const entries = await roster.findRosterEntries(email);
  const out = [];
  for (const entry of entries) {
    const row = await ledger.reserveOrFind(entry.emailLower, entry.cohort, entry.name);
    if (!row.driveFileId) {
      await ledger.setDriveFileId(row.rowNumber, `drive-file-for-${row.certId}`);
    }
    out.push({ certId: row.certId, cohort: row.cohort, name: row.name });
  }
  return out;
}

(async () => {
  console.log('--- first request -------------------------------------------');
  const first = await lookup('Ishanya@Example.com');
  console.log(first);
  check('cohort 2 gets AIPM code + cohort digit + seq 001', first, [
    { certId: 'JAPMAIPM2001', cohort: '2', name: 'Ishanya Anthapur' },
  ]);

  console.log('\n--- repeat request, different casing and whitespace ---------');
  const repeat = await lookup('  ISHANYA@example.com  ');
  console.log(repeat);
  check('same cert_id returned', repeat, first);
  check('no second ledger row appended', sheet.issued.length, 2);

  console.log('\n--- multi-cohort person ------------------------------------');
  const dana = await lookup('dana@example.com');
  console.log(dana);
  check('both cohorts issued, global sequence continues', dana.map((c) => c.certId), [
    'JAPMAIPM1002',
    'JAPMBWCC3003',
  ]);

  const danaAgain = await lookup('dana@example.com');
  check('multi-cohort repeat is stable', danaAgain, dana);

  console.log('\n--- privacy / input handling -------------------------------');
  check('unknown email yields nothing', await lookup('stranger@example.com'), []);
  check('malformed email yields nothing', await lookup('not-an-email'), []);

  console.log('\n--- concurrent first-time requests -------------------------');
  const before = sheet.issued.length;
  const [a, b] = await Promise.all([
    ledger.reserveOrFind('nobody@example.com', '2', 'Nobody Yet'),
    ledger.reserveOrFind('someone@example.com', '2', 'Someone Else'),
  ]);
  console.log([a.certId, b.certId]);
  check('collision resolved, two distinct ids', a.certId !== b.certId, true);
  check('two rows appended', sheet.issued.length - before, 2);

  console.log('\n--- lookup by cert id (verify page + download route) --------');
  const found = await ledger.findByCertId('japmaipm2001');
  check('case-insensitive cert id lookup', found && found.name, 'Ishanya Anthapur');
  check('drive file id stored', found && found.driveFileId, 'drive-file-for-JAPMAIPM2001');
  check('unknown cert id', await ledger.findByCertId('JAPMAIPM9999'), null);

  console.log('\n--- final ledger -------------------------------------------');
  console.table(sheet.issued.slice(1).map((r) => ({ cert_id: r[0], email: r[1], cohort: r[2], file: r[5] })));

  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
})();
