/* Shared by every page: language (Arabic / English), texts, the 10 IB items,
   lists (published config + this device's additions), storage, grade rule, radar chart. */

/* ---------- storage ---------- */
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null || v === undefined ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};

/* ---------- language ---------- */
let lang = store.get("ibe_lang", (navigator.language || "").toLowerCase().startsWith("en") ? "en" : "ar");
const STR = {
  appName: { ar: "تقييم الزيارة الصفية IB", en: "IB Classroom Evaluation" },
  school: { ar: "مدارس المنهل", en: "Al-Manhal Schools" },
  navHome: { ar: "الرئيسية", en: "Home" },
  navHistory: { ar: "تقييماتي", en: "My evaluations" },
  navSetup: { ar: "⚙ الإعداد", en: "⚙ Setup" },
  install: { ar: "📲 أضِف إلى الشاشة الرئيسية", en: "📲 Add to home screen" },
  langBtn: { ar: "English", en: "عربي" },
  heroTag: { ar: "برنامج السنوات المتوسطة MYP", en: "IB Middle Years Programme · MYP" },
  heroTitle: { ar: "قيّم الحصة بمعايير الـ IB في دقائق", en: "Evaluate a lesson against IB standards in minutes" },
  heroText: { ar: "أداة سريعة لمدارس المنهل: اختر دورك واسمك، قيّم 10 بنود، واحصل على نسبة وتصنيف وتغذية راجعة جاهزة للمشاركة أو التصدير PDF.", en: "A quick tool for Al-Manhal Schools: pick your role and name, score 10 items, and get a score, grade and feedback ready to share or export as PDF." },
  start: { ar: "ابدأ التقييم", en: "Start evaluation" },
  resume: { ar: "متابعة المسودة", en: "Resume draft" },
  noLogin: { ar: "بدون تسجيل دخول · يمكن للمشرف أو المعلم استخدامها · تُحفظ تقييماتك على هذا الجهاز فقط.", en: "No login · supervisors and teachers can use it · your evaluations stay on this device only." },
  chip1: { ar: "10 بنود · مقياس 1–4", en: "10 items · scale 1–4" },
  chip2: { ar: "نسبة وتصنيف تلقائي", en: "Automatic score & grade" },
  chip3: { ar: "ملاحظات وخطوة تالية", en: "Notes & next step" },
  chip4: { ar: "تقرير PDF ومشاركة", en: "PDF report & sharing" },
  howTitle: { ar: "كيف تعمل؟", en: "How it works" },
  how1t: { ar: "من أنت؟", en: "Who are you?" },
  how1: { ar: "اختر الدور والاسم والمعلم الذي تقيّمه.", en: "Choose your role, name and the teacher you evaluate." },
  how2t: { ar: "قيّم البنود", en: "Score the items" },
  how2: { ar: "10 بنود IB من 1 إلى 4، وملاحظة لكل بند إن أردت.", en: "10 IB items from 1 to 4, with an optional note on each." },
  how3t: { ar: "أضف ملاحظاتك", en: "Add your notes" },
  how3: { ar: "نقاط القوة، مجال التطوير، والخطوة المتفق عليها.", en: "Strengths, area for growth and the agreed next step." },
  how4t: { ar: "النتيجة والمشاركة", en: "Result & sharing" },
  how4: { ar: "نسبة الأداء والتصنيف، وتقرير PDF أو رسالة جاهزة.", en: "Score and grade, then a PDF report or a ready message." },
  accred: { ar: "مدرسة مرشّحة لبرنامج السنوات المتوسطة (IB MYP) ومعتمدة من Cognia", en: "IB MYP candidate school · Cognia accredited" },
  footer: { ar: "مدارس المنهل · American Diploma", en: "Al-Manhal Schools · American Diploma" },

  step1: { ar: "من وأين", en: "Who & where" },
  step2: { ar: "بنود الـ IB", en: "IB items" },
  step3: { ar: "الملاحظات", en: "Notes" },
  s1title: { ar: "بيانات الزيارة", en: "Visit details" },
  s1text: { ar: "اختر من القوائم. إن لم تجد اسمك اختر «إضافة جديد».", en: "Choose from the lists. If you can't find a name, choose “Add new”." },
  role: { ar: "دورك", en: "Your role" },
  evaluator: { ar: "اسمك", en: "Your name" },
  teacher: { ar: "المعلم المُقيَّم", en: "Teacher evaluated" },
  branch: { ar: "الفرع", en: "Branch" },
  subject: { ar: "المادة", en: "Subject" },
  klass: { ar: "الصف / الشعبة", en: "Class / section" },
  klassPh: { ar: "مثال: 7A", en: "e.g. 7A" },
  date: { ar: "التاريخ", en: "Date" },
  choose: { ar: "— اختر —", en: "— Choose —" },
  addNew: { ar: "➕ إضافة جديد…", en: "➕ Add new…" },
  addPrompt: { ar: "اكتب الاسم:", en: "Type the name:" },
  s2title: { ar: "قيّم بنود الـ IB", en: "Score the IB items" },
  s2text: { ar: "1 غير موجود · 2 بداية · 3 متحقق · 4 متميّز", en: "1 Not present · 2 Beginning · 3 Achieved · 4 Outstanding" },
  noteBtn: { ar: "＋ ملاحظة", en: "＋ Note" },
  notePh: { ar: "ملاحظة على هذا البند (اختياري)", en: "Note on this item (optional)" },
  s3title: { ar: "الملاحظات والتوصيات", en: "Comments & recommendations" },
  s3text: { ar: "كلها اختيارية، لكنها تجعل التغذية الراجعة أكثر فائدة للمعلم.", en: "All optional, but they make the feedback far more useful to the teacher." },
  strengths: { ar: "نقاط القوة", en: "Strengths" },
  strengthsPh: { ar: "ما الذي سار بشكل جيد؟", en: "What went well?" },
  growth: { ar: "توصيات للتحسين", en: "Recommendations for improvement" },
  growthPh: { ar: "ما الذي يُنصح المعلم بفعله؟", en: "What should the teacher do?" },
  nextStep: { ar: "محور الزيارة القادمة", en: "Focus for next visit" },
  nextPh: { ar: "ما الذي سيُلاحَظ في الزيارة القادمة؟", en: "What will be looked for next time?" },
  general: { ar: "ملاحظات عامة", en: "General comments" },
  support: { ar: "الدعم المقترح", en: "Support offered" },
  supportPh: { ar: "مثال: جلسة تخطيط مشترك", en: "e.g. co-planning session" },
  followUp: { ar: "موعد زيارة المتابعة", en: "Follow-up visit" },
  generalPh: { ar: "أي ملاحظات أخرى…", en: "Any other notes…" },
  back: { ar: "السابق", en: "Back" },
  next: { ar: "التالي", en: "Next" },
  finish: { ar: "إنهاء وعرض النتيجة", en: "Finish & see result" },
  scored: { ar: "تم تقييم {n} من 10", en: "{n} of 10 scored" },
  allScored: { ar: "اكتملت البنود", en: "All items scored" },
  needStep1: { ar: "اختر الدور والاسم والمعلم أولاً.", en: "Choose the role, your name and the teacher first." },
  needStep2: { ar: "قيّم جميع البنود العشرة أولاً.", en: "Score all ten items first." },
  perfLabel: { ar: "نسبة الأداء", en: "Performance" },
  grade: { ar: "التصنيف", en: "Grade" },

  resTitle: { ar: "النتيجة والتغذية الراجعة", en: "Result & feedback" },
  saved: { ar: "✓ تم حفظ التقييم على هذا الجهاز", en: "✓ Evaluation saved on this device" },
  strongTitle: { ar: "نقاط القوة", en: "Strong points" },
  devTitle: { ar: "مجالات التطوير والتوصيات", en: "Areas to develop & recommendations" },
  none3: { ar: "لا توجد بنود بدرجة 3 أو أعلى.", en: "No item scored 3 or above." },
  allGood: { ar: "جميع البنود متحققة أو متميّزة. استمر.", en: "Every item is achieved or outstanding. Keep going." },
  notesTitle: { ar: "الملاحظات", en: "Notes" },
  pdf: { ar: "⬇ تقرير PDF", en: "⬇ PDF report" },
  share: { ar: "↗ مشاركة", en: "↗ Share" },
  copy: { ar: "نسخ الملخص", en: "Copy summary" },
  copied: { ar: "تم النسخ ✓", en: "Copied ✓" },
  newEval: { ar: "+ تقييم جديد", en: "+ New evaluation" },
  toHistory: { ar: "تقييماتي", en: "My evaluations" },
  profile: { ar: "ملف المعلم في الـ IB", en: "Teacher's IB profile" },

  histTitle: { ar: "تقييماتي", en: "My evaluations" },
  histText: { ar: "تُحفظ هنا التقييمات التي أجريتها من هذا الجهاز فقط. لا يراها أحد غيرك.", en: "Evaluations you made from this device only. Nobody else can see them." },
  histEmpty: { ar: "لا توجد تقييمات بعد. ابدأ أول تقييم.", en: "No evaluations yet. Start your first one." },
  exportCsv: { ar: "تصدير CSV", en: "Export CSV" },
  delete: { ar: "حذف", en: "Delete" },
  confirmDel: { ar: "حذف هذا التقييم؟", en: "Delete this evaluation?" },
  open: { ar: "فتح", en: "Open" },
  count: { ar: "{n} تقييم", en: "{n} evaluations" },

  /* result extras (ideas from the school's observation report) */
  bandModel: { ar: "درس نموذجي", en: "ROLE-MODEL LESSON" },
  bandStrong: { ar: "على المسار الصحيح", en: "ON TRACK" },
  bandDev: { ar: "في طور النمو", en: "GROWING" },
  bandSupport: { ar: "يحتاج دعماً عاجلاً", en: "NEEDS PRIORITY SUPPORT" },
  avgItems: { ar: "متوسط البنود", en: "item average" },
  distTitle: { ar: "توزيع التقديرات", en: "Rating distribution" },
  actionTitle: { ar: "خطة المتابعة", en: "Action plan" },
  noAction: { ar: "لم تُحدَّد خطة متابعة بعد.", en: "No follow-up planned yet." },
  priority: { ar: "الأولوية", en: "Priority" },
  strengthLbl: { ar: "نقطة القوة", en: "Strength" },
  dayReport: { ar: "📊 ملخص اليوم", en: "📊 Day summary" },
  drTitle: { ar: "ملخص زيارات الحصص", en: "Lesson Visits Summary" },
  drSub: { ar: "صورة سريعة ليوم الزيارات: النتائج والأنماط وما سنفعله بعد ذلك", en: "A quick picture of the visit day: scores, patterns and what happens next" },
  drPick: { ar: "اختر يوم الزيارات", en: "Choose the day of the visits" },
  drNone: { ar: "لا توجد ملاحظات في هذا اليوم.", en: "No observations on this day." },
  drLessons: { ar: "حصص تمّت زيارتها", en: "Lessons visited" },
  drAvg: { ar: "متوسط المدرسة", en: "School average" },
  drTop: { ar: "تقديرات عليا", en: "Top ratings" },
  drGap: { ar: "أكبر فجوة", en: "Biggest gap" },
  drNoGap: { ar: "لا فجوة مشتركة", en: "No shared gap" },
  drAcross: { ar: "عبر {n} بنداً مُقيَّماً", en: "across {n} rated indicators" },
  drSnap: { ar: "المعلمون في لمحة", en: "Teachers at a glance" },
  drSnapSub: { ar: "مرتّبون حسب النتيجة. ▲ ما سار جيداً، ➜ ما نعمل عليه.", en: "Ranked by score. ▲ what went well, ➜ what to work on." },
  drHeat: { ar: "شبكة البنود", en: "Item grid" },
  drHeatSub: { ar: "كل بند لكل معلم، والعمود الأخير متوسط المدرسة.", en: "Every item for every teacher; the last column is the school average." },
  drProfile: { ar: "ملف المدرسة", en: "School profile" },
  drPatterns: { ar: "أبرز النقاط ومجالات التركيز", en: "Highlights & focus areas" },
  drWorking: { ar: "أبرز النقاط الإيجابية", en: "Highlights" },
  drGaps: { ar: "مجالات التركيز", en: "Focus areas" },
  drAll: { ar: "جميع المعلمين", en: "All teachers" },
  drAction: { ar: "الخطوات القادمة", en: "Next steps" },
  drCols: { ar: "المعلم|محور الزيارة القادمة|الدعم|زيارة المتابعة", en: "Teacher|Focus for next visit|Support|Follow-up visit" },
  drObservers: { ar: "الملاحِظون", en: "Observers" },
  drDate: { ar: "يوم الزيارات", en: "Visit day" },
  drWorkingAll: { ar: "{item}: متحقق أو أعلى لدى جميع المعلمين.", en: "{item}: achieved or better for every teacher." },
  drGapAll: { ar: "{item}: حصل على «بداية» أو أقل عند {n} من {m} معلمين.", en: "{item}: rated Beginning or lower for {n} of {m} teachers." },
  drPrint: { ar: "⬇ تقرير PDF", en: "⬇ Report PDF" },
  closeBtn: { ar: "رجوع", en: "Back" },
  slogan: { ar: "جذّابة .. رائدة .. تصنع جيلاً مبدعاً برؤية عالمية", en: "Attractive .. Pioneering Schools .. Shaping a Creative Generation With A Global Vision ." },
  sigObserver: { ar: "توقيع الملاحِظ", en: "Signature of Observer" },
  sigTeacher: { ar: "توقيع المعلم (اختياري)", en: "Signature of Teacher (optional)" },
  sigAdmin: { ar: "الإدارة", en: "Administration" },

  drRated: { ar: "بنود مُقيَّمة", en: "Items rated" },
  drTitle2: { ar: "كيف توزّعت التقديرات", en: "How ratings are spread" },
  drDistSub: { ar: "عدد البنود في كل مستوى على مستوى جميع المعلمين.", en: "Number of items at each level across all teachers." },
  drGapSub: { ar: "«بداية» أو أقل عند {n} من {m} معلمين", en: "Beginning or lower for {n} of {m} teachers" },
  gradeCLbl: { ar: "جيد · قيد التطوير من %", en: "Good · Developing from %" },

  /* setup page */
  setupTitle: { ar: "إعداد القوائم", en: "Lists setup" },
  setupText: { ar: "للمسؤول: أضف الأدوار والأسماء والفروع والمواد والمعلمين، وستظهر في القوائم المنسدلة.", en: "For the administrator: add roles, names, branches, subjects and teachers; they appear in the dropdowns." },
  listRoles: { ar: "الأدوار", en: "Roles" },
  listEvaluators: { ar: "المقيّمون (الأسماء)", en: "Evaluators (names)" },
  listTeachers: { ar: "المعلمون", en: "Teachers" },
  listBranches: { ar: "الفروع", en: "Branches" },
  listSubjects: { ar: "المواد", en: "Subjects" },
  addBtn: { ar: "إضافة", en: "Add" },
  namePh: { ar: "الاسم…", en: "Name…" },
  arPh: { ar: "بالعربية", en: "In Arabic" },
  enPh: { ar: "بالإنجليزية", en: "In English" },
  bulk: { ar: "لصق قائمة", en: "Paste a list" },
  bulkPh: { ar: "اسم في كل سطر…", en: "One name per line…" },
  addAll: { ar: "إضافة الكل", en: "Add all" },
  published: { ar: "منشور", en: "Published" },
  onlyHere: { ar: "على هذا الجهاز", en: "This device" },
  dupe: { ar: "موجود مسبقاً", en: "Already exists" },
  gradesTitle: { ar: "حدود التصنيف", en: "Grade limits" },
  gradeA: { ar: "الفئة A من %", en: "Grade A from %" },
  gradeB: { ar: "الفئة B من %", en: "Grade B from %" },
  publishTitle: { ar: "النشر للجميع", en: "Publish to everyone" },
  publishText: { ar: "القوائم التي تضيفها هنا تظهر على هذا الجهاز فقط. لتظهر لكل من يفتح الرابط: نزّل ملف الإعداد، ثم استبدل به الملف assets/config.json في المشروع وارفعه (git push).", en: "Lists you add here show on this device only. To show them to everyone who opens the link: download the config file, replace assets/config.json in the project with it, and push (git push)." },
  dlConfig: { ar: "⬇ تنزيل ملف الإعداد (config.json)", en: "⬇ Download config file (config.json)" },
  impConfig: { ar: "⬆ استيراد إعداد", en: "⬆ Import config" },
  resetLocal: { ar: "مسح إضافات هذا الجهاز", en: "Clear this device's additions" },
  confirmReset: { ar: "مسح كل ما أضفته على هذا الجهاز؟", en: "Clear everything you added on this device?" },
  toForm: { ar: "← الرجوع للتقييم", en: "← Back to evaluation" },
  toast: { ar: "تمت الإضافة ✓", en: "Added ✓" },
  search: { ar: "بحث…", en: "Search…" },

  /* report + messages */
  rpTitle: { ar: "تقرير زيارة صفية IB", en: "IB Classroom Evaluation Report" },
  rpItems: { ar: "تفصيل البنود", en: "Item breakdown" },
  rpSign1: { ar: "المقيّم", en: "Evaluator" },
  rpSign2: { ar: "المعلم", en: "Teacher" },
  rpSign3: { ar: "الإدارة", en: "Administration" },
  rpDate: { ar: "تاريخ الزيارة", en: "Visit date" },
  rpIssued: { ar: "صدر بتاريخ", en: "Issued on" },
  rpScale: { ar: "النسبة = المجموع ÷ 40 × 100 · 1 غير موجود · 2 بداية · 3 متحقق · 4 متميّز", en: "Score = total ÷ 40 × 100 · 1 Not present · 2 Beginning · 3 Achieved · 4 Outstanding" },
  totalOf: { ar: "المجموع {s} من 40", en: "Total {s} of 40" },
  by: { ar: "المقيّم", en: "Evaluator" },
};
const LVL = { ar: ["", "غير موجود", "بداية", "متحقق", "متميّز"], en: ["", "Not present", "Beginning", "Achieved", "Outstanding"] };
const t = (k, v) => { const e = STR[k]; let s = e ? (e[lang] || e.ar) : k; if (v) for (const x in v) s = s.replace("{" + x + "}", v[x]); return s; };
const lvl = (n) => LVL[lang][n] || "";
const lab = (o) => (o == null ? "" : typeof o === "string" ? o : o[lang] || o.ar || o.en || "");
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((e) => (e.textContent = t(e.dataset.i18n)));
  document.querySelectorAll("[data-i18n-ph]").forEach((e) => (e.placeholder = t(e.dataset.i18nPh)));
  document.title = t("appName") + " | " + t("school");
  document.querySelectorAll("[data-lang]").forEach((b) => (b.textContent = t("langBtn")));
}
function setLang(l) { lang = l; store.set("ibe_lang", l); applyLang(); document.dispatchEvent(new Event("langchange")); }
document.addEventListener("click", (e) => { if (e.target.closest("[data-lang]")) setLang(lang === "ar" ? "en" : "ar"); });

