import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, UserCircle } from "lucide-react";
import logo from "@/assets/logo.png";

export function AppHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isDash = pathname === "/";

  return (
    <header className="sticky top-0 z-30 bg-[#00361a] shadow-[0_4px_20px_-4px_rgba(27,77,46,0.25)] print:hidden">
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-5 sm:px-10">
        {/* Brand name */}
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="Aahar Jeevan home">
          <span className="text-[28px] font-bold tracking-tight text-white sm:text-[32px]" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Aahar Jeevan
          </span>
        </Link>

        {/* Navigation — centered */}
        <nav className="hidden items-center gap-8 sm:flex">
          <NavLink to="/" label="Home" active={isDash} />
          <NavLink to="/clients" label="Client List" active={pathname.startsWith("/clients")} />
          <NavLink to="/catalogue" label="Food Catalogue" active={pathname.startsWith("/catalogue")} />
        </nav>

        {/* Trailing icons */}
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white active:scale-90" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white active:scale-90" aria-label="Account">
            <UserCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={
        "relative pb-1 text-[14px] font-semibold tracking-wide transition-colors " +
        (active
          ? "text-white border-b-2 border-white"
          : "text-white/70 hover:text-white")
      }
    >
      {label}
    </Link>
  );
}