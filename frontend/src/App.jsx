import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/Map";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Persistent Layout Wrapper (Sidebar, Topbar, and Scrollable Viewport) */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<MapPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}