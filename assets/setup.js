"use strict";
/* Administrator setup: add/set roles, names, branches, subjects and teachers. */
const $ = (id) => document.getElementById(id);
const toast = (m) => { const e = document.createElement("div"); e.className = "toast"; e.textContent = m; document.body.appendChild(e); setTimeout(() => e.remove(), 1600); };
const DEFS = [
  { k: "roles", title: "listRoles", ico: "🧭", type: "bi" },
  { k: "evaluators", title: "listEvaluators", ico: "✍️", type: "name" },
  { k: "teachers", title: "listTeachers", ico: "👩‍🏫", type: "teacher" },
  { k: "branches", title: "listBranches", ico: "🏫", type: "bi" },
  { k: "subjects", title: "listSubjects", ico: "📚", type: "bi" },
];
const filt = {};

function build() {
  $("lists").innerHTML = DEFS.map((d) => `<div class="card lcard" id="c_${d.k}">
    <div class="lh"><div class="ico">${d.ico}</div><h3>${t(d.title)}</h3><span class="cnt" id="n_${d.k}">0</span></div>
    <form class="addrow" data-add="${d.k}">
      ${d.type === "bi" ? `<input name="ar" placeholder="${t("arPh")}" dir="rtl" autocomplete="off"><input name="en" placeholder="${t("enPh")}" dir="ltr" autocomplete="off">`
        : `<input name="name" placeholder="${t("namePh")}" autocomplete="off">`}
      ${d.type === "teacher" ? `<select name="sub"><option value="">${t("subject")}</option>${getList("subjects").map((x) => `<option value="${esc(keyOf(x.o))}">${esc(lab(x.o))}</option>`).join("")}</select>
        <select name="br"><option value="">${t("branch")}</option>${getList("branches").map((x) => `<option value="${esc(keyOf(x.o))}">${esc(lab(x.o))}</option>`).join("")}</select>` : ""}
      <button class="btn p sm" type="submit">${t("addBtn")}</button>
    </form>
    <div class="tools"><input data-search="${d.k}" placeholder="${t("search")}" value="${esc(filt[d.k] || "")}"><button class="link" data-bulk="${d.k}">${t("bulk")}</button></div>
    <div data-bulkbox="${d.k}" hidden><textarea rows="4" style="width:100%;margin-top:8px;padding:10px;border:1px solid var(--line);border-radius:12px;background:var(--bg)" placeholder="${d.type === "bi" ? "عربي | English" : t("bulkPh")}"></textarea><button class="btn p sm" style="margin-top:8px" data-bulkgo="${d.k}">${t("addAll")}</button></div>
    <div class="tags" id="t_${d.k}"></div></div>`).join("");
  DEFS.forEach((d) => tags(d.k));
  const g = gradeLimits(); $("gA").value = g.a; $("gB").value = g.b; $("gC").value = g.c;
}
function tags(k) {
  const q = norm(filt[k] || ""), list = getList(k).filter((x) => !q || norm(lab(x.o) + " " + keyOf(x.o)).includes(q));
  $("n_" + k).textContent = getList(k).length;
  $("t_" + k).innerHTML = list.map((x) => {
    const o = x.o, second = typeof o === "object" ? (lang === "ar" ? o.en : o.ar) : "";
    const m = k === "teachers" ? teacherMeta(o) : null, meta = m && (m.sub || m.br) ? [m.sub && lab(m.sub), m.br && lab(m.br)].filter(Boolean).join(" · ") : "";
    return `<span class="tag2" title="${x.pub ? t("published") : t("onlyHere")}">${esc(lab(o))}${second && second !== lab(o) ? `<small>${esc(second)}</small>` : ""}${meta ? `<small>${esc(meta)}</small>` : ""}${x.pub ? `<span class="lock">🔒</span>` : `<button data-del="${k}" data-key="${esc(keyOf(o))}" aria-label="${t("delete")}">×</button>`}</span>`;
  }).join("") || `<span class="sub" style="margin:0">—</span>`;
}
function addOne(k, o, extra) {
  if (!addToList(k, o)) { toast(t("dupe")); return false; }
  if (k === "teachers" && extra && (extra.sub || extra.br)) { const l = local(); l.tmeta[o] = { sub: extra.sub || undefined, br: extra.br || undefined }; store.set("ibe_local", l); }
  return true;
}
const findKey = (name, key) => { const x = getList(name).find((x) => keyOf(x.o) === key); return x ? x.o : undefined; };

