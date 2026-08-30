import { useState, useEffect } from "react";

const DEFAULT_API_BASE_URL = "http://localhost:8000/api/v1";

const PARLIAMENT_GEOJSON = "/geojson/malaysia.parlimen.geojson";
const DUN_GEOJSON = "/geojson/malaysia.dun.geojson";


export function useGeoSpatialData(
    layerType = "parliament",
    customApiBaseUrl
) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL =
        customApiBaseUrl || DEFAULT_API_BASE_URL;


    useEffect(() => {
        let isMounted = true;

        const controller = new AbortController();


        async function fetchGeoSpatialData() {
            try {
                setLoading(true);
                setError(null);


                // =====================================================
                // DETERMINE GEOJSON TYPE
                // =====================================================

                const isDun = layerType === "dun";

                const geoJsonUrl = isDun
                    ? DUN_GEOJSON
                    : PARLIAMENT_GEOJSON;


                // =====================================================
                // FETCH DATA
                // =====================================================

                const [
                    geoResponse,
                    seatsResponse,
                    performanceResponse
                ] = await Promise.all([
                    fetch(geoJsonUrl, {
                        signal: controller.signal
                    }),

                    fetch(`${API_BASE_URL}/seats`, {
                        signal: controller.signal
                    }),

                    fetch(
                        `${API_BASE_URL}/analytics/state-performance`,
                        {
                            signal: controller.signal
                        }
                    )
                ]);


                // =====================================================
                // VALIDATE RESPONSES
                // =====================================================

                if (!geoResponse.ok) {
                    throw new Error(
                        `Failed to load electoral GeoJSON: ${geoResponse.status}`
                    );
                }

                if (!seatsResponse.ok) {
                    throw new Error(
                        `Failed to load electoral seats: ${seatsResponse.status}`
                    );
                }

                if (!performanceResponse.ok) {
                    throw new Error(
                        `Failed to load state performance: ${performanceResponse.status}`
                    );
                }


                // =====================================================
                // PARSE RESPONSES
                // =====================================================

                const geoJson = await geoResponse.json();
                const seatsJson = await seatsResponse.json();
                const performanceJson =
                    await performanceResponse.json();


                const seats =
                    seatsJson.data ?? seatsJson;

                const performance =
                    performanceJson.data ??
                    performanceJson;


                // =====================================================
                // VALIDATE DATA
                // =====================================================

                if (!Array.isArray(seats)) {
                    throw new Error(
                        "Seats API did not return an array"
                    );
                }

                if (!Array.isArray(performance)) {
                    throw new Error(
                        "State performance API did not return an array"
                    );
                }

                if (
                    !geoJson ||
                    geoJson.type !== "FeatureCollection" ||
                    !Array.isArray(geoJson.features)
                ) {
                    throw new Error(
                        "Invalid electoral GeoJSON format"
                    );
                }


                // =====================================================
                // DEBUG INFORMATION
                // =====================================================

                console.group("MEIS GeoSpatial Data");

                console.log(
                    "Layer:",
                    layerType
                );

                console.log(
                    "GeoJSON:",
                    geoJsonUrl
                );

                console.log(
                    "GeoJSON features:",
                    geoJson.features.length
                );

                console.log(
                    "Database seats:",
                    seats.length
                );

                console.groupEnd();


                // =====================================================
                // CREATE EXACT SEAT LOOKUP
                //
                // IMPORTANT:
                // DO NOT REMOVE P / N PREFIXES.
                //
                // P.001 !== N.001
                // =====================================================

                const seatLookup = new Map();


                seats.forEach((seat) => {

                    const possibleCodes = [
                        seat.seat_code,
                        seat.code_parlimen,
                        seat.code_dun,
                        seat.parlimen,
                        seat.dun,
                        seat.code
                    ];


                    for (const code of possibleCodes) {

                        const normalized =
                            normalizeSeatCode(code);

                        if (!normalized) {
                            continue;
                        }


                        // Only accept the correct constituency type
                        if (isDun) {

                            if (!normalized.startsWith("N.")) {
                                continue;
                            }

                        } else {

                            if (!normalized.startsWith("P.")) {
                                continue;
                            }

                        }


                        seatLookup.set(
                            normalized,
                            seat
                        );
                    }
                });


                // =====================================================
                // CREATE STATE ANALYTICS LOOKUP
                // =====================================================

                const stateLookup = new Map();


                performance.forEach((state) => {

                    const stateName =
                        state.state_name ??
                        state.state ??
                        state.name;


                    const normalized =
                        normalizeStateName(stateName);


                    if (!normalized) {
                        return;
                    }


                    stateLookup.set(
                        normalized,
                        state
                    );
                });


                // =====================================================
                // MERGE GEOJSON + DATABASE ANALYTICS
                // =====================================================

                const mergedFeatures =
                    geoJson.features.map((feature) => {

                        const geoProperties =
                            feature.properties ?? {};


                        // =================================================
                        // GEOJSON IS THE SOURCE OF TRUTH
                        // =================================================

                        const geoSeatCode =
                            getGeoJsonSeatCode(
                                feature,
                                geoProperties
                            );


                        const normalizedGeoSeatCode =
                            normalizeSeatCode(
                                geoSeatCode
                            );


                        // =================================================
                        // MATCH DATABASE RECORD
                        // =================================================

                        const seat =
                            seatLookup.get(
                                normalizedGeoSeatCode
                            );


                        // =================================================
                        // IMPORTANT:
                        //
                        // STATE COMES FROM GEOJSON.
                        //
                        // DO NOT LET MYSQL MOVE THE FEATURE.
                        // =================================================

                        const stateName =
                            geoProperties.state_name ??
                            geoProperties.state ??
                            geoProperties.STATE ??
                            "Unknown State";


                        // =================================================
                        // STATE ANALYTICS
                        // =================================================

                        const statePerformance =
                            stateLookup.get(
                                normalizeStateName(
                                    stateName
                                )
                            );


                        // =================================================
                        // ANALYTICS ONLY
                        // =================================================

                        const totalVotes =
                            Number(
                                statePerformance?.total_votes ??
                                0
                            );


                        const dominantParty =
                            statePerformance?.dominant_party ??
                            "N/A";


                        // =================================================
                        // RETURN ORIGINAL GEOJSON GEOMETRY
                        //
                        // VERY IMPORTANT:
                        //
                        // geometry is NEVER modified.
                        // =================================================

                        return {

                            ...feature,

                            properties: {

                                // -----------------------------------------
                                // ORIGINAL GEOJSON PROPERTIES
                                // -----------------------------------------

                                ...geoProperties,


                                // -----------------------------------------
                                // GEOJSON IDENTITY
                                // -----------------------------------------

                                seat_code:
                                    geoSeatCode ??
                                    null,

                                seat_name:
                                    geoProperties.name ??
                                    geoProperties.parlimen ??
                                    geoProperties.dun ??
                                    "Unknown Seat",

                                state_name:
                                    stateName,

                                state_code:
                                    geoProperties.state_code ??
                                    null,

                                state_id:
                                    geoProperties.state_id ??
                                    null,


                                // -----------------------------------------
                                // DATABASE INFORMATION
                                // -----------------------------------------

                                database_seat_id:
                                    seat?.id ??
                                    seat?.seat_id ??
                                    null,

                                database_seat_name:
                                    seat?.seat_name ??
                                    seat?.name ??
                                    null,


                                // -----------------------------------------
                                // TYPE
                                // -----------------------------------------

                                seat_type:
                                    isDun
                                        ? "State Assembly"
                                        : "Parliamentary",


                                // -----------------------------------------
                                // ANALYTICS
                                // -----------------------------------------

                                total_votes:
                                    totalVotes,

                                dominant_party:
                                    dominantParty,


                                // -----------------------------------------
                                // MAP LAYER
                                // -----------------------------------------

                                layer_type:
                                    isDun
                                        ? "dun"
                                        : "parliament"
                            }
                        };
                    });


                // =====================================================
                // DEBUG MERGING
                // =====================================================

                console.log(
                    "Merged features:",
                    mergedFeatures.length
                );


                // =====================================================
                // SET DATA
                // =====================================================

                if (isMounted) {

                    setData({

                        type: "FeatureCollection",

                        ...(geoJson.bbox
                            ? {
                                bbox: geoJson.bbox
                            }
                            : {}),

                        features:
                            mergedFeatures
                    });


                    setLoading(false);
                }

            } catch (err) {

                if (
                    err.name === "AbortError"
                ) {
                    return;
                }


                console.error(
                    "GeoSpatial API error:",
                    err
                );


                if (isMounted) {

                    setError(
                        err.message ??
                        "Failed to load geospatial data"
                    );

                    setLoading(false);
                }
            }
        }


        fetchGeoSpatialData();


        return () => {

            isMounted = false;

            controller.abort();

        };

    }, [layerType, API_BASE_URL]);


    return {
        data,
        loading,
        error
    };
}


// ============================================================
// GEOJSON SEAT CODE
// ============================================================

function getGeoJsonSeatCode(
    feature,
    properties
) {

    return (
        properties.code_parlimen ??
        properties.code_dun ??
        properties.seat_code ??
        properties.parlimen ??
        properties.dun ??
        properties.code ??
        feature.id ??
        null
    );
}


// ============================================================
// NORMALIZE CONSTITUENCY CODE
//
// IMPORTANT:
// KEEP P. AND N.
//
// P.001 → P.001
// N.001 → N.001
//
// NEVER:
// P.001 → 001
// N.001 → 001
// ============================================================

function normalizeSeatCode(code) {

    if (
        code === undefined ||
        code === null
    ) {
        return "";
    }


    return String(code)
        .toUpperCase()
        .replace(/[-_]/g, "")
        .replace(/\s+/g, "")
        .trim();
}


// ============================================================
// NORMALIZE STATE NAME
// ============================================================

function normalizeStateName(name) {

    if (!name) {
        return "";
    }


    return String(name)
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}