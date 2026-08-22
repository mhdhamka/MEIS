import {
  LayoutDashboard,
  Map,
  BarChart3,
  Vote,
  Users,
  Building2
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/"
  },
  {
    label: "Electoral Map",
    icon: Map,
    path: "/map"
  },
  {
    label: "Elections",
    icon: Vote,
    path: "/elections"
  },
  {
    label: "Constituencies",
    icon: Building2,
    path: "/constituencies"
  },
  {
    label: "Candidates",
    icon: Users,
    path: "/candidates"
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/analytics"
  }
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-45 h-screen w-64 border-r border-[#134074] bg-[#0b2545] text-slate-100 shadow-sm">
      {/* Official Header branding */}
      <div className="flex h-16 items-center border-b border-[#134074]/60 px-6 bg-[#07192f]">
        <div>
          <h1 className="text-base font-bold tracking-wider text-white flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#ffb703]"></span>
            MEIS
          </h1>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
            Electoral Intelligence
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-6">
        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            System Modules
          </p>
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-[#134074] hover:text-white"
                >
                  <Icon size={17} className="text-slate-400 group-hover:text-white" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer System Status */}
      <div className="absolute bottom-0 w-full border-t border-[#134074]/60 bg-[#07192f] p-4">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">Portal Active</span>
        </div>
      </div>
    </aside>
  );
}