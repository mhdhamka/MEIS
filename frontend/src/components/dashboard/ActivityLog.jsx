import { Terminal, Activity, ArrowUpRight } from "lucide-react";

export default function ActivityLog() {
  const logs = [
    { time: "13:42:31", type: "SUCCESS", text: "Election dataset synchronized" },
    { time: "13:41:04", type: "SUCCESS", text: "Constituency records validated" },
    { time: "13:39:52", type: "INFO", text: "Candidate records updated" },
    { time: "13:37:21", type: "SUCCESS", text: "GeoJSON dataset loaded" },
    { time: "13:35:17", type: "WARNING", text: "4 records require validation" },
  ];

  return (
    <div className="bg-white text-slate-900 p-6 rounded-xl shadow-2xs border border-slate-200/80 font-mono text-xs relative overflow-hidden">
      {/* Top ambient highlight line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-50 text-emerald-600 shadow-2xs border border-slate-200/60">
            <Terminal size={16} />
          </div>
          <div>
            <h3 className="font-bold uppercase tracking-wider text-slate-800">Data Pipeline Activity</h3>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">Real-time system event stream</p>
          </div>
        </div>

        {/* Live Feed Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[10px]">
          <span className="text-emerald-700 font-bold tracking-wider">LIVE FEED</span>
        </div>
      </div>

      {/* Log Feed Items */}
      <div className="space-y-1.5">
        {logs.map((log, index) => {
          const isSuccess = log.type === "SUCCESS";
          const isWarning = log.type === "WARNING";

          return (
            <div
              key={index}
              className="group flex items-center justify-between py-2 px-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-200 transition-all duration-150 cursor-default"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-[11px] font-mono">{log.time}</span>
                <span className={`flex items-center gap-1.5 font-medium ${isSuccess ? "text-emerald-700" : isWarning ? "text-amber-700" : "text-blue-700"}`}>
                  <span className="font-bold">
                    {isSuccess ? "✓" : isWarning ? "⚠" : "ℹ"}
                  </span> 
                  <span className="text-slate-800 group-hover:text-slate-900 transition-colors">
                    {log.text}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold tracking-wide ${
                  isSuccess 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" 
                    : isWarning 
                    ? "bg-amber-50 text-amber-700 border border-amber-200/60" 
                    : "bg-blue-50 text-blue-700 border border-blue-200/60"
                }`}>
                  {log.type}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-sans">
        <span className="flex items-center gap-1.5">
          <Activity size={12} className="text-emerald-600" />
          Stream buffer normal
        </span>
        <span className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1 font-medium">
          View full logs <span className="text-xs">→</span>
        </span>
      </div>
    </div>
  );
}