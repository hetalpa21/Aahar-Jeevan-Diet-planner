import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { A as AppHeader } from "./AppHeader-Bt3sGQNu.mjs";
import { u as useStore, l as logo, D as Dialog, a as DialogContent, b as DialogHeader, d as DialogTitle, I as Input, e as DialogFooter, B as Button, L as Label } from "./router-BL5U29WJ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { U as Users, e as UserPlus, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
function Index() {
  const navigate = useNavigate();
  const {
    addPatient
  } = useStore();
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    name: "",
    age: "",
    contact: "",
    currentWeight: "",
    idealWeight: "",
    height: "",
    chest: "",
    waist: "",
    lowerWaist: "",
    thigh: "",
    gender: ""
  });
  const heightM = Number(form.height) / 100;
  const weightKg = Number(form.currentWeight);
  const bmi = heightM > 0 && weightKg > 0 ? weightKg / (heightM * heightM) : 0;
  const bmiRounded = bmi ? Math.round(bmi * 10) / 10 : 0;
  async function submit() {
    if (!form.name.trim()) {
      toast.error("Patient name is required");
      return;
    }
    try {
      const p = await addPatient({
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
        gender: form.gender || void 0,
        paymentStatus: "Pending"
      });
      toast.success(`Added ${p.name}`);
      setOpen(false);
      navigate({
        to: "/planner/$patientId",
        params: {
          patientId: p.id
        }
      });
    } catch (err) {
      toast.error(err.message || "Failed to add patient");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col", style: {
    background: "linear-gradient(180deg, #b9efc5 0%, #ddf5e3 40%, #f0faf3 100%)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex flex-1 flex-col items-center justify-center px-5 py-12 sm:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 flex items-center justify-center rounded-full bg-white shadow-[0_8px_32px_-8px_rgba(27,77,46,0.12)]", style: {
        width: 192,
        height: 192
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "Aahar Jeevan", width: 160, height: 160, className: "h-[140px] w-[140px] object-contain" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mb-2 text-center text-[32px] font-bold leading-tight tracking-tight text-[#00361a] sm:text-[40px]", style: {
        fontFamily: "'Manrope', sans-serif"
      }, children: "Welcome back, Shobhana Thakkar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mb-12 max-w-xl text-center text-[16px] leading-relaxed text-[#414942] sm:text-[18px]", style: {
        fontFamily: "'Manrope', sans-serif"
      }, children: "Manage your consultations and track patient wellness efficiently." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CTA, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-6 w-6" }), title: "Existing Patient", subtitle: "Search & manage clients", onClick: () => navigate({
          to: "/clients"
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CTA, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-6 w-6" }), title: "New Patient", subtitle: "Add basic details & create plan", onClick: () => setOpen(true) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90vh] overflow-y-auto sm:max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "New Patient" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.name, onChange: (e) => setForm({
          ...form,
          name: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Gender", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["Male", "Female", "Other"].map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setForm({
          ...form,
          gender: g
        }), className: "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition " + (form.gender === g ? "border-[#00361a] bg-[#00361a] text-white" : "border-input bg-background text-foreground hover:bg-muted"), children: g }, g)) }) }),
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-[#00361a]", children: Math.max(0, Number(form.idealWeight) - 5).toFixed(1) }),
              " – ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-[#00361a]", children: (Number(form.idealWeight) + 5).toFixed(1) }),
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "BMI (auto)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 items-center rounded-md border border-input bg-muted/40 px-3 text-sm", children: bmiRounded ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-[#00361a]", children: bmiRounded }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Enter height & weight" }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, className: "bg-[#00361a] hover:bg-[#1b4d2e]", children: "Save & Create Plan" })
      ] })
    ] }) })
  ] });
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
function CTA({
  icon,
  title,
  subtitle,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick, className: "group flex items-center gap-4 rounded-xl border border-transparent px-6 py-6 text-left shadow-[0_8px_32px_-8px_rgba(27,77,46,0.08)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_48px_-12px_rgba(27,77,46,0.15)] focus:outline-none focus:ring-2 focus:ring-[#00361a]/30 focus:ring-offset-2 active:scale-[0.98]", style: {
    backgroundColor: "rgba(254, 142, 39, 0.8)",
    backdropFilter: "blur(4px)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#00361a] text-white shadow-md transition-transform duration-300 group-hover:scale-110", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[18px] font-bold text-[#00361a]", style: {
        fontFamily: "'Manrope', sans-serif"
      }, children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[14px] text-[#414942]", children: subtitle })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-auto h-5 w-5 shrink-0 text-[#00361a] transition-transform duration-300 group-hover:translate-x-1" })
  ] });
}
export {
  Index as component
};
