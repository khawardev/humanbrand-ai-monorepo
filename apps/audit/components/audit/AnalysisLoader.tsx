'use client';

import { useMemo } from 'react';

// --- Sub-component for the animated background lines ---
const AnimatedLines = () => {
    const lines = useMemo(() => {
        const lineCount = 12; // Number of lines to draw
        return Array.from({ length: lineCount }).map((_, i) => ({
            // Random start and end points for each line
            x1: `${Math.random() * 100}%`,
            y1: `${Math.random() * 100}%`,
            x2: `${Math.random() * 100}%`,
            y2: `${Math.random() * 100}%`,
            // Random duration and delay for a dynamic, non-repeating feel
            duration: `${4 + Math.random() * 6}s`,
            delay: `${Math.random() * 5}s`,
        }));
    }, []);

    return (
        <svg
            width="100%"
            height="100%"
            className="absolute inset-0 z-0 opacity-40"
        >
            <defs>
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8FFF00" stopOpacity="0" />
                    <stop offset="50%" stopColor="#8FFF00" stopOpacity="1" />
                    <stop offset="100%" stopColor="#8FFF00" stopOpacity="0" />
                </linearGradient>
            </defs>
            {lines.map((line, i) => (
                <line
                    key={i}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="url(#line-gradient)"
                    strokeWidth="1"
                    className="animated-line"
                    style={{
                        animationDuration: line.duration,
                        animationDelay: line.delay,
                    }}
                />
            ))}
        </svg>
    );
};

// --- Main Loader Component ---
export default function AnalysisLoader() {
    return (
        <>
            {/* --- CSS Animations Definition --- */}
            <style jsx global>{`
        @keyframes drawLine {
          from { stroke-dasharray: 10000; stroke-dashoffset: 1000; }
          to { stroke-dasharray: 1000; stroke-dashoffset: 0; }
        }
        .animated-line {
          animation: drawLine ease-in-out infinite alternate;
        }
        @keyframes scanner {
          0% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .scanner-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: -10%; /* Start off-screen */
          width: 20%;
          height: 100%;
          background: linear-gradient(90deg, transparent, #8FFF00, transparent);
          animation: scanner 2s ease-in-out infinite;
          border-radius: 9999px;
        }
      `}</style>

            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#1a3a3a] text-white overflow-hidden">
                <AnimatedLines />
                <div className="relative z-10 flex flex-col items-center text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-wider">
                        Analyzing Your Brand
                    </h2>
                    <p className="mt-2 text-sm text-white/50 tracking-wide">
                        Scanning brand identity
                    </p>
                    <div className="mt-8 w-64 h-1 rounded-full bg-white/20 scanner-bar relative overflow-hidden">
                        {/* The scanner bar animation is handled by the ::before pseudo-element */}
                    </div>
                </div>
            </div>
        </>
    );
}