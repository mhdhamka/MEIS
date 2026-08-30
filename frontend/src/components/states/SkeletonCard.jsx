export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs animate-pulse">
      {/* Header / Title line */}
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-6 w-6 bg-slate-200 rounded-md"></div>
      </div>

      {/* Main content block */}
      <div className="mt-4 space-y-2">
        <div className="h-7 bg-slate-200 rounded w-1/2"></div>
        <div className="h-3 bg-slate-100 rounded w-3/4"></div>
      </div>

      {/* Footer detail */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-3 bg-slate-100 rounded w-1/4"></div>
        <div className="h-3 bg-slate-100 rounded w-1/5"></div>
      </div>
    </div>
  );
}