import { useState, useEffect } from "react";

export default function CircularGauge({ percent, label, color, size = 120 }) {
    const radius = 44;
    const circ = 2 * Math.PI * radius;
    const [animPct, setAnimPct] = useState(0);

    useEffect(() => {
        const t = setTimeout(() => setAnimPct(percent), 100);
        return () => clearTimeout(t);
    }, [percent]);

    const dash = (animPct / 100) * circ;

    return (
        <div className="flex flex-col items-center gap-2">
            <svg width={size} height={size} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle
                    cx="50" cy="50" r={radius} fill="none"
                    stroke={color} strokeWidth="8"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}
                />
                <text x="50" y="46" textAnchor="middle" fontSize="16" fontWeight="700"
                    fill={color} fontFamily="'DM Mono', monospace">
                    {Math.round(animPct)}%
                </text>
                <text x="50" y="60" textAnchor="middle" fontSize="7.5" fill="#94a3b8" fontFamily="system-ui">
                    {label}
                </text>
            </svg>
        </div>
    );
}