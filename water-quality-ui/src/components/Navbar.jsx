import {
    Droplets,
    FlaskConical,
    History
} from "lucide-react";

import { cn } from "../utils/helpers";
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
export default Navbar;