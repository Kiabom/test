"use client";
import { JourneySection, ScanSection, DriverSection } from "@/components/marketing/Sections";
export default function FeaturesPage() {
  return (
    <div className="px-4">
      <JourneySection detailed />
      <ScanSection />
      <DriverSection />
    </div>
  );
}
