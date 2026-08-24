import { X, Building2, Users, ShieldCheck } from "lucide-react";

export default function ConstituencyDetailModal({ constituency, onClose }) {
  if (!constituency) return null;

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#134074] bg-blue-50 px-2 py-0.5 rounded">
                Constituency Intelligence Profile
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{constituency.name}</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5"><Users size={14} /> Total Registered Voters</span>
                <span className="font-bold text-slate-800">{constituency.electorate?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5"><Building2 size={14} /> State Region</span>
                <span className="font-bold text-slate-800">{constituency.state}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 text-center">
          <a
            href="https://mysprsemak.spr.gov.my/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-[#134074] hover:underline"
          >
            Verify Official Record via MySPR Semak →
          </a>
        </div>
      </div>
    </div>
  );
}