"use client";

import { useMemo } from "react";
import DottedMap from "dotted-map";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
}

// --- Helper Functions (remain the same) ---
const projectPoint = (lat: number, lng: number) => {
  const x = (lng + 180) * (800 / 360);
  const y = (90 - lat) * (400 / 180);
  return { x, y };
};

const createCurvedPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
  const midX = (start.x + end.x) / 2;
  const midY = Math.min(start.y, end.y) - 50;
  return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
};


export default function WorldMap({ dots = [] }: MapProps) {
  const mapInstance = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);

  const svgMap = useMemo(() => {
    return mapInstance.getSVG({
      radius: 0.35,
      color: "currentColor",
      shape: "circle",
      backgroundColor: "transparent",
    });
  }, [mapInstance]);

  const animatedDots = useMemo(() => {
    return dots.map(dot => ({
      ...dot,
      startPoint: projectPoint(dot.start.lat, dot.start.lng),
      endPoint: projectPoint(dot.end.lat, dot.end.lng),
      path: createCurvedPath(projectPoint(dot.start.lat, dot.start.lng), projectPoint(dot.end.lat, dot.end.lng)),
      // Random delays for CSS animation
      animationDelay: `${(Math.random() * 5).toFixed(2)}s`,
    }));
  }, [dots]);

  return (
    <>
      {/* --- Pure CSS Animations --- */}
      <style jsx global>{`
        @keyframes pulse {
          0% { r: 2; opacity: 0.6; }
          100% { r: 8; opacity: 0; }
        }
        @keyframes march {
          from { stroke-dashoffset: 12; }
          to { stroke-dashoffset: 0; }
        }
        .pulsing-circle {
          animation: pulse 3s infinite;
        }
        
      `}</style>

      <div className="w-full  relative text-accent">
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
          alt="world map background"
          height="495"
          width="1056"
          draggable={false}
        />
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full absolute inset-0 pointer-events-none select-none text-primary"
        >
        
          {animatedDots.map((dot, i) => (
            <g key={`group-${i}`}>
              {/* Animated Path using CSS */}
              <path
                d={dot.path}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1.5"
                className="marching-path"
                style={{ animationDelay: dot.animationDelay }}
              />

              <circle cx={dot.startPoint.x} cy={dot.startPoint.y} r="2" fill="currentColor" />
              <circle
                cx={dot.startPoint.x}
                cy={dot.startPoint.y}
                r="2"
                fill="currentColor"
                className="pulsing-circle"
                style={{ animationDelay: dot.animationDelay }}
              />

              {/* Static end point */}
              <circle cx={dot.endPoint.x} cy={dot.endPoint.y} r="2" fill="currentColor" />
              {/* Pulsing end point using CSS */}
              <circle
                cx={dot.endPoint.x}
                cy={dot.endPoint.y}
                r="2"
                fill="currentColor"
                className="pulsing-circle"
                style={{ animationDelay: dot.animationDelay }}
              />
            </g>
          ))}
        </svg>
      </div>
    </>
  );
}