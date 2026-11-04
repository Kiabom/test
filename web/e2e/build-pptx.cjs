// Editable PowerPoint version of the presentation (Persian, RTL), built from the app's own
// screenshots in docs/screenshots (run `npm run e2e -- --shots` first).
// Usage: node e2e/build-pptx.cjs  →  docs/presentation/FanapTozin.pptx
const fs = require("fs");
const path = require("path");
const PptxGenJS = require("pptxgenjs");

const ROOT = path.join(__dirname, "..", "..");
const SHOTS = path.join(ROOT, "docs", "screenshots");
const OUT = path.join(ROOT, "docs", "presentation", "FanapTozin.pptx");
const APPLY_THEME = process.env.PPTX_APPLY_THEME; // path to the pptx skill's apply_theme.js (optional)

const THEME = {
  name: "FanapTozin",
  headFontFace: "Arial",
  bodyFontFace: "Arial",
  colors: {
    dk1: "172B3A",
    lt1: "FFFFFF",
    dk2: "102A43",
    lt2: "F5F7FA",
    accent1: "1273A6",
    accent2: "168567",
    accent3: "B7791F",
    accent4: "B42335",
    accent5: "7C3AED",
    accent6: "0891B2",
    hlink: "1273A6",
    folHlink: "7C3AED",
  },
};

const W = 13.333;
const H = 7.5;
const M = 0.5;
const FOOTER = "فناپ توزین · نسخه نمایشی با داده و سخت‌افزار شبیه‌سازی‌شده";

/** PNG size from the IHDR header. */
function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
/** Fit an image into a box, keeping its aspect ratio, aligned to the top and centred horizontally. */
function fit(file, box) {
  const { w, h } = pngSize(file);
  const s = Math.min(box.w / w, box.h / h);
  return { path: file, w: w * s, h: h * s, x: box.x + (box.w - w * s) / 2, y: box.y };
}
const shot = (name) => {
  const f = path.join(SHOTS, `${name}.png`);
  if (!fs.existsSync(f)) throw new Error(`missing screenshot ${f} — run "npm run e2e -- --shots" first`);
  return f;
};

