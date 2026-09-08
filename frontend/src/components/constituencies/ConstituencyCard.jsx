import {
    MapPin,
    ArrowUpRight,
} from "lucide-react";

export default function ConstituencyCard({
    constituency,
    onSelect,
}) {

    const code =
        constituency.seat_code ??
        constituency.code ??
        constituency.code_parlimen ??
        constituency.code_dun;

    const name =
        constituency.seat_name ??
        constituency.name ??
        constituency.constituency_name ??
        "Unknown";

    const state =
        constituency.state_name ??
        constituency.state ??
        "Unknown";

    const party =
        constituency.winner_party ??
        constituency.dominant_party ??
        constituency.party ??
        "—";

    const margin = Number(
        constituency.margin ??
        constituency.majority ??
        constituency.majority_margin ??
        0
    );

    return (
        <button
            onClick={() => onSelect(constituency)}
            className="w-full text-left bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 hover:border-[#134074]/40 hover:bg-white/95 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 group relative overflow-hidden"
        >

            {/* Subtle top glow line on hover */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#134074]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between">

                <div>

                    <span className="inline-block font-mono text-[10px] font-bold text-[#134074] bg-blue-50/80 border border-blue-100/80 px-2 py-0.5 rounded-md shadow-sm">
                        {code}
                    </span>

                    <h3 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-[#134074] transition-colors">
                        {name}
                    </h3>

                </div>

                <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-100 text-slate-400 group-hover:text-[#134074] group-hover:bg-blue-50/80 group-hover:border-blue-100 transition-all shadow-sm">
                    <ArrowUpRight size={15} />
                </div>

            </div>

            <div className="mt-3.5 flex items-center gap-1.5 text-xs text-slate-600 font-medium">

                <MapPin
                    size={13}
                    className="text-slate-400"
                />

                {state}

            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">

                <div>

                    <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                        Winner
                    </p>

                    <p className="text-xs font-bold text-slate-800 mt-0.5">
                        {party}
                    </p>

                </div>

                <div className="text-right">

                    <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                        Majority
                    </p>

                    <span className="inline-block font-mono text-xs font-bold text-emerald-600 bg-emerald-50/80 border border-emerald-100/80 px-2 py-0.5 rounded mt-0.5 shadow-sm">
                        +{margin.toLocaleString()}
                    </span>

                </div>

            </div>

        </button>
    );
}