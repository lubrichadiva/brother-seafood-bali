import { NavLink, Outlet } from "react-router-dom";
import { FileText, ClipboardList, Settings2, Shell, FileSpreadsheet, CalendarDays } from "lucide-react";

const links = [
  { to: "/", label: "Proposals", icon: FileText, id: "nav-proposals" },
  { to: "/tracker", label: "TA Tracker", icon: ClipboardList, id: "nav-tracker" },
  { to: "/reservations", label: "Reservations", icon: CalendarDays, id: "nav-reservations" },
  { to: "/reports", label: "Report", icon: FileSpreadsheet, id: "nav-reports" },
  { to: "/settings", label: "Logo & Gallery", icon: Settings2, id: "nav-settings" },
];

export default function Layout() {
  return (
    <div className="relative z-10 min-h-screen">
      <header className="no-print sticky top-0 z-40 bg-[#1A1513] text-[#FAF8F5] border-b-2 border-[#C9A227]">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-6">
          <NavLink to="/" className="flex items-center gap-3" data-testid="nav-brand">
            <span className="w-9 h-9 rounded-full bg-[#8B1A1A] border border-[#C9A227] flex items-center justify-center">
              <Shell className="w-4 h-4 text-[#C9A227]" />
            </span>
            <span className="leading-tight">
              <span className="font-display font-bold tracking-wide text-[#C9A227] block text-sm sm:text-base">BROTHER SEAFOOD BALI</span>
              <span className="text-[10px] uppercase tracking-[.2em] text-[#FAF8F5]/60 hidden sm:block">Travel Agent Proposal Studio</span>
            </span>
          </NavLink>
          <nav className="flex items-center gap-1">
            {links.map(({ to, label, icon: Icon, id }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                data-testid={id}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
                    isActive ? "bg-[#C9A227] text-[#1A1513] font-bold" : "text-[#FAF8F5]/80 hover:bg-white/10"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
