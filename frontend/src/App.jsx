import Sidebar from "./components/navigation/Sidebar";
import Topbar from "./components/navigation/Topbar";

function App() {
  return (
    <div className="min-h-screen bg-[#05070a] text-white">

      <Sidebar />

      <Topbar />

      <main className="ml-64 pt-16">

        <div className="p-6">

          <h1 className="text-2xl font-bold">
            Malaysia Electoral Intelligence System
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Explore electoral data, constituencies, parties and historical results.
          </p>

        </div>

      </main>

    </div>
  );
}

export default App;