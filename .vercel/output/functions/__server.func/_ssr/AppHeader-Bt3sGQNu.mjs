import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useRouterState, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Bell, C as CircleUser } from "../_libs/lucide-react.mjs";
function AppHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isDash = pathname === "/";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 bg-[#00361a] shadow-[0_4px_20px_-4px_rgba(27,77,46,0.25)] print:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-5 sm:px-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center gap-2.5 group", "aria-label": "Aahar Jeevan home", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[28px] font-bold tracking-tight text-white sm:text-[32px]", style: { fontFamily: "'Manrope', sans-serif" }, children: "Aahar Jeevan" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden items-center gap-8 sm:flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavLink, { to: "/", label: "Home", active: isDash }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavLink, { to: "/clients", label: "Client List", active: pathname.startsWith("/clients") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavLink, { to: "/catalogue", label: "Food Catalogue", active: pathname.startsWith("/catalogue") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white active:scale-90", "aria-label": "Notifications", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white active:scale-90", "aria-label": "Account", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { className: "h-5 w-5" }) })
    ] })
  ] }) });
}
function NavLink({ to, label, active }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to,
      className: "relative pb-1 text-[14px] font-semibold tracking-wide transition-colors " + (active ? "text-white border-b-2 border-white" : "text-white/70 hover:text-white"),
      children: label
    }
  );
}
export {
  AppHeader as A
};
