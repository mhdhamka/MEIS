import {
    MapPin,
    ChevronLeft,
    ChevronRight,
    Eye,
} from "lucide-react";

export default function ConstituencyTable({
    data,
    loading,
    pagination,
    onSelect,
    onPageChange,
}) {

    if (loading) {
        return <LoadingTable />;
    }

    if (!data || data.length === 0) {
        return <EmptyTable />;
    }

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden transition-all duration-200">

            {/* TABLE HEADER */}

            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">

                <div>

                    <h3 className="text-sm font-bold text-slate-900">
                        Constituency Directory
                    </h3>

                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        {pagination.total.toLocaleString()} constituencies
                    </p>

                </div>

                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#134074] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full shadow-inner">
                    Page {pagination.page} / {pagination.totalPages}
                </span>

            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">

                <table className="w-full text-left border-collapse">

                    <thead>

                        <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">

                            <th className="px-6 py-3.5">
                                Code
                            </th>

                            <th className="px-6 py-3.5">
                                Constituency
                            </th>

                            <th className="px-6 py-3.5">
                                State
                            </th>

                            <th className="px-6 py-3.5">
                                Type
                            </th>

                            <th className="px-6 py-3.5">
                                Winner
                            </th>

                            <th className="px-6 py-3.5 text-right">
                                Margin
                            </th>

                            <th className="px-6 py-3.5">
                            </th>

                        </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100">

                        {data.map((item, index) => {

                            const code =
                                item.seat_code ??
                                item.code ??
                                item.code_parlimen ??
                                item.code_dun ??
                                item.id;

                            const name =
                                item.seat_name ??
                                item.name ??
                                item.constituency_name ??
                                item.parlimen ??
                                item.dun ??
                                "Unknown";

                            const state =
                                item.state_name ??
                                item.state ??
                                "—";

                            const type =
                                item.seat_type ??
                                item.type ??
                                "Parliament";

                            const party =
                                item.winner_party ??
                                item.dominant_party ??
                                item.party ??
                                item.winning_party ??
                                "—";

                            const margin = Number(
                                item.margin ??
                                item.majority ??
                                item.majority_margin ??
                                0
                            );

                            // Unique composite key to prevent collisions
                            const rowKey = [
                                item.id,
                                item.seat_code,
                                item.code,
                                item.code_parlimen,
                                item.code_dun,
                                index
                            ].filter(Boolean).join("-");

                            return (
                                <tr
                                    key={rowKey}
                                    className="hover:bg-slate-50/80 transition-colors duration-150 group"
                                >

                                    {/* CODE */}

                                    <td className="px-6 py-4">

                                        <span className="font-mono text-xs font-bold text-[#134074] bg-blue-50/60 border border-blue-100 px-2 py-1 rounded-md">
                                            {code}
                                        </span>

                                    </td>

                                    {/* NAME */}

                                    <td className="px-6 py-4">

                                        <button
                                            onClick={() =>
                                                onSelect(item)
                                            }
                                            className="text-left group/btn"
                                        >

                                            <p className="text-xs font-bold text-slate-900 group-hover/btn:text-[#134074] transition-colors">
                                                {name}
                                            </p>

                                        </button>

                                    </td>

                                    {/* STATE */}

                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">

                                            <MapPin
                                                size={13}
                                                className="text-slate-400"
                                            />

                                            {state}

                                        </div>

                                    </td>

                                    {/* TYPE */}

                                    <td className="px-6 py-4">

                                        <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/60 text-[10px] font-bold text-slate-600 shadow-sm">
                                            {type}
                                        </span>

                                    </td>

                                    {/* WINNER */}

                                    <td className="px-6 py-4">

                                        <span className="text-xs font-bold text-slate-800">
                                            {party}
                                        </span>

                                    </td>

                                    {/* MARGIN */}

                                    <td className="px-6 py-4 text-right">

                                        <span
                                            className={`inline-block font-mono text-xs font-bold px-2 py-0.5 rounded ${
                                                margin < 500
                                                    ? "bg-red-50 text-red-600 border border-red-100"
                                                    : margin < 2000
                                                    ? "bg-orange-50 text-orange-600 border border-orange-100"
                                                    : margin < 10000
                                                    ? "bg-amber-50 text-amber-600 border border-amber-100"
                                                    : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                            }`}
                                        >
                                            +{margin.toLocaleString()}
                                        </span>

                                    </td>

                                    {/* ACTION */}

                                    <td className="px-6 py-4 text-right">

                                        <button
                                            onClick={() =>
                                                onSelect(item)
                                            }
                                            className="p-2 rounded-xl text-slate-400 hover:text-[#134074] hover:bg-blue-50/80 border border-transparent hover:border-blue-100 transition-all shadow-sm"
                                            title="View constituency"
                                        >

                                            <Eye size={15} />

                                        </button>

                                    </td>

                                </tr>
                            );
                        })}

                    </tbody>

                </table>

            </div>

            {/* PAGINATION */}

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">

                <p className="text-[11px] text-slate-500 font-medium">

                    Showing{" "}

                    <strong className="text-slate-800">
                        {(pagination.page - 1) *
                            pagination.limit +
                            1}
                    </strong>

                    {" "}–{" "}

                    <strong className="text-slate-800">
                        {Math.min(
                            pagination.page *
                                pagination.limit,
                            pagination.total
                        )}
                    </strong>

                    {" "}of{" "}

                    <strong className="text-slate-800">
                        {pagination.total}
                    </strong>

                </p>

                <div className="flex items-center gap-1.5">

                    <button
                        disabled={pagination.page <= 1}
                        onClick={() =>
                            onPageChange(
                                pagination.page - 1
                            )
                        }
                        className="p-2 rounded-xl border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
                    >
                        <ChevronLeft size={15} />
                    </button>

                    <button
                        disabled={
                            pagination.page >=
                            pagination.totalPages
                        }
                        onClick={() =>
                            onPageChange(
                                pagination.page + 1
                            )
                        }
                        className="p-2 rounded-xl border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
                    >
                        <ChevronRight size={15} />
                    </button>

                </div>

            </div>

        </div>
    );
}


// ============================================================
// LOADING
// ============================================================

function LoadingTable() {

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden p-6 shadow-sm">

            <div className="animate-pulse space-y-4">

                <div className="h-8 bg-slate-200/60 rounded-xl w-1/4 mb-6" />

                {[1, 2, 3, 4, 5, 6].map(
                    (row) => (

                        <div
                            key={row}
                            className="h-14 border border-slate-100 rounded-xl bg-slate-50/60"
                        />

                    )
                )}

            </div>

        </div>
    );
}


// ============================================================
// EMPTY
// ============================================================

function EmptyTable() {

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-16 text-center shadow-sm">

            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">

                <MapPin
                    size={20}
                    className="text-[#134074]"
                />

            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-900">
                No constituencies found
            </h3>

            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Try changing your search keywords or filter settings to display results.
            </p>

        </div>
    );
}