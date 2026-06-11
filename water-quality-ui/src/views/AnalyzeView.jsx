import { useState, useRef } from "react";

import {
    Activity,
    Waves,
    ArrowRight,
    Loader2,
    Trash2,
    AlertTriangle,
    ChevronRight,
    FlaskConical
} from "lucide-react";

import JsonUploadZone from "../components/JsonUploadZone";
import InputField from "../components/InputField";
import ResultCard from "../components/ResultCard";

import {
    INITIAL_FORM,
    FIELD_CONFIG,
    COLOR_OPTIONS,
    SOURCE_OPTIONS
} from "../constants/waterConstants";

import { cn } from "../utils/helpers";
function AnalyzeView({ onResult, history }) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const resultRef = useRef(null);

    const handleChange = (key, value) => {
        setForm((f) => ({ ...f, [key]: value }));
        setError(null);
    };

    const handleJsonFill = (updates) => {
        setForm((f) => ({ ...f, ...updates }));
        setResult(null);
        setError(null);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        // Build payload — cast numeric strings to floats
        const payload = {};
        for (const [k, v] of Object.entries(form)) {
            if (k === "Color" || k === "Source") {
                payload[k] = v;
            } else {
                const n = parseFloat(v);
                if (isNaN(n)) { setError(`"${k}" must be a valid number.`); setLoading(false); return; }
                payload[k] = n;
            }
        }

        try {
            const res = await fetch("http://localhost:8080/api/water-quality/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`Server error: ${res.status} ${res.statusText}`);
            const data = await res.json();
            setResult(data);
            onResult(data);
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
        } catch (err) {
            setError(err.message || "An unexpected error occurred. Check that your backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => { setResult(null); setForm(INITIAL_FORM); };

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">New Analysis</h1>
                    <p className="text-slate-400 text-sm mt-1">Enter water sample parameters to run an AI-powered quality assessment.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                    <Activity size={13} className="text-cyan-500" />
                    <span style={{ fontFamily: "'DM Mono', monospace" }}>ML Model: Active</span>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <FlaskConical size={14} className="text-blue-400" />
                    </div>
                    <span className="text-sm font-semibold text-slate-200">Sample Parameters</span>
                    <span className="ml-auto text-xs text-slate-600" style={{ fontFamily: "'DM Mono', monospace" }}>
                        {Object.keys(INITIAL_FORM).length} fields
                    </span>
                </div>

                <div className="p-6">
                    {/* ── JSON Upload ── */}
                    <div className="mb-6 pb-6 border-b border-slate-800">
                        <JsonUploadZone onFill={handleJsonFill} />
                    </div>

                    {/* Numeric fields grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                        {FIELD_CONFIG.map(({ key, label, unit, hint }) => (
                            <InputField key={key} fieldKey={key} label={label} unit={unit} hint={hint}
                                value={form[key]} onChange={handleChange} />
                        ))}
                    </div>

                    {/* Dropdown row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {[
                            { key: "Color", label: "Color", options: COLOR_OPTIONS },
                            { key: "Source", label: "Source", options: SOURCE_OPTIONS },
                        ].map(({ key, label, options }) => (
                            <div key={key}>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wide uppercase"
                                    style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem" }}>
                                    {label}
                                </label>
                                <div className="relative">
                                    <select
                                        value={form[key]}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        className="w-full appearance-none bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm
                      text-white transition-all duration-200 focus:outline-none focus:border-cyan-500
                      focus:ring-1 focus:ring-cyan-500/30 hover:border-slate-600 cursor-pointer"
                                        style={{ fontFamily: "'DM Mono', monospace" }}
                                    >
                                        {options.map((o) => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                    <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 rotate-90 pointer-events-none" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-start gap-3 p-4 bg-red-950/40 border border-red-800/50 rounded-xl mb-5">
                            <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
                            <p className="text-sm text-red-300">{error}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <button
                            onClick={() => { setForm(INITIAL_FORM); setResult(null); setError(null); }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
                        >
                            <Trash2 size={13} />
                            Clean Parameters
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={cn(
                                "flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200",
                                loading
                                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
                            )}
                        >
                            {loading ? (
                                <><Loader2 size={16} className="animate-spin" /> Analyzing Sample…</>
                            ) : (
                                <><Waves size={16} /> Analyze Water <ArrowRight size={14} /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Result */}
            {result && (
                <div ref={resultRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ResultCard result={result} onReset={handleReset} />
                </div>
            )}
        </div>
    );
}
export default AnalyzeView;