/* ---------- the 10 IB items (Arabic + English) ---------- */
const ITEMS = [
  { ar: "عبارة الاستقصاء", en: "Statement of Inquiry", hAr: "ظاهرة في الصف ويرجع إليها المعلم والطلاب", hEn: "Visible in the room and referred to by teacher and students",
    tAr: "اربط كل حصة بعبارة الاستقصاء واطلب من الطلاب الرجوع إليها.", tEn: "Link every lesson to the Statement of Inquiry and ask students to refer back to it." },
  { ar: "السياق العالمي", en: "Global Context", hAr: "مفعَّل في النشاط، لا مكتوب في الخطة فقط", hEn: "Active in the task, not only written in the plan",
    tAr: "فعّل السياق العالمي داخل النشاط نفسه لا في الخطة فقط.", tEn: "Bring the global context into the activity itself, not only the plan." },
  { ar: "المفهوم الرئيسي والمفاهيم المرتبطة", en: "Key and related concepts", hAr: "واضحة ومرتبطة بالدرس", hEn: "Clear and linked to the lesson",
    tAr: "وضّح المفهوم الرئيسي والمفاهيم المرتبطة في بداية الدرس.", tEn: "State the key and related concepts at the start of the lesson." },
  { ar: "مهارات ATL", en: "ATL skills", hAr: "مهارة محددة تُدرَّس بشكل صريح ويعرفها الطلاب", hEn: "A specific skill taught explicitly and known to students",
    tAr: "درّس مهارة ATL واحدة بشكل صريح وسمِّها للطلاب.", tEn: "Teach one ATL skill explicitly and name it for the students." },
  { ar: "التعلّم بالاستقصاء", en: "Learning through inquiry", hAr: "أسئلة وبحث وتفكير، لا تلقين", hEn: "Questions, research and thinking rather than telling",
    tAr: "استبدل التلقين بأسئلة وبحث وتفكير موجَّه.", tEn: "Replace telling with guided questions, research and thinking." },
  { ar: "معايير التقييم (A/B/C/D)", en: "Assessment criteria (A–D)", hAr: "يعرف الطلاب المعيار المرتبط بالمهمة", hEn: "Students know the criterion linked to the task",
    tAr: "اعرض معيار التقييم المرتبط بالمهمة وناقشه مع الطلاب.", tEn: "Show the criterion linked to the task and discuss it with students." },
  { ar: "صفات المتعلّم", en: "Learner profile", hAr: "حاضرة في الحوار والنشاط", hEn: "Present in dialogue and activity",
    tAr: "اربط صفات المتعلّم بالحوار والنشاط بأمثلة محددة.", tEn: "Link learner-profile attributes to talk and activity with specific examples." },
  { ar: "التمايز", en: "Differentiation", hAr: "مهام أو دعم مناسب لمستويات الطلاب", hEn: "Tasks or support suited to students' levels",
    tAr: "وفّر مهام أو دعماً مناسباً لمستويات الطلاب المختلفة.", tEn: "Provide tasks or support suited to the different levels in the class." },
  { ar: "التأمّل", en: "Reflection", hAr: "فرصة للطلاب للتأمل في تعلّمهم", hEn: "Students get a chance to reflect on their learning",
    tAr: "خصّص وقتاً لتأمل الطلاب في تعلّمهم.", tEn: "Set aside time for students to reflect on their learning." },
  { ar: "مطابقة خطة الوحدة", en: "Unit planner match", hAr: "الحصة منسجمة مع الخطة المرفوعة على Classera", hEn: "The lesson matches the planner uploaded on Classera",
    tAr: "تأكد من انسجام الحصة مع خطة الوحدة المرفوعة على Classera.", tEn: "Make sure the lesson matches the unit planner uploaded on Classera." },
];
const itemName = (i) => (lang === "ar" ? ITEMS[i].ar : ITEMS[i].en);
const itemHint = (i) => (lang === "ar" ? ITEMS[i].hAr : ITEMS[i].hEn);
const itemTip = (i) => (lang === "ar" ? ITEMS[i].tAr : ITEMS[i].tEn);

