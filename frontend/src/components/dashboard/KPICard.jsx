export default function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  borderColor = "border-t-blue-600",
  iconBgColor = "bg-blue-50 text-[#134074]"
}) {
  return (
    <div className={`group relative bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-t-4 ${borderColor} overflow-hidden`}>
      {/* Background ambient glow on hover */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg ${iconBgColor} group-hover:scale-110 transition-transform duration-200 shadow-2xs`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="relative z-10 mt-3">
        <p className="text-3xl font-black tracking-tight text-slate-900">{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
}