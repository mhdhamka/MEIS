const API_BASE_URL = "http://localhost:8000/api/v1";

async function request(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error(
            `API request failed: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
}


// ============================================================
// ANALYTICS
// ============================================================

export function getElectionSummary() {
    return request("/analytics/overview");
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
// GENERAL API
// ============================================================

export function getStates() {
    return request("/states");
}


export function getElections() {
    return request("/elections");
}


export function getResults() {
    return request("/results");
}


export function getCandidates() {
    return request("/candidates");
}


export function getParties() {
    return request("/parties");
}


// ============================================================
// API OBJECT
// ============================================================

export const api = {

    getDashboardAnalytics() {
        return request("/analytics/overview");
    },

    getElectionSummary,

    getPartySeatDistribution,

    getStateSeatDistribution,

    getElectionTrends,

    getStates,

    getElections,

    getResults,

    getCandidates,

    getParties,

};