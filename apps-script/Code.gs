/**
 * VOW Idea Intake — Google Apps Script Web App
 * Deploy as Web App (Execute as: Me, Who has access: Anyone) to get a URL.
 * Set that URL as GOOGLE_APPS_SCRIPT_WEBHOOK_URL in your Next.js env.
 *
 * Sheet must have a sheet named "Ideas" with these columns in row 1:
 * Timestamp, Idea (raw), Repeatability, Who for, Moment, Success, Links,
 * Idea H1, Idea H2, Bullets, Type, Horizon, Component Area, Tags,
 * Confidence, Rationale, Source, Status
 */

function doPost(e) {
  try {
    var body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    var sheet = getIdeasSheet();
    var headers = getHeaders();
    var row = mapToRow(body, headers);
    sheet.appendRow(row);
    return createJsonResponse(200, { ok: true });
  } catch (err) {
    console.error(err);
    return createJsonResponse(500, { ok: false, error: err.toString() });
  }
}

function getIdeasSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Ideas');
  if (!sheet) {
    sheet = ss.insertSheet('Ideas');
    var headers = [
      'Timestamp', 'Idea (raw)', 'Repeatability', 'Who for', 'Moment', 'Success', 'Links',
      'Idea H1', 'Idea H2', 'Bullets', 'Type', 'Horizon', 'Component Area', 'Tags',
      'Confidence', 'Rationale', 'Source', 'Status'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

function getHeaders() {
  var sheet = getIdeasSheet();
  return sheet.getRange(1, 1, 1, 18).getValues()[0];
}

function mapToRow(body, headers) {
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    var key = headers[i];
    var value = body[key] != null ? String(body[key]) : '';
    row.push(value);
  }
  return row;
}

function createJsonResponse(statusCode, data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
