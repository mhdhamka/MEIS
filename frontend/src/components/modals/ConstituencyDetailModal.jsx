import { useState } from "react";
import { X, Building2, Users, ExternalLink, Award, PieChart, MapPin, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";

export default function ConstituencyDetailModal({ constituency, onClose }) {
  const [showDistricts, setShowDistricts] = useState(false);

  if (!constituency) return null;

  const constituencyName = constituency.seat_name ?? constituency.name ?? "Unknown Constituency";
  const totalVoters = constituency.total_votes ?? constituency.electorate;
  const stateRegion = constituency.state_name ?? constituency.state;
  const dominantParty = constituency.dominant_party ?? constituency.party ?? constituency.coalition;
  
  const incumbentMP = constituency.incumbent ?? constituency.mp_name ?? constituency.representative;
  const majorityVotes = constituency.majority ?? constituency.majority_votes ?? constituency.majority_margin;

  const demographics = {
    malay: constituency.pct_malay ?? constituency.malay_percentage,
    chinese: constituency.pct_chinese ?? constituency.chinese_percentage,
    bumi: constituency.pct_bumi ?? constituency.bumi_percentage,
    others: constituency.pct_others ?? constituency.others_percentage
  };
  const hasDemographics = Object.values(demographics).every((val) => val != null && !isNaN(val));

  const pollingDistricts = constituency.polling_districts ?? constituency.dms ?? constituency.daerah_mengundi ?? [];

  // Synchronized party badge styling supporting regional coalitions and names
  const getPartyBadgeColor = (partyName) => {
    const p = (partyName ?? "").trim().toUpperCase();
    if (p.includes("GPS") || p.includes("PBB") || p.includes("SUPP") || p.includes("PRS") || p.includes("PDP")) {
      return "bg-amber-100 text-amber-800 border-amber-200";
    }
    if (p.includes("PH") || p.includes("PKR") || p.includes("DAP") || p.includes("AMANAH")) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    if (p.includes("PN") || p.includes("PAS") || p.includes("BERSATU") || p.includes("GERAKAN")) {
      return "bg-sky-100 text-sky-800 border-sky-200";
    }
    if (p.includes("BN") || p.includes("UMNO") || p.includes("MCA") || p.includes("MIC")) {
      return "bg-red-100 text-red-800 border-red-200";
    }
    if (p.includes("GRS")) {
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
    if (p.includes("WARISAN")) {
      return "bg-purple-100 text-purple-800 border-purple-200";
    }
    return "bg-slate-100 text-slate-800 border-slate-200";
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#134074] bg-blue-50 px-2.5 py-1 rounded-md">
                Constituency Intelligence Profile
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">{constituencyName}</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content Body */}
          <div className="mt-6 space-y-4">
            
            {/* Core Metrics Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/50">
                <span className="text-slate-500 flex items-center gap-2 font-medium">
                  <Users size={15} className="text-slate-400" /> Total Registered Voters
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {totalVoters != null && totalVoters > 0 ? Number(totalVoters).toLocaleString() : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/50">
                <span className="text-slate-500 flex items-center gap-2 font-medium">
                  <Building2 size={15} className="text-slate-400" /> State Region
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {stateRegion ?? "N/A"}
                </span>
              </div>
              {dominantParty && dominantParty !== "N/A" && (
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-slate-500 flex items-center gap-2 font-medium">
                    <ShieldCheck size={15} className="text-slate-400" /> Dominant Party
                  </span>
                  <span className={`font-bold text-xs px-2 py-0.5 rounded-full border ${getPartyBadgeColor(dominantParty)}`}>
                    {dominantParty}
                  </span>
                </div>
              )}
            </div>

            {/* Incumbency & Majority Badge Card */}
            {(incumbentMP || majorityVotes != null) && (
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#134074]">
                  <Award size={16} className="text-amber-500" /> Incumbency & Majority Margin
                </div>
                {incumbentMP && (
                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-slate-600">Current Representative:</span>
                    <span className="font-bold text-slate-800">{incumbentMP}</span>
                  </div>
                )}
                {majorityVotes != null && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Majority Margin:</span>
                    <span className="font-bold text-emerald-600">+{Number(majorityVotes).toLocaleString()} votes</span>
                  </div>
                )}
              </div>
            )}

            {/* Demographics Segmented Bar */}
            {hasDemographics && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <PieChart size={15} className="text-slate-400" /> Voter Demographics Estimate
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                  <div style={{ width: `${demographics.malay}%` }} className="bg-blue-600 h-full" title={`Malay: ${demographics.malay}%`} />
                  <div style={{ width: `${demographics.chinese}%` }} className="bg-amber-500 h-full" title={`Chinese: ${demographics.chinese}%`} />
                  <div style={{ width: `${demographics.bumi}%` }} className="bg-emerald-500 h-full" title={`Bumiputera: ${demographics.bumi}%`} />
                  <div style={{ width: `${demographics.others}%` }} className="bg-purple-400 h-full" title={`Others: ${demographics.others}%`} />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-600" /> Malay ({demographics.malay}%)</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Chinese ({demographics.chinese}%)</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Bumiputera ({demographics.bumi}%)</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400" /> Others ({demographics.others}%)</div>
                </div>
              </div>
            )}

            {/* Polling Districts Collapsible Section */}
            {pollingDistricts.length > 0 && (
              <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setShowDistricts(!showDistricts)}
                  className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <MapPin size={15} className="text-[#134074]" /> Polling Districts ({pollingDistricts.length} DMs)
                  </span>
                  {showDistricts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {showDistricts && (
                  <div className="p-3 border-t border-slate-200/60 max-h-36 overflow-y-auto space-y-1.5 bg-slate-50/50">
                    {pollingDistricts.map((dm, idx) => (
                      <div key={idx} className="text-xs text-slate-600 py-1 px-2.5 bg-white rounded-md border border-slate-100 shadow-2xs">
                        {typeof dm === "string" ? dm : dm.name ?? dm.dm_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Footer Link */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <a
            href="https://mysprsemak.spr.gov.my/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#134074] hover:text-blue-700 hover:underline transition"
          >
            Verify Official Record via MySPR Semak 
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}