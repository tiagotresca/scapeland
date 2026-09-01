/**
 * Scapeland — lead sink for the reservation form.
 *
 * Appends each submitted lead as a row in the "Scapeland Leads" Google Sheet:
 * https://docs.google.com/spreadsheets/d/1xljqH0cVv31maySnlTqf-j0ilOarsr7LMMTaBWsvVhs
 *
 * Setup (once, ~2 minutes — see docs/DEPLOY.md):
 *  1. Open the sheet above → Extensions → Apps Script.
 *  2. Paste this file's content, save.
 *  3. Deploy → New deployment → type "Web app" →
 *     Execute as: Me · Who has access: Anyone.
 *  4. Copy the Web App URL into FORM_ENDPOINT in assets/js/main.js.
 */
var SHEET_ID = '1xljqH0cVv31maySnlTqf-j0ilOarsr7LMMTaBWsvVhs';

function doPost(e) {
  var lead = {};
  try {
    lead = JSON.parse(e.postData.contents || '{}');
  } catch (err) {}
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  sheet.appendRow([
    new Date(),
    String(lead.name || ''),
    String(lead.email || ''),
    String(lead.phone || ''),
    'scapeland.com'
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
