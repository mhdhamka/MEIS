import { Activity } from "lucide-react";

export default function ActivityLog({ logs = [] }) {
  return (
    <div className="relative bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/80 shadow-xl shadow-slate-200/50 text-xs overflow-hidden">
      {/* Decorative ambient background mesh glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/60 relative z-10">
        <div className="flex items-center gap-2.5">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-600">
              Data Pipeline Activity
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-normal">Real-time system event stream</p>
          </div>
        </div>
      </div>

      {/* Log Feed Items */}
      <div className="space-y-2 relative z-10">
        {logs && logs.length > 0 ? (
          logs.map((log, index) => {
            const isSuccess = log.status === "SUCCESS";
            const isWarning = log.status === "WARNING";

            // Glassmorphic item styles based on status type
            let rowStyle = "bg-blue-500/5 border-blue-500/20 text-blue-900 hover:bg-blue-500/10 hover:border-blue-500/30";
            let badgeStyle = "bg-blue-500/15 border-blue-500/30 text-blue-700";
            let iconText = "ℹ";
            let textTone = "text-blue-700";

            if (isSuccess) {
              rowStyle = "bg-emerald-500/5 border-emerald-500/20 text-emerald-900 hover:bg-emerald-500/10 hover:border-emerald-500/30";
              badgeStyle = "bg-emerald-500/15 border-emerald-500/30 text-emerald-700";
              iconText = "✓";
              textTone = "text-emerald-700";
            } else if (isWarning) {
              rowStyle = "bg-amber-500/5 border-amber-500/20 text-amber-900 hover:bg-amber-500/10 hover:border-amber-500/30";
              badgeStyle = "bg-amber-500/15 border-amber-500/30 text-amber-700";
              iconText = "⚠";
              textTone = "text-amber-700";
            }

            return (
              <div
                key={index}
                className={`group backdrop-blur-md flex items-center justify-between py-2.5 px-3.5 rounded-xl border transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 cursor-default ${rowStyle}`}
              >
                <div className="flex items-center gap-3">
                  {/* Kept timestamp slightly technical/muted to fit log style */}
                  <span className="text-slate-400 text-[11px] font-mono">{log.timestamp}</span>
                  <span className="flex items-center gap-2">
                    <span className={`font-bold ${textTone}`}>
                      {iconText}
                    </span> 
                    <span className="text-slate-800 font-semibold group-hover:text-slate-950 transition-colors">
                      {log.message}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold tracking-wider border backdrop-blur-md ${badgeStyle}`}>
                    {log.status}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-6 text-center text-slate-400 text-xs bg-slate-50/50 rounded-xl border border-slate-200/60 backdrop-blur-sm">
            No pipeline activity logs recorded.
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 relative z-10">
        <span className="flex items-center gap-1.5">
          <Activity size={12} className="text-emerald-600 animate-pulse" />
          Stream buffer normal
        </span>
      </div>
    </div>
  );
}