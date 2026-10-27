"use client";
import { FaqSection, PricingTable, RequestForm, SectionTitle } from "@/components/marketing/Sections";
import { useL } from "@/lib/prefs";

export default function PricingPage() {
  const L = useL();
  return (
    <div className="px-4 py-14">
      <SectionTitle kicker={L("قیمت‌گذاری", "Pricing")} title={L("پایه · حرفه‌ای · سازمانی", "Basic · Professional · Enterprise")} sub={L("قیمت نهایی به تعداد باسکول، لاین و تجهیزات بستگی دارد (ارقام نمایشی).", "Final pricing depends on scales, lanes and equipment (illustrative).")} />
      <PricingTable />
      <div className="mt-14">
        <FaqSection />
      </div>
      <div className="mt-14">
        <RequestForm />
      </div>
    </div>
  );
}
