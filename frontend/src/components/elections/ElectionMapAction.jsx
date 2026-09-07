import {
    Map,
    ArrowRight
} from "lucide-react";

import {
    Link
} from "react-router-dom";


export default function ElectionMapAction({
    election
}) {
    if (!election) {
        return null;
    }


    return (
        <section className="bg-[#0b2545] text-white rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#ffb703]">
                    Geospatial Intelligence
                </p>

                <h3 className="text-lg font-bold mt-1">
                    Explore {
                        election.election_name
                    } on the Electoral Map
                </h3>

                <p className="text-xs text-slate-300 mt-1">
                    Visualize constituency boundaries,
                    party dominance, margins and electoral geography.
                </p>

            </div>


            <Link
                to={`/map?election=${election.election_id}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#ffb703] text-slate-900 text-xs font-bold hover:bg-amber-300"
            >
                <Map size={15} />

                Open Map

                <ArrowRight
                    size={14}
                />
            </Link>

        </section>
    );
}