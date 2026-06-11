import { useState } from "react";

import { Droplets, ChevronRight } from "lucide-react";

import Navbar from "./components/Navbar";
import AnalyzeView from "./views/AnalyzeView";
import HistoryView from "./views/HistoryView";

export default function App() {
  const [view, setView] = useState("analyze");
  const [history, setHistory] = useState([]);

  const handleResult = (data) => {
    setHistory((prev) => [data, ...prev]);
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-white"
      style={{
        fontFamily: "'DM Sans', 'Inter', sans-serif"
      }}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-800/6 rounded-full blur-3xl" />
      </div>

      <Navbar view={view} setView={setView} />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div
          className="flex items-center gap-2 text-xs text-slate-600 mb-6"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          <Droplets size={11} className="text-cyan-600" />
          <span>AquaPredict</span>
          <ChevronRight size={11} />
          <span className="text-slate-400">
            {view === "analyze"
              ? "New Analysis"
              : "History"}
          </span>
        </div>

        {view === "analyze"
          ? (
            <AnalyzeView
              onResult={handleResult}
              history={history}
            />
          )
          : (
            <HistoryView
              history={history}
            />
          )}
      </main>

      <footer className="relative border-t border-slate-800/50 mt-16 py-6 text-center">
        <p
          className="text-xs text-slate-700"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          AquaPredict · AI-Driven Water Quality Analysis · Graduation Project
        </p>
      </footer>
    </div>
  );
}