import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/navigation/Sidebar";
import Topbar from "./components/navigation/Topbar";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/Map";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Sidebar Navigation (Fixed width, full height) */}
        <Sidebar />

        {/* Main Content Column */}
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          {/* Topbar */}
          <Topbar />

          {/* Scrollable Viewport with Router Switches */}
          <main className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<MapPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}