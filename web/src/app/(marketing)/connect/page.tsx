"use client";
import { ConnectDiagram, SectionTitle } from "@/components/marketing/Sections";
import { Card } from "@/components/ui";
import { useL } from "@/lib/prefs";

export default function ConnectPage() {
  const L = useL();
  const rows = [
    [L("نمایشگر وزن (indicator)", "Weight indicator"), "RS-232 / RS-485 / TCP", L("Windows COM agent یا ماژول Wi-Fi کنار نمایشگر؛ فریم خام + stable + hash", "Windows COM agent or Wi-Fi module next to the indicator; raw frame + stable + hash")],
    [L("دوربین پلاک‌خوان", "ANPR camera"), "RTSP / ONVIF / SDK", L("OCR لبه با confidence و کادر، تصویر با SHA-256", "Edge OCR with confidence and bbox, SHA-256 image")],
    ["RFID UHF", "LLRP / TCP / Serial", L("EPC، RSSI، آنتن؛ ضدبرخورد و debounce", "EPC, RSSI, antenna; anti-collision and debounce")],
    [L("PLC، راهبند، چراغ، سنسور IR", "PLC, barrier, light, IR"), "Modbus TCP/RTU · DI/DO", L("OPEN_REQUEST → ACK؛ interlock سخت‌افزاری مستقل", "OPEN_REQUEST → ACK; independent hardware interlock")],
    ["LiDAR", "Ethernet / UDP / SDK", L("ابر نقاط، حجم، کیفیت؛ هم‌ترازی خالی/پر", "Point cloud, volume, quality; empty/loaded alignment")],
    ["UVSS", "GigE Vision", L("تصویر line-scan و مقایسه با مرجع", "Line-scan image and reference comparison")],
    [L("لودسل دیجیتال / جعبه تقسیم", "Digital load cells / JB"), "RS-485 (OEM)", L("drift، noise، تعادل — فقط با پشتیبانی سازنده", "Drift, noise, balance — only if the OEM supports it")],
    ["ERP / حسابداری", "REST / Webhook / SFTP", L("outbox با retry، dead-letter و replay idempotent", "Outbox with retry, dead-letter and idempotent replay")],
  ];
  return (
    <div className="px-4 py-14">
      <SectionTitle kicker={L("اتصال", "Connect")} title={L("اتصال به تجهیزات موجود شما", "Connect to the equipment you already have")} sub={L("پروتکل واقعی هر دستگاه پیش از استقرار با datasheet و آزمون سایت تأیید می‌شود.", "Each device's real protocol is confirmed with its datasheet and a site test before deployment.")} />
      <ConnectDiagram />
      <Card className="mx-auto mt-10 max-w-6xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-xs text-muted">
            <tr>
              <th className="p-3 text-start">{L("دستگاه", "Device")}</th>
              <th className="p-3 text-start">{L("رابط", "Interface")}</th>
              <th className="p-3 text-start">{L("قرارداد داده", "Data contract")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map(([a, b, c]) => (
              <tr key={a}>
                <td className="p-3 font-semibold">{a}</td>
                <td className="p-3 font-mono text-xs ltr">{b}</td>
                <td className="p-3 text-muted">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
