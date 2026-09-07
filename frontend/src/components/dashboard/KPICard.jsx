export default function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  borderColor = "border-t-blue-600",
  iconBgColor = "bg-blue-500/10 border border-blue-500/20 text-[#134074]"
}) {
  return (
    <div className={`group relative p-6 rounded-3xl bg-gradient-to-br from-white/80 via-white/50 to-white/30 backdrop-blur-2xl border border-white/60 shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-t-4 ${borderColor} overflow-hidden`}>
      {/* Background ambient glow effect on hover */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-800 transition-colors">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-2xl ${iconBgColor} backdrop-blur-md group-hover:scale-110 transition-transform duration-300 shadow-xs`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="relative z-10 mt-4">
        <p className="text-3xl font-black tracking-tight text-slate-900">{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{subtitle}</p>
        )}
      </div>
    </div>
  );
}