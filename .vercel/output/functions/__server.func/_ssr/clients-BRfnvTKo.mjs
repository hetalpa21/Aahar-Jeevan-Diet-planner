import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppHeader } from "./AppHeader-Bt3sGQNu.mjs";
import { u as useStore, B as Button, I as Input, D as Dialog, a as DialogContent, b as DialogHeader, d as DialogTitle, e as DialogFooter, c as cn, L as Label } from "./router-BL5U29WJ.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-C9s_HXwT.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { S as Search, T as TrendingUp, P as Pencil, c as Trash2 } from "../_libs/lucide-react.mjs";
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
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const STATUS_FILTERS = ["All", "Done", "Pending", "Partial"];
function ClientList() {
  const store = useStore();
  const {
    patients
  } = store;
  const navigate = useNavigate();
  const [q, setQ] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("All");
  const [sort, setSort] = reactExports.useState("name");
  const [editPatient, setEditPatient] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const rows = reactExports.useMemo(() => {
    let list = patients.filter((p) => (p.name + " " + p.contact).toLowerCase().includes(q.toLowerCase()));
    if (status !== "All") list = list.filter((p) => p.paymentStatus === status);
    list = [...list].sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : (b.lastPlanDate ?? "").localeCompare(a.lastPlanDate ?? ""));
    return list;
  }, [patients, q, status, sort]);
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await store.deletePatient(deleteTarget.id);
      toast.success(`Deleted ${deleteTarget.name}`);
    } catch (err) {
      toast.error("Failed to delete: " + err.message);
    }
    setDeleteTarget(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-end justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-[var(--dark-green)]", children: "Client List" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => navigate({
          to: "/"
        }), children: "Add Patient" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-md flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by name or phone", value: q, onChange: (e) => setQ(e.target.value), className: "pl-9" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Sort by" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: sort, onChange: (e) => setSort(e.target.value), className: "rounded-md border border-input bg-background px-3 py-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "name", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "date", children: "Last plan date" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Payment Status" }),
        STATUS_FILTERS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStatus(s), className: "rounded-full px-3 py-1 text-sm transition " + (status === s ? "bg-[var(--dark-green)] text-white" : "bg-muted text-foreground hover:bg-muted/70"), children: s }, s))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-lg border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-left text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Age" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Current" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Last plan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Payment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          rows.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border align-middle", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-orange)]/20 font-semibold text-[var(--accent-orange)]", children: p.name[0] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: p.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: p.contact })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: p.age }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
              p.currentWeight,
              " kg"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: p.lastPlanDate ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: p.paymentStatus }),
              p.totalAmount ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                p.paymentStatus === "Partial" ? `₹${(p.amountReceived ?? 0).toLocaleString("en-IN")}/` : "",
                "₹",
                p.totalAmount.toLocaleString("en-IN")
              ] }) : null
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/planner/$patientId", params: {
                patientId: p.id
              }, className: "rounded-md px-2.5 py-1.5 text-sm font-medium text-[var(--accent-orange)] transition hover:bg-[var(--primary-orange)]/10", children: "Edit Plan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/progress/$patientId", params: {
                patientId: p.id
              }, className: "flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium text-[var(--leaf-green)] transition hover:bg-[var(--leaf-green)]/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5" }),
                "Progress"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditPatient(p), className: "rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground", "aria-label": "Edit details", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDeleteTarget(p), className: "rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive", "aria-label": "Delete patient", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
            ] }) })
          ] }, p.id)),
          rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-10 text-center text-muted-foreground", children: "No clients match your filters." }) })
        ] })
      ] }) }) })
    ] }),
    editPatient && /* @__PURE__ */ jsxRuntimeExports.jsx(EditPatientDialog, { patient: editPatient, onClose: () => setEditPatient(null), onSave: async (patch) => {
      try {
        await store.updatePatient(editPatient.id, patch);
        toast.success(`Updated ${patch.name || editPatient.name}`);
        setEditPatient(null);
      } catch (err) {
        toast.error("Failed to update: " + err.message);
      }
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteTarget, onOpenChange: (o) => !o && setDeleteTarget(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
          "Delete ",
          deleteTarget?.name,
          "?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will permanently remove this patient and all their associated plans and progress data. This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: handleDelete, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Delete Patient" })
      ] })
    ] }) })
  ] });
}
function StatusBadge({
  status
}) {
  const cls = status === "Done" ? "bg-[var(--dark-green)] text-white" : status === "Pending" ? "bg-[var(--primary-orange)] text-white" : "bg-[var(--leaf-green)] text-white";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "rounded-full px-3 py-1 " + cls, children: status });
}
function EditPatientDialog({
  patient,
  onClose,
  onSave
}) {
  const [form, setForm] = reactExports.useState({
    name: patient.name,
    age: String(patient.age),
    contact: patient.contact,
    currentWeight: String(patient.currentWeight),
    idealWeight: patient.idealWeight != null ? String(patient.idealWeight) : "",
    height: patient.height != null ? String(patient.height) : "",
    chest: patient.chest != null ? String(patient.chest) : "",
    waist: patient.waist != null ? String(patient.waist) : "",
    lowerWaist: patient.lowerWaist != null ? String(patient.lowerWaist) : "",
    thigh: patient.thigh != null ? String(patient.thigh) : "",
    gender: patient.gender || ""
  });
  const heightM = Number(form.height) / 100;
  const weightKg = Number(form.currentWeight);
  const bmi = heightM > 0 && weightKg > 0 ? weightKg / (heightM * heightM) : 0;
  const bmiRounded = bmi ? Math.round(bmi * 10) / 10 : 0;
  function handleSave() {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    onSave({
      name: form.name.trim(),
      age: Number(form.age) || 0,
      contact: form.contact,
      currentWeight: Number(form.currentWeight) || 0,
      idealWeight: Number(form.idealWeight) || void 0,
      height: Number(form.height) || void 0,
      chest: Number(form.chest) || void 0,
      waist: Number(form.waist) || void 0,
      lowerWaist: Number(form.lowerWaist) || void 0,
      thigh: Number(form.thigh) || void 0,
      bmi: bmiRounded || void 0,
      gender: form.gender || void 0
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90vh] overflow-y-auto sm:max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
      "Edit Patient — ",
      patient.name
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.name, onChange: (e) => setForm({
        ...form,
        name: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Gender", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["Male", "Female", "Other"].map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setForm({
        ...form,
        gender: g
      }), className: "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition " + (form.gender === g ? "border-[var(--dark-green)] bg-[var(--dark-green)] text-white" : "border-input bg-background text-foreground hover:bg-muted"), children: g }, g)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Age", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.age, onChange: (e) => setForm({
          ...form,
          age: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Contact", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.contact, onChange: (e) => setForm({
          ...form,
          contact: e.target.value
        }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Current weight (kg)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.currentWeight, onChange: (e) => setForm({
          ...form,
          currentWeight: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Ideal body weight (kg)", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.idealWeight, onChange: (e) => setForm({
            ...form,
            idealWeight: e.target.value
          }) }),
          Number(form.idealWeight) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
            "Range: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-[var(--dark-green)]", children: Math.max(0, Number(form.idealWeight) - 5).toFixed(1) }),
            " – ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-[var(--dark-green)]", children: (Number(form.idealWeight) + 5).toFixed(1) }),
            " kg (±5)"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Height (cm)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.height, onChange: (e) => setForm({
          ...form,
          height: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Chest (in)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.chest, onChange: (e) => setForm({
          ...form,
          chest: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Waist (in)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.waist, onChange: (e) => setForm({
          ...form,
          waist: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Lower waist (in)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.lowerWaist, onChange: (e) => setForm({
          ...form,
          lowerWaist: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Thigh (in)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.thigh, onChange: (e) => setForm({
          ...form,
          thigh: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "BMI (auto)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 items-center rounded-md border border-input bg-muted/40 px-3 text-sm", children: bmiRounded ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-[var(--dark-green)]", children: bmiRounded }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Enter height & weight" }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, children: "Save Changes" })
    ] })
  ] }) });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm", children: label }),
    children
  ] });
}
export {
  ClientList as component
};
