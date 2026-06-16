import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, f as useBlocker } from "../_libs/tanstack__react-router.mjs";
import { f as Route, u as useStore, B as Button, l as logo, g as DAYS, I as Input, F as FoodDialog, L as Label } from "./router-BL5U29WJ.mjs";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-C9s_HXwT.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { H as House, A as ArrowRight, i as Undo2, R as Redo2, j as Copy, k as Check, f as ArrowLeft, l as Printer, S as Search, d as Plus, P as Pencil, c as Trash2, X, m as CircleCheck, I as IndianRupee } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./server-BVPxk9Ny.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
function Planner() {
  const {
    patientId
  } = Route.useParams();
  const navigate = useNavigate();
  const store = useStore();
  const patient = store.patients.find((p) => p.id === patientId);
  const [plan, setPlan] = reactExports.useState(null);
  const [loadingPlan, setLoadingPlan] = reactExports.useState(true);
  const [dirty, setDirty] = reactExports.useState(false);
  const blocker = useBlocker({
    shouldBlockFn: () => dirty,
    enableBeforeUnload: dirty,
    withResolver: true
  });
  const [day, setDay] = reactExports.useState("Mon");
  const [search, setSearch] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("All");
  const [step, setStep] = reactExports.useState("planner");
  const [saving, setSaving] = reactExports.useState(false);
  const [deleteFoodTarget, setDeleteFoodTarget] = reactExports.useState(null);
  const [copyPopover, setCopyPopover] = reactExports.useState(false);
  const [copyTargets, setCopyTargets] = reactExports.useState([]);
  const [foodDialog, setFoodDialog] = reactExports.useState({
    open: false,
    food: null
  });
  reactExports.useEffect(() => {
    async function loadPlan() {
      try {
        const p = await store.getPlanForPatient(patientId);
        setPlan(p);
      } catch (err) {
        toast.error("Failed to load plan: " + err.message);
      } finally {
        setLoadingPlan(false);
      }
    }
    loadPlan();
  }, [patientId, store.patients.length]);
  const currentDay = plan?.meals.find((m) => m.day === day);
  const categories = reactExports.useMemo(() => {
    const set = new Set(store.foods.map((f) => f.category ?? "Other"));
    return ["All", ...Array.from(set)];
  }, [store.foods]);
  const filteredFoods = reactExports.useMemo(() => {
    return store.foods.filter((f) => {
      const matchQ = f.name.toLowerCase().includes(search.toLowerCase());
      const matchC = category === "All" || (f.category ?? "Other") === category;
      return matchQ && matchC;
    });
  }, [store.foods, search, category]);
  const historyRef = reactExports.useRef([]);
  const futureRef = reactExports.useRef([]);
  const [historyLen, setHistoryLen] = reactExports.useState(0);
  const [futureLen, setFutureLen] = reactExports.useState(0);
  function update(newPlan) {
    if (plan) {
      historyRef.current = [...historyRef.current, plan];
      setHistoryLen(historyRef.current.length);
    }
    futureRef.current = [];
    setFutureLen(0);
    setPlan({
      ...newPlan,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    setDirty(true);
  }
  const undo = reactExports.useCallback(() => {
    if (historyRef.current.length === 0 || !plan) return;
    const prev = historyRef.current[historyRef.current.length - 1];
    historyRef.current = historyRef.current.slice(0, -1);
    setHistoryLen(historyRef.current.length);
    futureRef.current = [...futureRef.current, plan];
    setFutureLen(futureRef.current.length);
    setPlan(prev);
    setDirty(true);
  }, [plan]);
  const redo = reactExports.useCallback(() => {
    if (futureRef.current.length === 0 || !plan) return;
    const next = futureRef.current[futureRef.current.length - 1];
    futureRef.current = futureRef.current.slice(0, -1);
    setFutureLen(futureRef.current.length);
    historyRef.current = [...historyRef.current, plan];
    setHistoryLen(historyRef.current.length);
    setPlan(next);
    setDirty(true);
  }, [plan]);
  reactExports.useEffect(() => {
    function handleKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "z" && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [undo, redo]);
  function addItemToSlot(slot, food, portion) {
    if (!plan) return;
    const meals = plan.meals.map((m) => m.day !== day ? m : {
      ...m,
      slots: m.slots.map((s) => s.slotName !== slot ? s : {
        ...s,
        items: [...s.items, {
          foodId: food.id,
          portion: portion ?? food.serving
        }]
      })
    });
    update({
      ...plan,
      meals
    });
  }
  function removeItem(slot, idx) {
    if (!plan) return;
    const meals = plan.meals.map((m) => m.day !== day ? m : {
      ...m,
      slots: m.slots.map((s) => s.slotName !== slot ? s : {
        ...s,
        items: s.items.filter((_, i) => i !== idx)
      })
    });
    update({
      ...plan,
      meals
    });
  }
  function setSlotTime(slot, time) {
    if (!plan) return;
    const meals = plan.meals.map((m) => m.day !== day ? m : {
      ...m,
      slots: m.slots.map((s) => s.slotName !== slot ? s : {
        ...s,
        time
      })
    });
    update({
      ...plan,
      meals
    });
  }
  function addSlot() {
    const name = window.prompt("Enter slot name (e.g. Mid-Morning Snack):");
    if (!name?.trim()) return;
    const trimmed = name.trim();
    if (!plan) return;
    const exists = plan.meals.find((m) => m.day === day)?.slots.some((s) => s.slotName === trimmed);
    if (exists) {
      toast.error(`Slot "${trimmed}" already exists`);
      return;
    }
    const meals = plan.meals.map((m) => ({
      ...m,
      slots: [...m.slots, {
        slotName: trimmed,
        time: "",
        items: []
      }]
    }));
    update({
      ...plan,
      meals
    });
    toast.success(`Added slot "${trimmed}"`);
  }
  function renameSlot(oldName) {
    const newName = window.prompt(`Rename "${oldName}" to:`, oldName);
    if (!newName?.trim() || newName.trim() === oldName) return;
    const trimmed = newName.trim();
    if (!plan) return;
    const exists = plan.meals.find((m) => m.day === day)?.slots.some((s) => s.slotName === trimmed);
    if (exists) {
      toast.error(`Slot "${trimmed}" already exists`);
      return;
    }
    const meals = plan.meals.map((m) => ({
      ...m,
      slots: m.slots.map((s) => s.slotName === oldName ? {
        ...s,
        slotName: trimmed
      } : s)
    }));
    update({
      ...plan,
      meals
    });
    toast.success(`Renamed to "${trimmed}"`);
  }
  function deleteSlot(slotName) {
    if (!plan) return;
    if (!window.confirm(`Delete slot "${slotName}" from all days? Items in it will be lost.`)) return;
    const meals = plan.meals.map((m) => ({
      ...m,
      slots: m.slots.filter((s) => s.slotName !== slotName)
    }));
    update({
      ...plan,
      meals
    });
    toast.success(`Removed slot "${slotName}"`);
  }
  function duplicateDayTo(targets) {
    if (!plan || targets.length === 0) return;
    const source = plan.meals.find((m) => m.day === day);
    const meals = plan.meals.map((m) => targets.includes(m.day) ? {
      ...source,
      day: m.day
    } : m);
    update({
      ...plan,
      meals
    });
    toast.success(`Copied ${day} → ${targets.join(", ")}`);
    setCopyPopover(false);
    setCopyTargets([]);
  }
  async function save(asDraft) {
    if (!plan) return;
    const next = {
      ...plan,
      isDraft: asDraft,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      setSaving(true);
      const saved = await store.savePlan(next);
      setPlan(saved);
      setDirty(false);
      toast.success(asDraft ? "Draft saved" : "Plan saved");
    } catch (err) {
      toast.error("Failed to save plan: " + err.message);
    } finally {
      setSaving(false);
    }
  }
  async function saveAndNext() {
    if (!plan) return;
    const next = {
      ...plan,
      isDraft: false,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      setSaving(true);
      const saved = await store.savePlan(next);
      setPlan(saved);
      setDirty(false);
      setStep("review");
      toast.success("Plan saved! Review payment & export.");
    } catch (err) {
      toast.error("Failed to save plan: " + err.message);
    } finally {
      setSaving(false);
    }
  }
  async function handlePaymentUpdate(status, totalAmount, amountReceived) {
    if (!patient) return;
    try {
      await store.updatePatient(patient.id, {
        paymentStatus: status,
        totalAmount,
        amountReceived
      });
      toast.success(`Payment status updated to ${status}`);
    } catch (err) {
      toast.error("Failed to update payment: " + err.message);
    }
  }
  function goHome() {
    navigate({
      to: "/"
    });
  }
  function exportPDF() {
    window.print();
  }
  if (store.loading || loadingPlan) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground animate-pulse text-lg", children: "Loading plan details..." }) });
  }
  if (!patient || !plan || !currentDay) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Patient or plan data not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4", onClick: () => navigate({
        to: "/clients"
      }), children: "Back to Clients" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 border-b border-border bg-[var(--header-bg)]/95 backdrop-blur-md shadow-sm print:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: goHome, className: "flex items-center gap-3 group rounded-lg px-2.5 py-1.5 text-[var(--dark-green)] transition hover:bg-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "", width: 44, height: 44, className: "h-11 w-11 rounded-xl object-contain shadow-sm ring-1 ring-border/50 transition group-hover:shadow-md group-hover:scale-[1.04]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:block text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold leading-tight text-[var(--dark-green)]", children: "Aahar Jeevan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[11px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-3 w-3" }),
              "Home"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-4 w-4 sm:hidden" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden items-center gap-2 sm:flex", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition " + (step === "planner" ? "bg-[var(--leaf-green)] text-white" : "bg-muted text-muted-foreground"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]", children: "1" }),
            "Diet Plan"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition " + (step === "review" ? "bg-[var(--leaf-green)] text-white" : "bg-muted text-muted-foreground"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]", children: "2" }),
            "Payment & Export"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: step === "planner" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mr-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: undo, disabled: historyLen === 0, title: "Undo (Ctrl+Z)", className: "rounded-md p-1.5 text-muted-foreground transition hover:bg-muted disabled:opacity-30 disabled:pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: redo, disabled: futureLen === 0, title: "Redo (Ctrl+Y)", className: "rounded-md p-1.5 text-muted-foreground transition hover:bg-muted disabled:opacity-30 disabled:pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Redo2, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => save(true), disabled: saving, children: saving ? "Saving..." : "Save as Draft" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => {
              setCopyPopover(!copyPopover);
              setCopyTargets([]);
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "mr-1 h-4 w-4" }),
              "Duplicate Day"
            ] }),
            copyPopover && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 top-full z-30 mt-1 w-60 rounded-xl border border-border bg-card p-3 shadow-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2 text-xs font-medium text-muted-foreground", children: [
                "Copy ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: day }),
                " to:"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: DAYS.filter((d) => d !== day).map((d) => {
                const selected = copyTargets.includes(d);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setCopyTargets((prev) => selected ? prev.filter((x) => x !== d) : [...prev, d]), className: "flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium transition " + (selected ? "border-[var(--leaf-green)] bg-[var(--leaf-green)] text-white" : "border-border bg-background text-foreground hover:bg-muted"), children: [
                  selected && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }),
                  d
                ] }, d);
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCopyTargets(DAYS.filter((d) => d !== day)), className: "text-xs text-muted-foreground hover:text-foreground transition", children: "Select all" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => setCopyPopover(false), children: "Cancel" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", disabled: copyTargets.length === 0, onClick: () => duplicateDayTo(copyTargets), children: [
                    "Copy to ",
                    copyTargets.length || "",
                    " day",
                    copyTargets.length !== 1 ? "s" : ""
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveAndNext, disabled: saving, children: saving ? "Saving..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Save & Next ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
          ] }) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setStep("planner"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }),
            "Back to Planner"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: exportPDF, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "mr-1 h-4 w-4" }),
            "Export to PDF"
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[2px] bg-gradient-to-r from-[var(--primary-orange)] via-[var(--leaf-green)] to-[var(--primary-orange)] opacity-60" })
    ] }),
    step === "planner" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1600px] px-4 pt-6 print:hidden sm:px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-2", children: DAYS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDay(d), className: "min-w-[60px] rounded-md border px-4 py-2 text-sm font-medium transition " + (day === d ? "border-[var(--leaf-green)] bg-[var(--leaf-green)] text-white" : "border-border bg-card text-foreground hover:bg-muted"), children: d }, d)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Select a day to design its meals." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_1fr] print:block print:px-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "rounded-xl border border-border bg-card p-4 print:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-2xl font-bold text-[var(--dark-green)]", children: fullDay(day) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "pl-9", placeholder: "Search foods", value: search, onChange: (e) => setSearch(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCategory(c), className: "rounded-full px-3 py-1 text-xs transition " + (category === c ? "bg-[var(--leaf-green)] text-white" : "bg-muted text-foreground hover:bg-muted/70"), children: c }, c)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full mb-1", onClick: () => setFoodDialog({
              open: true,
              food: null
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
              " Add catalogue item"
            ] }),
            filteredFoods.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 rounded-lg border border-border bg-background p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate font-medium", children: f.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: f.notes || f.category || "" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFoodDialog({
                  open: true,
                  food: f
                }), "aria-label": "Edit", className: "rounded-md p-1.5 text-muted-foreground hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDeleteFoodTarget(f), "aria-label": "Delete", className: "rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AddToSlotButton, { food: f, slots: currentDay.slots.map((s) => s.slotName), onAdd: (slot, portion) => addItemToSlot(slot, f, portion) })
              ] })
            ] }, f.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "overflow-x-auto print:overflow-visible", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid min-w-[900px] gap-3 print:hidden`, style: {
            gridTemplateColumns: `repeat(${currentDay.slots.length}, minmax(0, 1fr))`
          }, children: currentDay.slots.map((slot) => {
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col rounded-xl border border-border bg-card p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate text-base font-semibold text-[var(--dark-green)]", children: slot.slotName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 gap-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => renameSlot(slot.slotName), "aria-label": "Rename slot", className: "rounded p-1 text-muted-foreground hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteSlot(slot.slotName), "aria-label": "Delete slot", className: "rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "time", value: slot.time, onChange: (e) => setSlotTime(slot.slotName, e.target.value), className: "mt-2 h-9" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-muted-foreground", children: [
                slot.items.length,
                " item",
                slot.items.length === 1 ? "" : "s"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-2", children: slot.items.map((it, idx) => {
                const food = store.foods.find((f) => f.id === it.foodId);
                if (!food) return null;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "group flex items-start justify-between gap-2 rounded-md border border-border bg-background p-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-medium", children: food.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: it.portion })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeItem(slot.slotName, idx), "aria-label": "Remove", className: "rounded-md p-1 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive print:opacity-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
                ] }, idx);
              }) })
            ] }, slot.slotName);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 print:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: addSlot, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
            " Add Slot"
          ] }) })
        ] })
      ] })
    ] }),
    step === "review" && /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewStep, { patient, plan, store, onPaymentUpdate: handlePaymentUpdate, onExportPDF: exportPDF, onBack: () => setStep("planner"), onDone: goHome }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-export hidden print:block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "Aahar Jeevan", className: "print-logo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-brand", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-brand-name", children: "Shobhana Thakkar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-brand-sub", children: "Internationally Certified Nutritionist" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-brand-sub", children: "Mobile: 9687491796" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-patient", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "print-label", children: "Name:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "print-value", children: patient.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "print-label", children: "Current Weight:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "print-value", children: [
            patient.currentWeight ?? "—",
            " kg"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "print-label", children: "Ideal Body Weight:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "print-value", children: [
            patient.idealWeight ?? "—",
            patient.idealWeight ? ` kg (±5: ${Math.max(0, patient.idealWeight - 5).toFixed(1)}–${(patient.idealWeight + 5).toFixed(1)} kg)` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "print-label", children: "BMI:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "print-value", children: patient.bmi ?? "—" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "print-plan-title", children: "7-Day Diet Plan" }),
      plan.meals.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-day", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "print-day-title", children: fullDay(m.day) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "print-table", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: {
              width: "18%"
            }, children: "Meal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: {
              width: "14%"
            }, children: "Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Items" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: m.slots.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "print-slot", children: s.slotName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: s.time || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: s.items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "print-empty", children: "—" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "print-items", children: s.items.map((it, i) => {
              const food = store.foods.find((f) => f.id === it.foodId);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                food?.name,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "print-portion", children: [
                  "— ",
                  it.portion
                ] }),
                food?.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "print-notes", children: [
                  "Note: ",
                  food.notes
                ] })
              ] }, i);
            }) }) })
          ] }, s.slotName)) })
        ] })
      ] }, m.day)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        pageBreakBefore: "always",
        paddingTop: "40px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-center text-xl font-bold text-[#0070c0] mb-6 tracking-wide", children: "TIPS:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc pl-8 mb-10 space-y-2 text-[15px] marker:text-black", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-[#c00000] font-bold marker:text-[#c00000]", children: "7 hrs. Sleep, Stress free life, Exercise help to live a happy and healthy life." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Vegetables include carrots, cucumber, green peppers, Broccoli, cauliflower, Cabbage, lettuce, mushrooms, onions, red peppers, tomatoes, beetroot, peas, celery, chili, garlic, basil, coriander, parsley, etc." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Drink at least 4 liters of water per day, (Make sure Urine color should be pale yellow)." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Make sure don't consume more than the mentioned quantity." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Daily 45 mins any exercise (5 days in a week)." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-[#c00000] mb-6", children: "Avoid List" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pl-2 text-[15px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#c00000] font-bold", children: "☐ Wheat, Sugar & Maida completely." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#c00000] font-bold", children: "☐ Simple sugar, jaggery & honey" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#c00000] font-bold", children: "☐ Package food like chips, biscuits or any snacks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "☐ Home Fried food like puri, samosa, pakoda etc." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "☐ Processed food & trans-fat." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "☐ Pre made snacks like shukadi.....etc." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "☐ Outside unhealthy snacks like panipuri, pav bhaji, pizza, burger etc." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "☐ Bakery items like breads, cake, biscuits etc." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "☐ Ice-cream, candy, Cold coco." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "☐ Chocolates." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "☐ Artificial sweeteners like ready fruits juice." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "☐ Sugar sweetened beverages like soft drink, fruit drink, sports drinks etc." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "☐ Alcoholic beverages like red bulls." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-footer mt-12", children: "Prepared by Shobhana Thakkar · Aahar Jeevan · 9687491796" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: blocker.status === "blocked", onOpenChange: (o) => !o && blocker.reset?.(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "You have unsaved changes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Save draft before leaving?" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { onClick: () => blocker.reset?.(), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => blocker.proceed?.(), children: "Discard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => {
          save(true);
          blocker.proceed?.();
        }, children: "Save draft" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteFoodTarget, onOpenChange: (o) => !o && setDeleteFoodTarget(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Food Item?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "Are you sure you want to delete ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: deleteFoodTarget?.name }),
          " from the food catalogue? This action cannot be undone."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: async () => {
          if (deleteFoodTarget) {
            try {
              await store.deleteFood(deleteFoodTarget.id);
              toast.success(`Deleted "${deleteFoodTarget.name}" from catalogue`);
            } catch (err) {
              toast.error("Failed to delete food item: " + err.message);
            } finally {
              setDeleteFoodTarget(null);
            }
          }
        }, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Delete" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FoodDialog, { open: foodDialog.open, food: foodDialog.food, onClose: () => setFoodDialog({
      open: false,
      food: null
    }), onSave: async (data) => {
      try {
        if (foodDialog.food) {
          await store.updateFood(foodDialog.food.id, data);
          toast.success("Item updated");
        } else {
          await store.addFood(data);
          toast.success("Item added");
        }
      } catch (err) {
        toast.error("Failed to save food: " + err.message);
      }
      setFoodDialog({
        open: false,
        food: null
      });
    } })
  ] });
}
function fullDay(d) {
  return {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday"
  }[d];
}
const PAYMENT_OPTIONS = [{
  value: "Done",
  label: "Paid",
  color: "border-[var(--leaf-green)] bg-[var(--leaf-green)]/10 text-[var(--dark-green)]",
  icon: CircleCheck
}, {
  value: "Partial",
  label: "Partial",
  color: "border-[var(--primary-orange)] bg-[var(--primary-orange)]/10 text-[var(--accent-orange)]",
  icon: IndianRupee
}, {
  value: "Pending",
  label: "Pending",
  color: "border-destructive bg-destructive/10 text-destructive",
  icon: IndianRupee
}];
function ReviewStep({
  patient,
  plan,
  store,
  onPaymentUpdate,
  onExportPDF,
  onBack,
  onDone
}) {
  const totalItems = plan.meals.reduce((sum, m) => sum + m.slots.reduce((s2, sl) => s2 + sl.items.length, 0), 0);
  const filledDays = plan.meals.filter((m) => m.slots.some((sl) => sl.items.length > 0)).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-8 sm:px-6 print:hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-1 text-2xl font-bold text-[var(--dark-green)]", children: plan.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-4 text-sm text-muted-foreground", children: [
        "Plan for ",
        patient.name,
        " · Last updated ",
        new Date(plan.updatedAt).toLocaleDateString()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-background p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-[var(--leaf-green)]", children: filledDays }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: "Days planned" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-background p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-[var(--primary-orange)]", children: totalItems }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: "Food items" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-background p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-[var(--dark-green)]", children: plan.isDraft ? "Draft" : "Final" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: "Plan status" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: "Day Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-2", children: plan.meals.map((m) => {
          const count = m.slots.reduce((s, sl) => s + sl.items.length, 0);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border p-2 text-center text-xs transition " + (count > 0 ? "border-[var(--leaf-green)] bg-[var(--leaf-green)]/5" : "border-border bg-muted/30"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: m.day }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 " + (count > 0 ? "text-[var(--dark-green)]" : "text-muted-foreground"), children: [
              count,
              " item",
              count !== 1 ? "s" : ""
            ] })
          ] }, m.day);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentCard, { patient, onPaymentUpdate }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-1 text-lg font-bold text-[var(--dark-green)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "mr-1.5 inline h-5 w-5" }),
        "Export & Finish"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-5 text-sm text-muted-foreground", children: "Export the diet plan as a branded PDF or return to editing." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", onClick: onExportPDF, className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4" }),
          "Export to PDF"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", variant: "outline", onClick: onBack, className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
          "Back to Planner"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", variant: "outline", onClick: onDone, className: "gap-2 ml-auto border-[var(--leaf-green)] text-[var(--dark-green)] hover:bg-[var(--leaf-green)]/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
          "Done — Go Home"
        ] })
      ] })
    ] })
  ] });
}
function PaymentCard({
  patient,
  onPaymentUpdate
}) {
  const [totalAmount, setTotalAmount] = reactExports.useState(String(patient.totalAmount ?? ""));
  const [amountReceived, setAmountReceived] = reactExports.useState(String(patient.amountReceived ?? ""));
  const [selectedStatus, setSelectedStatus] = reactExports.useState(patient.paymentStatus);
  const total = Number(totalAmount) || 0;
  const received = Number(amountReceived) || 0;
  function handleStatusClick(status) {
    if (total <= 0) {
      toast.error("Please enter the total amount first");
      return;
    }
    setSelectedStatus(status);
    if (status === "Done") {
      setAmountReceived(String(total));
      onPaymentUpdate(status, total, total);
    } else if (status === "Pending") {
      setAmountReceived("0");
      onPaymentUpdate(status, total, 0);
    } else {
      onPaymentUpdate(status, total, received);
    }
  }
  function handlePartialSave() {
    if (received <= 0) {
      toast.error("Please enter the amount received");
      return;
    }
    if (received >= total) {
      toast.error("Received amount should be less than total for partial. Use 'Paid' instead.");
      return;
    }
    onPaymentUpdate("Partial", total, received);
    toast.success("Partial payment saved");
  }
  function handleTotalBlur() {
    const t = Number(totalAmount) || 0;
    if (t > 0 && patient.totalAmount !== t) {
      onPaymentUpdate(selectedStatus, t, selectedStatus === "Done" ? t : selectedStatus === "Pending" ? 0 : received);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-1 text-lg font-bold text-[var(--dark-green)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "mr-1.5 inline h-5 w-5" }),
      "Payment"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-sm text-muted-foreground", children: "Enter the consultation fee and update payment status." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Total Amount (₹)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm", children: "₹" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", placeholder: "e.g. 1500", value: totalAmount, onChange: (e) => setTotalAmount(e.target.value), onBlur: handleTotalBlur, className: "pl-7" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: PAYMENT_OPTIONS.map((opt) => {
      const active = selectedStatus === opt.value;
      const Icon = opt.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleStatusClick(opt.value), className: "flex flex-col items-center gap-2 rounded-xl border-2 p-5 text-center transition-all hover:scale-[1.03] " + (active ? opt.color + " ring-2 ring-offset-2 ring-offset-background shadow-md" : "border-border bg-background text-foreground hover:bg-muted"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-7 w-7 " + (active ? "" : "text-muted-foreground") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: opt.label }),
        active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium uppercase tracking-wider opacity-70", children: "Current" })
      ] }, opt.value);
    }) }),
    selectedStatus === "Partial" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-xl border border-[var(--primary-orange)]/30 bg-[var(--primary-orange)]/5 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Amount Received (₹)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm", children: "₹" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", placeholder: "e.g. 500", value: amountReceived, onChange: (e) => setAmountReceived(e.target.value), onKeyDown: (e) => e.key === "Enter" && handlePartialSave(), className: "pl-7" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handlePartialSave, size: "sm", className: "shrink-0", children: "Save" })
      ] }),
      total > 0 && received > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
        "Remaining: ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-[var(--accent-orange)]", children: [
          "₹",
          (total - received).toLocaleString("en-IN")
        ] })
      ] })
    ] }),
    total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-[var(--dark-green)]", children: [
          "₹",
          (selectedStatus === "Done" ? total : selectedStatus === "Pending" ? 0 : received).toLocaleString("en-IN")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: " received of " }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
          "₹",
          total.toLocaleString("en-IN")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: " total" })
      ] })
    ] })
  ] });
}
function AddToSlotButton({
  food,
  slots,
  onAdd
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [selectedSlot, setSelectedSlot] = reactExports.useState(null);
  const [serving, setServing] = reactExports.useState("");
  function reset() {
    setOpen(false);
    setSelectedSlot(null);
    setServing("");
  }
  function handleSlotClick(s) {
    setSelectedSlot(s);
    setServing("");
  }
  function handleConfirm() {
    if (!selectedSlot || !serving.trim()) {
      toast.error("Please enter a serving size");
      return;
    }
    onAdd(selectedSlot, serving.trim());
    toast.success(`Added ${food.name} → ${selectedSlot}`);
    reset();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen((o) => !o), "aria-label": `Add ${food.name}`, className: "rounded-md bg-[var(--primary-orange)] p-1.5 text-white hover:bg-[var(--accent-orange)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }) }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "fixed inset-0 z-10 cursor-default", "aria-label": "Close" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 top-full z-20 mt-1 w-52 overflow-hidden rounded-lg border border-border bg-popover shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-3 py-1.5 text-xs text-muted-foreground", children: [
          selectedSlot ? `Serving for ${selectedSlot}` : "Add to slot",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3 cursor-pointer", onClick: reset })
        ] }),
        !selectedSlot ? slots.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleSlotClick(s), className: "block w-full px-3 py-2 text-left text-sm hover:bg-muted", children: s }, s)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { autoFocus: true, placeholder: "e.g. 4 pieces, 40g, 1 cup", value: serving, onChange: (e) => setServing(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleConfirm(), className: "h-8 text-sm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "flex-1", onClick: () => setSelectedSlot(null), children: "Back" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "flex-1", onClick: handleConfirm, children: "Add" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  Planner as component
};
