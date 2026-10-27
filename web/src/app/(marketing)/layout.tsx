import { LiveRoot } from "@/components/LiveRoot";
import { MarketingChrome } from "@/components/marketing/Chrome";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <LiveRoot>
      <MarketingChrome>{children}</MarketingChrome>
    </LiveRoot>
  );
}
