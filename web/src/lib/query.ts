/** Read a URL query parameter on the client (pages render after mount, so window is available). */
export function queryParam(name: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  return new URLSearchParams(window.location.search).get(name) ?? undefined;
}
