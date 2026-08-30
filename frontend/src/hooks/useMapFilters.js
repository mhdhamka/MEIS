import { useMemo } from "react";

export function useMapFilters(
  data,
  {
    seatType,
    stateFilter,
    searchQuery,
  }
) {
  return useMemo(() => {
    if (!data?.features) {
      return {
        type: "FeatureCollection",
        features: [],
      };
    }

    const normalizedSearch =
      searchQuery
        ?.trim()
        .toLowerCase() ?? "";

    const features =
      data.features.filter((feature) => {
        const p =
          feature.properties ?? {};

        if (
          seatType &&
          seatType !== "all" &&
          p.layer_type !== seatType
        ) {
          return false;
        }

        if (
          stateFilter &&
          stateFilter !== "all" &&
          p.state_name !== stateFilter
        ) {
          return false;
        }

        if (normalizedSearch) {
          const searchable =
            [
              p.seat_code,
              p.seat_name,
              p.state_name,
              p.dominant_party,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          if (
            !searchable.includes(
              normalizedSearch
            )
          ) {
            return false;
          }
        }

        return true;
      });

    return {
      type: "FeatureCollection",
      features,
    };

  }, [
    data,
    seatType,
    stateFilter,
    searchQuery,
  ]);
}