async function main() {
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE";
  pres.rtlMode = true;
  pres.title = "فناپ توزین — سامانه هوشمند توزین و تردد معدن";
  pres.author = "Fanap Tozin demo";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;

  pres.defineSlideMaster({
    title: "COVER",
    background: { color: C.text2 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: M, y: 2.3, w: W - 2 * M, h: 1.4, fontSize: 60, bold: true, color: C.background1, align: "right", rtlMode: true, valign: "middle" }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: M, y: 3.8, w: W - 2 * M, h: 1.2, fontSize: 24, color: C.background2, align: "right", rtlMode: true, valign: "top" }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: C.background1 },
    margin: [0.5, 0.5, 0.6, 0.5],
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: M, y: 0.35, w: W - 2 * M, h: 0.85, fontSize: 32, bold: true, color: C.text2, align: "right", rtlMode: true, valign: "middle" }, text: "" } },
      { text: { text: FOOTER, options: { x: M, y: H - 0.45, w: 8, h: 0.3, fontSize: 10, color: "5B6B79", align: "right", rtlMode: true } } },
    ],
    slideNumber: { x: M, y: H - 0.45, w: 0.6, h: 0.3, fontSize: 10, color: "5B6B79" },
  });
  pres.defineSlideMaster({
    title: "CONTENT_DARK",
    background: { color: C.text2 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: M, y: 0.35, w: W - 2 * M, h: 0.85, fontSize: 32, bold: true, color: C.background1, align: "right", rtlMode: true, valign: "middle" }, text: "" } },
      { text: { text: FOOTER, options: { x: M, y: H - 0.45, w: 8, h: 0.3, fontSize: 10, color: "9FB3C8", align: "right", rtlMode: true } } },
    ],
    slideNumber: { x: M, y: H - 0.45, w: 0.6, h: 0.3, fontSize: 10, color: "9FB3C8" },
  });

  // ------------ helpers ------------
  const kicker = (slide, text, dark) => slide.addText(text, { x: M, y: 1.15, w: W - 2 * M, h: 0.4, fontSize: 16, bold: true, color: dark ? "7DD3FC" : C.accent1, align: "right", rtlMode: true, isTextBox: true, margin: 0, objectName: "kicker" });
  /** Points on the right (RTL reading start), each with a numbered circle — the deck's motif. */
  const points = (slide, items, dark, box = { x: 7.55, y: 1.85, w: 5.28 }) => {
    items.forEach((t, i) => {
      const y = box.y + i * 1.15;
      slide.addShape(pres.ShapeType.ellipse, { x: box.x + box.w - 0.5, y: y + 0.05, w: 0.5, h: 0.5, fill: { color: dark ? C.accent6 : C.accent2 }, line: { color: dark ? C.accent6 : C.accent2 }, objectName: `point-dot-${i + 1}` });
      slide.addText(String(i + 1).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]), { x: box.x + box.w - 0.5, y: y + 0.05, w: 0.5, h: 0.5, fontSize: 16, bold: true, color: C.background1, align: "center", valign: "middle", isTextBox: true, margin: 0, objectName: `point-num-${i + 1}` });
      slide.addText(t, { x: box.x, y, w: box.w - 0.7, h: 0.95, fontSize: 18, color: dark ? C.background1 : C.text1, align: "right", rtlMode: true, valign: "top", isTextBox: true, margin: 0, objectName: `point-${i + 1}` });
    });
  };
  const image = (slide, file, box, name) => slide.addImage({ ...fit(file, box), altText: name, objectName: name, shadow: { type: "outer", color: "000000", opacity: 0.25, blur: 8, offset: 3, angle: 90 } });
  const LEFT = { x: M, y: 1.75, w: 6.7, h: 5.1 };

  const content = (section, o) => {
    const s = pres.addSlide({ masterName: o.dark ? "CONTENT_DARK" : "CONTENT", sectionTitle: section });
    s.addText(o.title, { placeholder: "title" });
    if (o.kicker) kicker(s, o.kicker, o.dark);
    points(s, o.points, o.dark);
    if (o.phones) {
      const half = (LEFT.w - 0.4) / 2;
      o.phones.forEach((p, i) => {
        image(s, shot(p.shot), { x: LEFT.x + i * (half + 0.4), y: LEFT.y, w: half, h: LEFT.h - 0.4 }, p.shot);
        s.addText(p.label, { x: LEFT.x + i * (half + 0.4), y: LEFT.y + LEFT.h - 0.35, w: half, h: 0.35, fontSize: 12, color: o.dark ? "9FB3C8" : "5B6B79", align: "center", rtlMode: true, isTextBox: true, margin: 0 });
      });
    } else if (o.shot) image(s, shot(o.shot), LEFT, o.shot);
    s.addNotes(o.notes);
    return s;
  };

  // ------------ 1. intro ------------
  pres.addSection({ title: "مقدمه" });
  {
    const s = pres.addSlide({ masterName: "COVER", sectionTitle: "مقدمه" });
    s.addText("فناپ توزین", { placeholder: "title" });
    s.addText("سامانه هوشمند توزین و تردد معدن — از دروازه تا رسید: هر کیلوگرم ثبت، هر خروج کنترل‌شده، هر کامیون روی نقشه.", { placeholder: "body" });
    s.addImage({ ...fit(shot("control-room-dark"), { x: M, y: 4.9, w: 4.2, h: 2.2 }), altText: "اتاق کنترل", objectName: "cover-image" });
    s.addText("نسخه نمایشی — همه داده‌ها و دستگاه‌ها شبیه‌سازی‌شده‌اند", { x: 5.2, y: H - 0.8, w: W - 5.7, h: 0.4, fontSize: 14, color: "9FB3C8", align: "right", rtlMode: true, isTextBox: true, margin: 0 });
    s.addNotes("سامانه هوشمند توزین و تردد معدن: از نوبت کامیون تا تحویل بار، با کنترل ضدتقلب و دید کامل برای معدن‌دار.");
  }
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "مقدمه" });
    s.addText("مسئله امروز معدن", { placeholder: "title" });
    const cards = [
      ["تقلب وزن و سهمیه", "تارای دستکاری‌شده، تیکت تکراری، QR کپی‌شده و برداشت بیش از حواله.", C.accent4],
      ["صف و معطلی", "راننده نمی‌داند کجا برود؛ باسکول بیکار می‌ماند و صف بیرون معدن طولانی می‌شود.", C.accent3],
      ["اسناد کاغذی", "رسید و مجوز خروج کاغذی، بدون راستی‌آزمایی و بدون اتصال به ERP.", C.accent5],
      ["بی‌خبری از کامیون‌ها", "معدن‌دار نمی‌داند الان چه کسی داخل است، چه کسی در جاده است و چه اتفاقی افتاده.", C.accent1],
    ];
    const cw = (W - 2 * M - 0.4) / 2;
    cards.forEach(([t, d, col], i) => {
      const x = M + (i % 2 ? 0 : cw + 0.4);
      const y = 1.6 + Math.floor(i / 2) * 2.7;
      s.addShape(pres.ShapeType.roundRect, { x, y, w: cw, h: 2.4, rectRadius: 0.12, fill: { color: C.background2 }, line: { color: C.background2 }, objectName: `card-${i + 1}` });
      s.addShape(pres.ShapeType.ellipse, { x: x + cw - 0.95, y: y + 0.35, w: 0.65, h: 0.65, fill: { color: col }, line: { color: col }, objectName: `card-icon-${i + 1}` });
      s.addText("!", { x: x + cw - 0.95, y: y + 0.35, w: 0.65, h: 0.65, fontSize: 22, bold: true, color: C.background1, align: "center", valign: "middle", isTextBox: true, margin: 0 });
      s.addText(t, { x: x + 0.3, y: y + 0.35, w: cw - 1.4, h: 0.65, fontSize: 22, bold: true, color: C.text2, align: "right", rtlMode: true, valign: "middle", isTextBox: true, margin: 0 });
      s.addText(d, { x: x + 0.3, y: y + 1.15, w: cw - 0.6, h: 1.05, fontSize: 16, color: C.text1, align: "right", rtlMode: true, valign: "top", isTextBox: true, margin: 0 });
    });
    s.addNotes("چهار درد اصلی: تقلب وزن و سهمیه، صف و معطلی، اسناد کاغذی و نبود دید لحظه‌ای از کامیون‌ها.");
  }
  {
    const s = pres.addSlide({ masterName: "CONTENT_DARK", sectionTitle: "مقدمه" });
    s.addText("یک سفر، ۱۰ ایستگاه شماره‌دار", { placeholder: "title" });
    kicker(s, "گوشی راننده، مانیتور کنار باسکول و صفحه معدن‌دار همیشه یک چیز می‌گویند.", true);
    const steps = ["نوبت و مدارک", "دروازه ورود", "پارکینگ و صف", "توزین اول", "بارگیری", "اسکن بار (LiDAR)", "توزین دوم", "رسید توزین", "خروج با QR", "حمل و تحویل"];
    const cw = (W - 2 * M - 4 * 0.3) / 5;
    steps.forEach((t, i) => {
      const col = i % 5;
      const x = W - M - cw - col * (cw + 0.3); // right-to-left order
      const y = 2.0 + Math.floor(i / 5) * 2.45;
      s.addShape(pres.ShapeType.roundRect, { x, y, w: cw, h: 2.1, rectRadius: 0.12, fill: { color: "1D3A56" }, line: { color: "1D3A56" }, objectName: `step-${i}` });
      s.addShape(pres.ShapeType.ellipse, { x: x + cw - 0.95, y: y + 0.25, w: 0.7, h: 0.7, fill: { color: C.accent6 }, line: { color: C.accent6 } });
      s.addText("۰۱۲۳۴۵۶۷۸۹"[i], { x: x + cw - 0.95, y: y + 0.25, w: 0.7, h: 0.7, fontSize: 22, bold: true, color: C.text2, align: "center", valign: "middle", isTextBox: true, margin: 0 });
      s.addText(t, { x: x + 0.2, y: y + 1.1, w: cw - 0.4, h: 0.8, fontSize: 18, bold: true, color: C.background1, align: "right", rtlMode: true, valign: "top", isTextBox: true, margin: 0 });
    });
    s.addNotes("راننده، مانیتور و معدن‌دار همه از یک نقشه راه مشترک استفاده می‌کنند: ۱۰ ایستگاه با شماره تابلو.");
  }

  // ------------ 2. driver track ------------
  const D = "مسیر راننده";
  pres.addSection({ title: D });
  content(D, { kicker: "ایستگاه ۰ و ۲ · نوبت و صف", title: "لینک پیامکی به جای برگه و صف", shot: "driver-trip-mobile", phones: [{ shot: "driver-trip-mobile", label: "سفر من: همه مراحل" }, { shot: "driver-exit-qr-mobile", label: "رسید و QR خروج" }], points: ["نوبت و جای راننده در صف، با زمان تقریبی", "همه ۱۰ مرحله سفر با توضیح کامل", "بدون نصب برنامه — روی هر گوشی", "تماس با اپراتور با یک دکمه"], notes: "راننده قبل از رسیدن لینک می‌گیرد: نوبت، ساعت ورود و همه مراحل. نیازی به نصب برنامه نیست." });
  content(D, { kicker: "ایستگاه ۱ · دروازه ورود", title: "هویت با دو منبع، تصمیم مرحله‌ای", shot: "gate", points: ["پلاک‌خوان جلو/عقب + RFID؛ مغایرت = توقف", "اسکن زیر خودرو با مقایسه تصویر مرجع", "ایمنی ← هویت ← مدارک ← حواله", "نرم‌افزار فقط درخواست می‌دهد؛ PLC تأیید می‌کند"], notes: "پلاک جلو و عقب، تگ RFID، اسکن زیر خودرو و عکس مدارک. در این نمونه پلاک با RFID نمی‌خواند و کامیون متوقف شده." });
  content(D, { kicker: "ایستگاه ۳ و ۶ · مانیتور باسکول", title: "راننده بدون پیاده شدن می‌داند چه کند", shot: "driver-display", dark: true, points: ["دستورهای کوتاه: جلو بیایید، توقف، ثبت شد، بروید", "چراغ سبز/زرد/قرمز و وزن زنده", "هشدار موقعیت چرخ‌ها", "کیوسک لمسی برای چاپ رسید"], notes: "کنار هر باسکول یک مانیتور بیرونی: پلاک، دستور، چراغ و وزن زنده. همان پیامی که روی گوشی راننده است." });
  content(D, { kicker: "ایستگاه ۳ و ۶ · اپراتور", title: "وزن پایدار، تازه، همه چرخ‌ها روی باسکول", shot: "weighing", points: ["ثبت وزن ناپایدار یا قدیمی‌تر از ۱۲ ثانیه ممکن نیست", "۴ دوربین با hash برای هر توزین", "خالص = ناخالص − تارا؛ اضافه‌بار و سهمیه چک می‌شود", "استثنا فقط با امضای دو نفر"], notes: "وزن فقط از indicator و فقط وقتی پایدار، تازه و با همه چرخ‌ها روی باسکول. در صحنه، باسکول ۲ یک کامیون اضافه‌بار دارد." });
  content(D, { kicker: "ایستگاه ۴ و ۵ · بارگیری و LiDAR", title: "حجم سه‌بعدی بار، بار خارج از مرکز، روکش", shot: "scan-lidar", points: ["ابر نقاط سه‌بعدی و نقشه ارتفاع", "مقایسه حجم×چگالی با وزن باسکول", "هشدار بار خارج از مرکز و بدون روکش", "نمایشگر کابین لودر برای پر کردن دقیق"], notes: "Payload لودر سطل‌به‌سطل و اسکن LiDAR بالای بار؛ هر دو تخمینی‌اند و فقط برای کنترل کیفیت، نه وزن قانونی." });
  content(D, { kicker: "ایستگاه ۷ و ۸ · رسید و خروج", title: "بدون کاغذ، بدون کپی", phones: [{ shot: "driver-exit-qr-mobile", label: "گوشی راننده" }, { shot: "guard-accept-mobile", label: "گوشی حراست" }], points: ["رسید با QR راستی‌آزمایی و شماره نسخه", "QR خروج فقط یک بار معتبر است", "اسکن آنلاین حراست با دوربین گوشی", "اسکن دوم = رد + هشدار امنیتی R36"], notes: "رسید و مجوز خروج روی گوشی راننده می‌آید. حراست با گوشی اسکن می‌کند؛ اسکن دوم رد می‌شود و هشدار امنیتی می‌دهد." });
  content(D, { kicker: "ایستگاه ۹ · حمل و تحویل", title: "راننده همیشه می‌داند کجا برود", phones: [{ shot: "driver-map-mobile", label: "داخل معدن" }, { shot: "driver-road-mobile", label: "در جاده" }], points: ["ایستگاه بعدی روی نقشه معدن", "یک دکمه: مسیریابی با GPS گوشی", "مسیر تا مشتری و زمان رسیدن", "ثبت سرعت، توقف و انحراف مسیر"], notes: "هر ایستگاه روی نقشه معدن است و با یک دکمه به برنامه مسیریابی گوشی فرستاده می‌شود. بعد از خروج، مسیر تا مشتری ردیابی می‌شود." });
  content(D, { kicker: "پیش از ورود", title: "همه مراحل در یک صفحه، با QR روی تابلو", shot: "driver-guide", points: ["نقشه ایستگاه‌های شماره‌دار", "مدارک و تجهیزات لازم", "قوانین ایمنی و معنی چراغ‌ها", "پرسش‌های رایج — قابل چاپ"], notes: "راهنمای یک‌صفحه‌ای قابل چاپ با QR روی تابلوی دروازه: مراحل، مدارک، قوانین و معنی چراغ‌ها." });

  // ------------ 3. owner track ------------
  const O = "مسیر معدن‌دار";
  pres.addSection({ title: O });
  content(O, { kicker: "نمای معدن‌دار", title: "هر مرحله شفاف، گلوگاه مشخص", shot: "process", points: ["۱۰ مرحله با مسئول، دستگاه و سند خروجی", "کنترل‌های ضدتقلب هر مرحله", "قیف امروز: رسیده تا تحویل‌شده", "گلوگاه با میانگین زمان"], notes: "همه مراحل در یک صفحه: چه کسی و چه دستگاهی، کدام کنترل، چند کامیون الان، میانگین زمان و گلوگاه امروز." });
  content(O, { kicker: "اتاق کنترل", title: "همه لاین‌ها در یک نگاه", shot: "control-room-dark", dark: true, points: ["دوربین، وزن، پلاک و RFID هر لاین", "وضعیت راهبند و چراغ با تأیید PLC", "لاگ خام دستگاه‌ها", "حالت شب برای اتاق کنترل"], notes: "پنج لاین با دوربین، وزن زنده، پلاک و RFID، راهبند و چراغ، و لاگ خام دستگاه‌ها." });
  content(O, { kicker: "نقشه", title: "همه ماشین‌ها و اتفاقات روی نقشه", shot: "fleet-map", points: ["داخل معدن، در جاده و در راه معدن", "ناوگان داخلی و لودرها", "هشدارهای سایت و رویدادهای جاده", "نقشه، ماهواره یا حالت بدون اینترنت"], notes: "همه کامیون‌ها روی یک نقشه: داخل معدن با ایستگاه، در جاده با درصد مسیر و زمان رسیدن، ورودی‌ها، ناوگان داخلی و رویدادها." });
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: O });
    s.addText("۱۰ کنترل ضدتقلب", { placeholder: "title" });
    const ctl = [
      ["فقط وزن پایدار و تازه", "ثبت وزن ناپایدار یا قدیمی‌تر از ۱۲ ثانیه ممکن نیست."],
      ["هویت دستگاه و قفل باسکول", "گواهی کالیبراسیون منقضی = قفل توزین تجاری."],
      ["دو منبع هویت", "پلاک‌خوان و RFID باید یکی باشند؛ مغایرت = توقف."],
      ["همه چرخ‌ها روی باسکول", "پرتوهای IR + ماسک تصویری؛ یک چرخ بیرون = بدون ثبت."],
      ["شواهد تصویری با hash", "جلو، عقب، بالا، جانب و زیر خودرو با SHA-256."],
      ["QR خروج یک‌بارمصرف", "توکن غیرقابل حدس، مصرف اتمیک، اسکن دوم = هشدار."],
      ["زنجیره audit با HMAC", "هر تغییر به رکورد قبلی زنجیر می‌شود؛ دستکاری فوراً کشف می‌شود."],
      ["نسخه و شمارنده چاپ", "هیچ چیز حذف نمی‌شود؛ چاپ مجدد با دلیل و شماره."],
      ["الگوهای آماری تقلب", "تارای غیرعادی، خالص تکراری، سفر غیرممکن، ثبت دستی زیاد."],
      ["قفل حواله و سهمیه", "مصرف اتمیک سهمیه؛ اضافه‌برداشت یا انقضا = توقف خروج."],
    ];
    const cw = (W - 2 * M - 0.5) / 2;
    ctl.forEach(([t, d], i) => {
      const x = i < 5 ? M + cw + 0.5 : M;
      const y = 1.45 + (i % 5) * 1.08;
      const num = String(i + 1).padStart(2, "0").replace(/\d/g, (x) => "۰۱۲۳۴۵۶۷۸۹"[x]);
      s.addShape(pres.ShapeType.ellipse, { x: x + cw - 0.6, y: y + 0.05, w: 0.6, h: 0.6, fill: { color: C.accent1 }, line: { color: C.accent1 }, objectName: `control-dot-${i + 1}` });
      s.addText(num, { x: x + cw - 0.6, y: y + 0.05, w: 0.6, h: 0.6, fontSize: 15, bold: true, color: C.background1, align: "center", valign: "middle", isTextBox: true, margin: 0 });
      s.addText([{ text: t, options: { bold: true, fontSize: 17, color: C.text2, breakLine: true } }, { text: d, options: { fontSize: 14, color: "5B6B79" } }], { x, y, w: cw - 0.8, h: 0.95, align: "right", rtlMode: true, valign: "top", isTextBox: true, margin: 0, objectName: `control-${i + 1}` });
    });
    s.addNotes("هر کنترل یک راه مشخص تقلب را می‌بندد؛ همه در audit زنجیره‌ای ثبت می‌شوند.");
  }
  content(O, { kicker: "کنترل", title: "هیچ استثنایی بی‌صاحب نمی‌ماند", shot: "alerts", points: ["۴۰ قانون قابل تنظیم با تست روی داده گذشته", "چرخه دیده‌شد ← بررسی ← حل با SLA", "تارای غیرعادی، سفر غیرممکن، ثبت دستی زیاد", "زنجیره HMAC: دستکاری فوراً کشف می‌شود"], notes: "هشدارها با SLA و مسئول؛ الگوهای آماری تقلب؛ زنجیره audit که هر دستکاری را فوراً نشان می‌دهد." });
  content(O, { kicker: "داشبورد", title: "عدد درست، همان لحظه", shot: "dashboard", points: ["تناژ امروز و ۷ روز، هدف/واقعی شیفت", "سه جمع جدا: داخلی، انتقال، فروش", "گزارش Excel/PDF و ایمیل زمان‌بندی", "صورت‌حساب مشتری و اتصال ERP"], notes: "تناژ ورودی و خروجی، هدف شیفت، ریسک و گزارش‌های آماده با خروجی Excel و PDF و ارسال خودکار ایمیل." });
  content(O, { kicker: "سخت‌افزار", title: "تجهیزات استاندارد، Edge محلی، کار بدون اینترنت", shot: "hardware", points: ["پلاک‌خوان، RFID، UVSS، LiDAR، indicator، PLC", "Edge محلی: قطع اینترنت = ادامه کار", "همگام‌سازی بعدی بدون تکرار", "راهبند هرگز بدون تأیید PLC باز نمی‌شود"], notes: "تجهیزات استاندارد بازار به Edge محلی وصل می‌شوند؛ با قطع اینترنت کار ادامه دارد و بعداً بدون تکرار همگام می‌شود." });

  // ------------ 4. close ------------
  pres.addSection({ title: "جمع‌بندی" });
  {
    const s = pres.addSlide({ masterName: "CONTENT_DARK", sectionTitle: "جمع‌بندی" });
    s.addText("قدم بعدی", { placeholder: "title" });
    const steps = [
      ["۱. جلسه نیازسنجی", "لاین‌ها، مدارک، حواله‌ها و ERP شما"],
      ["۲. پایلوت", "یک دروازه و یک باسکول با داده واقعی"],
      ["۳. توسعه کامل", "همه لاین‌ها، LiDAR، UVSS و ناوگان"],
    ];
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    steps.forEach(([t, d], i) => {
      const x = W - M - cw - i * (cw + 0.4);
      s.addShape(pres.ShapeType.roundRect, { x, y: 1.9, w: cw, h: 2.6, rectRadius: 0.12, fill: { color: "1D3A56" }, line: { color: "1D3A56" }, objectName: `next-${i + 1}` });
      s.addText(t, { x: x + 0.3, y: 2.2, w: cw - 0.6, h: 0.7, fontSize: 24, bold: true, color: C.background1, align: "right", rtlMode: true, isTextBox: true, margin: 0 });
      s.addText(d, { x: x + 0.3, y: 3.0, w: cw - 0.6, h: 1.2, fontSize: 18, color: "CFE3F2", align: "right", rtlMode: true, valign: "top", isTextBox: true, margin: 0 });
    });
    s.addText("نمایش زنده روی لپ‌تاپ", { x: M, y: 4.85, w: W - 2 * M, h: 0.45, fontSize: 18, bold: true, color: "CFE3F2", align: "right", rtlMode: true, isTextBox: true, margin: 0 });
    [["۱. اجرا: ", "npm run demo"], ["۲. ویترین نمونه‌ها: ", "localhost:3000/showcase"], ["۳. همین ارائه: ", "localhost:3000/present"]].forEach(([label, cmd], i) =>
      s.addText([{ text: label, options: { color: "CFE3F2" } }, { text: cmd, options: { color: "7DD3FC", fontFace: "Courier New" } }], { x: M, y: 5.35 + i * 0.45, w: W - 2 * M, h: 0.4, fontSize: 17, align: "right", rtlMode: true, isTextBox: true, margin: 0, objectName: `demo-step-${i + 1}` }),
    );
    s.addNotes("پیشنهاد: پایلوت روی یک باسکول و یک دروازه، سپس توسعه به همه لاین‌ها و اتصال ERP.");
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await pres.writeFile({ fileName: OUT });
  if (APPLY_THEME) {
    const { applyTheme } = require(APPLY_THEME);
    await applyTheme(OUT, THEME);
  }
  console.log("PPTX:", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
