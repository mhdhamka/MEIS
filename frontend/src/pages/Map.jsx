import { useState, useMemo } from "react";
import MapToolbar from "../components/maps/MapToolBar";
import ElectoralMapContainer from "../components/maps/ElectoralMapContainer";
import LoadingState from "../components/states/LoadingState";
import ErrorState from "../components/states/ErrorState";
import EmptyState from "../components/states/EmptyState";
import SkeletonCard from "../components/states/SkeletonCard";
import SkeletonTable from "../components/states/SkeletonTable";
import { useGeoSpatialData } from "../hooks/useGeoSpatialData";
import { useMapFilters } from "../hooks/useMapFilters";
import { useMapResults } from "../hooks/useMapResults";
import { mergeElectionResults } from "../utils/electoral";

export default function MapPage() {
  // --------------------------------------------------------
  // FILTER / UI STATE — this is the single source of truth
  // for the whole map page.
  // --------------------------------------------------------
  const [seatType, setSeatType] = useState("parliament");
  const [stateFilter, setStateFilter] = useState("all");
  const [electionId, setElectionId] = useState(null);
  const [metric, setMetric] = useState("boundaries");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState(null);

  // --------------------------------------------------------
  // DATA
  //
  // useGeoSpatialData fetches (and session-caches) the merged
  // GeoJSON + seats + analytics for the active seatType only.
  // Changing `metric` never triggers a refetch — only styling
  // changes. useMapFilters then derives the FeatureCollection
  // that both the map and the search dropdown actually use.
  // --------------------------------------------------------
  const { data: geoJsonData, loading, error } = useGeoSpatialData(seatType);

  const filteredData = useMapFilters(geoJsonData, {
    seatType,
    stateFilter,
    searchQuery,
  });

  // --------------------------------------------------------
  // ELECTION RESULTS
  //
  // Separate, lightweight fetch (GET /api/v1/map/results) that
  // returns per-seat winner/vote-share/margin analytics with NO
  // geometry. Changing `electionId` only re-runs this hook —
  // useGeoSpatialData above is completely untouched, so the
  // GeoJSON never refetches when the election filter changes.
  // --------------------------------------------------------
  const { resultsBySeat } = useMapResults(
    electionId,
    seatType,
    stateFilter !== "all" ? stateFilter : null
  );

  const mapData = useMemo(
    () => mergeElectionResults(filteredData, resultsBySeat),
    [filteredData, resultsBySeat]
  );

  const handleSelectSearchResult = (feature) => {
    setSelectedConstituency(feature.properties);
  };

  const handleViewProfile = (seatCode) => {
    if (!seatCode) return;
    // Swap this for the router's navigate() once one is wired in —
    // kept as a plain navigation so this page has no router dependency.
    window.location.assign(`/constituencies/${encodeURIComponent(seatCode)}`);
  };

  const isEmpty = !loading && !error && (filteredData?.features?.length ?? 0) === 0;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-slate-100 overflow-hidden">
      {loading ? (
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <LoadingState
            title="Preparing electoral map"
            message="Loading parliamentary boundaries and electoral analytics."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonTable rows={4} columns={4} />
        </div>
      ) : error ? (
        <ErrorState
          title="Unable to load electoral map"
          message={error}
          onRetry={() => window.location.reload()}
        />
      ) : isEmpty ? (
        <EmptyState
          title="No constituency boundaries"
          message="No geospatial features are available for this selection."
          actionLabel="Reset Filters"
          onAction={() => {
            setStateFilter("all");
            setSearchQuery("");
          }}
        />
      ) : (
        <>
          <MapToolbar
            seatType={seatType}
            onSeatTypeChange={setSeatType}
            stateFilter={stateFilter}
            onStateChange={setStateFilter}
            electionId={electionId}
            onElectionChange={setElectionId}
            metric={metric}
            onMetricChange={setMetric}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchData={mapData}
            onSelectSearchResult={handleSelectSearchResult}
          />

          <div className="flex-1 min-h-0 mt-4 relative">
            <ElectoralMapContainer
              data={mapData}
              metric={metric}
              seatType={seatType}
              electionId={electionId}
              selectedConstituency={selectedConstituency}
              onSelectConstituency={setSelectedConstituency}
              onViewProfile={handleViewProfile}
            />
          </div>
        </>
      )}
    </div>
  );
}
