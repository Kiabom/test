"use client";
import { CameraFeed } from "@/components/hardware/CameraFeed";
import { ScaleDeckTop } from "@/components/hardware/ScaleDeck";
import { UvssImage } from "@/components/hardware/Devices";
import { ControlsGrid, SectionTitle } from "@/components/marketing/Sections";
import { Card } from "@/components/ui";
import { useL } from "@/lib/prefs";

export default function ControlsPage() {
  const L = useL();
  return (
    <div className="px-4 py-14">
      <SectionTitle kicker={L("کنترل‌ها", "Controls")} title={L("کنترل‌های ۰۱ تا ۱۰", "Controls 01 – 10")} sub={L("هر کنترل یک قانون قابل پیکربندی در موتور قوانین است و هر رخداد با شواهد و audit ثبت می‌شود.", "Each control is a configurable rule in the rule engine; every hit is recorded with evidence and audit.")} />
      <ControlsGrid />
      <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="mb-2 font-bold">04 · {L("چرخ خارج از باسکول", "Wheel off the deck")}</div>
          <ScaleDeckTop occupied beams={[true, true, true, false]} positionOk={false} offsetPct={-9} color="#c92a2a" loaded className="w-full" />
          <div className="mt-2 text-xs text-danger">⛔ {L("ثبت وزن غیرفعال — راننده: کمی جلو بروید", "Capture disabled — driver: move forward a little")}</div>
        </Card>
        <Card className="p-4">
          <div className="mb-2 font-bold">03 · {L("مغایرت پلاک و RFID", "Plate/RFID mismatch")}</div>
          <CameraFeed view="front" seed={8} plate={{ d2: "36", letter: "ص", d3: "418", region: "55" }} color="#5f3dc4" confidence={0.93} label="CAM-A-FRONT" />
          <div className="mt-2 text-xs text-danger">RFID → 72 ل 905 - 22 · HOLD</div>
        </Card>
        <Card className="p-4">
          <div className="mb-2 font-bold">05 · {L("ناهنجاری زیر خودرو", "Under-vehicle anomaly")}</div>
          <UvssImage anomalies={[{ x: 0.38, y: 0.46, w: 0.12, h: 0.1, label: "", score: 0.86 }]} className="w-full rounded" />
          <div className="mt-2 text-xs text-danger">{L("تطابق با مرجع ۷۱٪ — ارجاع به حراست", "71% reference match — sent to security")}</div>
        </Card>
      </div>
    </div>
  );
}
