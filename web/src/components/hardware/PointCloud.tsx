"use client";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { heapHeight, prng, type CloudMode } from "./heap";

export type { CloudMode };

function buildCloud(seed: number, mode: CloudMode, offCenter: number) {
  const r = prng(seed + 7);
  const pts: number[] = [];
  const cols: number[] = [];
  const L = 7.6;
  const W = 2.4;
  const H = 1.5;
  const c = new THREE.Color();
  const push = (x: number, y: number, z: number, hNorm: number, gray = false) => {
    pts.push(x, y, z);
    if (gray) c.setRGB(0.55, 0.6, 0.66);
    else c.setHSL(0.66 - 0.66 * Math.min(1, Math.max(0, hNorm)), 0.9, 0.52);
    cols.push(c.r, c.g, c.b);
  };
  // bed walls & floor
  for (let i = 0; i < 2200; i++) {
    const x = (r() - 0.5) * L;
    const z = (r() - 0.5) * W;
    push(x, 0, z, 0, mode !== "empty");
  }
  for (let i = 0; i < 1400; i++) {
    const side = r() < 0.5 ? -1 : 1;
    const x = (r() - 0.5) * L;
    const y = r() * H;
    push(x, y, (side * W) / 2, 0, true);
  }
  for (let i = 0; i < 500; i++) {
    const side = r() < 0.5 ? -1 : 1;
    push((side * L) / 2, r() * H, (r() - 0.5) * W, 0, true);
  }
  if (mode !== "empty") {
    for (let i = 0; i < 9000; i++) {
      const x = (r() - 0.5) * (L - 0.2);
      const z = (r() - 0.5) * (W - 0.2);
      const h = Math.min(H + 0.9, heapHeight(x, z, seed, offCenter) + 0.25 + (r() - 0.5) * 0.04);
      push(x, h, z, h / (H + 0.6));
    }
  } else {
    // carryback residue
    for (let i = 0; i < 400; i++) {
      const x = -L / 2 + 0.3 + r() * 1.2;
      const z = (r() - 0.5) * (W - 0.3);
      push(x, 0.05 + r() * 0.12, z, 0.15);
    }
  }
  return { positions: new Float32Array(pts), colors: new Float32Array(cols) };
}

function Cloud({ seed, mode, offCenter }: { seed: number; mode: CloudMode; offCenter: number }) {
  const geo = useMemo(() => {
    const { positions, colors } = buildCloud(seed, mode, offCenter);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [seed, mode, offCenter]);
  return (
    <points geometry={geo}>
      <pointsMaterial size={0.045} vertexColors sizeAttenuation />
    </points>
  );
}

export default function PointCloudViewer({ seed = 1, mode = "loaded", offCenter = 0, height = 360 }: { seed?: number; mode?: CloudMode; offCenter?: number; height?: number }) {
  return (
    <div style={{ height }} className="overflow-hidden rounded-xl bg-[#05070d]">
      <Canvas camera={{ position: [6.5, 5, 6.5], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={["#05070d"]} />
        <gridHelper args={[14, 28, "#1e3a5f", "#10213a"]} position={[0, -0.01, 0]} />
        <Cloud seed={seed} mode={mode} offCenter={offCenter} />
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}
