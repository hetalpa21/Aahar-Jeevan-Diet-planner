import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-BVPxk9Ny.mjs";
import { T as Toaster$1, t as toast } from "../_libs/sonner.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { R as Root } from "../_libs/radix-ui__react-label.mjs";
import { O as Overlay, P as Portal, C as Content, a as Close, T as Title, D as Description, R as Root$1 } from "../_libs/radix-ui__react-dialog.mjs";
import { L as Lock, E as EyeOff, a as Eye, b as LogIn, X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
const appCss = "/assets/styles-BNiA_16r.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_SLOTS = [
  "Early Morning",
  "Breakfast",
  "Lunch",
  "Evening Snack",
  "Dinner"
];
const SLOTS = DEFAULT_SLOTS;
const DEFAULT_TIMES = {
  "Early Morning": "06:30",
  Breakfast: "08:00",
  Lunch: "13:00",
  "Evening Snack": "16:30",
  Dinner: "19:30"
};
function emptyPlan(patientId, patientName) {
  return {
    id: `plan_${Date.now()}`,
    patientId,
    title: `Week Plan — ${patientName}`,
    isDraft: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    meals: DAYS.map((day) => ({
      day,
      slots: SLOTS.map((s) => ({ slotName: s, time: DEFAULT_TIMES[s], items: [] }))
    }))
  };
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getPatients = createServerFn({
  method: "GET"
}).handler(createSsrRpc("66af482de39a6f8183715cde3c2da0f2b1cca898fcb9fa1c8b0d9a3a3acf1fb3"));
const addPatient = createServerFn({
  method: "POST"
}).handler(createSsrRpc("0be4c5e2fb38d0d04ca779c54fc9bcd56845ba36585f434eb043d3a83c0abaed"));
const updatePatient = createServerFn({
  method: "POST"
}).handler(createSsrRpc("375d997bd1a4828cf68e97f84fc29c8bafed29b37f9a18ed2f0c2cf37cb292dc"));
const getFoods = createServerFn({
  method: "GET"
}).handler(createSsrRpc("7aa5e07fa5742934acc25a1ac72ea66b4003fc6052a69a3bfec34905ff3c0bbf"));
const addFood = createServerFn({
  method: "POST"
}).handler(createSsrRpc("2261613e621672cf612b2a746c83b30ebbce91c4084579d7b45ef72a11d63e17"));
const updateFood = createServerFn({
  method: "POST"
}).handler(createSsrRpc("42ac39f2959eaa3d8152cb30609721ba34cd7aeab93061b7a262f8ff207308a9"));
const deleteFood = createServerFn({
  method: "POST"
}).handler(createSsrRpc("4a054d10d5a5732fa92e0edc20fecc809429be5855f482bc12f27624383226ee"));
const getPlanForPatient = createServerFn({
  method: "GET"
}).handler(createSsrRpc("755e2d6cacd1a25565bc1233237561ddb031c0a989955e02a221e0b0f4c75112"));
const savePlan = createServerFn({
  method: "POST"
}).handler(createSsrRpc("f452290df2ee5c30fd2396414c5b4b2d92ee3001f4514240cafe4b5cfefded4d"));
const deletePatient = createServerFn({
  method: "POST"
}).handler(createSsrRpc("c260d2d6674852f91abad0d06aa0b32e0dbad59e8885851140a70962e4cb953b"));
const getProgressForPatient = createServerFn({
  method: "GET"
}).handler(createSsrRpc("8542ceca8f92e07044762468e1d9b43091d9c337b3383d8950bc33eb18763fd7"));
const addProgressEntry = createServerFn({
  method: "POST"
}).handler(createSsrRpc("f753cc5a6a451f7ffc6c166fe8f25268accb08e2728e9a60a1fa43d2e9001fa9"));
const updateProgressEntry = createServerFn({
  method: "POST"
}).handler(createSsrRpc("c418bd9896403311ccd7fe87bffcf795c15617fb4a0f5bb7c861e2270056a1ea"));
const deleteProgressEntry = createServerFn({
  method: "POST"
}).handler(createSsrRpc("55e750c373d5c050d313bf4afbab306c84a10fe3b2f0633ccb6ed2a65c7b1e97"));
const Ctx = reactExports.createContext(null);
function StoreProvider({ children }) {
  const queryClient = useQueryClient();
  const { data: patients = [], isLoading: loadingPatients } = useQuery({
    queryKey: ["patients"],
    queryFn: () => getPatients()
  });
  const { data: foods = [], isLoading: loadingFoods } = useQuery({
    queryKey: ["foods"],
    queryFn: () => getFoods()
  });
  const addPatientMutation = useMutation({
    mutationFn: (p) => addPatient({ data: p }),
    onSuccess: (newPatient) => {
      queryClient.setQueryData(["patients"], (old = []) => [...old, newPatient]);
    }
  });
  const updatePatientMutation = useMutation({
    mutationFn: (args) => updatePatient({ data: args }),
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: ["patients"] });
      const prev = queryClient.getQueryData(["patients"]);
      queryClient.setQueryData(
        ["patients"],
        (old = []) => old.map((p) => p.id === id ? { ...p, ...patch } : p)
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["patients"], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["patients"] })
  });
  const deletePatientMutation = useMutation({
    mutationFn: (id) => deletePatient({ data: id }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["patients"] });
      const prev = queryClient.getQueryData(["patients"]);
      queryClient.setQueryData(
        ["patients"],
        (old = []) => old.filter((p) => p.id !== id)
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["patients"], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["patients"] })
  });
  const addFoodMutation = useMutation({
    mutationFn: (f) => addFood({ data: f }),
    onSuccess: (newFood) => {
      queryClient.setQueryData(["foods"], (old = []) => [newFood, ...old]);
    }
  });
  const updateFoodMutation = useMutation({
    mutationFn: (args) => updateFood({ data: args }),
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: ["foods"] });
      const prev = queryClient.getQueryData(["foods"]);
      queryClient.setQueryData(
        ["foods"],
        (old = []) => old.map((f) => f.id === id ? { ...f, ...patch } : f)
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["foods"], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["foods"] })
  });
  const deleteFoodMutation = useMutation({
    mutationFn: (id) => deleteFood({ data: id }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["foods"] });
      const prev = queryClient.getQueryData(["foods"]);
      queryClient.setQueryData(
        ["foods"],
        (old = []) => old.filter((f) => f.id !== id)
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["foods"], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["foods"] })
  });
  const savePlanMutation = useMutation({
    mutationFn: (plan) => savePlan({ data: plan }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["plan", data.patientId] });
    }
  });
  const addProgressMutation = useMutation({
    mutationFn: (e) => addProgressEntry({ data: e }),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["progress", vars.patientId] });
    }
  });
  const updateProgressMutation = useMutation({
    mutationFn: (args) => updateProgressEntry({ data: args })
  });
  const deleteProgressMutation = useMutation({
    mutationFn: (id) => deleteProgressEntry({ data: id })
  });
  const value = {
    patients,
    foods,
    plans: [],
    loading: loadingPatients || loadingFoods,
    addPatient: async (p) => {
      return await addPatientMutation.mutateAsync(p);
    },
    updatePatient: async (id, patch) => {
      await updatePatientMutation.mutateAsync({ id, patch });
    },
    deletePatient: async (id) => {
      await deletePatientMutation.mutateAsync(id);
    },
    addFood: async (f) => {
      return await addFoodMutation.mutateAsync(f);
    },
    updateFood: async (id, patch) => {
      await updateFoodMutation.mutateAsync({ id, patch });
    },
    deleteFood: async (id) => {
      await deleteFoodMutation.mutateAsync(id);
    },
    savePlan: async (plan) => {
      return await savePlanMutation.mutateAsync(plan);
    },
    getPlanForPatient: async (patientId) => {
      const plan = await getPlanForPatient({ data: patientId });
      if (plan) return plan;
      const patient = patients.find((p) => p.id === patientId);
      return emptyPlan(patientId, patient?.name ?? "Patient");
    },
    getProgressForPatient: async (patientId) => {
      return await getProgressForPatient({ data: patientId });
    },
    addProgressEntry: async (entry) => {
      return await addProgressMutation.mutateAsync(entry);
    },
    updateProgressEntry: async (id, patch) => {
      await updateProgressMutation.mutateAsync({ id, patch });
    },
    deleteProgressEntry: async (id, patientId) => {
      await deleteProgressMutation.mutateAsync(id);
      queryClient.invalidateQueries({ queryKey: ["progress", patientId] });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx.Provider, { value, children });
}
function useStore() {
  const ctx = reactExports.useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const verifyPassword = createServerFn({
  method: "POST"
}).handler(createSsrRpc("9148d632394f7e1af801c872f3a8498973e241b0d2d8ef455868fa086f9fe6fd"));
const AUTH_KEY = "aahar_jeevan_auth";
const AuthContext = reactExports.createContext(null);
function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);
  const login = reactExports.useCallback(async (password) => {
    const result = await verifyPassword({ data: password });
    if (result.success) {
      localStorage.setItem(AUTH_KEY, "true");
      setIsAuthenticated(true);
    }
  }, []);
  const logout = reactExports.useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value: { isAuthenticated, login, logout, loading }, children });
}
function useAuth() {
  const ctx = reactExports.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = Root.displayName;
const logo = "/assets/logo-Bk6nDpxq.png";
function LoginScreen() {
  const { login } = useAuth();
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [showPw, setShowPw] = reactExports.useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!password.trim()) return;
    setError("");
    setLoading(true);
    try {
      await login(password);
    } catch (err) {
      setError("Incorrect password. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-gradient-to-br from-[oklch(0.97_0.02_75)] via-background to-[oklch(0.95_0.04_145)] px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-card/80 p-8 shadow-xl backdrop-blur-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex flex-col items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-white p-3 shadow-md ring-1 ring-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo, alt: "Aahar Jeevan", className: "h-16 w-16 object-contain" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-[var(--dark-green)]", children: "Aahar Jeevan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: "Nutritionist Workspace" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "password", className: "mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            "Password"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "password",
                type: showPw ? "text" : "password",
                placeholder: "Enter your password",
                value: password,
                onChange: (e) => {
                  setPassword(e.target.value);
                  setError("");
                },
                className: "pr-10",
                autoFocus: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowPw(!showPw),
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground",
                tabIndex: -1,
                children: showPw ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full gap-2", size: "lg", disabled: loading || !password.trim(), children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse", children: "Verifying..." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
          "Login"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-center text-xs text-muted-foreground", children: "Shobhana Thakkar · Internationally Certified Nutritionist" })
  ] }) });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$5 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" }
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com"
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap"
      },
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$5.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGate, { queryClient }) }) });
}
function AuthGate({ queryClient }) {
  const { isAuthenticated, loading, logout } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground animate-pulse text-lg", children: "Loading..." }) });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoginScreen, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(StoreProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: logout,
        className: "fixed bottom-4 right-4 z-50 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-md backdrop-blur-sm transition hover:bg-destructive/10 hover:text-destructive print:hidden",
        children: "Logout"
      }
    )
  ] });
}
const $$splitComponentImporter$4 = () => import("./clients-BRfnvTKo.mjs");
const Route$4 = createFileRoute("/clients")({
  head: () => ({
    meta: [{
      title: "Client List — Aahar Jeevan"
    }, {
      name: "description",
      content: "Search, sort, and manage your nutrition clients."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const Dialog = Root$1;
const DialogPortal = Portal;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = Title.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = Description.displayName;
const $$splitComponentImporter$3 = () => import("./catalogue-dIS2DLPR.mjs");
const Route$3 = createFileRoute("/catalogue")({
  head: () => ({
    meta: [{
      title: "Food Catalogue — Aahar Jeevan"
    }, {
      name: "description",
      content: "Manage your shared food catalogue used across all client diet plans."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
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
const $$splitComponentImporter$2 = () => import("./index-C870Ftp7.mjs");
const Route$2 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Aahar Jeevan — Nutritionist Workspace"
    }, {
      name: "description",
      content: "Manage clients, design weekly diet plans, and export PDFs — all in one place."
    }, {
      property: "og:title",
      content: "Aahar Jeevan"
    }, {
      property: "og:description",
      content: "Nutritionist workspace for client management and diet planning."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./progress._patientId-Dgk8Gktp.mjs");
const Route$1 = createFileRoute("/progress/$patientId")({
  head: () => ({
    meta: [{
      title: "Progress Tracker — Aahar Jeevan"
    }, {
      name: "description",
      content: "Track client body measurements week by week."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./planner._patientId-CbxuOdto.mjs");
const Route = createFileRoute("/planner/$patientId")({
  head: () => ({
    meta: [{
      title: "Diet Planner — Aahar Jeevan"
    }, {
      name: "description",
      content: "Design weekly diet plans for your clients."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ClientsRoute = Route$4.update({
  id: "/clients",
  path: "/clients",
  getParentRoute: () => Route$5
});
const CatalogueRoute = Route$3.update({
  id: "/catalogue",
  path: "/catalogue",
  getParentRoute: () => Route$5
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$5
});
const ProgressPatientIdRoute = Route$1.update({
  id: "/progress/$patientId",
  path: "/progress/$patientId",
  getParentRoute: () => Route$5
});
const PlannerPatientIdRoute = Route.update({
  id: "/planner/$patientId",
  path: "/planner/$patientId",
  getParentRoute: () => Route$5
});
const rootRouteChildren = {
  IndexRoute,
  CatalogueRoute,
  ClientsRoute,
  PlannerPatientIdRoute,
  ProgressPatientIdRoute
};
const routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Button as B,
  Dialog as D,
  FoodDialog as F,
  Input as I,
  Label as L,
  Route$1 as R,
  Textarea as T,
  DialogContent as a,
  DialogHeader as b,
  cn as c,
  DialogTitle as d,
  DialogFooter as e,
  Route as f,
  DAYS as g,
  buttonVariants as h,
  logo as l,
  router as r,
  useStore as u
};
