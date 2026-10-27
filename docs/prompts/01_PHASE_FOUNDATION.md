# فاز ۰۱ — زیرساخت، Design System، RTL/i18n، Shell

> پیش‌نیاز: `00_MASTER_PROMPT.md` را خوانده‌ای. مرجع: `spec/DESIGN_SYSTEM.md`.

## کار
1. پروژه `web/` را با Next.js 15 + React 19 + TypeScript strict + Tailwind v4 بساز (`npm`). اسکریپت‌ها: `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `test` (vitest).
2. `src/app/globals.css`: همه توکن‌های رنگ روشن/تیره به‌صورت CSS variables (`:root` و `[data-theme=dark]`) و نگاشت در `@theme` تیلویند (`--color-bg`, `--color-surface`, `--color-primary`, …). فونت Vazirmatn از `@fontsource-variable/vazirmatn`. کلاس `.num` با `tabular-nums` و `direction:ltr; unicode-bidi:isolate`.
3. **i18n:** `src/i18n/{fa,en}.ts` (کلیدهای تو در تو)، hook `useT()`؛ store زبان در Zustand + localStorage؛ تنظیم `document.documentElement.dir/lang`. layout ریشه پیش‌فرض `lang="fa" dir="rtl"`.
4. **فرمت:** `src/lib/format.ts`: `fmtNum`, `fmtKg` (kg/t)، `fmtDate`/`fmtTime`/`fmtDateTime` (شمسی با `date-fns-jalali` در fa، میلادی در en، timezone Asia/Tehran)، `fmtDuration`، `fmtRelative` («۲ دقیقه پیش»)، ارقام فارسی در fa.
5. **کامپوننت‌های UI** (`src/components/ui`): Button، Card، Badge، StatusPill (PASS/REVIEW/HOLD/BLOCK/OFFLINE/UNKNOWN/ESTIMATED/MANUAL با رنگ+آیکون+متن)، KpiTile (با sparkline کوچک SVG و lastUpdatedAt)، Tabs، Table ساده، Dialog/ConfirmDialog با فیلد دلیل اجباری، Drawer، Input/Select/Switch/SegmentedControl، EmptyState، Skeleton، Toast.
6. **کامپوننت‌های دامنه پایه:** `IranPlate` (SVG دقیق پلاک ایرانی: نوار آبی چپ با پرچم و I.R. IRAN، دو رقم، حرف، سه رقم، کادر «ایران» + کد؛ سایز sm/md/lg/xl)، `WeightDisplay` (حالت LED هفت‌قطعه‌ای با فونت CSS و حالت مدرن؛ نشانگرهای STABLE/MOTION/ZERO/FRESH و سن)، `TrafficLight`، `BarrierIcon` (انیمیشن باز/بسته)، `LiveDot`.
7. **Shell اپ** (`src/components/shell`): سایدبار راست جمع‌شونده با گروه‌های DESIGN_SYSTEM §۴ و همه لینک‌های SCREENS (فعلاً صفحات ساده با عنوان)، topbar با انتخاب سایت/شیفت، جست‌وجو، وضعیت اتصال، زنگ هشدار، سوییچ زبان، سوییچ تم، انتخاب «نقش دمو» (برای نمایش RBAC)؛ bottom-nav موبایل.
8. `src/config/brand.ts` (نام، شعار، رنگ لوگو) و لوگوی SVG ساده اختصاصی (ترازو + کامیون مینیمال).
9. PWA پایه: `manifest.webmanifest` و آیکون SVG.

## پذیرش
- `/app` با shell کامل در fa (RTL) و en (LTR) و تم روشن/تیره رندر می‌شود.
- صفحه `/app/dev/ui` (فقط dev) همه کامپوننت‌ها از جمله پلاک‌ها و WeightDisplay را نشان می‌دهد.
- typecheck/lint/build سبز. commit: `feat(web): foundation, design system, i18n, shell`.
