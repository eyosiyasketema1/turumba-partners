"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export default function CobeGlobe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    
    if (!canvasRef.current) return;
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 0,
      theta: 0.2,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.2, 0.4, 1],
      glowColor: [0.1, 0.1, 0.2],
      markers: [
        { location: [37.78, -122.44], size: 0.05 }, // sf
        { location: [40.71, -74.01], size: 0.05 }, // nyc
      ],
      arcs: [
        { from: [37.78, -122.44], to: [40.71, -74.01] },
      ],
      arcColor: [0.3, 0.5, 1],
      arcWidth: 0.5,
      arcHeight: 0.3,
      onRender: (state: any) => {
        state.phi = phi;
        phi += 0.005;
      },
    } as any);

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className={`absolute z-10 pointer-events-none flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          contain: "layout paint size",
          aspectRatio: 1,
          opacity: 1,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
