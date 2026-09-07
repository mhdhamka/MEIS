import { useState } from "react";
import { TrendingUp } from "lucide-react";

export default function TurnoutTrendCard({ turnoutData = [
  { cycle: "GE-11", turnout: 73.9, year: "2004" },
  { cycle: "GE-12", turnout: 71.0, year: "2008" },
  { cycle: "GE-13", turnout: 84.8, year: "2013" },
  { cycle: "GE-14", turnout: 82.3, year: "2018" },
  { cycle: "GE-15", turnout: 74.7, year: "2022" },
] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/90 via-white/60 to-white/40 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-blue-900/10 text-slate-900">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/50">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-800 rounded-full text-[10px] uppercase tracking-[0.2em] font-black border border-emerald-500/20 backdrop-blur-md mb-2 shadow-2xs">
            Historical Telemetry
          </span>
          <h3 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
            Voter Turnout Trend
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Federal election participation analysis (GE-11 to GE-15)
          </p>
        </div>
        <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700">
          <TrendingUp size={18} />
        </div>
      </div>

      {/* Interactive Chart Container */}
      <div className="bg-white/50 backdrop-blur-xl p-5 rounded-2xl border border-white/80 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {hoveredPoint ? `${hoveredPoint.cycle} (${hoveredPoint.year}) Turnout` : "Hover data points for details"}
          </span>
          <span className="font-mono text-xs font-black text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            {hoveredPoint ? `${hoveredPoint.turnout}%` : "Multi-Cycle View"}
          </span>
        </div>

        {/* Visual Bar Matrix / Curve representation */}
        <div className="space-y-3">
          {turnoutData.map((item) => {
            const isHovered = hoveredPoint?.cycle === item.cycle;

            return (
              <div 
                key={item.cycle}
                onMouseEnter={() => setHoveredPoint(item)}
                onMouseLeave={() => setHoveredPoint(null)}
                className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  isHovered ? "bg-white border-emerald-500/50 shadow-md scale-[1.01]" : "bg-white/60 border-white/80 hover:bg-white/80 shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-3 w-28">
                  <span className="text-xs font-mono font-bold text-slate-400">{item.year}</span>
                  <span className="text-xs font-black text-slate-800">{item.cycle}</span>
                </div>

                <div className="flex-1 mx-4 bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div 
                    className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                    style={{ width: `${item.turnout}%` }}
                  />
                </div>

                <div className="font-mono text-right w-16">
                  <span className="text-xs font-black text-slate-900">{item.turnout}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}