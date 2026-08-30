import {
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function ErrorState({
  title = "Unable to load data",
  message = "An unexpected error occurred.",
  onRetry,
}) {
  return (
    <div className="min-h-[300px] flex items-center justify-center">

      <div className="max-w-md w-full bg-white border border-red-200 rounded-xl p-6 text-center shadow-sm">

        <div className="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center">

          <AlertTriangle
            size={22}
            className="text-red-600"
          />

        </div>

        <h3 className="mt-4 text-base font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          {message}
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#134074] text-white text-xs font-semibold hover:bg-[#0b2545]"
          >
            <RefreshCw size={14} />

            Retry
          </button>
        )}

      </div>

    </div>
  );
}