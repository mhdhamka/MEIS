import { Link } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Trophy,
    TrendingUp,
    Users,
    BarChart3,
    Building2,
} from "lucide-react";

function formatNumber(value) {
    return Number(value || 0).toLocaleString();
}

function formatPercent(value) {
    return `${Number(value || 0).toFixed(1)}%`;
}

export default function CandidateProfile({ candidate }) {
    if (!candidate) {
        return (
            <div className="rounded-3xl bg-white p-8 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-4 border border-slate-100">
                    <Users size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Candidate not found</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto font-medium">
                    The requested candidate profile could not be located.
                </p>
                <Link
                    to="/candidates"
                    className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#134074] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-[#0f325d] transition"
                >
                    Return to candidates
                </Link>
            </div>
        );
    }

    const history = [...(candidate.history || [])];
    const sortedHistory = history;
    const latest = candidate.latestResult || sortedHistory[sortedHistory.length - 1] || {};

    return (
        <div className="space-y-6 pb-12">
            {/* Back Navigation */}
            <Link
                to="/candidates"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-[#134074]"
            >
                <ArrowLeft size={15} />
                Back to Candidates Directory
            </Link>

            {/* Hero Section converted to White Background */}
            <section className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="px-6 py-8 md:px-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center">

                        <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#134074] border border-blue-100">
                                    Candidate Intelligence Profile
                                </span>

                                {latest.isWinner && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200/60">
                                        <Trophy size={12} />
                                        Winner
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                                {candidate.name}
                            </h1>

                            <p className="mt-1 text-sm font-bold text-blue-600">
                                {candidate.party}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600 font-medium">
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin size={13} className="text-blue-600" />
                                    <strong className="text-slate-900">{candidate.seatCode}</strong> {candidate.seatName}
                                </span>

                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 border border-slate-200 text-slate-700 font-semibold">
                                    {candidate.state}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metric Summary Bar */}
                <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 md:grid-cols-4 md:divide-y-0 bg-slate-50/50 border-t border-slate-100">
                    <Metric label="Contested" value={candidate.contested} />
                    <Metric label="Wins" value={candidate.wins} positive />
                    <Metric label="Losses" value={candidate.losses} />
                    <Metric label="Win Rate" value={formatPercent(candidate.winRate)} />
                </div>
            </section>

            {/* Relationship Cards */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <RelationshipCard
                    icon={Building2}
                    title="Constituency"
                    value={candidate.seatName}
                    subtitle={candidate.seatCode}
                    href={candidate.seatCode ? `/constituencies/${encodeURIComponent(candidate.seatCode)}` : null}
                    iconBg="bg-blue-50 text-blue-600 border border-blue-100"
                />
                <RelationshipCard
                    icon={Users}
                    title="Political Party"
                    value={candidate.party}
                    subtitle="Party affiliation"
                    href="/parties"
                    iconBg="bg-indigo-50 text-indigo-600 border border-indigo-100"
                />
                <RelationshipCard
                    icon={BarChart3}
                    title="State"
                    value={candidate.state}
                    subtitle="Electoral region"
                    iconBg="bg-slate-50 text-slate-600 border border-slate-100"
                />
            </section>

            {/* Performance Metrics Overview */}
            <section className="space-y-4">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#134074]">
                        Metrics
                    </p>
                    <h2 className="text-lg font-black text-slate-900 mt-0.5">
                        Candidate Performance
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                        Historical electoral performance across contested elections.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <PerformanceCard
                        icon={TrendingUp}
                        label="Total Votes"
                        value={formatNumber(candidate.totalVotes)}
                        iconBg="bg-blue-50 text-blue-600 border border-blue-100"
                    />
                    <PerformanceCard
                        icon={BarChart3}
                        label="Avg Vote Share"
                        value={formatPercent(candidate.averageVoteShare)}
                        iconBg="bg-indigo-50 text-indigo-600 border border-indigo-100"
                    />
                    <PerformanceCard
                        icon={Trophy}
                        label="Wins"
                        value={formatNumber(candidate.wins)}
                        iconBg="bg-emerald-50 text-emerald-600 border border-emerald-100"
                    />
                    <PerformanceCard
                        icon={TrendingUp}
                        label="Avg Margin"
                        value={formatNumber(Math.round(candidate.averageMargin))}
                        iconBg="bg-blue-50 text-blue-600 border border-blue-100"
                    />
                </div>
            </section>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <VotesByElection history={sortedHistory} />
                <VoteShareChart history={sortedHistory} />
                <MarginChart history={sortedHistory} />
                <WinLossChart wins={candidate.wins} losses={candidate.losses} />
            </div>

            {/* Election History Table */}
            <ElectionHistory history={sortedHistory} />
        </div>
    );
}

function Metric({ label, value, positive = false }) {
    return (
        <div className="px-6 py-4">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                {label}
            </p>
            <p className={`mt-1 text-2xl font-black tracking-tight ${positive ? "text-emerald-600" : "text-slate-900"}`}>
                {value}
            </p>
        </div>
    );
}

function RelationshipCard({ icon: Icon, title, value, subtitle, href, iconBg }) {
    const content = (
        <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-xl shadow-slate-200/50 border border-slate-100 transition hover:border-blue-200 group">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm ${iconBg}`}>
                <Icon size={18} />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    {title}
                </p>
                <p className="mt-1 truncate text-sm font-bold text-slate-900 group-hover:text-[#134074] transition">
                    {value}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 font-medium">
                    {subtitle}
                </p>
            </div>
        </div>
    );

    if (!href) return content;
    return <Link to={href} className="block">{content}</Link>;
}

function PerformanceCard({ icon: Icon, label, value, iconBg }) {
    return (
        <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        {label}
                    </p>
                    <p className="mt-2 text-3xl font-black text-slate-900 tracking-tight">
                        {value}
                    </p>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm ${iconBg}`}>
                    <Icon size={18} />
                </div>
            </div>
        </div>
    );
}

function ChartContainer({ title, description, children }) {
    return (
        <section className="rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 p-6 space-y-4">
            <div>
                <h3 className="text-base font-bold text-slate-900">
                    {title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                    {description}
                </p>
            </div>
            <div className="pt-2">
                {children}
            </div>
        </section>
    );
}

function VotesByElection({ history }) {
    const max = Math.max(...history.map((item) => item.votes), 1);

    return (
        <ChartContainer title="Votes by Election" description="Candidate vote totals across elections.">
            <div className="space-y-4">
                {history.map((item, index) => (
                    <div key={`${item.electionId}-${index}`}>
                        <div className="mb-1 flex justify-between text-xs">
                            <span className="font-semibold text-slate-700">{item.electionName}</span>
                            <span className="font-black text-slate-900">{formatNumber(item.votes)}</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200/60">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-[#134074]"
                                style={{ width: `${(item.votes / max) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </ChartContainer>
    );
}

function VoteShareChart({ history }) {
    return (
        <ChartContainer title="Vote Share" description="Percentage of valid votes received.">
            <div className="flex h-48 items-end gap-3 border-b border-slate-100 pb-2 px-2">
                {history.map((item, index) => {
                    const height = Math.min(Math.max(item.voteShare, 0), 100);
                    return (
                        <div key={`${item.electionId}-${index}`} className="flex h-full flex-1 flex-col items-center justify-end gap-2 group">
                            <span className="text-[10px] font-black text-slate-700">{formatPercent(item.voteShare)}</span>
                            <div
                                className="w-full rounded-t-xl bg-blue-600 transition group-hover:bg-[#134074] shadow-sm"
                                style={{ height: `${height}%`, minHeight: "4px" }}
                            />
                            <span className="mb-2 max-w-full truncate text-[9px] text-slate-400 font-medium">{item.electionName}</span>
                        </div>
                    );
                })}
            </div>
        </ChartContainer>
    );
}

function MarginChart({ history }) {
    return (
        <ChartContainer title="Winning Margins" description="Recorded electoral margin for each contest.">
            <div className="space-y-4">
                {history.map((item, index) => {
                    const margin = Number(item.margin) || 0;
                    return (
                        <div key={`${item.electionId}-${index}`}>
                            <div className="mb-1 flex justify-between">
                                <span className="text-xs font-semibold text-slate-700">{item.electionName}</span>
                                <span className={`text-xs font-bold ${item.isWinner ? "text-emerald-600" : "text-rose-600"}`}>
                                    {item.isWinner ? "+" : "-"}{formatNumber(Math.abs(margin))}
                                </span>
                            </div>
                            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200/60">
                                <div
                                    className={`h-full rounded-full ${item.isWinner ? "bg-emerald-500" : "bg-rose-500"}`}
                                    style={{
                                        width: `${Math.min((Math.abs(margin) / Math.max(...history.map((x) => Math.abs(Number(x.margin) || 0)), 1)) * 100, 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </ChartContainer>
    );
}

function WinLossChart({ wins, losses }) {
    const total = wins + losses || 1;
    const winPercentage = (wins / total) * 100;
    const lossPercentage = (losses / total) * 100;

    return (
        <ChartContainer title="Wins vs Losses" description="Overall candidate electoral record.">
            <div className="flex items-center gap-6 py-2">
                <div className="relative h-36 w-36 shrink-0">
                    <div
                        className="h-full w-full rounded-full shadow-inner"
                        style={{ background: `conic-gradient(#10b981 0 ${winPercentage}%, #f43f5e ${winPercentage}% 100%)` }}
                    />
                    <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white shadow-sm">
                        <div className="text-center">
                            <p className="text-xl font-black text-slate-900">{wins}</p>
                            <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Wins</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <Legend label="Wins" value={wins} percentage={winPercentage} color="bg-emerald-500" />
                    <Legend label="Losses" value={losses} percentage={lossPercentage} color="bg-rose-500" />
                </div>
            </div>
        </ChartContainer>
    );
}

function Legend({ label, value, percentage, color }) {
    return (
        <div>
            <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                <span className="text-xs font-bold text-slate-700">{label}</span>
            </div>
            <p className="mt-1 text-sm font-black text-slate-900">
                {value} <span className="font-medium text-slate-400 text-xs">({percentage.toFixed(1)}%)</span>
            </p>
        </div>
    );
}

function ElectionHistory({ history }) {
    return (
        <section className="rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <div>
                    <h2 className="text-base font-bold text-slate-900">Election History</h2>
                    <p className="text-xs text-slate-500">Historical contests, results, and constituency relationships.</p>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/30 text-[10px] font-extrabold uppercase text-slate-400">
                            <th className="px-6 py-3 text-left">Election</th>
                            <th className="px-6 py-3 text-left">Constituency</th>
                            <th className="px-6 py-3 text-right">Votes</th>
                            <th className="px-6 py-3 text-right">Vote Share</th>
                            <th className="px-6 py-3 text-right">Margin</th>
                            <th className="px-6 py-3 text-center">Result</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {history.map((item, index) => (
                            <tr key={`${item.electionId}-${index}`} className="hover:bg-slate-50/50 transition">
                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.electionName}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <span className="font-bold text-slate-900">{item.seatCode}</span> {item.seatName}
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">{formatNumber(item.votes)}</td>
                                <td className="px-6 py-4 text-right text-sm font-semibold text-slate-600">{formatPercent(item.voteShare)}</td>
                                <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                                    {item.isWinner ? "+" : "-"}{formatNumber(Math.abs(item.margin))}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                                            item.isWinner
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                                : "bg-rose-50 text-rose-600 border border-rose-200/60"
                                        }`}
                                    >
                                        {item.isWinner ? "WIN" : "LOSS"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {history.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-xs text-slate-500">
                                    No election history available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}