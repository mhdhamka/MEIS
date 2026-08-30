import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Vote,
  Users,
  Building2,
  ShieldCheck,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    label: "Electoral Map",
    icon: Map,
    path: "/map",
  },
  {
    label: "Elections",
    icon: Vote,
    path: "/elections",
  },
  {
    label: "Constituencies",
    icon: Building2,
    path: "/constituencies",
  },
  {
    label: "Candidates",
    icon: Users,
    path: "/candidates",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
];

export default function Sidebar() {
  return (
    <aside className="relative flex flex-col h-full w-64 shrink-0 border-r border-slate-800 bg-[#0b132b] text-slate-100 shadow-2xl">
      
      {/* Official Header Branding */}
      <div className="flex h-20 items-center border-b border-slate-800/80 px-6 bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-inner">
            <span className="inline-block h-3 w-3 rounded-sm bg-amber-400 shadow-sm shadow-amber-400/50"></span>
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-wider text-white flex items-center gap-1.5">
              MEIS
            </h1>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Electoral Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-6 flex-1 overflow-y-auto">
        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            System Modules
          </p>
          <div className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600/20 to-blue-500/10 border border-blue-500/30 text-white shadow-lg shadow-blue-950/40"
                        : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-r-full shadow-sm shadow-blue-400" />
                      )}
                      <Icon
                        size={17}
                        className={`transition-colors ${
                          isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      />
                      <span className="tracking-tight">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer System Status Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-200 leading-tight">Portal Active</span>
              <span className="text-[9px] text-slate-400">Secure Node</span>
            </div>
          </div>
          <ShieldCheck size={16} className="text-emerald-500/80" />
        </div>
      </div>
    </aside>
  );
}