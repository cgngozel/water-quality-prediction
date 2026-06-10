import { useState, useEffect, useRef } from "react";
import {
  Droplets, FlaskConical, History, BarChart3, ChevronRight,
  AlertTriangle, CheckCircle2, Loader2, Clock, Database,
  Waves, Activity, ArrowRight, RefreshCw, X,
  Upload, FileJson, CircleCheck, Trash2
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const COLOR_OPTIONS = [
  "Colorless", "Near Colorless", "Faint Yellow", "Light Yellow",
  "Yellow", "Yellow, Foamy", "Muddy", "Blue-Green"
];

const SOURCE_OPTIONS = [
  "River", "Ground", "Spring", "Lake", "Stream",
  "Reservoir", "Aquifer", "Well"
];

const INITIAL_FORM = {
  pH: "", Iron: "", Nitrate: "", Chloride: "", Lead: "", Zinc: "",
  Color: "Colorless", Turbidity: "", Fluoride: "", Copper: "",
  Odor: "", Sulfate: "", Conductivity: "", Chlorine: "", Manganese: "",
  "Total Dissolved Solids": "", Source: "River"
};

const FIELD_CONFIG = [
  { key: "pH", label: "pH Level", unit: "pH", hint: "0–14" },
  { key: "Iron", label: "Iron", unit: "mg/L", hint: "≤ 0.3" },
  { key: "Nitrate", label: "Nitrate", unit: "mg/L", hint: "≤ 10" },
  { key: "Chloride", label: "Chloride", unit: "mg/L", hint: "≤ 250" },
  { key: "Lead", label: "Lead", unit: "mg/L", hint: "≤ 0.015" },
  { key: "Zinc", label: "Zinc", unit: "mg/L", hint: "≤ 5" },
  { key: "Turbidity", label: "Turbidity", unit: "NTU", hint: "≤ 1" },
  { key: "Fluoride", label: "Fluoride", unit: "mg/L", hint: "≤ 1.5" },
  { key: "Copper", label: "Copper", unit: "mg/L", hint: "≤ 1.3" },
  { key: "Odor", label: "Odor", unit: "TON", hint: "0–3" },
  { key: "Sulfate", label: "Sulfate", unit: "mg/L", hint: "≤ 250" },
  { key: "Conductivity", label: "Conductivity", unit: "μS/cm", hint: "≤ 500" },
  { key: "Chlorine", label: "Chlorine", unit: "mg/L", hint: "≤ 4" },
  { key: "Manganese", label: "Manganese", unit: "mg/L", hint: "≤ 0.05" },
  { key: "Total Dissolved Solids", label: "Total Dissolved Solids", unit: "mg/L", hint: "≤ 500" },
];

// ─── Utility ─────────────────────────────────────────────────────────────────

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatVal(v) {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "number") return v % 1 === 0 ? v : v.toFixed(3);
  return v;
}

// ─── Circular Gauge ──────────────────────────────────────────────────────────

function CircularGauge({ percent, label, color, size = 120 }) {
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

// ─── Progress Bar ─────────────────────────────────────────────────────────────

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

// ─── JSON Upload Zone ─────────────────────────────────────────────────────────

const KNOWN_KEYS = [
  "pH", "Iron", "Nitrate", "Chloride", "Lead", "Zinc", "Color",
  "Turbidity", "Fluoride", "Copper", "Odor", "Sulfate", "Conductivity",
  "Chlorine", "Manganese", "Total Dissolved Solids", "Source"
];

function JsonUploadZone({ onFill }) {
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



function Navbar({ view, setView }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Droplets size={16} className="text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Aqua<span className="text-cyan-400">Predict</span>
              </span>
              <div className="text-xs text-slate-500 leading-none" style={{ fontFamily: "'DM Mono', monospace" }}>
                AI Water Analysis
              </div>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-1 bg-slate-900 rounded-xl p-1 border border-slate-800">
            {[
              { id: "analyze", label: "New Analysis", Icon: FlaskConical },
              { id: "history", label: "History", Icon: History },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  view === id
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── Input Field ─────────────────────────────────────────────────────────────

function InputField({ fieldKey, label, unit, hint, value, onChange }) {
  return (
    <div className="group">
      <label className="block text-xs font-medium text-slate-400 mb-1.5 tracking-wide uppercase"
        style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem" }}>
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          step="any"
          placeholder={hint}
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white
            placeholder-slate-600 transition-all duration-200
            focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30
            hover:border-slate-600 pr-14"
          style={{ fontFamily: "'DM Mono', monospace" }}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none"
          style={{ fontFamily: "'DM Mono', monospace" }}>
          {unit}
        </span>
      </div>
    </div>
  );
}

// ─── Result Card ─────────────────────────────────────────────────────────────

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

// ─── New Analysis View ────────────────────────────────────────────────────────

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

// ─── History View ─────────────────────────────────────────────────────────────

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

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState("analyze");
  const [history, setHistory] = useState([]);

  const handleResult = (data) => {
    setHistory((prev) => [data, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-800/6 rounded-full blur-3xl" />
      </div>

      <Navbar view={view} setView={setView} />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-600 mb-6"
          style={{ fontFamily: "'DM Mono', monospace" }}>
          <Droplets size={11} className="text-cyan-600" />
          <span>AquaPredict</span>
          <ChevronRight size={11} />
          <span className="text-slate-400">{view === "analyze" ? "New Analysis" : "History"}</span>
        </div>

        {view === "analyze"
          ? <AnalyzeView onResult={handleResult} history={history} />
          : <HistoryView history={history} />
        }
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-800/50 mt-16 py-6 text-center">
        <p className="text-xs text-slate-700" style={{ fontFamily: "'DM Mono', monospace" }}>
          AquaPredict · AI-Driven Water Quality Analysis · Graduation Project
        </p>
      </footer>
    </div>
  );
}
