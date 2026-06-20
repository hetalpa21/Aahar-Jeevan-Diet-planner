import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Home, Users, Apple, LogOut, TrendingUp, Search } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import logo from "@/assets/logo.png";
import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { getInitials, toTitleCase } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

function SidebarIcon({ icon, label, active, to, onClick }: { icon: React.ReactNode; label: string; active?: boolean; to?: string; onClick?: () => void }) {
  const content = (
    <>
      {icon}
    </>
  );

  const className = "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition " +
    (active ? "bg-[#1b4d2e] text-white shadow-sm" : "text-[#b5b0ab] hover:bg-[#f5f3f0] hover:text-[#1a1a1a]");

  if (to) {
    return <Link to={to} title={label} className={className}>{content}</Link>;
  }
  return <button onClick={onClick} title={label} className={className}>{content}</button>;
}

export function AppSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const store = useStore();
  
  const [progressOpen, setProgressOpen] = useState(false);
  const [progressSearch, setProgressSearch] = useState("");

  const progressFiltered = useMemo(() => {
    if (!progressSearch.trim()) return store.patients;
    const q = progressSearch.toLowerCase();
    return store.patients.filter((p) => p.name.toLowerCase().includes(q) || p.contact?.includes(q));
  }, [store.patients, progressSearch]);

  const handleProgressClick = () => {
    const patientMatch = pathname.match(/\/(?:planner|progress)\/([^/]+)/);
    if (patientMatch && patientMatch[1]) {
      navigate({ to: "/progress/$patientId", params: { patientId: patientMatch[1] } });
    } else {
      setProgressOpen(true);
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[72px] flex-col items-center border-r border-[#e8e5e1] bg-white py-5 print:hidden">
      {/* Logo */}
      <Link to="/" className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[#e8e5e1] transition hover:scale-105 active:scale-95">
        <img src={logo} alt="Aahar Jeevan Logo" className="h-9 w-9 object-contain" />
      </Link>

      {/* Nav icons */}
      <nav className="flex flex-1 flex-col items-center gap-3">
        <SidebarIcon icon={<Home className="h-5 w-5" />} label="Home" active={pathname === "/"} to="/" />
        <SidebarIcon icon={<Users className="h-5 w-5" />} label="Clients" active={pathname.startsWith("/clients")} to="/clients" />
        <SidebarIcon icon={<Apple className="h-5 w-5" />} label="Catalogue" active={pathname.startsWith("/catalogue")} to="/catalogue" />
        <SidebarIcon icon={<TrendingUp className="h-5 w-5" />} label="Progress" active={pathname.startsWith("/progress")} onClick={handleProgressClick} />
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-3 pb-2">
        <button
          onClick={logout}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-[13px] font-bold text-red-700">
          S
        </div>
      </div>

      {/* Progress Patient Selector Dialog */}
      <Dialog open={progressOpen} onOpenChange={setProgressOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Select a Patient for Progress Tracker</DialogTitle></DialogHeader>
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search patient..." value={progressSearch} onChange={(e) => setProgressSearch(e.target.value)} className="h-9 pl-8 text-sm" />
          </div>
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {progressFiltered.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No patients found</p>
            ) : progressFiltered.map((p) => (
              <button key={p.id} onClick={() => { setProgressOpen(false); navigate({ to: "/progress/$patientId", params: { patientId: p.id } }); }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-muted"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f5e9] text-xs font-bold text-[#2e7d32]">{getInitials(p.name)}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{toTitleCase(p.name)}</p>
                  {p.contact && <p className="text-xs text-muted-foreground">{p.contact}</p>}
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
