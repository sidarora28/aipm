/**
 * JAPM revenue dashboard — sheet reader.
 *
 * SETUP
 *   1. Open EITHER spreadsheet ▸ Extensions ▸ Apps Script
 *   2. Paste this over everything ▸ Save
 *   3. Change TOKEN below to a long random string
 *   4. Run ▸ doGet once, and approve the permission prompt
 *   5. Deploy ▸ New deployment ▸ Web app
 *        Execute as:     Me
 *        Who has access: Anyone
 *   6. Copy the /exec URL → that is SHEET_API_URL in Vercel
 *
 * "Anyone" is safe: every request must carry ?token=, and this script never
 * returns Name, Email, Receipt URL or any per-person row. Members are
 * aggregated by cohort INSIDE Google. Personal data never leaves the sheets.
 *
 * Deploy from an account that can open BOTH spreadsheets below.
 */

var TOKEN = 'CHANGE-ME-to-a-long-random-string';

// "Full Stats for DS" — cash collected, one row per Stripe/SamCart charge.
var SALES_ID    = '1GBCmgnBDOXLD3dznKPepmEGhE-TgjsrDP4J5yBbzmuw';
var SALES_SHEET = 'All Online Sales';

// "Member Details" — one row per member, Price = full contract value.
var MEMBERS_ID    = '1gbc2EVfwkIqrXXtFRCh72IsHALWHF9YsIgKRe6I5edA';
var MEMBERS_SHEET = 'Members';

// Optional costs tab; put it in either file, the script looks in both.
var COSTS_SHEET = 'Costs';

