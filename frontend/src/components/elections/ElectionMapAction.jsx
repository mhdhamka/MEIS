import {
    Map,
    ArrowRight
} from "lucide-react";

import {
    Link
} from "react-router-dom";

export default function ElectionMapAction({
    election,
    constituency
}) {
    // Determine target based on whichever prop is provided
    const target = constituency ?? election;

    if (!target) {
        return null;
    }

    // Extract identifiers and names safely for both types
    const name = 
        target.seat_name ?? 
        target.name ?? 
        target.constituency_name ?? 
        target.election_name ?? 
        "Electoral Data";

    const code = 
        target.seat_code ?? 
        target.code ?? 
        target.code_parlimen ?? 
        target.code_dun ?? 
        target.election_id;

    const queryParam = constituency ? `code=${code}` : `election=${code}`;

    return (
        <Link
            to={`/map?${queryParam}`}
            className="group relative bg-gradient-to-r from-[#0b2545] via-[#102a43] to-[#0b2545] text-white rounded-2xl p-4 border border-[#ffb703]/40 shadow-2xl flex items-center justify-between gap-4 transition-all hover:border-[#ffb703] hover:scale-[1.01] overflow-hidden"
        >
            {/* Subtle left gold accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ffb703]" />

            <div className="flex items-center gap-3.5 pl-2">
                <div className="w-10 h-10 rounded-xl bg-[#ffb703]/15 border border-[#ffb703]/30 flex items-center justify-center text-[#ffb703] shrink-0">
                    <Map size={20} />
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white tracking-tight">
                            View on Electoral Map
                        </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                        Explore {name} {code ? `(${code})` : ""} geography
                    </p>
                </div>
            </div>

            <div className="pr-2 text-[#ffb703] group-hover:translate-x-1 transition-transform">
                <ArrowRight size={18} />
            </div>
        </Link>
    );
}