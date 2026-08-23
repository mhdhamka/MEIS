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

export const api = {

    getDashboardAnalytics() {
        return request("/analytics/dashboard");
    },

    getStates() {
        return request("/states");
    },

    getElections() {
        return request("/elections");
    },

    getResults() {
        return request("/results");
    },

    getCandidates() {
        return request("/candidates");
    },

    getParties() {
        return request("/parties");
    },

};