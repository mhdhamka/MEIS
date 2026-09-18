import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api";
import {
    Trophy,
    Percent,
    Users,
    Target,
    MapPin,
} from "lucide-react";

function formatNumber(value) {
    return Number(value || 0).toLocaleString();
}

export default function PartyPerformance() {
    const { id } = useParams();
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPerformance() {
            try {
                setLoading(true);
                const response = await api.get(`/parties/${id}/performance`);
                setPerformance(response.data?.data || response.data);
            } catch (err) {
                setError("Historical party performance is not available from the current API.");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchPerformance();
        }
    }, [id]);

    if (loading) {
        return <div className="p-6 text-sm text-slate-500">Loading performance metrics...</div>;
    }

    if (error || !performance) {
        return (
            <div className="mt-5 rounded-xl border border-dashed border-slate-200 p-8 text-center bg-white/75 backdrop-blur-xl">
                <p className="text-sm text-slate-500">
                    {error || "Historical party performance is not available from the current API."}
                </p>
            </div>
        );
    }

    const seats = Number(performance.seats_won ?? 0);
    const candidates = Number(performance.candidates ?? 0);
    const totalVotes = Number(performance.total_votes ?? 0);
    const wins = Number(performance.seats_won ?? 0);
    
    const winRate = candidates > 0 ? (wins / candidates) * 100 : 0;
    const voteShare = performance.vote_share !== undefined && performance.vote_share !== null 
        ? Number(performance.vote_share) 
        : null;
    
    const geographicCount = Number(
        performance.states_contested ??
        performance.geographic_distribution ??
        performance.state_count ??
        performance.regionsCount ??
        0
    );

    const history = Array.isArray(performance.history) ? performance.history : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-slate-900">
                        Party Performance
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                        Historical electoral metrics and constituency footprint overview.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* 1. Seat History / Seats Won */}
                <div className="rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 p-5 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-slate-400 mb-3">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider">
                                Seat History
                            </span>
                            <Trophy size={16} className="text-amber-500" />
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                            {formatNumber(seats)}
                        </p>
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-slate-500">
                        Total constituencies won
                    </p>
                </div>

                {/* 2. Vote Share */}
                <div className="rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 p-5 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-slate-400 mb-3">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider">
                                Vote Share
                            </span>
                            <Percent size={16} className="text-blue-500" />
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                            {voteShare !== null ? `${voteShare.toFixed(1)}%` : "—"}
                        </p>
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-slate-500">
                        Aggregate popular vote percentage
                    </p>
                </div>

                {/* 3. Candidate Count */}
                <div className="rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 p-5 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-slate-400 mb-3">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider">
                                Candidate Count
                            </span>
                            <Users size={16} className="text-indigo-500" />
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                            {formatNumber(candidates)}
                        </p>
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-slate-500">
                        Total nominated representatives
                    </p>
                </div>

                {/* 4. Win Rate */}
                <div className="rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 p-5 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-slate-400 mb-3">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider">
                                Win Rate
                            </span>
                            <Target size={16} className="text-emerald-500" />
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                            {winRate.toFixed(1)}%
                        </p>
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-slate-500">
                        Success ratio per contest
                    </p>
                </div>

                {/* 5. Geographic Distribution */}
                <div className="rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 p-5 shadow-xl shadow-slate-200/50 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                    <div>
                        <div className="flex items-center justify-between text-slate-400 mb-3">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider">
                                Geographic Spread
                            </span>
                            <MapPin size={16} className="text-rose-500" />
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                            {formatNumber(geographicCount)} <span className="text-sm font-bold text-slate-400">States</span>
                        </p>
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-slate-500">
                        Regional electoral footprint
                    </p>
                </div>
            </div>

            {/* Performance History Table */}
            <div className="rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 p-6 shadow-xl shadow-slate-200/50">
                <h2 className="text-lg font-bold text-slate-900">Party Performance History</h2>
                <p className="mt-1 text-sm text-slate-500">Electoral performance breakdown across general elections.</p>

                {history.length > 0 ? (
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full min-w-[500px] text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Election Year</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Seats Won</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Votes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item, index) => (
                                    <tr key={index} className="border-b border-slate-50 last:border-0">
                                        <td className="px-4 py-4 text-sm font-bold text-slate-900">{item.election}</td>
                                        <td className="px-4 py-4 text-sm font-bold text-slate-700">{item.seats_won}</td>
                                        <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                                            {item.total_votes ? Number(item.total_votes).toLocaleString() : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="mt-5 rounded-xl border border-dashed border-slate-200 p-8 text-center">
                        <p className="text-sm text-slate-500">Historical party performance is not available from the current API.</p>
                    </div>
                )}
            </div>
        </div>
    );
}