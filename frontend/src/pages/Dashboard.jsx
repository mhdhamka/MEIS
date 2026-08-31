import { useEffect, useState } from "react";
import { Building2, Users, Vote, MapPin } from "lucide-react";

import {
  getElectionSummary,
  getStateSeatDistribution,
  getElectionTrends,
} from "../services/api";

import LoadingState from "../components/states/LoadingState";
import ErrorState from "../components/states/ErrorState";
import SkeletonCard from "../components/states/SkeletonCard";
import SkeletonTable from "../components/states/SkeletonTable";

// Modularized Dashboard Components
import TelemetryHeader from "../components/dashboard/TelemetryHeader";
import KPICard from "../components/dashboard/KPICard";
import QuickActions from "../components/dashboard/QuickActions";
import ActivityLog from "../components/dashboard/ActivityLog";
import IntelligenceAlerts from "../components/dashboard/IntelligenceAlerts";
import PartyDistributionCard from "../components/dashboard/PartyDistributionCard";
import JurisdictionOverview from "../components/dashboard/JurisdictionOverview";
import HistoricalTrendsTable from "../components/dashboard/HistoricalTrendsTable";

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

        // Fetch summary, state distributions, trends, and explicitly hit the analytics seat-counts endpoint for actual winning seats
        const [
          summaryData,
          seatCountsRes,
          stateData,
          trendData,
        ] = await Promise.all([
          getElectionSummary(electionId),
          fetch(`http://localhost:8000/api/v1/analytics/seat-counts?election_id=${electionId}`).then(res => res.json()),
          getStateSeatDistribution(electionId),
          getElectionTrends(),
        ]);

        // Map backend 'seats_won' key to 'seats' so PartyDistributionCard reads it properly
        const formattedPartySeats = (seatCountsRes || []).map(item => ({
          party_name: item.party_name,
          seats: item.seats_won
        }));

        setSummary(summaryData);
        setPartySeats(formattedPartySeats);
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
      <TelemetryHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="States & Territories" value={totalStates} subtitle="Jurisdictions represented" icon={MapPin} />
        <KPICard title="Registered Parties" value={totalParties} subtitle="Parties recorded in election data" icon={Vote} />
        <KPICard title="Total Seats" value={totalSeats.toLocaleString()} subtitle="Seats in selected election" icon={Building2} />
        <KPICard title="Candidates Logged" value={totalCandidates.toLocaleString()} subtitle="Candidates in selected election" icon={Users} />
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IntelligenceAlerts />
        <ActivityLog />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PartyDistributionCard 
          partySeats={partySeats} 
          totalSeats={totalSeats} 
          getPartyBarColor={getPartyBarColor} 
        />
        <JurisdictionOverview stateSeats={stateSeats} />
      </div>

      <HistoricalTrendsTable trends={trends} />
    </div>
  );
}