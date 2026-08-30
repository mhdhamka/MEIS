const API_BASE_URL = "http://localhost:8000/api/v1";

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`[MEIS API] ${endpoint}`, error);
    throw error;
  }
}

// ============================================================
// SYSTEM
// ============================================================

export function getHealth() {
  return fetch("http://localhost:8000/health").then((response) =>
    response.json()
  );
}

// ============================================================
// STATES, ELECTIONS, SEATS, CANDIDATES, PARTIES, RESULTS
// ============================================================

export function getStates() {
  return request("/states");
}

export function getElections() {
  return request("/elections");
}

export function getSeats() {
  return request("/seats");
}

export function getCandidates() {
  return request("/candidates");
}

export function getParties() {
  return request("/parties");
}

export function getResults() {
  return request("/results");
}

// ============================================================
// MAP RESULTS (per-seat winner analytics, no geometry)
// ============================================================

export function getMapResults({ electionId, seatType, state } = {}) {
  const params = new URLSearchParams();
  if (electionId != null) params.append("election_id", electionId);
  if (seatType) params.append("seat_type", seatType);
  if (state) params.append("state", state);

  const query = params.toString() ? `?${params.toString()}` : "";
  return request(`/map/results${query}`);
}

// ============================================================
// ANALYTICS & ADVANCED QUERIES
// ============================================================

export function getOverviewAnalytics() {
  return request("/analytics/overview");
}

export function getElectionSummary() {
  return request("/analytics/overview");
}

export function getStatePerformance() {
  return request("/analytics/state-performance");
}

export function getPartyPerformance() {
  return request("/analytics/party-performance");
}

export function getWinningMargins() {
  return request("/analytics/winning-margins");
}

export function getPartySeatDistribution(electionId = null, seatType = null) {
  const params = new URLSearchParams();
  if (electionId) params.append("election_id", electionId);
  if (seatType) params.append("seat_type", seatType);
  const query = params.toString() ? `?${params.toString()}` : "";
  return request(`/analytics/party-performance${query}`);
}

export function getStateSeatDistribution(electionId = null) {
  const query = electionId ? `?election_id=${electionId}` : "";
  return request(`/analytics/state-performance${query}`);
}

export function getElectionTrends(seatId = null) {
  const query = seatId ? `?seat_id=${seatId}` : "";
  return request(`/analytics/election-comparison${query}`);
}

// ============================================================
// API BUNDLE OBJECT
// ============================================================

export const api = {
  getDashboardAnalytics() {
    return request("/analytics/overview");
  },
  getElectionSummary,
  getPartySeatDistribution,
  getStateSeatDistribution,
  getElectionTrends,
  getOverviewAnalytics,
  getStatePerformance,
  getPartyPerformance,
  getWinningMargins,
  getStates,
  getElections,
  getSeats,
  getResults,
  getMapResults,
  getCandidates,
  getParties,
};