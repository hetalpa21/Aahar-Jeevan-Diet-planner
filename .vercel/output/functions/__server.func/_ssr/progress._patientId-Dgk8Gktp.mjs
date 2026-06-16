import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { R as Route$1, u as useStore, B as Button, l as logo, I as Input } from "./router-BL5U29WJ.mjs";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-C9s_HXwT.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { H as House, f as ArrowLeft, d as Plus, g as TrendingDown, c as Trash2, h as Save, M as Minus, T as TrendingUp } from "../_libs/lucide-react.mjs";
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
function ProgressTracker() {
  const {
    patientId
  } = Route$1.useParams();
  const navigate = useNavigate();
  const store = useStore();
  const patient = store.patients.find((p) => p.id === patientId);
  const [entries, setEntries] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(null);
  reactExports.useEffect(() => {
    async function load() {
      try {
        const data = await store.getProgressForPatient(patientId);
        setEntries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [patientId]);
  async function addWeek() {
    const nextWeek = entries.length > 0 ? Math.max(...entries.map((e) => e.weekNumber)) + 1 : 1;
    const prefillWeight = nextWeek === 1 ? patient?.currentWeight : void 0;
    try {
      const entry = await store.addProgressEntry({
        patientId,
        weekNumber: nextWeek,
        weight: prefillWeight,
        waist: void 0,
        lowerWaist: void 0,
        thigh: void 0,
        notes: void 0
      });
      setEntries((prev) => [...prev, entry]);
      toast.success(`Week ${nextWeek} added`);
    } catch (err) {
      toast.error("Failed to add week: " + err.message);
    }
  }
  async function saveEntry(entry) {
    setSaving(entry.id);
    try {
      await store.updateProgressEntry(entry.id, {
        weight: entry.weight,
        waist: entry.waist,
        lowerWaist: entry.lowerWaist,
        thigh: entry.thigh,
        notes: entry.notes
      });
      toast.success(`Week ${entry.weekNumber} saved`);
    } catch (err) {
      toast.error("Failed to save: " + err.message);
    } finally {
      setSaving(null);
    }
  }
  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await store.deleteProgressEntry(deleteTarget.id, patientId);
      setEntries((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      toast.success(`Week ${deleteTarget.weekNumber} deleted`);
    } catch (err) {
      toast.error("Failed to delete: " + err.message);
    }
    setDeleteTarget(null);
  }
  function updateField(id, field, value) {
    setEntries((prev) => prev.map((e) => e.id === id ? {
      ...e,
      [field]: field === "notes" ? value : value === "" ? void 0 : Number(value)
    } : e));
  }
  function goHome() {
    navigate({
      to: "/"
    });
  }
  if (store.loading || loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground animate-pulse text-lg", children: "Loading progress data..." }) });
  }
  if (!patient) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Patient not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4", onClick: () => navigate({
        to: "/clients"
      }), children: "Back to Clients" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 border-b border-border bg-[var(--header-bg)]/95 backdrop-blur-md shadow-sm print:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: goHome, className: "flex items-center gap-3 group rounded-lg px-2.5 py-1.5 text-[var(--dark-green)] transition hover:bg-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "", width: 44, height: 44, className: "h-11 w-11 rounded-xl object-contain shadow-sm ring-1 ring-border/50 transition group-hover:shadow-md group-hover:scale-[1.04]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:block text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold leading-tight text-[var(--dark-green)]", children: "Aahar Jeevan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[11px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-3 w-3" }),
              "Home"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "hidden text-lg font-semibold text-[var(--dark-green)] sm:block", children: "Progress Tracker" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => navigate({
            to: "/clients"
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }),
            "Back to Clients"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: addWeek, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
            "Add Week"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[2px] bg-gradient-to-r from-[var(--primary-orange)] via-[var(--leaf-green)] to-[var(--primary-orange)] opacity-60" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-[1400px] px-4 py-8 sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary-orange)]/20 text-xl font-bold text-[var(--accent-orange)]", children: patient.name[0] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-[var(--dark-green)]", children: patient.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Age ",
            patient.age,
            " · ",
            patient.contact,
            " · Start weight: ",
            patient.currentWeight,
            " kg"
          ] })
        ] })
      ] }) }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Error loading progress:" }),
        " ",
        error,
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
          "Make sure the ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "progress_entries" }),
          " table exists in Supabase."
        ] })
      ] }),
      entries.length === 0 && !error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-full bg-[var(--leaf-green)]/10 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-8 w-8 text-[var(--leaf-green)]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-[var(--dark-green)]", children: "No progress entries yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 mb-4 text-sm text-muted-foreground", children: "Start tracking by adding the first week's measurements." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: addWeek, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
          "Add Week 1"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex gap-4 pb-4", style: {
        minWidth: entries.length * 240
      }, children: [
        entries.map((entry, idx) => {
          const prev = idx > 0 ? entries[idx - 1] : null;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(WeekCard, { entry, prev, saving: saving === entry.id, onUpdate: (field, value) => updateField(entry.id, field, value), onSave: () => saveEntry(entry), onDelete: () => setDeleteTarget(entry) }, entry.id);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: addWeek, className: "flex min-w-[200px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/10 p-6 text-muted-foreground transition hover:border-[var(--leaf-green)] hover:bg-[var(--leaf-green)]/5 hover:text-[var(--dark-green)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-8 w-8" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Add Week" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteTarget, onOpenChange: (o) => !o && setDeleteTarget(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
          "Delete Week ",
          deleteTarget?.weekNumber,
          "?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will permanently remove the measurements for this week." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: confirmDelete, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Delete" })
      ] })
    ] }) })
  ] });
}
function Trend({
  current,
  previous,
  lowerIsBetter = true
}) {
  if (current == null || previous == null) return null;
  const diff = current - previous;
  if (Math.abs(diff) < 0.01) return /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3.5 w-3.5 text-muted-foreground" });
  const isGood = lowerIsBetter ? diff < 0 : diff > 0;
  return isGood ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3.5 w-3.5 text-[var(--leaf-green)]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 text-destructive" });
}
function WeekCard({
  entry,
  prev,
  saving,
  onUpdate,
  onSave,
  onDelete
}) {
  const date = new Date(entry.recordedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-[220px] flex-col rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-t-2xl bg-[var(--leaf-green)] px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-base font-bold text-white", children: [
          "Week ",
          entry.weekNumber
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-white/70", children: date })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onDelete, className: "rounded-md p-1.5 text-white/70 transition hover:bg-white/20 hover:text-white", "aria-label": "Delete week", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MeasurementField, { label: "Weight", unit: "kg", value: entry.weight, prev: prev?.weight, onChange: (v) => onUpdate("weight", v) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MeasurementField, { label: "Waist", unit: "in", value: entry.waist, prev: prev?.waist, onChange: (v) => onUpdate("waist", v) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MeasurementField, { label: "Lower Waist", unit: "in", value: entry.lowerWaist, prev: prev?.lowerWaist, onChange: (v) => onUpdate("lowerWaist", v) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MeasurementField, { label: "Thigh", unit: "in", value: entry.thigh, prev: prev?.thigh, onChange: (v) => onUpdate("thigh", v) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "w-full gap-1.5", onClick: onSave, disabled: saving, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5" }),
      saving ? "Saving..." : "Save"
    ] }) })
  ] });
}
function MeasurementField({
  label,
  unit,
  value,
  prev,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-muted-foreground", children: [
        label,
        " (",
        unit,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trend, { current: value, previous: prev, lowerIsBetter: true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.1", placeholder: "—", value: value ?? "", onChange: (e) => onChange(e.target.value), className: "h-9 text-sm" })
  ] });
}
export {
  ProgressTracker as component
};
