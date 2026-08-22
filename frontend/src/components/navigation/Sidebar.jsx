import {
  LayoutDashboard,
  Map,
  BarChart3,
  Vote,
  Users,
  Building2,
  Database
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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-[#080b10]">

      <div className="flex h-16 items-center border-b border-white/10 px-6">

        <div>
          <h1 className="text-lg font-bold tracking-wide">
            MEIS
          </h1>

          <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
            Electoral Intelligence
          </p>
        </div>

      </div>

      <nav className="p-4">

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
          Intelligence
        </p>

        <div className="space-y-1">

          {navigation.map((item) => {

            const Icon = item.icon;

            return (
              <a
                key={item.path}
                href={item.path}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <Icon size={17} />

                <span>
                  {item.label}
                </span>
              </a>
            );

          })}

        </div>

      </nav>

      <div className="absolute bottom-0 w-full border-t border-white/10 p-4">

        <div className="flex items-center gap-2 text-xs text-gray-500">

          <span className="h-2 w-2 rounded-full bg-green-400" />

          System Operational

        </div>

      </div>

    </aside>
  );
}