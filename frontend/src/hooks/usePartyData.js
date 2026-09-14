import { useEffect, useState } from "react";
import { api } from "../services/api";

export function usePartyData(partyId = null) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        let mounted = true;

        async function load() {

            try {

                setLoading(true);
                setError(null);

                const response = partyId
                    ? await api.getParty(partyId)
                    : await api.getParties();

                if (!mounted) {
                    return;
                }

                const result =
                    response?.data ??
                    response;

                setData(result);

            } catch (err) {

                console.error(
                    "Party API error:",
                    err
                );

                if (mounted) {

                    setError(
                        err.message ||
                        "Failed to load party data."
                    );

                }

            } finally {

                if (mounted) {
                    setLoading(false);
                }

            }

        }

        load();

        return () => {
            mounted = false;
        };

    }, [partyId]);

    return {
        data,
        loading,
        error
    };
}