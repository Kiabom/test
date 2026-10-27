import { getDb } from "@/server/runtime";
import { liveSnapshot } from "@/server/views";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const encoder = new TextEncoder();
  let timer: ReturnType<typeof setInterval> | undefined;
  const stream = new ReadableStream({
    start(controller) {
      const send = () => {
        try {
          controller.enqueue(encoder.encode(`event: tick\ndata: ${JSON.stringify(liveSnapshot(getDb()))}\n\n`));
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
