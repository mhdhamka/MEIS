import { Outlet } from "react-router-dom";
import Sidebar from "../navigation/Sidebar";
import Topbar from "../navigation/Topbar";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Topbar />

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}