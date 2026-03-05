/**
 * VOW Idea Intake — Google Apps Script Web App
 * Deploy as Web App (Execute as: Me, Who has access: Anyone) to get a URL.
 * Set that URL as GOOGLE_APPS_SCRIPT_WEBHOOK_URL in your Next.js env.
 *
 * Sheets:
 * - "Idea Intake": one row per idea (headers in row 1).
 * - "Meta": cell A1 = Ideas Submitted count (number). Initialize to 172.
 */

function doGet() {
  try {
    var count = getIdeasSubmittedCount();
    return createJsonResponse(200, { ideas_submitted: count });
  } catch (err) {
    console.error(err);
    return createJsonResponse(500, { ideas_submitted: 172, error: err.toString() });
  }
}

function doPost(e) {
  try {
    var body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    var sheet = getIdeaIntakeSheet();
    var headers = getHeaders(sheet);
    var row = mapToRow(body, headers);
    sheet.appendRow(row);
    var newCount = incrementIdeasSubmittedCount();
    return createJsonResponse(200, { ok: true, ideas_submitted: newCount });
  } catch (err) {
    console.error(err);
    return createJsonResponse(500, { ok: false, error: err.toString() });
  }
}

function getIdeaIntakeSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Idea Intake');
  if (!sheet) {
    sheet = ss.insertSheet('Idea Intake');
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

function getMetaSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Meta');
  if (!sheet) {
    sheet = ss.insertSheet('Meta');
    sheet.getRange('A1').setValue(172);
    sheet.getRange('A1').setNumberFormat('0');
  }
  return sheet;
}

function getIdeasSubmittedCount() {
  var sheet = getMetaSheet();
  var val = sheet.getRange('A1').getValue();
  var num = typeof val === 'number' ? val : parseInt(String(val), 10);
  return isNaN(num) ? 172 : Math.max(0, Math.floor(num));
}

function incrementIdeasSubmittedCount() {
  var sheet = getMetaSheet();
  var current = getIdeasSubmittedCount();
  var newCount = current + 1;
  sheet.getRange('A1').setValue(newCount);
  sheet.getRange('A1').setNumberFormat('0');
  return newCount;
}

function getHeaders(sheet) {
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
