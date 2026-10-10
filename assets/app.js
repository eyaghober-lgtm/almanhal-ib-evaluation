"use strict";
/* IB Classroom Evaluation: welcome → 3 steps → result → history. No login; data stays on this device. */
const $ = (id) => document.getElementById(id);
let view = "welcome", step = 1, curRec = null;

const blank = () => ({ role: "", evaluator: "", teacher: "", branch: "", subject: "", klass: "", date: new Date().toISOString().slice(0, 10),
  sc: Array(10).fill(0), inotes: Array(10).fill(""), strengths: "", growth: "", next: "", general: "", support: "", followUp: "" });
let D = Object.assign(blank(), store.get("ibe_draft", {}));
const saveDraft = () => store.set("ibe_draft", D);
const hasDraft = () => !!(D.support || D.followUp || D.role || D.evaluator || D.teacher || D.klass || D.sc.some(Boolean) || D.strengths || D.growth || D.next || D.general || D.inotes.some(Boolean));
const visits = () => store.get("ibe_visits", []);
const find = (name, key) => { const x = getList(name).find((x) => keyOf(x.o) === key); return x ? x.o : key; };
const toast = (m) => { const e = document.createElement("div"); e.className = "toast"; e.textContent = m; document.body.appendChild(e); setTimeout(() => e.remove(), 1800); };

/* ---------- view switching ---------- */
function go(v, opts) {
  view = v; if (opts && opts.step) step = opts.step;
  $("v-welcome").hidden = v !== "welcome";
  $("app").hidden = v === "welcome";
  $("v-form").hidden = v !== "form"; $("v-result").hidden = v !== "result"; $("v-history").hidden = v !== "history"; $("v-day").hidden = v !== "day";
  document.querySelectorAll("[data-go]").forEach((a) => a.classList.toggle("on", a.dataset.go === (v === "result" || v === "day" ? "history" : v)));
  if (v === "form") renderForm(); if (v === "result") renderResult(curRec); if (v === "history") renderHistory(); if (v === "day") renderDay(); if (v === "welcome") renderWelcome();
  window.scrollTo({ top: 0 });
}
document.addEventListener("click", (e) => {
  const g = e.target.closest("[data-go]");
  if (g) { e.preventDefault(); if (g.dataset.go === "form" && g.dataset.new) { D = blank(); saveDraft(); step = 1; } go(g.dataset.go, { step: g.dataset.go === "form" ? step : undefined }); }
});
function renderWelcome() { $("resumeBtn").hidden = !hasDraft(); }

/* ---------- form ---------- */
const opts = (name, sel, addable) =>
  `<option value="">${t("choose")}</option>` + getList(name).map((x) => { const k = keyOf(x.o); return `<option value="${esc(k)}" ${k === sel ? "selected" : ""}>${esc(lab(x.o))}</option>`; }).join("") + (addable ? `<option value="__add">${t("addNew")}</option>` : "");
const field = (id, label, inner, req, full) => `<div class="f ${full ? "full" : ""}"><label for="${id}">${label}${req ? ' <span class="req">*</span>' : ""}</label>${inner}</div>`;

