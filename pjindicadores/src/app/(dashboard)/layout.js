import Sidebar from '../components/layout/Sidebar.jsx';
import TopBar from '../components/layout/TopBar.jsx';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0f111a]">
      {/* Sidebar lateral (Fuente [5], [6]) */}
      <Sidebar />

      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        {/* Topbar superior (Fuente [7], [2]) */}
        <TopBar />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