document.addEventListener("submit", (e) => {
  const f = e.target.closest("[data-add]"); if (!f) return; e.preventDefault();
  const k = f.dataset.add, d = DEFS.find((x) => x.k === k), v = (n) => (f.elements[n] ? f.elements[n].value.trim() : "");
  let o;
  if (d.type === "bi") { const ar = v("ar"), en = v("en"); if (!ar && !en) return; o = { ar: ar || en, en: en || ar }; }
  else { o = v("name"); if (!o) return; }
  const extra = d.type === "teacher" ? { sub: v("sub") ? findKey("subjects", v("sub")) : null, br: v("br") ? findKey("branches", v("br")) : null } : null;
  if (addOne(k, o, extra)) { toast(t("toast")); build(); }
});
document.addEventListener("input", (e) => { const s = e.target.dataset.search; if (s) { filt[s] = e.target.value; tags(s); } });
document.addEventListener("click", (e) => {
  const del = e.target.closest("[data-del]");
  if (del) { const k = del.dataset.del, o = (local()[k] || []).find((x) => keyOf(x) === del.dataset.key); if (o !== undefined) { removeFromList(k, o); if (k === "teachers") { const l = local(); delete l.tmeta[o]; store.set("ibe_local", l); } } build(); return; }
  const b = e.target.closest("[data-bulk]"); if (b) { e.preventDefault(); const box = document.querySelector(`[data-bulkbox="${b.dataset.bulk}"]`); box.hidden = !box.hidden; return; }
  const go = e.target.closest("[data-bulkgo]");
  if (go) {
    const k = go.dataset.bulkgo, d = DEFS.find((x) => x.k === k), ta = document.querySelector(`[data-bulkbox="${k}"] textarea`); let n = 0;
    ta.value.split(/\n/).map((s) => s.trim()).filter(Boolean).forEach((line) => {
      let o = line; if (d.type === "bi") { const [a, b2] = line.split("|").map((s) => s.trim()); o = { ar: a || b2, en: b2 || a }; }
      if (addToList(k, o)) n++;
    });
    toast(n ? `+${n}` : t("dupe")); build();
  }
});
["gA", "gB", "gC"].forEach((id) => $(id).addEventListener("change", () => {
  const a = +$("gA").value, b = +$("gB").value, c = +$("gC").value;
  if (!(a > b && b > c && c >= 1)) { const g = gradeLimits(); $("gA").value = g.a; $("gB").value = g.b; $("gC").value = g.c; return; }
  const l = local(); l.gradeA = a; l.gradeB = b; l.gradeC = c; store.set("ibe_local", l); toast("✓");
}));
$("dl").onclick = () => {
  const l = local(), merged = { gradeA: gradeLimits().a, gradeB: gradeLimits().b, gradeC: gradeLimits().c, tmeta: Object.assign({}, CONFIG.tmeta || {}, l.tmeta) };
  DEFS.forEach((d) => (merged[d.k] = getList(d.k).map((x) => x.o)));
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(merged, null, 2)], { type: "application/json" })); a.download = "config.json"; a.click();
};
$("imp").onclick = () => $("impFile").click();
$("impFile").onchange = (e) => { const f = e.target.files[0]; if (!f) return; f.text().then((tx) => { try { const d = JSON.parse(tx), l = local(); DEFS.forEach((x) => { if (Array.isArray(d[x.k])) l[x.k] = d[x.k]; }); l.tmeta = d.tmeta || {}; if (d.gradeA) l.gradeA = d.gradeA; if (d.gradeB) l.gradeB = d.gradeB; if (d.gradeC) l.gradeC = d.gradeC; store.set("ibe_local", l); toast("✓"); build(); } catch (er) { toast("JSON ✗"); } }); };
$("reset").onclick = () => { if (confirm(t("confirmReset"))) { store.set("ibe_local", LOCAL_DEFAULT); build(); } };

document.addEventListener("langchange", build);
(async function () { await loadConfig(); applyLang(); build(); })();
