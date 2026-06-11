import {
    CheckCircle2,
    AlertTriangle,
    X
} from "lucide-react";

import CircularGauge from "./CircularGauge";
import ProgressBar from "./ProgressBar";

import { cn, formatVal } from "../utils/helpers";
function ResultCard({ result, onReset }) {
    const isSafe = result.prediction === 0;
    const safePercent = Math.round((result.probability0 || 0) * 100);
    const riskPercent = Math.round((result.probability1 || 0) * 100);

    return (
        <div className={cn(
            "rounded-2xl border overflow-hidden shadow-2xl",
            isSafe
                ? "border-emerald-500/30 shadow-emerald-500/10"
                : "border-red-500/30 shadow-red-500/10"
        )}>
            {/* Header banner */}
            <div className={cn(
                "relative px-6 py-5 flex items-center justify-between",
                isSafe
                    ? "bg-gradient-to-r from-emerald-950 to-teal-950"
                    : "bg-gradient-to-r from-red-950 to-rose-950"
            )}>
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center shadow-lg",
                        isSafe ? "bg-emerald-500/20 shadow-emerald-500/30" : "bg-red-500/20 shadow-red-500/30"
                    )}>
                        {isSafe
                            ? <CheckCircle2 size={28} className="text-emerald-400" />
                            : <AlertTriangle size={28} className="text-red-400" />
                        }
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 uppercase tracking-widest mb-0.5"
                            style={{ fontFamily: "'DM Mono', monospace" }}>
                            Analysis Result · ID #{result.id}
                        </div>
                        <div className={cn(
                            "text-2xl font-bold",
                            isSafe ? "text-emerald-300" : "text-red-300"
                        )}>
                            {isSafe ? "Safe / Clean Water" : "Risky / Hazardous Water"}
                        </div>
                        <div className="text-sm text-slate-400 mt-0.5">
                            Threshold used: <span className="text-slate-300 font-mono">{result.thresholdUsed}</span>
                            &nbsp;·&nbsp; Source: <span className="text-slate-300">{result.Source}</span>
                        </div>
                    </div>
                </div>
                <button onClick={onReset}
                    className="p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                    <X size={16} />
                </button>
            </div>

            {/* Probability Gauges */}
            <div className="bg-slate-900 px-6 py-6">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-5"
                    style={{ fontFamily: "'DM Mono', monospace" }}>
                    Probability Breakdown
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <CircularGauge
                        percent={safePercent}
                        label="Safety Score"
                        color="#34d399"
                        size={130}
                    />
                    <CircularGauge
                        percent={riskPercent}
                        label="Risk Score"
                        color={isSafe ? "#f87171" : "#f43f5e"}
                        size={130}
                    />
                </div>

                {/* Bar details */}
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-slate-400">Safety Probability</span>
                            <span className="text-emerald-400 font-mono font-semibold">{safePercent}%</span>
                        </div>
                        <ProgressBar value={safePercent} color="#34d399" />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-slate-400">Risk Probability</span>
                            <span className="text-red-400 font-mono font-semibold">{riskPercent}%</span>
                        </div>
                        <ProgressBar value={riskPercent} color="#f87171" />
                    </div>
                </div>
            </div>

            {/* Parameter Summary */}
            <div className="bg-slate-900/60 border-t border-slate-800 px-6 py-5">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-4"
                    style={{ fontFamily: "'DM Mono', monospace" }}>
                    Parameter Summary
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                        ["pH", result.pH, "pH"],
                        ["Iron", result.Iron, "mg/L"],
                        ["Nitrate", result.Nitrate, "mg/L"],
                        ["Chloride", result.Chloride, "mg/L"],
                        ["Lead", result.Lead, "mg/L"],
                        ["Zinc", result.Zinc, "mg/L"],
                        ["Turbidity", result.Turbidity, "NTU"],
                        ["Fluoride", result.Fluoride, "mg/L"],
                        ["Copper", result.Copper, "mg/L"],
                        ["Sulfate", result.Sulfate, "mg/L"],
                        ["Chlorine", result.Chlorine, "mg/L"],
                        ["TDS", result["Total Dissolved Solids"], "mg/L"],
                    ].map(([name, val, unit]) => (
                        <div key={name} className="bg-slate-800/60 rounded-lg px-3 py-2.5 border border-slate-700/50">
                            <div className="text-xs text-slate-500 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>
                                {name}
                            </div>
                            <div className="text-sm font-semibold text-white flex items-baseline gap-1">
                                <span style={{ fontFamily: "'DM Mono', monospace" }}>{formatVal(val)}</span>
                                <span className="text-xs text-slate-500 font-normal">{unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default ResultCard;