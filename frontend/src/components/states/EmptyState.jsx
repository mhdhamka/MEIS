import {
  SearchX,
} from "lucide-react";

export default function EmptyState({
  title = "No results found",
  message = "Try adjusting your filters or search query.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="min-h-[250px] flex items-center justify-center">

      <div className="text-center max-w-sm">

        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center">

          <SearchX
            size={22}
            className="text-slate-500"
          />

        </div>

        <h3 className="mt-4 text-sm font-bold text-slate-800">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {message}
        </p>

        {actionLabel && (
          <button
            onClick={onAction}
            className="mt-4 px-4 py-2 text-xs font-semibold rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            {actionLabel}
          </button>
        )}

      </div>

    </div>
  );
}