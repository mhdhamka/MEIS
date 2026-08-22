import { useEffect, useState } from "react";
import { 
  Building2, 
  Users, 
  Vote, 
  MapPin, 
  Activity, 
  Database, 
  Server, 
  TrendingUp, 
  ShieldCheck 
} from "lucide-react";

export default function Dashboard() {
  // Local state for future API integration with your FastAPI backend
  const [stats, setStats] = useState({
    states: 16,
    parties: 112,
    seats: 3096,
    candidates: 21861,
  });

  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Page Title & Context Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-slate-200">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-[#134074] uppercase tracking-wider mb-1">
            System Overview
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Electoral Intelligence Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Real-time telemetry, historical seat analytics, and constituency distribution indices.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Pipeline Synchronized
          </span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs border-t-4 border-t-[#134074]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">States & Territories</span>
            <MapPin size={18} className="text-[#134074]" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.states}</p>
          <p className="text-xs text-slate-500 mt-1">Federal & State jurisdictions</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs border-t-4 border-t-[#134074]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Parties</span>
            <Vote size={18} className="text-[#134074]" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.parties}</p>
          <p className="text-xs text-slate-500 mt-1">Coalitions and independent entities</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs border-t-4 border-t-[#134074]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Seats</span>
            <Building2 size={18} className="text-[#134074]" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.seats.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Parliamentary (Dewan Rakyat) & DUN</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs border-t-4 border-t-[#134074]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Candidates Logged</span>
            <Users size={18} className="text-[#134074]" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats.candidates.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Historical electoral nominees</p>
        </div>

      </div>

      {/* Middle Grid: Party Seat Distribution & System Status Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Party Distribution Box */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#134074]" />
              Party Seat Distribution Overview
            </h3>
            <span className="text-xs text-slate-500">Top Contending Coalitions</span>
          </div>
          
          <div className="space-y-4 py-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Pakatan Harapan (PH)</span>
                <span>82 Seats</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-[#134074] h-full rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Perikatan Nasional (PN)</span>
                <span>74 Seats</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: "58%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Barisan Nasional (BN)</span>
                <span>30 Seats</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full rounded-full" style={{ width: "30%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>GPS / Other Coalitions</span>
                <span>37 Seats</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "35%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* System Telemetry & Status Box */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
              <Activity size={16} className="text-emerald-600" />
              System Telemetry Status
            </h3>
            
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Server size={15} className="text-slate-500" />
                  <span className="text-xs font-medium text-slate-700">FastAPI REST Core</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> OPERATIONAL
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Database size={15} className="text-slate-500" />
                  <span className="text-xs font-medium text-slate-700">MySQL Database Instance</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> CONNECTED
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={15} className="text-slate-500" />
                  <span className="text-xs font-medium text-slate-700">ETL Pipelines & Scripts</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> READY
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">MEIS Intelligence Core v1.0.0</p>
          </div>
        </div>

      </div>

      {/* Electoral Map Quick View Banner Container */}
      <div className="bg-[#0b2545] text-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffb703]">Geospatial Intelligence</span>
          <h4 className="text-lg font-bold mt-0.5">Interactive Constituency Mapping Module</h4>
          <p className="text-xs text-slate-300 mt-1">Explore constituency boundaries, demographic breakdowns, and polling district boundaries across Malaysia.</p>
        </div>
        <a 
          href="/map" 
          className="px-4 py-2 bg-[#ffb703] text-slate-900 font-semibold text-xs rounded-md shadow-xs hover:bg-[#faedcd] transition-colors whitespace-nowrap"
        >
          Launch Electoral Map &rarr;
        </a>
      </div>

    </div>
  );
}