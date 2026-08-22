import Sidebar from "./components/navigation/Sidebar";
import Topbar from "./components/navigation/Topbar";

function App() {
  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800">

      <Sidebar />

      <Topbar />

      <main className="ml-64 pt-16">

        <div className="p-8">

          <div className="border-b border-slate-200 pb-4 mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Malaysia Electoral Intelligence System
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Explore electoral data, constituencies, parties and historical results.
            </p>
          </div>

          {/* Quick Stats / Content Canvas Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs border-t-4 border-t-[#134074]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Database</h3>
              <p className="text-2xl font-bold text-slate-800 mt-2">GE15 & State Records</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs border-t-4 border-t-[#134074]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Constituencies</h3>
              <p className="text-2xl font-bold text-slate-800 mt-2">Federal & State Seats</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs border-t-4 border-t-[#134074]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Analytics Engine</h3>
              <p className="text-2xl font-bold text-emerald-600 mt-2">Operational</p>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}

export default App;