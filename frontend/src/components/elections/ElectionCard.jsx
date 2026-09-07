import {
    CalendarDays,
    ArrowRight
} from "lucide-react";


export default function ElectionCard({
    election,
    selected,
    onSelect
}) {
    return (
        <article
            className={`
                rounded-2xl p-5 transition-all duration-300 backdrop-blur-xl border
                ${
                    selected
                        ? "bg-white/90 border-[#134074] shadow-lg shadow-blue-900/10 ring-2 ring-blue-500/20"
                        : "bg-white/70 border-white/60 hover:bg-white/90 hover:border-slate-300 shadow-xl shadow-slate-200/40 hover:-translate-y-1"
                }
            `}
        >

            <div className="flex items-start justify-between">

                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#134074] bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {
                        election.election_type ??
                        "Election"
                    }
                </span>

                <div className="w-8 h-8 rounded-xl bg-white/60 backdrop-blur-md border border-slate-200/60 flex items-center justify-center text-slate-500 shadow-sm">
                    <CalendarDays
                        size={16}
                    />
                </div>

            </div>


            <h3 className="text-xl font-black text-slate-900 mt-4 tracking-tight">
                {
                    election.election_name
                }
            </h3>


            <p className="text-sm font-semibold text-slate-500 mt-1">
                {
                    election.election_year
                }
            </p>


            <div className="border-t border-slate-100/80 mt-4 pt-4 flex items-center justify-between">
                <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Election ID
                    </p>

                    <p className="text-sm font-black text-slate-800 mt-0.5">
                        #
                        {
                            election.election_id
                        }
                    </p>
                </div>

            </div>


            <button
                onClick={() =>
                    onSelect(
                        election.election_id
                    )
                }
                className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#0b2545] text-white rounded-xl py-2.5 text-xs font-bold shadow-md shadow-blue-900/20 hover:bg-[#134074] active:scale-[0.98] transition-all duration-200 group"
            >
                Explore Election

                <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                />
            </button>

        </article>
    );
}