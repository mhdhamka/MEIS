import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/Map";
import ElectionsPage from "./pages/Elections";
import ConstituenciesPage from "./pages/Constituencies";
import CandidatesPage from "./pages/Candidates";
import CandidateDetail from "./pages/CandidateDetail";
import Parties from "./pages/Parties";
import PartyDetail from "./pages/PartyDetail";
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
          <Route path="/candidates/:candidateId" element={<CandidateDetail />} />
          
          <Route path="/parties" element={<Parties />} />
          <Route path="/parties/:partyId" element={<PartyDetail />} />
          
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}