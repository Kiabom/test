import { getDb } from "@/server/runtime";
import { liveSnapshotJson } from "@/server/views";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Server-sent snapshots. A frame goes out when the data revision changes (at most once a second)
 * or as a keep-alive (5 s live, 15 s for the frozen presentation scene).
 */
export function GET(req: Request) {
  const encoder = new TextEncoder();
  let timer: ReturnType<typeof setInterval> | undefined;
  const stream = new ReadableStream({
    start(controller) {
      let sentRev = -1;
      let sentAt = 0;
      const send = () => {
        try {
          const d = getDb();
          const now = Date.now();
          // unchanged data: refresh every 5 s in live mode, every 15 s for the frozen scene
          if (d.revision === sentRev && now - sentAt < (d.live.scene === "LIVE" ? 5000 : 15_000)) return;
          const snap = liveSnapshotJson(d);
          sentRev = snap.rev;
          sentAt = now;
          controller.enqueue(encoder.encode(`event: tick\ndata: ${snap.json}\n\n`));
        } catch {
          if (timer) clearInterval(timer);
        }
      };
      controller.enqueue(encoder.encode("retry: 2000\n\n"));
      send();
      timer = setInterval(send, 1000);
      req.signal.addEventListener("abort", () => {
        if (timer) clearInterval(timer);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      });
    },
    cancel() {
      if (timer) clearInterval(timer);
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive", "X-Accel-Buffering": "no" },
  });
}
