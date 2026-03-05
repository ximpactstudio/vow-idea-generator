/**
 * VOW Idea Intake — Google Apps Script Web App
 * Deploy as Web App (Execute as: Me, Who has access: Anyone) to get a URL.
 * Set that URL as GOOGLE_APPS_SCRIPT_WEBHOOK_URL in your Next.js env.
 *
 * Required sheet tabs (create them manually; script does not auto-create):
 * - "Idea Intake": headers in row 1 must match the row order below.
 * - "Meta": cell B1 = Ideas Submitted count (number). Set B1 to 172 initially.
 */

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents || "{}");

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var intake = ss.getSheetByName("Idea Intake");
    if (!intake) throw new Error('Missing sheet tab "Idea Intake"');

    var meta = ss.getSheetByName("Meta");
    if (!meta) throw new Error('Missing sheet tab "Meta" (create Meta, set B1 = 172)');

    // Helper: accept both Next.js keys ("Idea (raw)") and snake_case (idea_raw)
    var get = function(key, snakeKey, def) {
      def = def || "";
      if (payload[key] != null && payload[key] !== "") return payload[key];
      if (snakeKey && payload[snakeKey] != null && payload[snakeKey] !== "") return payload[snakeKey];
      return def;
    };

    var now = new Date();
    var row = [
      now,
      get("Idea (raw)", "idea_raw") || get("idea"),
      get("Repeatability", "repeatability"),
      get("Name", "name"),
      get("Email", "email"),
      get("Who for", "who_for"),
      get("Moment", "moment"),
      get("Success", "success"),
      get("Links", "links"),
      get("Idea H1", "idea_h1"),
      get("Idea H2", "idea_h2"),
      Array.isArray(payload.Bullets) ? payload.Bullets.join(" | ") : (Array.isArray(payload.bullets) ? payload.bullets.join(" | ") : (get("Bullets", "bullets") || "")),
      get("Type", "type"),
      get("Horizon", "horizon"),
      get("Component Area", "component_area"),
      Array.isArray(payload.Tags) ? payload.Tags.join(", ") : (get("Tags", "tags") || ""),
      get("Confidence", "confidence"),
      get("Rationale", "rationale"),
      get("Source", "source") || "Web intake",
      get("Status", "status") || "New",
    ];
    intake.appendRow(row);

    // Increment counter atomically (LockService prevents race conditions)
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      var cell = meta.getRange("B1");
      var current = Number(cell.getValue()) || 0;
      var updated = current + 1;
      cell.setValue(updated);
      return _json({ ok: true, ideas_submitted: updated });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return _json({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function doGet() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var meta = ss.getSheetByName("Meta");
    if (!meta) throw new Error('Missing sheet tab "Meta"');
    var val = Number(meta.getRange("B1").getValue()) || 0;
    return _json({ ok: true, ideas_submitted: val });
  } catch (err) {
    return _json({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
