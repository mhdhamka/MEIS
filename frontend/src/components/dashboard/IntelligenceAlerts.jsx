import { AlertTriangle, CheckCircle2, Info, BellRing, ArrowUpRight } from "lucide-react";

export default function IntelligenceAlerts({ alerts = [] }) {
  const activeCount = alerts.length;

  return (
    <div className="relative bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/80 shadow-xl shadow-slate-200/50 flex flex-col justify-between overflow-hidden">
      {/* Decorative ambient background mesh glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-600 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 shadow-xs">
              <BellRing size={14} className="animate-pulse" />
            </span>
            Intelligence Alerts & System Notices
          </h3>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 backdrop-blur-md shadow-2xs">
            {activeCount} Active
          </span>
        </div>

        <div className="space-y-3 relative z-10">
          {alerts && alerts.length > 0 ? (
            alerts.map((alert, index) => {
              const alertType = alert.type || "";
              const isWarning = alertType === "warning" || alertType === "CRITICAL_MARGIN";
              const isSuccess = alertType === "success" || alertType === "SYNC_OK";
              const isInfo = alertType === "info" || alertType === "DATA_VALIDATION";

              // Glassmorphic styles and icons based on dynamic alert type
              let containerStyle = "bg-amber-500/5 backdrop-blur-md border-amber-500/20 text-amber-900 hover:bg-amber-500/10 hover:border-amber-500/30 shadow-xs";
              let iconStyle = "bg-amber-500/15 border border-amber-500/30 text-amber-700";
              let textStyle = "text-amber-700 font-semibold";
              let IconComponent = AlertTriangle;

              if (isSuccess) {
                containerStyle = "bg-emerald-500/5 backdrop-blur-md border-emerald-500/20 text-emerald-900 hover:bg-emerald-500/10 hover:border-emerald-500/30 shadow-xs";
                iconStyle = "bg-emerald-500/15 border border-emerald-500/30 text-emerald-700";
                textStyle = "text-emerald-700 font-semibold";
                IconComponent = CheckCircle2;
              } else if (isInfo) {
                containerStyle = "bg-blue-500/5 backdrop-blur-md border-blue-500/20 text-blue-900 hover:bg-blue-500/10 hover:border-blue-500/30 shadow-xs";
                iconStyle = "bg-blue-500/15 border border-blue-500/30 text-blue-700";
                textStyle = "text-blue-700 font-semibold";
                IconComponent = Info;
              }

              return (
                <div
                  key={index}
                  className={`group relative flex items-start justify-between gap-3 p-3.5 rounded-xl border text-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default ${containerStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 transition-transform duration-300 group-hover:scale-110 ${iconStyle}`}>
                      <IconComponent size={16} />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block leading-snug">
                        {alert.text || alert.message}
                      </span>
                      <span className={`inline-block mt-1 text-[10px] uppercase tracking-wider ${textStyle}`}>
                        {alert.tag || alert.type}
                      </span>
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 group-hover:translate-x-0 self-center text-slate-400">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-slate-400 font-sans text-xs bg-slate-50/50 rounded-xl border border-slate-200/60 backdrop-blur-sm">
              No active intelligence alerts or system notices.
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 relative z-10">
        <span className="flex items-center gap-1.5">
          Real-time anomaly scanner
        </span>
        <span className="font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
          Monitoring Active
        </span>
      </div>
    </div>
  );
}