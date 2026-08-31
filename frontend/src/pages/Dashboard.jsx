import { useEffect, useState } from "react";
import { Building2, Users, Vote, MapPin, TrendingUp } from "lucide-react";

import {
  getElectionSummary,
  getPartySeatDistribution,
  getStateSeatDistribution,
  getElectionTrends,
} from "../services/api";

import LoadingState from "../components/states/LoadingState";
import ErrorState from "../components/states/ErrorState";
import EmptyState from "../components/states/EmptyState";
import SkeletonCard from "../components/states/SkeletonCard";
import SkeletonTable from "../components/states/SkeletonTable";

// Modularized Dashboard Components
import TelemetryHeader from "../components/dashboard/TelemetryHeader";
import KPICard from "../components/dashboard/KPICard";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityLog from "../components/dashboard/ActivityLog";
import IntelligenceAlerts from "../components/dashboard/IntelligenceAlerts";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [partySeats, setPartySeats] = useState([]);
  const [stateSeats, setStateSeats] = useState([]);
  const [trends, setTrends] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const electionId = 125;

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const [
          summaryData,
          partyData,
          stateData,
          trendData,
        ] = await Promise.all([
          getElectionSummary(electionId),
          getPartySeatDistribution(electionId),
          getStateSeatDistribution(electionId),
          getElectionTrends(),
        ]);

        setSummary(summaryData);
        setPartySeats(partyData);
        setStateSeats(stateData);
        setTrends(trendData);
      } catch (err) {
        console.error("Dashboard API error:", err);
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [electionId]);

  const getPartyBarColor = (partyName) => {
    const p = (partyName ?? "").trim().toUpperCase();
    if (p.includes("GPS") || p.includes("PBB") || p.includes("SUPP") || p.includes("PRS") || p.includes("PDP")) {
      return "#ffb703";
    }
    if (p.includes("PH") || p.includes("PKR") || p.includes("DAP") || p.includes("AMANAH")) {
      return "#1d4ed8";
    }
    if (p.includes("PN") || p.includes("PAS") || p.includes("BERSATU") || p.includes("GERAKAN")) {
      return "#0ea5e9";
    }
    if (p.includes("BN") || p.includes("UMNO") || p.includes("MCA") || p.includes("MIC")) {
      return "#dc2626";
    }
    if (p.includes("GRS")) {
      return "#059669";
    }
    return "#134074";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingState title="Loading electoral intelligence" message="Fetching live analytics and telemetry from MEIS API." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonTable rows={4} columns={4} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        message={`${error} (Make sure the FastAPI backend is running on http://localhost:8000)`}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const totalStates = stateSeats.length;
  const totalParties = summary?.total_parties ?? partySeats.length;
  const totalSeats = summary?.total_seats ?? 0;
  const totalCandidates = summary?.total_candidates ?? 0;

  return (
    <div className="space-y-6">
      {/* 1. SYSTEM TELEMETRY HEADER */}
      <TelemetryHeader />

      {/* 2. NATIONAL KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="States & Territories" value={totalStates} subtitle="Jurisdictions represented" icon={MapPin} />
        <KPICard title="Registered Parties" value={totalParties} subtitle="Parties recorded in election data" icon={Vote} />
        <KPICard title="Total Seats" value={totalSeats.toLocaleString()} subtitle="Seats in selected election" icon={Building2} />
        <KPICard title="Candidates Logged" value={totalCandidates.toLocaleString()} subtitle="Candidates in selected election" icon={Users} />
      </div>

      {/* 3. QUICK NAVIGATION SHORTCUTS */}
      <QuickActions />

      {/* 4. ALERTS & TELEMETRY LOGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IntelligenceAlerts />
        <ActivityLog />
      </div>

      {/* 5. PARTY DISTRIBUTION + STATE DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Party Distribution */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#134074]" />
              Party Seat Distribution
            </h3>
            <span className="text-xs text-slate-500">Live election data</span>
          </div>

          <div className="space-y-4">
            {partySeats.length === 0 ? (
              <EmptyState title="No party data" message="No party seat distribution data available for this selection." />
            ) : (
              partySeats.map((party, index) => {
                const percentage = party.percentage ?? (totalSeats > 0 ? (party.seats / totalSeats) * 100 : 0);
                const barColor = getPartyBarColor(party.party_name);

                return (
                  <div key={party.party_id ?? index}>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>{party.party_name}</span>
                      <span>{party.seats} seats</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(Number(percentage) || 0, 100)}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* State Summary Panel */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-[#134074]" />
              Jurisdiction Overview
            </h3>
            <p className="text-xs text-slate-500 mb-4">Regional state seat metrics count</p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {stateSeats.map((state, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-medium text-slate-700">{state.state_name}</span>
                  <span className="font-bold text-[#134074]">{state.seats} seats</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">MEIS Command Center Core v1.0</span>
          </div>
        </div>
      </div>

      {/* 6. HISTORICAL ELECTION TRENDS TABLE */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#134074]" />
              Historical Election Trends
            </h3>
            <p className="text-xs text-slate-500 mt-1">Election cycles available in the MEIS database</p>
          </div>
        </div>

        {trends.length === 0 ? (
          <EmptyState title="No historical records" message="No historical election records found in the database." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Election</th>
                  <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Year</th>
                  <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Seats</th>
                  <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Votes</th>
                </tr>
              </thead>
              <tbody>
                {trends.map((trend, index) => (
                  <tr key={trend.election_id ?? index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3 text-sm font-semibold text-slate-800">{trend.election_name}</td>
                    <td className="px-3 py-3 text-sm text-slate-600">{trend.election_year}</td>
                    <td className="px-3 py-3 text-sm text-slate-600">{trend.seats}</td>
                    <td className="px-3 py-3 text-sm font-medium text-slate-700 text-right">
                      {Number(trend.votes ?? 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}