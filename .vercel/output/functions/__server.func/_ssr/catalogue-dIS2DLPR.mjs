import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AppHeader } from "./AppHeader-Bt3sGQNu.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, d as DialogTitle, L as Label, I as Input, T as Textarea, e as DialogFooter, B as Button, u as useStore } from "./router-BL5U29WJ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { d as Plus, P as Pencil, c as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
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
function Catalogue() {
  const {
    foods,
    addFood,
    updateFood,
    deleteFood
  } = useStore();
  const [editing, setEditing] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  function openNew() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(f) {
    setEditing(f);
    setOpen(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-[var(--dark-green)]", children: "Food Catalogue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: openNew, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
          " Add New Item"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: foods.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-[var(--dark-green)]", children: f.name }),
            f.category && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-2 inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground", children: f.category })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openEdit(f), "aria-label": "Edit", className: "rounded-md p-2 text-muted-foreground hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
              try {
                await deleteFood(f.id);
                toast.success("Item removed");
              } catch (err) {
                toast.error("Failed to remove item: " + err.message);
              }
            }, "aria-label": "Delete", className: "rounded-md p-2 text-destructive hover:bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] })
        ] }),
        f.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: f.notes })
      ] }, f.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FoodDialog, { open, onClose: () => setOpen(false), food: editing, onSave: async (data) => {
      try {
        if (editing) {
          await updateFood(editing.id, data);
          toast.success("Item updated");
        } else {
          await addFood(data);
          toast.success("Item added");
        }
      } catch (err) {
        toast.error("Failed to save item: " + err.message);
      }
      setOpen(false);
    } })
  ] });
}
function FoodDialog({
  open,
  onClose,
  food,
  onSave
}) {
  const [name, setName] = reactExports.useState(food?.name ?? "");
  const [notes, setNotes] = reactExports.useState(food?.notes ?? "");
  useStateSync(food, (f) => {
    setName(f?.name ?? "");
    setNotes(f?.notes ?? "");
  });
  function submit() {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    onSave({
      name: name.trim(),
      serving: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      notes
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: food ? "Edit Item" : "Add Item" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: name, onChange: (e) => setName(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: notes, onChange: (e) => setNotes(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Hint: Items can be added and edited from the Diet Planner." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, children: "Save" })
    ] })
  ] }) });
}
function useStateSync(value, fn) {
  reactExports.useEffect(() => {
    fn(value);
  }, [value]);
}
export {
  FoodDialog,
  Catalogue as component
};
