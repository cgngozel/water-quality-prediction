import { useState, useRef } from "react";

import {
    Upload,
    FileJson,
    CircleCheck,
    AlertTriangle,
    X
} from "lucide-react";

import { cn } from "../utils/helpers";
const KNOWN_KEYS = [
    "pH", "Iron", "Nitrate", "Chloride", "Lead", "Zinc", "Color",
    "Turbidity", "Fluoride", "Copper", "Odor", "Sulfate", "Conductivity",
    "Chlorine", "Manganese", "Total Dissolved Solids", "Source"
];

export default function JsonUploadZone({ onFill }) {
    const [dragging, setDragging] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'success'|'error', msg, filled }
    const inputRef = useRef(null);

    const showToast = (type, msg, filled = []) => {
        setToast({ type, msg, filled });
        setTimeout(() => setToast(null), 4500);
    };

    const parseAndFill = (text, filename) => {
        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch {
            showToast("error", `"${filename}" geçerli bir JSON dosyası değil.`);
            return;
        }

        // Support both single object and array (use first element)
        const obj = Array.isArray(parsed) ? parsed[0] : parsed;
        if (!obj || typeof obj !== "object") {
            showToast("error", "JSON içeriği bir nesne ya da nesne dizisi olmalı.");
            return;
        }

        const updates = {};
        const filled = [];
        const unknown = [];

        for (const [k, v] of Object.entries(obj)) {
            if (KNOWN_KEYS.includes(k)) {
                // For numeric fields, coerce to string for the input
                if (k === "Color" || k === "Source") {
                    updates[k] = String(v);
                } else {
                    const n = parseFloat(v);
                    updates[k] = isNaN(n) ? "" : String(n);
                }
                filled.push(k);
            } else {
                // Ignore extra keys like prediction, probability0, id, etc.
                unknown.push(k);
            }
        }

        if (filled.length === 0) {
            showToast("error", "JSON'da tanınan hiçbir alan bulunamadı.");
            return;
        }

        onFill(updates);
        showToast("success", `${filled.length} alan dolduruldu.`, filled);
    };

    const handleFile = (file) => {
        if (!file) return;
        if (!file.name.endsWith(".json") && file.type !== "application/json") {
            showToast("error", "Lütfen yalnızca .json uzantılı dosya yükleyin.");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => parseAndFill(e.target.result, file.name);
        reader.readAsText(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    return (
        <div className="relative">
            {/* Drop zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    "relative flex items-center gap-4 px-5 py-4 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 group",
                    dragging
                        ? "border-cyan-400 bg-cyan-500/10 scale-[1.01]"
                        : "border-slate-700 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/60"
                )}
            >
                {/* Animated icon area */}
                <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200",
                    dragging ? "bg-cyan-500/20" : "bg-slate-700/60 group-hover:bg-slate-700"
                )}>
                    <FileJson size={20} className={dragging ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-300"} />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-300">
                        Fill automaticly with JSON File.
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Drag and drop the file here or {" "}
                        <span className="text-cyan-500 underline underline-offset-2">browse files.</span>
                    </p>
                </div>

                <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all duration-200",
                    dragging
                        ? "bg-cyan-500/20 text-cyan-300"
                        : "bg-slate-700 text-slate-400 group-hover:text-slate-300"
                )}>
                    <Upload size={12} />
                    Yükle
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }}
                />
            </div>

            {/* Toast notification */}
            {toast && (
                <div className={cn(
                    "absolute left-0 right-0 -bottom-2 translate-y-full z-20",
                    "animate-in fade-in slide-in-from-top-2 duration-300"
                )}>
                    <div className={cn(
                        "flex items-start gap-3 px-4 py-3 rounded-xl border shadow-xl text-sm",
                        toast.type === "success"
                            ? "bg-emerald-950 border-emerald-700/50 text-emerald-300"
                            : "bg-red-950 border-red-700/50 text-red-300"
                    )}>
                        {toast.type === "success"
                            ? <CircleCheck size={15} className="text-emerald-400 mt-0.5 shrink-0" />
                            : <AlertTriangle size={15} className="text-red-400 mt-0.5 shrink-0" />
                        }
                        <div className="flex-1">
                            <span className="font-medium">{toast.msg}</span>
                            {toast.filled?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {toast.filled.map((f) => (
                                        <span key={f} className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-400 text-xs font-mono border border-emerald-800/50">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={() => setToast(null)} className="text-slate-500 hover:text-slate-300 shrink-0">
                            <X size={13} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

