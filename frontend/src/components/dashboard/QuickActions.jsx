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
    <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
          Explore Intelligence Shortcuts
        </h3>
        <span className="text-[11px] font-medium text-blue-600">Quick Navigation</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link
              key={idx}
              to={action.path}
              className="group relative p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
            >
              {/* Subtle hover accent line at top of card */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-blue-600 transition-colors" />

              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-white shadow-2xs text-[#134074] group-hover:bg-[#134074] group-hover:text-white group-hover:scale-110 transition-all duration-200">
                  <Icon size={18} />
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>

              <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {action.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}