function stepper() {
  const names = ["step1", "step2", "step3"];
  return `<div class="stepper">${names.map((n, i) => `<div class="s ${step === i + 1 ? "on" : ""} ${step > i + 1 ? "done" : ""}"><i>${step > i + 1 ? "✓" : i + 1}</i><span>${t(n)}</span></div>${i < 2 ? `<div class="line"><b style="width:${step > i + 1 ? 100 : 0}%"></b></div>` : ""}`).join("")}</div>`;
}
function panelHtml() {
  if (step === 1) {
    return `<h2>${t("s1title")}</h2><p class="sub">${t("s1text")}</p><div class="grid2">
      ${field("f-role", t("role"), `<select id="f-role">${opts("roles", D.role, true)}</select>`, true)}
      ${field("f-evaluator", t("evaluator"), `<select id="f-evaluator">${opts("evaluators", D.evaluator, true)}</select>`, true)}
      ${field("f-teacher", t("teacher"), `<select id="f-teacher">${opts("teachers", D.teacher, true)}</select>`, true, true)}
      ${field("f-branch", t("branch"), `<select id="f-branch">${opts("branches", D.branch, true)}</select>`)}
      ${field("f-subject", t("subject"), `<select id="f-subject">${opts("subjects", D.subject, true)}</select>`)}
      ${field("f-klass", t("klass"), `<input id="f-klass" value="${esc(D.klass)}" placeholder="${t("klassPh")}">`)}
      ${field("f-date", t("date"), `<input id="f-date" type="date" value="${esc(D.date)}">`)}
    </div><div class="err" id="err"></div>`;
  }
  if (step === 2) {
    return `<h2>${t("s2title")}</h2><p class="sub">${t("s2text")}</p>` + ITEMS.map((_, i) => `<div class="item ${D.inotes[i] ? "shownote" : ""}" id="it${i}">
      <div class="n">${i + 1}</div><div><h4>${esc(itemName(i))}</h4><small>${esc(itemHint(i))}</small><button type="button" class="nb" data-nb="${i}">${t("noteBtn")}</button></div>
      <div class="cs">${[1, 2, 3, 4].map((v) => `<input type="radio" name="q${i}" id="q${i}_${v}" value="${v}" ${D.sc[i] === v ? "checked" : ""}><label for="q${i}_${v}" title="${lvl(v)}">${v}</label>`).join("")}</div>
      <div class="note"><textarea data-note="${i}" placeholder="${t("notePh")}">${esc(D.inotes[i])}</textarea></div></div>`).join("") + `<div class="err" id="err"></div>`;
  }
  return `<h2>${t("s3title")}</h2><p class="sub">${t("s3text")}</p><div class="grid2">
    ${field("f-general", t("general"), `<textarea id="f-general" placeholder="${t("generalPh")}">${esc(D.general)}</textarea>`, false, true)}
    ${field("f-strengths", t("strengths"), `<textarea id="f-strengths" placeholder="${t("strengthsPh")}">${esc(D.strengths)}</textarea>`, false, true)}
    ${field("f-growth", t("growth"), `<textarea id="f-growth" placeholder="${t("growthPh")}">${esc(D.growth)}</textarea>`, false, true)}
    ${field("f-next", t("nextStep"), `<textarea id="f-next" placeholder="${t("nextPh")}">${esc(D.next)}</textarea>`, false, true)}
    ${field("f-support", t("support"), `<input id="f-support" value="${esc(D.support)}" placeholder="${t("supportPh")}">`)}
    ${field("f-followUp", t("followUp"), `<input id="f-followUp" type="date" value="${esc(D.followUp)}">`)}
  </div><div class="err" id="err"></div>`;
}
function renderForm() {
  $("stepper").innerHTML = stepper();
  const p = $("panel"); p.innerHTML = panelHtml(); p.classList.remove("panel"); void p.offsetWidth; p.classList.add("panel");
  $("btnBack").hidden = step === 1;
  $("btnNext").textContent = step === 3 ? t("finish") : t("next");
  updateBar();
}
function score() { const n = D.sc.filter(Boolean).length, sum = D.sc.reduce((a, b) => a + b, 0); return { n, sum, pct: Math.round((sum / 40) * 100) }; }
function updateBar() {
  const s = score();
  $("ring").style.setProperty("--p", s.pct); $("ringTxt").textContent = s.pct + "%";
  $("barTitle").textContent = t("perfLabel") + " " + (s.n ? `${s.sum}/40` : "");
  $("barNote").textContent = s.n === 10 ? t("allScored") + " · " + t("grade") + " " + gradeOf(s.pct) : t("scored", { n: s.n });
}
const MAP = { "f-role": "role", "f-evaluator": "evaluator", "f-teacher": "teacher", "f-branch": "branch", "f-subject": "subject", "f-klass": "klass", "f-date": "date", "f-strengths": "strengths", "f-growth": "growth", "f-next": "next", "f-general": "general", "f-support": "support", "f-followUp": "followUp" };
const ADDSTR = { "f-role": "roles", "f-evaluator": "evaluators", "f-teacher": "teachers", "f-branch": "branches", "f-subject": "subjects" };
let timer = 0;
$("panel").addEventListener("input", (e) => { const k = MAP[e.target.id]; if (k && e.target.tagName !== "SELECT") D[k] = e.target.value; if (e.target.dataset.note !== undefined) D.inotes[+e.target.dataset.note] = e.target.value; clearTimeout(timer); timer = setTimeout(saveDraft, 300); });
$("panel").addEventListener("change", (e) => {
  const id = e.target.id, k = MAP[id];
  if (e.target.name && /^q\d+$/.test(e.target.name)) { D.sc[+e.target.name.slice(1)] = +e.target.value; saveDraft(); updateBar(); return; }
  if (!k || e.target.tagName !== "SELECT") return;
  if (e.target.value === "__add") {
    const v = (prompt(t("addPrompt")) || "").trim();
    if (v) { const o = ["f-role", "f-branch", "f-subject"].includes(id) ? { ar: v, en: v } : v; addToList(ADDSTR[id], o); D[k] = keyOf(o); }
    saveDraft(); renderForm(); return;
  }
  D[k] = e.target.value;
  if (id === "f-teacher" && D.teacher) { const nm = find("teachers", D.teacher), m = teacherMeta(typeof nm === "string" ? nm : keyOf(nm)); if (m.sub) D.subject = keyOf(m.sub); if (m.br) D.branch = keyOf(m.br); saveDraft(); renderForm(); return; }
  saveDraft();
});
$("panel").addEventListener("click", (e) => { const b = e.target.closest("[data-nb]"); if (b) $("it" + b.dataset.nb).classList.toggle("shownote"); });
$("btnBack").addEventListener("click", () => { step = Math.max(1, step - 1); renderForm(); window.scrollTo({ top: 0, behavior: "smooth" }); });
$("btnNext").addEventListener("click", () => {
  const err = (m) => { const e = $("err"); if (e) e.textContent = m; };
  if (step === 1 && !(D.role && D.evaluator && D.teacher)) return err(t("needStep1"));
  if (step === 2 && D.sc.includes(0)) return err(t("needStep2"));
  if (step < 3) { step++; renderForm(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  finish();
});

/* ---------- finish → result ---------- */
function finish() {
  if (!(D.role && D.evaluator && D.teacher)) { step = 1; renderForm(); $("err").textContent = t("needStep1"); return; }
  if (D.sc.includes(0)) { step = 2; renderForm(); $("err").textContent = t("needStep2"); return; }
  const s = score();
  const rec = { id: Date.now().toString(36), ts: Date.now(), date: D.date, role: find("roles", D.role), evaluator: find("evaluators", D.evaluator), teacher: find("teachers", D.teacher),
    branch: D.branch ? find("branches", D.branch) : "", subject: D.subject ? find("subjects", D.subject) : "", klass: D.klass, sc: D.sc.slice(), inotes: D.inotes.slice(),
    strengths: D.strengths, growth: D.growth, next: D.next, general: D.general, support: D.support, followUp: D.followUp, sum: s.sum, pct: s.pct, grade: gradeOf(s.pct) };
  store.set("ibe_visits", visits().concat([rec]));
  D = blank(); saveDraft(); step = 1; curRec = rec; go("result"); const tg = $("savedTag"); if (tg) tg.hidden = false;
}

/* ---------- result ---------- */
const nm = (o) => lab(o);
const dName = (r) => nm(r.teacher);
function metaLine(r) { return [nm(r.teacher), nm(r.branch), nm(r.subject), r.klass, r.date].filter(Boolean).map(esc).join(" · "); }
function lists(r) {
  const strong = r.sc.map((s, i) => [s, i]).filter((x) => x[0] >= 3), weak = r.sc.map((s, i) => [s, i]).filter((x) => x[0] <= 2);
  return { strong, weak };
}
const bandChip = (b) => `<span class="band" style="background:${b.bg};color:${b.col}">${t(b.key)}</span>`;
function actionBlock(r) {
  const rows = [[t("nextStep"), r.next], [t("support"), r.support], [t("followUp"), r.followUp]].filter((x) => x[1]);
  return rows.length ? `<table class="plan">${rows.map(([k, v]) => `<tr><th>${k}</th><td>${esc(v)}</td></tr>`).join("")}</table>` : `<p class="meta-line">${t("noAction")}</p>`;
}
function renderResult(r) {
  if (!r) return go("welcome");
  const { strong, weak } = lists(r), b = bandOf(r.pct), av = avgItems(r.sc);
  const notes = [["general", r.general], ["strengths", r.strengths], ["growth", r.growth]].filter((x) => x[1]);
  const inotes = r.inotes.map((n, i) => [i, n]).filter((x) => x[1]);
  $("v-result").innerHTML = `<div class="panel card res">
    <div class="snap" style="background:${b.bg};border-color:${b.col}33">
      <div class="snap-num" style="color:${b.col}">${r.pct}<small>%</small></div>
      <div class="snap-txt"><b>${esc(dName(r))}</b><span>${[nm(r.subject), nm(r.branch), r.klass].filter(Boolean).map(esc).join(" · ")}</span>
        ${bandChip(b)}<span class="gr ${r.grade}">${t("grade")} ${r.grade}</span>
        <span class="meta-line"><bdi dir="ltr">${av.toFixed(2)} / 4</bdi> ${t("avgItems")} · <bdi dir="ltr">${r.sum}/40</bdi> · ${esc(r.date)}</span></div></div>
    <div class="meta-line" style="margin-top:8px">${t("by")}: ${esc(nm(r.evaluator))} · ${esc(nm(r.role))}</div>
    <span class="savedtag" id="savedTag" hidden>${t("saved")}</span>
    <h3>${t("distTitle")}</h3>${distBar(distribution([r.sc]))}${distLegend()}
    <h3>${t("strongTitle")}</h3><ul>${strong.length ? strong.map(([s, i]) => `<li>${esc(itemName(i))} — ${lvl(s)}</li>`).join("") : `<li>${t("none3")}</li>`}</ul>
    <h3>${t("devTitle")}</h3><ul>${weak.length ? weak.map(([s, i]) => `<li><b>${esc(itemName(i))}</b> (${lvl(s)}): ${esc(itemTip(i))}</li>`).join("") : `<li>${t("allGood")}</li>`}</ul>
    <h3>${t("actionTitle")}</h3>${actionBlock(r)}
    ${notes.length || inotes.length ? `<h3>${t("notesTitle")}</h3>${notes.map(([k, v]) => `<div class="nt"><b>${t(k)}</b>${esc(v)}</div>`).join("")}${inotes.map(([i, n]) => `<div class="nt"><b>${i + 1}. ${esc(itemName(i))}</b>${esc(n)}</div>`).join("")}` : ""}
    <h3>${t("profile")}</h3><div class="radar">${radarSvg(r.sc)}</div>
    <div class="actions"><button class="btn p" id="bPdf">${t("pdf")}</button><button class="btn o" id="bShare">${t("share")}</button><button class="btn o" id="bCopy">${t("copy")}</button>
      <button class="btn o" data-go="form" data-new="1">${t("newEval")}</button><button class="btn o" data-go="history">${t("toHistory")}</button></div></div>`;
  $("bPdf").onclick = () => printHtml(reportHtml(r));
  $("bShare").onclick = () => shareSummary(r);
  $("bCopy").onclick = async () => { try { await navigator.clipboard.writeText(summary(r)); toast(t("copied")); } catch (e) { prompt("", summary(r)); } };
}
function summary(r) {
  const { strong, weak } = lists(r), b = bandOf(r.pct);
  const L = [`${t("appName")} — ${t("school")}`, metaLine(r).replace(/<[^>]+>/g, ""), `${t("by")}: ${nm(r.evaluator)} (${nm(r.role)})`,
    `${t("perfLabel")}: ${r.pct}% (${r.sum}/40) — ${t(b.key)} · ${t("grade")} ${r.grade}`];
  if (strong.length) L.push("", t("strongTitle") + ":", ...strong.map(([s, i]) => `• ${itemName(i)}`));
  if (weak.length) L.push("", t("devTitle") + ":", ...weak.map(([s, i]) => `• ${itemName(i)}: ${itemTip(i)}`));
  if (r.general) L.push("", t("general") + ": " + r.general);
  if (r.strengths) L.push(t("strengths") + ": " + r.strengths);
  if (r.growth) L.push(t("growth") + ": " + r.growth);
  if (r.next) L.push(t("nextStep") + ": " + r.next);
  if (r.support) L.push(t("support") + ": " + r.support);
  if (r.followUp) L.push(t("followUp") + ": " + r.followUp);
  return L.join("\n");
}
async function shareSummary(r) {
  const text = summary(r);
  if (navigator.share) { try { await navigator.share({ title: t("appName"), text }); return; } catch (e) { if (e && e.name === "AbortError") return; } }
  window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener");
}

/* ---------- printing: everything goes through #report (A4) ---------- */
function printHtml(html) { $("report").innerHTML = html; document.body.classList.add("has-report"); setTimeout(() => window.print(), 80); }
window.addEventListener("afterprint", () => document.body.classList.remove("has-report"));
const whenStr = () => new Date().toLocaleDateString(lang === "ar" ? "ar" : "en-GB", { year: "numeric", month: "long", day: "numeric" });
const footBand = () => `<div class="rp-foot">${t("footer")} · ${t("rpIssued")} ${whenStr()}</div>`;

/* one observation → A4 report */
function reportHtml(r) {
  const { strong, weak } = lists(r), b = bandOf(r.pct), av = avgItems(r.sc);
  const nts = [["general", r.general], ["strengths", r.strengths], ["growth", r.growth]].filter((x) => x[1]);
  const plan = [[t("nextStep"), r.next], [t("support"), r.support], [t("followUp"), r.followUp]].filter((x) => x[1]);
  return `<div class="rp-head"><img src="assets/logo.png" alt=""><div><h1>${t("rpTitle")}</h1><small>${t("school")} · ${t("appName")}</small></div></div>
  <div class="rp-meta"><div><span>${t("teacher")}</span><b>${esc(nm(r.teacher))}</b></div><div><span>${t("branch")}</span><b>${esc(nm(r.branch) || "—")}</b></div><div><span>${t("subject")}</span><b>${esc(nm(r.subject) || "—")}</b></div>
    <div><span>${t("klass")}</span><b>${esc(r.klass || "—")}</b></div><div><span>${t("evaluator")} · ${t("role")}</span><b>${esc(nm(r.evaluator))} · ${esc(nm(r.role))}</b></div><div><span>${t("rpDate")}</span><b>${esc(r.date)}</b></div></div>
  <div class="rp-score" style="background:${b.bg}"><div class="rp-ring">${donutSvg(r.pct, b.col, 80, r.pct + "%")}</div>
    <div><b style="font-size:13pt;color:${b.col}">${t(b.key)}</b><span class="rp-grade">${t("grade")} ${r.grade}</span><p>${t("totalOf", { s: r.sum })} · <bdi dir="ltr">${av.toFixed(2)} / 4</bdi> ${t("avgItems")}</p><p>${t("rpScale")}</p></div></div>
  <div class="rp-title">${t("rpItems")}</div>
  <table class="rp-items">${ITEMS.map((_, i) => `<tr class="${r.sc[i] <= 2 ? "low" : ""}"><td>${i + 1}</td><td>${esc(itemName(i))}${r.inotes[i] ? `<small>${esc(r.inotes[i])}</small>` : ""}</td><td style="width:30%"><span class="bar"><i style="width:${(r.sc[i] / 4) * 100}%;background:${LEVEL_COL[r.sc[i]]}"></i></span></td><td style="width:92px;white-space:nowrap"><b>${r.sc[i]}</b> ${lvl(r.sc[i])}</td></tr>`).join("")}</table>
  <div class="rp-cols"><div><div class="rp-title">${t("strongTitle")}</div><ul>${strong.length ? strong.map(([s, i]) => `<li>${esc(itemName(i))}</li>`).join("") : "<li>—</li>"}</ul></div>
    <div><div class="rp-title">${t("devTitle")}</div><ul>${weak.length ? weak.map(([s, i]) => `<li><b>${esc(itemName(i))}:</b> ${esc(itemTip(i))}</li>`).join("") : `<li>${t("allGood")}</li>`}</ul></div></div>
  ${nts.length || plan.length ? `<div class="rp-notes"><div class="rp-title">${t("notesTitle")} · ${t("actionTitle")}</div>${nts.map(([k, v]) => `<p><b>${t(k)}:</b> ${esc(v)}</p>`).join("")}${plan.map(([k, v]) => `<p><b>${k}:</b> ${esc(v)}</p>`).join("")}</div>` : ""}
  <div class="rp-sign"><div>${t("sigObserver")}</div><div>${t("sigTeacher")}</div><div>${t("sigAdmin")}</div></div>
  ${footBand()}`;
}

/* ---------- day report: several teachers observed on one day ---------- */
let dayDate = "";
const strongNames = (r) => r.sc.map((s, i) => [s, i]).filter((x) => x[0] >= 3).sort((a, b) => b[0] - a[0]).slice(0, 3).map(([s, i]) => itemName(i)).join(" · ");
const priorityTips = (r) => r.sc.map((s, i) => [s, i]).filter((x) => x[0] <= 2).sort((a, b) => a[0] - b[0]).slice(0, 2).map(([s, i]) => itemTip(i)).join(" ");
function dayReportHtml(recs, date) {
  const n = recs.length, dist = distribution(recs.map((r) => r.sc)), total = n * ITEMS.length;
  const avgPct = Math.round(recs.reduce((a, r) => a + r.pct, 0) / n), bAvg = bandOf(avgPct);
  const itemAvg = ITEMS.map((_, i) => recs.reduce((a, r) => a + r.sc[i], 0) / n), schoolAvg = itemAvg.reduce((a, b) => a + b, 0) / ITEMS.length;
  const gi = itemAvg.indexOf(Math.min(...itemAvg)), hasGap = itemAvg[gi] < 3;
  const lowCount = (i) => recs.filter((r) => r.sc[i] <= 2).length;
  const observers = [...new Set(recs.map((r) => nm(r.evaluator)))].map(esc).join(" · ");
  const ranked = recs.slice().sort((a, b) => b.pct - a.pct);
  const ini = (s) => String(s).replace(/^(ms\.|mr\.|mrs\.|أ\.|ا\.)\s*/i, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const working = ITEMS.map((_, i) => i).filter((i) => recs.every((r) => r.sc[i] >= 3)).slice(0, 4);
  const gaps = ITEMS.map((_, i) => [lowCount(i), i]).filter((x) => x[0] >= Math.ceil(n / 2) && x[0] > 0).sort((a, b) => b[0] - a[0]).slice(0, 4);
  const steps = recs.map((r) => ({ d: r.followUp || "", who: dName(r), focus: r.next || priorityTips(r) || "—", support: r.support || "" })).sort((a, b) => (a.d || "9999").localeCompare(b.d || "9999"));
  const pill = (ico, k, v) => `<div class="d2-pill"><span>${ico}</span><div><small>${k}</small><b>${v}</b></div></div>`;
  return `<div class="dr2">
  <header class="d2-head"><img src="assets/logo.png" alt=""><div><h1>${t("drTitle")}</h1><p>${t("drSub")}</p></div>
    <div class="d2-chips"><span>📅 ${t("drDate")}: <b>${esc(date)}</b></span><span>👤 ${observers}</span></div></header>

  <section class="d2-board">
    <div class="d2-ring">${donutSvg(avgPct, bAvg.col, 132, avgPct + "%", schoolAvg.toFixed(2) + " / 4")}</div>
    <div class="d2-stats"><h3>${t("drAvg")} <span class="band" style="background:${bAvg.bg};color:${bAvg.col}">${t(bAvg.key)}</span></h3>
      <div class="d2-pills">${pill("🏫", t("drLessons"), n)}${pill("★", t("drTop"), dist[4])}${pill("✔", t("drRated"), total)}
        ${pill(hasGap ? "⚠" : "✓", t("drGap"), hasGap ? esc(itemName(gi)) : t("drNoGap"))}</div>
      ${hasGap ? `<p class="d2-note">${t("drGapSub", { n: lowCount(gi), m: n })}</p>` : ""}</div>
  </section>

  <h2 class="d2-h">${t("drSnap")}</h2><p class="d2-sub">${t("drSnapSub")}</p>
  <div class="d2-list">${ranked.map((r) => { const b = bandOf(r.pct), av = avgItems(r.sc); return `<div class="d2-row">
    <span class="av" style="background:${b.col}">${esc(ini(dName(r)))}</span>
    <div class="mid"><div class="line"><b>${esc(dName(r))}</b><span class="meta">${[nm(r.subject), r.klass].filter(Boolean).map(esc).join(" · ")}</span></div>
      <div class="track"><i style="width:${r.pct}%;background:${b.col}"></i></div>
      <p class="up">▲ ${esc(strongNames(r)) || "—"}</p><p class="nx">➜ ${esc(priorityTips(r)) || t("allGood")}</p></div>
    <div class="end"><b style="color:${b.col}">${r.pct}%</b><small><bdi dir="ltr">${av.toFixed(2)} / 4</bdi></small><span class="band" style="background:${b.bg};color:${b.col}">${t(b.key)}</span></div></div>`; }).join("")}</div>

  <h2 class="d2-h">${t("drTitle2")}</h2><p class="d2-sub">${t("drDistSub")}</p>
  <div class="d2-dist">${distBar(dist)}${distLegend()}</div>

  <div class="d2-split">
    <div><h2 class="d2-h">${t("drHeat")}</h2><p class="d2-sub">${t("drHeatSub")}</p>
      <table class="d2-grid"><thead><tr><th></th>${recs.map((r) => `<th title="${esc(dName(r))}">${esc(ini(dName(r)))}</th>`).join("")}<th>Ø</th></tr></thead><tbody>
      ${ITEMS.map((_, i) => `<tr><td>${i + 1}. ${esc(itemName(i))}</td>${recs.map((r) => `<td><span class="dot" style="background:${LEVEL_COL[r.sc[i]]}">${r.sc[i]}</span></td>`).join("")}<td class="avgc"><b>${itemAvg[i].toFixed(1)}</b></td></tr>`).join("")}</tbody></table></div>
    <div><h2 class="d2-h">${t("drProfile")}</h2><div class="radar">${radarSvg(itemAvg, 230)}</div></div>
  </div>

  <h2 class="d2-h">${t("drPatterns")}</h2>
  <div class="d2-two">
    <div class="up"><h4>✓ ${t("drWorking")}</h4><ul>${working.length ? working.map((i) => `<li>${t("drWorkingAll", { item: esc(itemName(i)) })}</li>`).join("") : "<li>—</li>"}</ul></div>
    <div class="dn"><h4>➜ ${t("drGaps")}</h4><ul>${gaps.length ? gaps.map(([c, i]) => `<li>${t("drGapAll", { item: esc(itemName(i)), n: c, m: n })}</li>`).join("") : "<li>—</li>"}</ul></div></div>

  <h2 class="d2-h">${t("drAction")}</h2>
  <ol class="d2-time">${hasGap ? `<li class="all"><time>${t("drAll")}</time><div><b>${esc(itemName(gi))}</b><p>${esc(itemTip(gi))}</p></div></li>` : ""}
    ${steps.map((x) => `<li><time>${esc(x.d || "—")}</time><div><b>${esc(x.who)}</b><p>${esc(x.focus)}</p>${x.support ? `<small>🤝 ${esc(x.support)}</small>` : ""}</div></li>`).join("")}</ol>
  <div class="d2-foot">${t("footer")} · ${t("rpIssued")} ${whenStr()}</div></div>`;
}
function renderDay() {
  const all = visits(), dates = [...new Set(all.map((r) => r.date))].sort().reverse();
  if (!dayDate || !dates.includes(dayDate)) dayDate = dates[0] || "";
  const recs = all.filter((r) => r.date === dayDate).sort((a, b) => a.ts - b.ts);
  $("v-day").innerHTML = `<div class="panel"><div class="actions" style="margin:0 0 14px;align-items:center"><button class="btn o sm" data-go="history">${t("closeBtn")}</button>
    <label style="margin:0;font-weight:600">${t("drPick")}: <select id="dayPick" style="padding:8px 12px;border-radius:10px;border:1px solid var(--line)">${dates.map((d) => `<option ${d === dayDate ? "selected" : ""}>${d}</option>`).join("")}</select></label>
    ${recs.length ? `<button class="btn p sm" id="bDayPdf">${t("drPrint")}</button>` : ""}</div>
    ${recs.length ? dayReportHtml(recs, dayDate) : `<div class="card empty"><p>${t("drNone")}</p></div>`}</div>`;
  const pick = $("dayPick"); if (pick) pick.onchange = () => { dayDate = pick.value; renderDay(); };
  const pdf = $("bDayPdf"); if (pdf) pdf.onclick = () => printHtml(dayReportHtml(recs, dayDate));
}

/* ---------- history ---------- */
function renderHistory() {
  const all = visits().slice().reverse();
  $("v-history").innerHTML = `<div class="panel"><h2>${t("histTitle")}</h2><p class="sub">${t("histText")}</p>
    ${all.length ? `<div class="actions" style="margin:0 0 12px"><button class="btn p sm" data-go="form" data-new="1">${t("newEval")}</button><button class="btn o sm" id="bDay">${t("dayReport")}</button><button class="btn o sm" id="bCsv">${t("exportCsv")}</button><span class="meta-line" style="align-self:center">${t("count", { n: all.length })}</span></div>`
      : ""}
    ${all.length ? all.map((r) => `<div class="hrow"><div class="mini ${r.grade}">${r.pct}%</div><div class="txt"><b>${esc(nm(r.teacher))}</b><small>${[nm(r.subject), nm(r.branch), r.date].filter(Boolean).map(esc).join(" · ")} — ${t("by")}: ${esc(nm(r.evaluator))}</small></div>
      <button class="btn o sm" data-open="${r.id}">${t("open")}</button><button class="btn d sm" data-del="${r.id}">${t("delete")}</button></div>`).join("")
      : `<div class="card empty"><div class="ico">📋</div><p>${t("histEmpty")}</p><div class="actions" style="justify-content:center"><button class="btn p" data-go="form" data-new="1">${t("start")}</button></div></div>`}</div>`;
  const csv = $("bCsv"); if (csv) csv.onclick = exportCsv; const dy = $("bDay"); if (dy) dy.onclick = () => go("day");
}
$("v-history").addEventListener("click", (e) => {
  const o = e.target.closest("[data-open]"), d = e.target.closest("[data-del]");
  if (o) { curRec = visits().find((r) => r.id === o.dataset.open); go("result"); }
  if (d && confirm(t("confirmDel"))) { store.set("ibe_visits", visits().filter((r) => r.id !== d.dataset.del)); renderHistory(); }
});
function exportCsv() {
  const all = visits(), q = (s) => `"${String(s == null ? "" : s).replace(/"/g, '""')}"`;
  const head = [t("date"), t("teacher"), t("role"), t("evaluator"), t("branch"), t("subject"), t("klass"), ...ITEMS.map((_, i) => itemName(i)), "Total", "%", t("grade"), t("strengths"), t("growth"), t("nextStep"), t("general"), t("support"), t("followUp")];
  const csv = "﻿" + [head, ...all.map((r) => [r.date, nm(r.teacher), nm(r.role), nm(r.evaluator), nm(r.branch), nm(r.subject), r.klass, ...r.sc, r.sum, r.pct + "%", r.grade, r.strengths, r.growth, r.next, r.general, r.support, r.followUp])].map((x) => x.map(q).join(",")).join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "ib-evaluations.csv"; a.click();
}

/* ---------- start ---------- */
document.addEventListener("langchange", () => go(view));
(async function () { await loadConfig(); applyLang(); go(location.hash === "#history" ? "history" : "welcome"); })();
