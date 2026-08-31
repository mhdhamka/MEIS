import { AlertTriangle, CheckCircle2, BellRing, ArrowUpRight } from "lucide-react";

export default function IntelligenceAlerts() {
  const alerts = [
    { type: "warning", text: "12 constituencies have margins below 500 votes", tag: "Critical Margin" },
    { type: "success", text: "GE-15 dataset successfully synchronized", tag: "Sync OK" },
    { type: "warning", text: "3 candidate records have incomplete party mappings", tag: "Data Validation" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <BellRing size={15} className="text-amber-500 animate-bounce" />
            Intelligence Alerts & System Notices
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
            3 Active
          </span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const isWarning = alert.type === "warning";
            return (
              <div
                key={index}
                className={`group relative flex items-start justify-between gap-3 p-3.5 rounded-xl border text-xs transition-all duration-200 hover:shadow-xs hover:-translate-y-0.5 cursor-default ${
                  isWarning
                    ? "bg-amber-50/40 border-amber-200/80 text-amber-900 hover:bg-amber-50/80"
                    : "bg-emerald-50/40 border-emerald-200/80 text-emerald-900 hover:bg-emerald-50/80"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg shrink-0 ${isWarning ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {isWarning ? (
                      <AlertTriangle size={16} />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block leading-snug">
                      {alert.text}
                    </span>
                    <span className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider ${isWarning ? "text-amber-700" : "text-emerald-700"}`}>
                      {alert.tag}
                    </span>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center text-slate-400">
                  <ArrowUpRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Real-time anomaly scanner</span>
        <span className="font-medium text-emerald-600"> Monitoring Active</span>
      </div>
    </div>
  );
}