export default function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden animate-pulse">
      {/* Table Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex items-center gap-4">
        {Array.from({ length: columns }).map((_, index) => (
          <div
            key={`header-${index}`}
            className="h-3 bg-slate-200 rounded flex-1"
          ></div>
        ))}
      </div>

      {/* Table Body Rows */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="px-6 py-4 flex items-center gap-4"
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={`h-3.5 bg-slate-100 rounded flex-1 ${
                  colIndex === 0 ? "w-1/4" : "w-auto"
                }`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}