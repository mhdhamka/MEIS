import { ShieldAlert, CheckCircle2, Calendar, Users, Vote, Landmark } from "lucide-react";
import EmptyState from "../states/EmptyState";

export default function ElectionSnapshotCard({ snapshot = null, getPartyBarColor }) {
  if (!snapshot) {
    return (
      <div className="lg:col-span-2 p-6 rounded-3xl bg-white/70 backdrop-blur-2xl border border-white/60 shadow-xl">
        <EmptyState title="No active snapshot" message="Electoral intelligence snapshot telemetry is currently unassigned." />
      </div>
    );
  }

  const isHungParliament = snapshot.is_hung_parliament || snapshot.seats_won_highest < (snapshot.total_seats / 2);

  return (
    <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/90 via-white/60 to-white/40 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-blue-900/10 text-slate-900 transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-200/50">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-700 rounded-full text-[10px] uppercase tracking-[0.2em] font-black border border-indigo-500/20 shadow-2xs">
              Current Electoral Snapshot
            </span>
            {isHungParliament && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-700 rounded-full text-[10px] font-bold border border-amber-500/20">
                <ShieldAlert size={12} /> Hung Parliament Indicator
              </span>
            )}
          </div>
          <h3 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            {snapshot.election_name ?? "GE-15 Federal Election"}
          </h3>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
            <Calendar size={13} className="text-indigo-600" /> {snapshot.election_date ?? "19 Nov 2022"}
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/70 shadow-inner">
          <div className="px-3 py-1.5 bg-white rounded-xl shadow-2xs text-center">
            <span className="block text-[9px] uppercase font-bold text-slate-400">Seats</span>
            <span className="font-mono font-black text-xs text-slate-800">{snapshot.total_seats ?? 222}</span>
          </div>
          <div className="px-3 py-1.5 bg-white rounded-xl shadow-2xs text-center">
            <span className="block text-[9px] uppercase font-bold text-slate-400">Turnout</span>
            <span className="font-mono font-black text-xs text-indigo-600">{snapshot.turnout ?? "74.7%"}</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80 shadow-2xs backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Landmark size={12} className="text-indigo-500" /> Contested
          </span>
          <span className="text-sm font-black text-slate-800 mt-1 block font-mono">{snapshot.total_seats ?? 222} Seats</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80 shadow-2xs backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Users size={12} className="text-indigo-500" /> Candidates
          </span>
          <span className="text-sm font-black text-slate-800 mt-1 block font-mono">{snapshot.total_candidates ?? "945"}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80 shadow-2xs backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Vote size={12} className="text-indigo-500" /> Total Votes
          </span>
          <span className="text-sm font-black text-slate-800 mt-1 block font-mono">{snapshot.total_votes ?? "15.5M"}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80 shadow-2xs backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-500" /> Verification
          </span>
          <span className="text-sm font-black text-emerald-600 mt-1 block font-mono">100% Audited</span>
        </div>
      </div>

      {/* Party Seats Breakdown List */}
      <div className="space-y-2.5">
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 block mb-1">
          Winning Party Seat Allocation
        </span>

        {(snapshot.parties || [
          { name: "PH", seats: 82 },
          { name: "PN", seats: 74 },
          { name: "BN", seats: 30 },
          { name: "GPS", seats: 23 },
          { name: "Others", seats: 13 }
        ]).map((party, index) => {
          const seatCount = Number(party.seats ?? 0);
          const totalSeats = Number(snapshot.total_seats ?? 222);
          const percent = (seatCount / totalSeats) * 100;
          const color = getPartyBarColor ? getPartyBarColor(party.name) : "#134074";

          return (
            <div key={index} className="p-3 rounded-xl bg-white/60 border border-white/80 shadow-2xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-32 shrink-0">
                <span className="w-2.5 h-2.5 rounded-md shadow-2xs" style={{ backgroundColor: color }} />
                <span className="text-xs font-bold text-slate-800">{party.name}</span>
              </div>
              <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: color }} />
              </div>
              <div className="font-mono text-right w-20 shrink-0">
                <span className="text-xs font-black text-indigo-900">{seatCount}</span>
                <span className="text-[10px] text-slate-400 ml-1">SEATS</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}