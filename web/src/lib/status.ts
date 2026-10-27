export const txStatus = (s: string) => (s === "APPROVED" ? "PASS" : s === "EXCEPTION" ? "HOLD" : s === "VOIDED" ? "BLOCK" : "REVIEW") as "PASS" | "HOLD" | "BLOCK" | "REVIEW";
export const sevTone = (s: string) => (s === "CRITICAL" || s === "HIGH" ? "danger" : s === "WARNING" ? "warning" : "info") as "danger" | "warning" | "info";