/* ---------- lists: published config + this device's additions ---------- */
let CONFIG = { gradeA: 90, gradeB: 80, roles: [], branches: [], subjects: [], evaluators: [], teachers: [] };
const LOCAL_DEFAULT = { roles: [], branches: [], subjects: [], evaluators: [], teachers: [], tmeta: {}, gradeA: null, gradeB: null };
const local = () => Object.assign({}, LOCAL_DEFAULT, store.get("ibe_local", {}));
const keyOf = (o) => (typeof o === "string" ? o : (o.en || o.ar || "")).trim().toLowerCase();
const norm = (s) => String(s).trim().toLowerCase().replace(/\s+/g, " ").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");

async function loadConfig() {
  try { const r = await fetch("assets/config.json?v=" + Date.now()); if (r.ok) CONFIG = Object.assign(CONFIG, await r.json()); } catch (e) {}
  return CONFIG;
}
/* published items first, then this device's additions (no duplicates) */
function getList(name) {
  const base = (CONFIG[name] || []).map((o) => ({ o, pub: true }));
  const seen = new Set(base.map((x) => norm(keyOf(x.o))));
  const add = (local()[name] || []).filter((o) => !seen.has(norm(keyOf(o)))).map((o) => ({ o, pub: false }));
  return base.concat(add);
}
function addToList(name, o) {
  const l = local(), all = getList(name);
  if (all.some((x) => norm(keyOf(x.o)) === norm(keyOf(o)))) return false;
  l[name] = (l[name] || []).concat([o]); store.set("ibe_local", l); return true;
}
function removeFromList(name, o) {
  const l = local(); l[name] = (l[name] || []).filter((x) => norm(keyOf(x)) !== norm(keyOf(o))); store.set("ibe_local", l);
}
const teacherMeta = (n) => Object.assign({}, (CONFIG.tmeta || {})[n] || {}, local().tmeta[n] || {});
const gradeLimits = () => { const l = local(); return { a: l.gradeA != null ? l.gradeA : CONFIG.gradeA, b: l.gradeB != null ? l.gradeB : CONFIG.gradeB, c: l.gradeC != null ? l.gradeC : (CONFIG.gradeC != null ? CONFIG.gradeC : 70) }; };
const BANDS = [
  { k: "model", key: "bandModel", col: "#1f9d6b", bg: "#e3f6ee" },
  { k: "strong", key: "bandStrong", col: "#1b8fbf", bg: "#e4f4fb" },
  { k: "dev", key: "bandDev", col: "#c98512", bg: "#fff3dc" },
  { k: "support", key: "bandSupport", col: "#d03a3a", bg: "#fde7e7" },
];
const bandOf = (p) => { const g = gradeLimits(); return BANDS[p >= g.a ? 0 : p >= g.b ? 1 : p >= g.c ? 2 : 3]; };
const avgItems = (sc) => { const r = sc.filter((v) => v > 0); return r.length ? r.reduce((a, b) => a + b, 0) / r.length : 0; };
const LEVEL_COL = { 4: "#1f9d6b", 3: "#4cb6e0", 2: "#eba43a", 1: "#dc4b4b", 0: "#dfe5ef" };
function distribution(scs) { const d = { 4: 0, 3: 0, 2: 0, 1: 0 }; scs.forEach((sc) => sc.forEach((v) => { if (d[v] !== undefined) d[v]++; })); return d; }
function distBar(d) {
  const tot = d[4] + d[3] + d[2] + d[1] || 1;
  return `<div class="dist">${[4, 3, 2, 1].map((v) => d[v] ? `<i style="width:${(d[v] / tot) * 100}%;background:${LEVEL_COL[v]}" title="${lvl(v)}: ${d[v]}">${d[v]}</i>` : "").join("")}</div>`;
}
const distLegend = () => `<div class="legend">${[4, 3, 2, 1].map((v) => `<span><i style="background:${LEVEL_COL[v]}"></i>${lvl(v)}</span>`).join("")}</div>`;
const gradeOf = (p) => { const g = gradeLimits(); return p >= g.a ? "A" : p >= g.b ? "B" : "C"; };

