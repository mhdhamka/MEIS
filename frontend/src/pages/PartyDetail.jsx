import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PartyProfile from "../components/parties/PartyProfile";
import { api } from "../services/api";

export default function PartyDetail() {

    const { partyId } = useParams();

    const [party, setParty] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        let mounted = true;

        async function loadParty() {

            try {

                setLoading(true);
                setError(null);

                const response =
                    await api.getParty(partyId);

                if (!mounted) {
                    return;
                }

                const data =
                    response?.data ??
                    response;

                setParty(data);

            } catch (err) {

                console.error(
                    "Failed to load party profile:",
                    err
                );

                if (mounted) {

                    setError(
                        err.message ||
                        "Failed to load party profile."
                    );

                }

            } finally {

                if (mounted) {
                    setLoading(false);
                }

            }

        }

        loadParty();

        return () => {
            mounted = false;
        };

    }, [partyId]);


    if (loading) {
        return (
            <div className="min-h-full bg-[#F5F3F6] p-6">

                <div className="
                    mx-auto
                    max-w-[1600px]
                    animate-pulse
                    space-y-5
                ">

                    <div className="h-32 rounded-2xl bg-white" />

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-28 rounded-2xl bg-white"
                            />
                        ))}

                    </div>

                    <div className="h-80 rounded-2xl bg-white" />

                </div>

            </div>
        );
    }


    if (error) {
        return (
            <div className="min-h-full bg-[#F5F3F6] p-6">

                <div className="
                    mx-auto
                    max-w-[1600px]
                ">

                    <div className="
                        rounded-2xl
                        border border-red-200
                        bg-red-50
                        p-8
                        text-center
                    ">

                        <h2 className="font-bold text-red-800">
                            Unable to load party
                        </h2>

                        <p className="mt-2 text-sm text-red-600">
                            {error}
                        </p>

                        <Link
                            to="/parties"
                            className="
                                mt-5
                                inline-flex
                                rounded-xl
                                bg-[#134074]
                                px-4 py-2.5
                                text-sm
                                font-bold
                                text-white
                            "
                        >
                            Back to Parties
                        </Link>

                    </div>

                </div>

            </div>
        );
    }


    if (!party) {
        return (
            <div className="
                min-h-full
                bg-[#F5F3F6]
                p-6
            ">

                <div className="
                    mx-auto
                    max-w-[1600px]
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    p-10
                    text-center
                ">

                    <h2 className="font-bold text-slate-900">
                        Party not found
                    </h2>

                    <Link
                        to="/parties"
                        className="
                            mt-4
                            inline-block
                            text-sm
                            font-bold
                            text-[#134074]
                        "
                    >
                        ← Back to Parties
                    </Link>

                </div>

            </div>
        );
    }


    return (
        <div className="min-h-full bg-[#F5F3F6]">

            <div className="border-b border-slate-200 bg-white">

                <div className="
                    mx-auto
                    max-w-[1600px]
                    px-6 py-5
                ">

                    <div className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        font-semibold
                        text-slate-400
                    ">

                        <Link
                            to="/"
                            className="hover:text-[#134074]"
                        >
                            MEIS
                        </Link>

                        <span>/</span>

                        <Link
                            to="/parties"
                            className="hover:text-[#134074]"
                        >
                            Parties
                        </Link>

                        <span>/</span>

                        <span className="text-slate-600">
                            Profile
                        </span>

                    </div>

                </div>

            </div>


            <main className="
                mx-auto
                max-w-[1600px]
                px-6
                py-6
            ">

                <PartyProfile party={party} />

            </main>

        </div>
    );
}