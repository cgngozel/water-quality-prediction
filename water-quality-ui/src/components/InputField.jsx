export default function InputField({ fieldKey, label, unit, hint, value, onChange }) {
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