/* ---------- donut (drawn as SVG so it prints the same everywhere) ---------- */
function donutSvg(pct, col, size, txt, sub) {
  const r = 44, c = 2 * Math.PI * r, dash = (c * Math.max(0, Math.min(100, pct))) / 100;
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" role="img"><circle cx="50" cy="50" r="${r}" fill="none" stroke="#e1e8f2" stroke-width="10"/>
    <circle cx="50" cy="50" r="${r}" fill="none" stroke="${col}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${dash} ${c}" transform="rotate(-90 50 50)"/>
    <text x="50" y="${sub ? 50 : 57}" text-anchor="middle" font-size="${sub ? 21 : 24}" font-weight="700" fill="#0b1f4d">${txt}</text>${sub ? `<text x="50" y="65" text-anchor="middle" font-size="10" fill="#5b6785">${sub}</text>` : ""}</svg>`;
}

/* ---------- radar ---------- */
function radarSvg(sc, size = 240) {
  const N = 10, R = 100, C = 130, pt = (i, r) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / N; return [C + r * Math.cos(a), C + r * Math.sin(a)]; };
  let g = "";
  for (let k = 1; k <= 4; k++) g += `<polygon points="${ITEMS.map((_, i) => pt(i, (R * k) / 4).join(",")).join(" ")}" fill="none" stroke="var(--line)"/>`;
  g += ITEMS.map((_, i) => { const [x, y] = pt(i, R), [tx, ty] = pt(i, R + 14); return `<line x1="${C}" y1="${C}" x2="${x}" y2="${y}" stroke="var(--line)"/><text x="${tx}" y="${ty}" font-size="10" text-anchor="middle" dominant-baseline="middle" fill="var(--muted)">${i + 1}</text>`; }).join("");
  g += `<polygon points="${sc.map((s, i) => pt(i, (R * s) / 4).join(",")).join(" ")}" fill="rgba(76,195,232,.35)" stroke="var(--teal)" stroke-width="2"/>`;
  return `<svg viewBox="0 0 260 260" width="${size}" height="${size}" role="img">${g}</svg>`;
}

/* ---------- add to home screen + offline ---------- */
(function () {
  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  let deferred = null;
  addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; });
  addEventListener("appinstalled", () => document.querySelectorAll("[data-install]").forEach((b) => (b.hidden = true)));
  if (standalone) addEventListener("DOMContentLoaded", () => document.querySelectorAll("[data-install]").forEach((b) => (b.hidden = true)));
  function help() {
    const old = document.getElementById("pwa-help"); if (old) old.remove();
    const ar = lang === "ar";
    const steps = ios
      ? (ar ? ["افتح الموقع في <b>Safari</b>", "اضغط زر المشاركة <b>⬆︎</b>", "اختر <b>«إضافة إلى الشاشة الرئيسية»</b>", "اضغط <b>إضافة</b>"] : ["Open the site in <b>Safari</b>", "Tap the Share button <b>⬆︎</b>", "Choose <b>“Add to Home Screen”</b>", "Tap <b>Add</b>"])
      : (ar ? ["افتح قائمة المتصفح <b>⋮</b>", "اختر <b>«تثبيت التطبيق»</b> أو <b>«إضافة إلى الشاشة الرئيسية»</b>", "اضغط <b>تثبيت</b>"] : ["Open the browser menu <b>⋮</b>", "Choose <b>“Install app”</b> or <b>“Add to Home screen”</b>", "Tap <b>Install</b>"]);
    const box = document.createElement("div"); box.id = "pwa-help"; box.className = "overlay";
    box.innerHTML = `<div class="sheetbox"><img src="assets/icons/icon-192.png" alt="" style="width:64px;height:64px;border-radius:16px;display:block;margin:0 auto 10px">
      <h3 style="text-align:center;margin:0 0 6px">${ar ? "أضِف التطبيق إلى الشاشة الرئيسية" : "Add the app to your home screen"}</h3>
      <p style="text-align:center;color:var(--muted);font-size:.9rem;margin:0 0 8px">${ar ? "يفتح كتطبيق بأيقونة المنهل ويعمل دون إنترنت." : "Opens like an app with the Al-Manhal icon, and works offline."}</p>
      <ol style="margin:0;padding-inline-start:22px">${steps.map((s) => `<li>${s}</li>`).join("")}</ol>
      <button class="btn p wide" style="margin-top:14px">${ar ? "حسناً" : "OK"}</button></div>`;
    box.addEventListener("click", (e) => { if (e.target === box || e.target.tagName === "BUTTON") box.remove(); });
    document.body.appendChild(box);
  }
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-install]"); if (!b) return; e.preventDefault();
    if (deferred) { deferred.prompt(); try { await deferred.userChoice; } catch (er) {} deferred = null; } else help();
  });
})();
