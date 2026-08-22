/**
 * Exercises the REAL lib/members.js against an in-memory "members" tab.
 * googleapis is replaced in the require cache before the modules load.
 */
const path = require('path');
const Module = require('module');

const PROJECT = __dirname;
const BUILD = path.join(__dirname, '.testbuild');

// ---- in-memory spreadsheet (mirrors the real members tab layout) ----------
const sheet = {
  members: [
    ['Name', 'Email', 'Cohort', 'Country', 'Timezone', 'Price', 'CERT ID', 'CERT URL'],
    ['Ishanya Anthapur', 'iAnthapur@gmail.com ', '2', 'IN', '', '', '', ''],
    ['Lauren Nagel', 'llyounger@gmail.com', '2', 'US', '', '', '', ''],
    ['Lauren Nagel', 'llyounger@gmail.com', '3', 'US', '', '', '', ''],
    ['Nikesh Surana', 'gmnikesh@gmail.com', '1', 'IN', '', '', '', ''],
    ['Someone Else', 'someone@example.com', '2', '', '', '', '', ''],
  ],
};

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
            return { data: { values: sheet[parseTab(range)] ?? [] } };
          },
          async update({ range, requestBody }) {
            const tab = parseTab(range);
            const m = /^([A-Z]+)(\d+)$/.exec(String(range).split('!')[1]);
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
process.env.MEMBERS_TAB = 'members';
process.env.GOOGLE_SERVICE_ACCOUNT_B64 = Buffer.from(
  JSON.stringify({ client_email: 'a@b.com', private_key: 'k' }),
).toString('base64');

const members = require(path.join(BUILD, 'members.js'));

let failures = 0;
function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
  if (!ok) console.log(`        expected ${JSON.stringify(expected)}\n        actual   ${JSON.stringify(actual)}`);
}

/** What /api/lookup does, minus PDF generation and Drive. */
async function lookup(rawEmail) {
  const email = members.normalizeEmail(rawEmail);
  if (!members.looksLikeEmail(email)) return [];
  const rows = await members.findMemberRows(email);
  const out = [];
  for (const row of rows) {
    const certId = await members.reserveCertId(row.rowNumber);
    if (!row.certUrl) await members.setCertUrl(row.rowNumber, `https://x.test/api/certificate/${certId}`);
    out.push({ certId, cohort: row.cohort, name: row.name });
  }
  return out;
}

(async () => {
  console.log('--- first request -------------------------------------------');
  const first = await lookup('iAnthapur@gmail.com');
  console.log(first);
  check('cohort 2 -> AIPM, seq 001', first, [
    { certId: 'JAPMAIPM2001', cohort: '2', name: 'Ishanya Anthapur' },
  ]);

  console.log('\n--- repeat, different casing and whitespace -----------------');
  check('same cert id returned', await lookup('  IANTHAPUR@GMAIL.COM  '), first);
  check('CERT URL written once', sheet.members[1][7], 'https://x.test/api/certificate/JAPMAIPM2001');

  console.log('\n--- multi-cohort person (cohorts 2 and 3) ------------------');
  const lauren = await lookup('llyounger@gmail.com');
  console.log(lauren);
  check('two certificates, global sequence, BWCC for cohort 3',
    lauren.map((c) => c.certId), ['JAPMAIPM2002', 'JAPMBWCC3003']);
  check('multi-cohort repeat is stable', await lookup('llyounger@gmail.com'), lauren);

  console.log('\n--- privacy / input handling -------------------------------');
  check('unknown email yields nothing', await lookup('stranger@example.com'), []);
  check('malformed email yields nothing', await lookup('not-an-email'), []);

  console.log('\n--- concurrent first-time requests -------------------------');
  const [a, b] = await Promise.all([
    members.reserveCertId(5), // Nikesh, cohort 1   (row 5: +1 header, 0-based -> 1-based)
    members.reserveCertId(6), // Someone Else, cohort 2
  ]);
  console.log([a, b]);
  check('collision resolved, two distinct ids', a !== b, true);
  check('both are fresh sequential ids', [a, b].sort(), ['JAPMAIPM1004', 'JAPMAIPM2005']);

  console.log('\n--- lookup by cert id (verify + download) ------------------');
  const found = await members.findByCertId('japmaipm2001');
  check('case-insensitive cert id lookup', found && found.name, 'Ishanya Anthapur');
  check('unknown cert id', await members.findByCertId('JAPMAIPM9999'), null);

  console.log('\n--- final members tab --------------------------------------');
  console.table(sheet.members.slice(1).map((r) => ({ name: r[0], email: r[1], cohort: r[2], 'CERT ID': r[6], 'CERT URL': r[7] ? 'set' : '' })));

  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
})();
