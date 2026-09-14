import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/Map";
import ElectionsPage from "./pages/Elections";
import ConstituenciesPage from "./pages/Constituencies";
import CandidatesPage from "./pages/Candidates";
import CandidateDetail from "./pages/CandidateDetail"; 
import AnalyticsPage from "./pages/Analytics";
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
          <Route path="/elections" element={<ElectionsPage />} />
          <Route path="/constituencies" element={<ConstituenciesPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          
          {/* 2. Add the dynamic route for individual candidates */}
          <Route path="/candidates/:candidateId" element={<CandidateDetail />} />
          
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}