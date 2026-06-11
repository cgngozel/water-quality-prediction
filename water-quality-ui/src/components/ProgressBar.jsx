import { useState, useEffect } from "react";

export default function ProgressBar({ value, color }) {
    function ProgressBar({ value, color }) {
        const [w, setW] = useState(0);
        useEffect(() => { const t = setTimeout(() => setW(value), 150); return () => clearTimeout(t); }, [value]);
        return (
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${w}%`, backgroundColor: color }}
                />
            </div>
        );
    }
}
