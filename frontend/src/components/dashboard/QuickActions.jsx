import { Link } from "react-router-dom";
import { Map, Building, Calendar, BarChart2, ArrowRight } from "lucide-react";

export default function QuickActions() {
  const actions = [
    { title: "Electoral Map", description: "Explore constituency geography", path: "/map", icon: Map },
    { title: "Constituencies", description: "Search 3,000+ seats", path: "/constituencies", icon: Building },
    { title: "Elections", description: "Compare election cycles", path: "/elections", icon: Calendar },
    { title: "Analytics", description: "Analyze electoral trends", path: "/analytics", icon: BarChart2 },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/80 via-white/50 to-white/30 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-blue-900/15 text-slate-950 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Explore Shortcuts
        </h3>
        <span className="text-[11px] font-extrabold text-[#134074] px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
          Quick Navigation
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link
              key={idx}
              to={action.path}
              className="group relative p-4.5 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl hover:bg-white/80 hover:border-[#134074]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Top hover accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#134074] transition-colors" />

              <div className="flex items-center justify-between mb-3.5">
                <div className="p-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-white shadow-xs text-[#134074] group-hover:bg-[#134074] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <Icon size={18} />
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-[#134074] group-hover:translate-x-1 transition-all duration-300" />
              </div>

              <h4 className="text-sm font-black text-slate-900 group-hover:text-[#134074] transition-colors tracking-tight">
                {action.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}