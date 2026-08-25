export default function MapTooltipOverlay({
    activeConstituency
}) {
    if (!activeConstituency) {
        return null;
    }

    return (
        <div className="absolute bottom-6 left-6 z-40 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-xl max-w-xs animate-in fade-in duration-150">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#134074] bg-blue-50 px-2 py-0.5 rounded">
                Live Electoral Feed
            </span>


            {/* =====================================================
                CONSTITUENCY
            ===================================================== */}

            <h4 className="text-sm font-bold text-slate-900 mt-2">
                {activeConstituency.seat_name ??
                    activeConstituency.name ??
                    "Unknown Constituency"}
            </h4>


            {/* =====================================================
                INFORMATION
            ===================================================== */}

            <div className="mt-3 space-y-1.5 text-xs text-slate-600">

                <p>
                    State Region:{" "}
                    <strong className="text-slate-900">
                        {activeConstituency.state_name ??
                            activeConstituency.state ??
                            "N/A"}
                    </strong>
                </p>

                <p>
                    Constituency Code:{" "}
                    <strong className="text-slate-900">
                        {activeConstituency.seat_code ??
                            "N/A"}
                    </strong>
                </p>

                <p>
                    Seat Type:{" "}
                    <strong className="text-slate-900">
                        {activeConstituency.seat_type ??
                            "N/A"}
                    </strong>
                </p>

                <p>
                    Dominant Party:{" "}
                    <strong className="text-slate-900">
                        {activeConstituency.dominant_party ??
                            activeConstituency.dominantParty ??
                            "N/A"}
                    </strong>
                </p>

                <p>
                    Total Votes:{" "}
                    <strong className="text-slate-900">
                        {Number(
                            activeConstituency.total_votes ??
                            0
                        ).toLocaleString()}
                    </strong>
                </p>

            </div>
        </div>
    );
}