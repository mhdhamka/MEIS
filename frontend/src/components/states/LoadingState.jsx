import { LoaderCircle } from "lucide-react";

export default function LoadingState({
  title = "Loading data...",
  message = "Retrieving electoral intelligence from MEIS.",
}) {
  return (
    <div className="min-h-[300px] flex items-center justify-center">

      <div className="text-center">

        <LoaderCircle
          size={32}
          className="mx-auto text-[#134074] animate-spin"
        />

        <h3 className="mt-4 text-sm font-bold text-slate-800">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {message}
        </p>

      </div>

    </div>
  );
}