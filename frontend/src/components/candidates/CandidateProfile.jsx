import { Link } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Trophy,
    TrendingUp,
    TrendingDown,
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

function getInitials(name) {
    if (!name) {
        return "?";
    }

    const words = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 1) {
        return words[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();
}

export default function CandidateProfile({
    candidate,
}) {
    if (!candidate) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <Users
                    size={32}
                    className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-semibold text-slate-600">
                    Candidate not found.
                </p>

                <Link
                    to="/candidates"
                    className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                    Return to candidates
                </Link>
            </div>
        );
    }

    const history = [
        ...(candidate.history || []),
    ];

    const sortedHistory = history;

    const latest =
        candidate.latestResult ||
        sortedHistory[
            sortedHistory.length - 1
        ] ||
        {};

    return (
        <div className="space-y-6 pb-10">

            {/* Back */}
            <Link
                to="/candidates"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-blue-600"
            >
                <ArrowLeft size={15} />
                Back to Candidates
            </Link>

            {/* ---------------------------------------- */}
            {/* Hero */}
            {/* ---------------------------------------- */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-slate-900 px-6 py-8 text-white md:px-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center">
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-slate-700 text-2xl font-black">
                            {getInitials(
                                candidate.name
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-200">
                                    Candidate Profile
                                </span>

                                {latest.isWinner && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                                        <Trophy
                                            size={12}
                                        />
                                        Winner
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl font-black tracking-tight md:text-3xl">
                                {candidate.name}
                            </h1>

                            <p className="mt-1 text-sm font-semibold text-blue-300">
                                {candidate.party}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-300">
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin
                                        size={13}
                                    />

                                    {candidate.seatCode}{" "}
                                    {
                                        candidate.seatName
                                    }
                                </span>

                                <span>
                                    {
                                        candidate.state
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current result */}
                <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 md:grid-cols-4 md:divide-y-0">
                    <Metric
                        label="Contested"
                        value={
                            candidate.contested
                        }
                    />

                    <Metric
                        label="Wins"
                        value={
                            candidate.wins
                        }
                        positive
                    />

                    <Metric
                        label="Losses"
                        value={
                            candidate.losses
                        }
                    />

                    <Metric
                        label="Win Rate"
                        value={formatPercent(
                            candidate.winRate
                        )}
                    />
                </div>
            </section>

            {/* ---------------------------------------- */}
            {/* Relationship */}
            {/* ---------------------------------------- */}

            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <RelationshipCard
                    icon={Building2}
                    title="Constituency"
                    value={
                        candidate.seatName
                    }
                    subtitle={
                        candidate.seatCode
                    }
                    href={
                        candidate.seatCode
                            ? `/constituencies/${encodeURIComponent(
                                candidate.seatCode
                            )}`
                            : null
                    }
                />

                <RelationshipCard
                    icon={Users}
                    title="Political Party"
                    value={
                        candidate.party
                    }
                    subtitle="Party affiliation"
                    href="/parties"
                />

                <RelationshipCard
                    icon={BarChart3}
                    title="State"
                    value={
                        candidate.state
                    }
                    subtitle="Electoral region"
                />
            </section>

            {/* ---------------------------------------- */}
            {/* Performance overview */}
            {/* ---------------------------------------- */}

            <section>
                <div className="mb-4">
                    <h2 className="text-sm font-bold text-slate-900">
                        Candidate Performance
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        Historical electoral performance
                        across contested elections.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <PerformanceCard
                        icon={TrendingUp}
                        label="Total Votes"
                        value={formatNumber(
                            candidate.totalVotes
                        )}
                    />

                    <PerformanceCard
                        icon={BarChart3}
                        label="Avg Vote Share"
                        value={formatPercent(
                            candidate.averageVoteShare
                        )}
                    />

                    <PerformanceCard
                        icon={Trophy}
                        label="Wins"
                        value={formatNumber(
                            candidate.wins
                        )}
                    />

                    <PerformanceCard
                        icon={TrendingUp}
                        label="Avg Margin"
                        value={formatNumber(
                            Math.round(
                                candidate.averageMargin
                            )
                        )}
                    />
                </div>
            </section>

            {/* ---------------------------------------- */}
            {/* Charts */}
            {/* ---------------------------------------- */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                <VotesByElection
                    history={
                        sortedHistory
                    }
                />

                <VoteShareChart
                    history={
                        sortedHistory
                    }
                />

                <MarginChart
                    history={
                        sortedHistory
                    }
                />

                <WinLossChart
                    wins={
                        candidate.wins
                    }
                    losses={
                        candidate.losses
                    }
                />
            </div>

            {/* ---------------------------------------- */}
            {/* Election history */}
            {/* ---------------------------------------- */}

            <ElectionHistory
                history={
                    sortedHistory
                }
            />
        </div>
    );
}

function Metric({
    label,
    value,
    positive = false,
}) {
    return (
        <div className="px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {label}
            </p>

            <p
                className={`mt-1 text-lg font-black ${
                    positive
                        ? "text-emerald-600"
                        : "text-slate-900"
                }`}
            >
                {value}
            </p>
        </div>
    );
}

function RelationshipCard({
    icon: Icon,
    title,
    value,
    subtitle,
    href,
}) {
    const content = (
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Icon size={18} />
            </div>

            <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {title}
                </p>

                <p className="mt-1 truncate text-sm font-bold text-slate-900">
                    {value}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                    {subtitle}
                </p>
            </div>
        </div>
    );

    if (!href) {
        return content;
    }

    return (
        <Link to={href}>
            {content}
        </Link>
    );
}

function PerformanceCard({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {label}
                </p>

                <Icon
                    size={16}
                    className="text-slate-400"
                />
            </div>

            <p className="mt-3 text-2xl font-black text-slate-900">
                {value}
            </p>
        </div>
    );
}

function ChartContainer({
    title,
    description,
    children,
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">
                {title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
                {description}
            </p>

            <div className="mt-5">
                {children}
            </div>
        </section>
    );
}

function VotesByElection({
    history,
}) {
    const max = Math.max(
        ...history.map(
            (item) => item.votes
        ),
        1
    );

    return (
        <ChartContainer
            title="Votes by Election"
            description="Candidate vote totals across elections."
        >
            <div className="space-y-4">
                {history.map(
                    (item, index) => (
                        <div
                            key={`${item.electionId}-${index}`}
                        >
                            <div className="mb-1 flex justify-between text-xs">
                                <span className="font-semibold text-slate-700">
                                    {
                                        item.electionName
                                    }
                                </span>

                                <span className="font-bold text-slate-900">
                                    {formatNumber(
                                        item.votes
                                    )}
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-blue-600"
                                    style={{
                                        width: `${(
                                            item.votes /
                                            max
                                        ) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )
                )}
            </div>
        </ChartContainer>
    );
}

function VoteShareChart({
    history,
}) {
    return (
        <ChartContainer
            title="Vote Share"
            description="Percentage of valid votes received."
        >
            <div className="flex h-48 items-end gap-3 border-b border-slate-200 px-2">
                {history.map(
                    (item, index) => {
                        const height =
                            Math.min(
                                Math.max(
                                    item.voteShare,
                                    0
                                ),
                                100
                            );

                        return (
                            <div
                                key={`${item.electionId}-${index}`}
                                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                            >
                                <span className="text-[10px] font-bold text-slate-700">
                                    {formatPercent(
                                        item.voteShare
                                    )}
                                </span>

                                <div
                                    className="w-full rounded-t-lg bg-blue-500 transition hover:bg-blue-600"
                                    style={{
                                        height: `${height}%`,
                                        minHeight:
                                            "4px",
                                    }}
                                />

                                <span className="mb-2 max-w-full truncate text-[9px] text-slate-400">
                                    {
                                        item.electionName
                                    }
                                </span>
                            </div>
                        );
                    }
                )}
            </div>
        </ChartContainer>
    );
}

function MarginChart({
    history,
}) {
    return (
        <ChartContainer
            title="Winning Margins"
            description="Recorded electoral margin for each contest."
        >
            <div className="space-y-4">
                {history.map(
                    (item, index) => {
                        const margin =
                            Number(
                                item.margin
                            ) || 0;

                        return (
                            <div
                                key={`${item.electionId}-${index}`}
                            >
                                <div className="mb-1 flex justify-between">
                                    <span className="text-xs font-semibold text-slate-700">
                                        {
                                            item.electionName
                                        }
                                    </span>

                                    <span
                                        className={`text-xs font-bold ${
                                            item.isWinner
                                                ? "text-emerald-600"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {item.isWinner
                                            ? "+"
                                            : "-"}
                                        {formatNumber(
                                            Math.abs(
                                                margin
                                            )
                                        )}
                                    </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full rounded-full ${
                                            item.isWinner
                                                ? "bg-emerald-500"
                                                : "bg-red-400"
                                        }`}
                                        style={{
                                            width: `${Math.min(
                                                Math.abs(
                                                    margin
                                                ) /
                                                    Math.max(
                                                        ...history.map(
                                                            (
                                                                x
                                                            ) =>
                                                                Math.abs(
                                                                    Number(
                                                                        x.margin
                                                                    ) ||
                                                                    0
                                                                )
                                                        ),
                                                        1
                                                    ) *
                                                    100,
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    }
                )}
            </div>
        </ChartContainer>
    );
}

function WinLossChart({
    wins,
    losses,
}) {
    const total =
        wins + losses || 1;

    const winPercentage =
        (wins / total) * 100;

    const lossPercentage =
        (losses / total) * 100;

    return (
        <ChartContainer
            title="Wins vs Losses"
            description="Overall candidate electoral record."
        >
            <div className="flex items-center gap-6">
                <div className="relative h-36 w-36 shrink-0">
                    <div
                        className="h-full w-full rounded-full"
                        style={{
                            background: `conic-gradient(#10b981 0 ${winPercentage}%, #ef4444 ${winPercentage}% 100%)`,
                        }}
                    />

                    <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white">
                        <div className="text-center">
                            <p className="text-xl font-black text-slate-900">
                                {wins}
                            </p>

                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                Wins
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <Legend
                        label="Wins"
                        value={wins}
                        percentage={
                            winPercentage
                        }
                    />

                    <Legend
                        label="Losses"
                        value={losses}
                        percentage={
                            lossPercentage
                        }
                    />
                </div>
            </div>
        </ChartContainer>
    );
}

function Legend({
    label,
    value,
    percentage,
}) {
    return (
        <div>
            <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />

                <span className="text-xs font-semibold text-slate-600">
                    {label}
                </span>
            </div>

            <p className="mt-1 text-sm font-black text-slate-900">
                {value}{" "}
                <span className="font-medium text-slate-400">
                    ({percentage.toFixed(1)}%)
                </span>
            </p>
        </div>
    );
}

function ElectionHistory({
    history,
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-sm font-bold text-slate-900">
                    Election History
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                    Historical contests, results and
                    constituency relationships.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Election
                            </th>

                            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Constituency
                            </th>

                            <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Votes
                            </th>

                            <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Vote Share
                            </th>

                            <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Margin
                            </th>

                            <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Result
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {history.map(
                            (item, index) => (
                                <tr
                                    key={`${item.electionId}-${index}`}
                                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                >
                                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                                        {
                                            item.electionName
                                        }
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-600">
                                        <span className="font-semibold text-slate-900">
                                            {
                                                item.seatCode
                                            }
                                        </span>{" "}
                                        {
                                            item.seatName
                                        }
                                    </td>

                                    <td className="px-5 py-4 text-right text-sm font-semibold text-slate-900">
                                        {formatNumber(
                                            item.votes
                                        )}
                                    </td>

                                    <td className="px-5 py-4 text-right text-sm text-slate-600">
                                        {formatPercent(
                                            item.voteShare
                                        )}
                                    </td>

                                    <td className="px-5 py-4 text-right text-sm font-semibold text-slate-900">
                                        {item.isWinner
                                            ? "+"
                                            : "-"}
                                        {formatNumber(
                                            Math.abs(
                                                item.margin
                                            )
                                        )}
                                    </td>

                                    <td className="px-5 py-4 text-center">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                                item.isWinner
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-red-50 text-red-600"
                                            }`}
                                        >
                                            {item.isWinner
                                                ? "WIN"
                                                : "LOSS"}
                                        </span>
                                    </td>
                                </tr>
                            )
                        )}

                        {history.length ===
                            0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-5 py-10 text-center text-sm text-slate-500"
                                >
                                    No election history
                                    available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}