function doGet(e) {
  try {
    if (((e && e.parameter && e.parameter.token) || '') !== TOKEN) {
      return json({ error: 'bad token' });
    }
    return json({
      generatedAt: new Date().toISOString(),
      orders:  readOrders(),
      cohorts: readCohorts(),
      costs:   readCosts(),
    });
  } catch (err) {
    return json({ error: String(err && err.message ? err.message : err) });
  }
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

function headerMap(row) {
  var m = {};
  for (var i = 0; i < row.length; i++) {
    var k = String(row[i] || '').trim().toLowerCase();
    if (k && !(k in m)) m[k] = i;
  }
  return m;
}

function pick(row, map, names) {
  for (var i = 0; i < names.length; i++) {
    var idx = map[names[i]];
    if (idx !== undefined && row[idx] !== '' && row[idx] !== null) return row[idx];
  }
  return '';
}

function ymd(v) {
  if (v instanceof Date && !isNaN(v.getTime())) {
    return Utilities.formatDate(v, 'UTC', 'yyyy-MM-dd');
  }
  var s = String(v || '').trim();
  if (!s) return '';
  var d = new Date(s);
  return isNaN(d.getTime()) ? '' : Utilities.formatDate(d, 'UTC', 'yyyy-MM-dd');
}

function num(v) {
  if (typeof v === 'number') return v;
  var s = String(v || '').replace(/[^0-9.\-]/g, '');
  if (!s || s === '-' || s === '.') return 0;
  var n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function truthy(v) {
  var s = String(v || '').trim().toLowerCase();
  return s === 'true' || s === 'yes' || s === '1';
}

/** Cash collected. One object per charge, with no identifying columns. */
function readOrders() {
  var sh = SpreadsheetApp.openById(SALES_ID).getSheetByName(SALES_SHEET);
  if (!sh) throw new Error('Sheet not found: ' + SALES_SHEET);

  var v = sh.getDataRange().getValues();
  if (v.length < 2) return [];
  var map = headerMap(v[0]);
  var out = [];

  for (var r = 1; r < v.length; r++) {
    var row = v[r];
    var d = ymd(pick(row, map, ['date']));
    var p = String(pick(row, map, ['product name', 'product']) || '').trim();
    var usd = num(pick(row, map, ['usd amount']));
    var inr = num(pick(row, map, ['inr']));
    var amt = num(pick(row, map, ['amount']));
    if (!d && !p && !usd && !inr && !amt) continue;

    out.push({
      d: d,
      p: p || 'Unknown',
      c: String(pick(row, map, ['country']) || '').trim().toUpperCase(),
      cur: String(pick(row, map, ['currency']) || '').trim().toLowerCase(),
      amt: amt, usd: usd, inr: inr,
      ch: String(pick(row, map, ['channel of sale', 'channel']) || '').trim(),
      fee: num(pick(row, map, ['gr fee'])),
      dfee: num(pick(row, map, ['discovery fee'])),
      net: num(pick(row, map, ['minus commission'])),
      dupe: truthy(pick(row, map, ['dupes'])),
    });
  }
  return out;
}

/**
 * Booked (contract) revenue, aggregated by cohort so no member row leaves.
 * Price is the full course value, recognised at first payment.
 */
function readCohorts() {
  var ss;
  try { ss = SpreadsheetApp.openById(MEMBERS_ID); }
  catch (err) { return []; }

  var sh = ss.getSheetByName(MEMBERS_SHEET);
  if (!sh) return [];

  var v = sh.getDataRange().getValues();
  if (v.length < 2) return [];
  var map = headerMap(v[0]);

  // Only these are read. Name / Email / CERT are deliberately never touched.
  var iCohort = map['cohort'];
  var iPrice  = map['price'];
  if (iCohort === undefined || iPrice === undefined) return [];

  var agg = {};
  for (var r = 1; r < v.length; r++) {
    var row = v[r];
    var cohort = String(row[iCohort] || '').trim();
    var price = num(row[iPrice]);
    if (!cohort && !price) continue;
    cohort = cohort || 'Unassigned';

    if (!agg[cohort]) {
      agg[cohort] = { cohort: cohort, members: 0, booked: 0, paying: 0, refunds: 0, countries: {} };
    }
    agg[cohort].members += 1;
    agg[cohort].booked += price;
    if (price > 0) agg[cohort].paying += 1;
    agg[cohort].refunds += num(pick(row, map, ['lovable refund', 'refund']));

    var country = String(pick(row, map, ['country']) || '').trim();
    if (country) agg[cohort].countries[country] = (agg[cohort].countries[country] || 0) + 1;
  }

  var out = [];
  for (var k in agg) {
    if (Object.prototype.hasOwnProperty.call(agg, k)) out.push(agg[k]);
  }
  out.sort(function (a, b) { return String(a.cohort).localeCompare(String(b.cohort)); });
  return out;
}

/**
 * Optional Costs tab, looked for in both files. Headers (any order):
 *   Date | Category | Description | Amount | Currency | Recurring
 * Recurring = monthly | yearly | one-off
 */
function readCosts() {
  var ids = [SALES_ID, MEMBERS_ID];
  var out = [];
  for (var i = 0; i < ids.length; i++) {
    var sh;
    try { sh = SpreadsheetApp.openById(ids[i]).getSheetByName(COSTS_SHEET); }
    catch (err) { continue; }
    if (!sh) continue;

    var v = sh.getDataRange().getValues();
    if (v.length < 2) continue;
    var map = headerMap(v[0]);

    for (var r = 1; r < v.length; r++) {
      var row = v[r];
      var amount = num(pick(row, map, ['amount', 'amount (usd)', 'usd']));
      var cat = String(pick(row, map, ['category', 'cat']) || '').trim();
      if (!amount && !cat) continue;
      out.push({
        d: ymd(pick(row, map, ['date', 'month'])),
        cat: cat || 'Uncategorised',
        desc: String(pick(row, map, ['description', 'desc', 'note', 'vendor']) || '').trim(),
        amt: amount,
        cur: String(pick(row, map, ['currency']) || 'usd').trim().toLowerCase(),
        rec: String(pick(row, map, ['recurring', 'frequency']) || '').trim().toLowerCase(),
      });
    }
  }
  return out;
}
