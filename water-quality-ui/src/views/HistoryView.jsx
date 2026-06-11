import { useState, useEffect } from "react";

import {
    Database,
    Loader2,
    RefreshCw,
    BarChart3
} from "lucide-react";

import { cn, formatVal } from "../utils/helpers";
function HistoryView({ history }) {
    const [fetchedHistory, setFetchedHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const res = await fetch("http://localhost:8080/api/water-quality/history");
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                const data = await res.json();
                setFetchedHistory(Array.isArray(data) ? data : []);
            } catch {
                // Fall back to in-session history
                setFetchedHistory(null);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const displayHistory = fetchedHistory !== null ? fetchedHistory : history;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Analysis History</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {displayHistory.length > 0
                            ? `${displayHistory.length} record${displayHistory.length !== 1 ? "s" : ""} found`
                            : "No analyses recorded yet."}
                    </p>
                </div>
                <button
                    onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 400); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                >
                    <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Database size={14} className="text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold text-slate-200">Past Analyses</span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20 gap-3 text-slate-500">
                        <Loader2 size={20} className="animate-spin" />
                        <span className="text-sm">Loading records…</span>
                    </div>
                ) : displayHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                            <BarChart3 size={24} className="text-slate-600" />
                        </div>
                        <p className="text-slate-400 font-medium">No analyses yet</p>
                        <p className="text-slate-600 text-sm mt-1">Submit a water sample from the New Analysis tab to get started.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-800/40">
                                    {["ID", "pH", "Iron", "Nitrate", "Chloride", "Color", "Turbidity", "TDS", "Source", "Status"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap"
                                            style={{ fontFamily: "'DM Mono', monospace" }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {displayHistory.map((row, i) => {
                                    const isSafe = row.prediction === 0;
                                    return (
                                        <tr key={row.id ?? i}
                                            className="hover:bg-slate-800/40 transition-colors group">
                                            <td className="px-4 py-3 text-slate-500 font-mono text-xs">#{row.id ?? i + 1}</td>
                                            <td className="px-4 py-3 text-slate-300 font-mono">{formatVal(row.pH)}</td>
                                            <td className="px-4 py-3 text-slate-300 font-mono">{formatVal(row.Iron)}</td>
                                            <td className="px-4 py-3 text-slate-300 font-mono">{formatVal(row.Nitrate)}</td>
                                            <td className="px-4 py-3 text-slate-300 font-mono">{formatVal(row.Chloride)}</td>
                                            <td className="px-4 py-3 text-slate-400 max-w-[100px] truncate">{row.Color}</td>
                                            <td className="px-4 py-3 text-slate-300 font-mono">{formatVal(row.Turbidity)}</td>
                                            <td className="px-4 py-3 text-slate-300 font-mono">{formatVal(row["Total Dissolved Solids"])}</td>
                                            <td className="px-4 py-3 text-slate-400">{row.Source}</td>
                                            <td className="px-4 py-3">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                                                    isSafe
                                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                                                )}>
                                                    <span className={cn(
                                                        "w-1.5 h-1.5 rounded-full",
                                                        isSafe ? "bg-emerald-400" : "bg-red-400"
                                                    )} />
                                                    {isSafe ? "Safe" : "Risky"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
export default HistoryView;