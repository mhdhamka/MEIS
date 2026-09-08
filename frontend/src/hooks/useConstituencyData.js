import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../services/api";

export function useConstituencyData(filters = {}) {

    const [data, setData] = useState([]);
    const allDataCache = useRef([]); // Cache for client-side search fallback using ref to avoid re-render loops
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedConstituency, setSelectedConstituency] =
        useState(null);

    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState(null);

    // ============================================================
    // FETCH DIRECTORY
    // ============================================================

    const fetchConstituencies = useCallback(async () => {

        try {

            setLoading(true);
            setError(null);

            // Fetch from API using the correct service method
            const response = await api.getConstituencies(filters);

            let records =
                response?.data ??
                response?.results ??
                response?.items ??
                response ??
                [];

            let arrayData = Array.isArray(records)
                ? records
                : [];

            // FALLBACK / CACHING: Keep an unfiltered cache so client-side filtering works seamlessly
            if (arrayData.length === 0 && filters.search && allDataCache.current.length > 0) {
                arrayData = allDataCache.current;
            } else if (arrayData.length > 0 && !filters.search && !filters.state && !filters.seat_type) {
                allDataCache.current = arrayData;
            }

            // Client-side safety filter matching search terms (name, code, or state)
            if (filters.search) {
                const queryVal = filters.search.toLowerCase();
                arrayData = arrayData.filter(item => {
                    const name = (item.seat_name || item.name || item.constituency_name || "").toLowerCase();
                    const code = (item.seat_code || item.code || item.code_parlimen || item.code_dun || "").toLowerCase();
                    const state = (item.state_name || item.state || "").toLowerCase();
                    return name.includes(queryVal) || code.includes(queryVal) || state.includes(queryVal);
                });
            }

            // Client-side safety filter for state
            if (filters.state) {
                arrayData = arrayData.filter(item => {
                    const st = item.state_name || item.state || "";
                    return st === filters.state;
                });
            }

            // Client-side safety filter for seat type
            if (filters.seat_type) {
                arrayData = arrayData.filter(item => {
                    const tp = item.seat_type || item.type || "";
                    return tp.toLowerCase() === filters.seat_type.toLowerCase();
                });
            }

            setData(arrayData);

            const meta =
                response?.pagination ??
                response?.meta ??
                {};

            const total =
                Number(meta.total) ||
                Number(response?.total) ||
                arrayData.length;

            const page =
                Number(meta.page) ||
                Number(filters.page) ||
                1;

            const limit =
                Number(meta.limit) ||
                Number(filters.limit) ||
                20;

            setPagination({
                page,
                limit,
                total,
                totalPages:
                    Number(meta.totalPages) ||
                    Math.max(1, Math.ceil(total / limit)),
            });

        } catch (err) {

            console.error(
                "Constituency API error:",
                err
            );

            setError(
                err.message ||
                "Failed to load constituencies."
            );

            setData([]);

        } finally {

            setLoading(false);

        }

    }, [filters]);

    useEffect(() => {
        fetchConstituencies();
    }, [fetchConstituencies]);

    // ============================================================
    // LOAD PROFILE
    // ============================================================

    const loadProfile = useCallback(async (identifier) => {

        if (identifier === null || identifier === undefined || identifier === "") {
            return;
        }

        try {

            setProfileLoading(true);
            setProfileError(null);

            // Supports passing either seat_id (number) or seat_code (string) depending on component implementation
            const response = await api.getConstituency(identifier);

            const profile =
                response?.data ??
                response;

            setSelectedConstituency(profile);

        } catch (err) {

            console.error(
                "Constituency profile error:",
                err
            );

            setProfileError(
                err.message ||
                "Failed to load constituency profile."
            );

        } finally {

            setProfileLoading(false);

        }

    }, []);

    // ============================================================
    // CLOSE PROFILE
    // ============================================================

    const closeProfile = useCallback(() => {
        setSelectedConstituency(null);
        setProfileError(null);
    }, []);

    return {
        data,
        pagination,

        loading,
        error,

        selectedConstituency,
        profileLoading,
        profileError,

        fetchConstituencies,
        loadProfile,
        closeProfile,
    };
}