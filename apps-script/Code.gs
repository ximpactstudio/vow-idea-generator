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
    const payload = JSON.parse(e.postData.contents || "{}");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const intake = ss.getSheetByName("Idea Intake");
    const meta = ss.getSheetByName("Meta");
    if (!intake) throw new Error('Missing "Idea Intake" sheet');
    if (!meta) throw new Error('Missing "Meta" sheet');

    const get = (obj, keys, fallback = "") => {
      for (var i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
      }
      return fallback;
    };

    const toStr = (v) => (v === undefined || v === null) ? "" : String(v);

    const now = new Date();

    const idea = toStr(get(payload, ["idea", "idea_raw", "ideaRaw", "ideaText"]));
    const repeatability = toStr(get(payload, ["repeatability", "repeatable", "repeatabilityText"]));
    const name = toStr(get(payload, ["name", "your_name", "yourName"]));
    const email = toStr(get(payload, ["email", "your_email", "yourEmail"]));
    const whoFor = toStr(get(payload, ["who_for", "whoFor", "audience"]));
    const moment = toStr(get(payload, ["moment", "trigger", "occasion"]));
    const success = toStr(get(payload, ["success", "success_metric", "successMetric"]));
    const links = toStr(get(payload, ["links", "references", "link"]));
    const h1 = toStr(get(payload, ["h1", "idea_h1", "ideaH1"]));
    const h2 = toStr(get(payload, ["h2", "idea_h2", "ideaH2"]));
    const h3 = toStr(get(payload, ["h3", "idea_h3", "ideaH3"]));
    const bulletsVal = get(payload, ["bullets"], "");
    const bullets = Array.isArray(bulletsVal) ? bulletsVal.join(" | ") : toStr(bulletsVal);
    const type = toStr(get(payload, ["type", "idea_type", "ideaType"]));
    const horizon = toStr(get(payload, ["horizon", "Horizon"]));
    const component = toStr(get(payload, ["component", "component_area", "componentArea"]));
    const area = toStr(get(payload, ["area", "componentAreaDetail", "component_detail"]));
    const tagsVal = get(payload, ["tags"], "");
    const tags = Array.isArray(tagsVal) ? tagsVal.join(", ") : toStr(tagsVal);
    const confidence = toStr(get(payload, ["confidence"]));
    const rationale = toStr(get(payload, ["rationale", "reasoning"]));

    const row = [
      now,
      idea,
      repeatability,
      name,
      email,
      whoFor,
      moment,
      success,
      links,
      h1,
      h2,
      h3,
      bullets,
      type,
      horizon,
      component,
      area,
      tags,
      confidence,
      rationale,
      "Web Intake",
      "New"
    ];

    intake.appendRow(row);

    // increment counter with lock
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const cell = meta.getRange("B1");
      const current = Number(cell.getValue()) || 0;
      const updated = current + 1;
      cell.setValue(updated);

      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, ideas_submitted: updated }))
        .setMimeType(ContentService.MimeType.JSON);
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err && err.message ? err.message : err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}