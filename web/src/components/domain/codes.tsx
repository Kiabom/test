"use client";
import JsBarcode from "jsbarcode";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef } from "react";

export function Qr({ value, size = 140, className }: { value: string; size?: number; className?: string }) {
  return <QRCodeSVG value={value} size={size} level="M" marginSize={1} className={className} />;
}

export function Barcode({ value, height = 44, width = 1.6, className }: { value: string; height?: number; width?: number; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (ref.current) JsBarcode(ref.current, value, { format: "CODE128", height, width, displayValue: true, fontSize: 12, margin: 4, background: "transparent" });
  }, [value, height, width]);
  return <svg ref={ref} className={className} />;
}

export const origin = () => (typeof window !== "undefined" ? window.location.origin : "");
