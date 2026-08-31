import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  Vote,
  MapPin,
  Activity,
  Database,
  Server,
  TrendingUp,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

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

export default function Dashboard() {
  // ============================================================
  // STATE
  // ============================================================

  const [summary, setSummary] = useState(null);
  const [partySeats, setPartySeats] = useState([]);
  const [stateSeats, setStateSeats] = useState([]);
  const [trends, setTrends] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================================
  // CURRENT ELECTION
  // ============================================================

  const electionId = 125;

  // ============================================================
  // LOAD DASHBOARD DATA
  // ============================================================

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

  // ============================================================
  // PARTY COLOR HELPER (Synchronized with Map & Modals)
  // ============================================================

  const getPartyBarColor = (partyName) => {
    const p = (partyName ?? "").trim().toUpperCase();
    if (p.includes("GPS") || p.includes("PBB") || p.includes("SUPP") || p.includes("PRS") || p.includes("PDP")) {
      return "#ffb703"; // Amber
    }
    if (p.includes("PH") || p.includes("PKR") || p.includes("DAP") || p.includes("AMANAH")) {
      return "#1d4ed8"; // Blue
    }
    if (p.includes("PN") || p.includes("PAS") || p.includes("BERSATU") || p.includes("GERAKAN")) {
      return "#0ea5e9"; // Sky Blue
    }
    if (p.includes("BN") || p.includes("UMNO") || p.includes("MCA") || p.includes("MIC")) {
      return "#dc2626"; // Red
    }
    if (p.includes("GRS")) {
      return "#059669"; // Emerald
    }
    return "#134074"; // Default brand dark blue
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingState
          title="Loading electoral intelligence"
          message="Fetching live analytics and telemetry from MEIS API."
        />
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

  // ============================================================
  // ERROR STATE
  // ============================================================

  if (error) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        message={`${error} (Make sure the FastAPI backend is running on http://localhost:8000)`}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // ============================================================
  // DERIVED VALUES
  // ============================================================

  const totalStates = stateSeats.length;
  const totalParties = summary?.total_parties ?? partySeats.length;
  const totalSeats = summary?.total_seats ?? 0;
  const totalCandidates = summary?.total_candidates ?? 0;

  // ============================================================
  // DASHBOARD RENDER
  // ============================================================

  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-slate-200">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-[#134074] uppercase tracking-wider mb-1">
            System Overview
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Electoral Intelligence Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Real-time electoral analytics, historical results, party performance, and constituency distribution.
          </p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STATES */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs border-t-4 border-t-[#134074]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              States & Territories
            </span>
            <MapPin size={18} className="text-[#134074]" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalStates}</p>
          <p className="text-xs text-slate-500 mt-1">Jurisdictions represented</p>
        </div>

        {/* PARTIES */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs border-t-4 border-t-[#134074]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Registered Parties
            </span>
            <Vote size={18} className="text-[#134074]" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalParties}</p>
          <p className="text-xs text-slate-500 mt-1">Parties recorded in election data</p>
        </div>

        {/* SEATS */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs border-t-4 border-t-[#134074]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Seats
            </span>
            <Building2 size={18} className="text-[#134074]" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalSeats.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Seats in selected election</p>
        </div>

        {/* CANDIDATES */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs border-t-4 border-t-[#134074]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Candidates Logged
            </span>
            <Users size={18} className="text-[#134074]" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalCandidates.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Candidates in selected election</p>
        </div>
      </div>

      {/* PARTY DISTRIBUTION + TELEMETRY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PARTY SEAT DISTRIBUTION */}
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
              <EmptyState
                title="No party data"
                message="No party seat distribution data available for this selection."
              />
            ) : (
              partySeats.map((party, index) => {
                const percentage =
                  party.percentage ??
                  (totalSeats > 0 ? (party.seats / totalSeats) * 100 : 0);
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

        {/* SYSTEM TELEMETRY */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
              <Activity size={16} className="text-emerald-600" />
              System Telemetry
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Server size={15} className="text-slate-500" />
                  <span className="text-xs font-medium text-slate-700">FastAPI REST Core</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  OPERATIONAL
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Database size={15} className="text-slate-500" />
                  <span className="text-xs font-medium text-slate-700">MySQL Database</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  CONNECTED
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={15} className="text-slate-500" />
                  <span className="text-xs font-medium text-slate-700">ETL Pipeline</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  READY
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <BarChart3 size={15} className="text-slate-500" />
                  <span className="text-xs font-medium text-slate-700">Analytics Engine</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  READY
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">MEIS Intelligence Core v1.0.0</p>
          </div>
        </div>
      </div>

      {/* STATE DISTRIBUTION */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <MapPin size={16} className="text-[#134074]" />
              Seats by State
            </h3>
            <p className="text-xs text-slate-500 mt-1">Geographic distribution for the selected election</p>
          </div>
        </div>

        {stateSeats.length === 0 ? (
          <EmptyState
            title="No state metrics"
            message="No regional state seat metrics are available at this time."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {stateSeats.map((state, index) => (
              <div key={state.state_id ?? index} className="p-3 rounded-md bg-slate-50 border border-slate-100">
                <p className="text-xs font-semibold text-slate-700 truncate">{state.state_name}</p>
                <p className="text-xl font-bold text-[#134074] mt-1">{state.seats}</p>
                <p className="text-[10px] text-slate-400 uppercase">seats</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HISTORICAL ELECTION TRENDS */}
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
          <EmptyState
            title="No historical records"
            message="No historical election records found in the database."
          />
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

      {/* GEOSPATIAL MODULE */}
      <div className="bg-[#0b2545] text-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffb703]">
            Geospatial Intelligence
          </span>
          <h4 className="text-lg font-bold mt-0.5">Interactive Constituency Mapping Module</h4>
          <p className="text-xs text-slate-300 mt-1">
            Explore constituency boundaries, electoral results, and geographic distributions across Malaysia.
          </p>
        </div>
        <Link
          to="/map"
          className="px-4 py-2 bg-[#ffb703] text-slate-900 font-semibold text-xs rounded-md shadow-xs hover:bg-[#faedcd] transition-colors whitespace-nowrap cursor-pointer"
        >
          Launch Electoral Map →
        </Link>
      </div>
    </div>
  );
}