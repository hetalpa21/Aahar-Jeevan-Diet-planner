import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { getPlanForPatient, savePlan, getDashboardStats } from "@/lib/api/database.functions";
import { getPlanStatus } from "@/lib/types";
import type { Gender } from "@/lib/types";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { useAuth } from "@/lib/useAuth";
import {
  Users, Plus, Search, Bell, Home, BookOpen,
  UtensilsCrossed, TrendingUp, LogOut, Copy, FilePlus,
  Check, ChevronRight, Activity, Leaf, UserPlus, Apple, FileText
} from "lucide-react";

export const Route = createFileRoute("/")(  {
  head: () => ({
    meta: [
      { title: "Dashboard — Aahar Jeevan" },
      { name: "description", content: "Your nutritionist workspace dashboard." },
    ],
  }),
  component: Dashboard,
});

/* ─── Recently-viewed helpers ─── */
interface RecentEntry { patientId: string; name: string; viewedAt: string }
const RV_KEY = "aahar_recently_viewed";
function getRecentlyViewed(): RecentEntry[] {
  try { return JSON.parse(localStorage.getItem(RV_KEY) || "[]"); } catch { return []; }
}

/* ─── Greeting helper ─── */
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
function todayStr() {
  return new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

/* ═══════════════════════════════════════════════════════════ */
function Dashboard() {
  const navigate = useNavigate();
  const store = useStore();
  const { logout } = useAuth();

  /* ── Stats ── */
  const [stats, setStats] = useState({ totalPlans: 0, activePlans: 0 });
  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {});
  }, []);

  const thisMonthCount = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return store.patients.filter((p) => new Date(p.createdAt) >= startOfMonth).length;
  }, [store.patients]);

  /* ── Recently viewed ── */
  const [recentlyViewed, setRecentlyViewed] = useState<RecentEntry[]>([]);
  useEffect(() => {
    const updateRV = () => setRecentlyViewed(getRecentlyViewed());
    updateRV();
    window.addEventListener("focus", updateRV);
    return () => window.removeEventListener("focus", updateRV);
  }, []);

  /* ── Search ── */
  const [searchQ, setSearchQ] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchResults = useMemo(() => {
    if (!searchQ.trim()) return [];
    const q = searchQ.toLowerCase();
    return store.patients
      .filter((p) => p.name.toLowerCase().includes(q) || (p.contact && p.contact.includes(q)))
      .slice(0, 6);
  }, [store.patients, searchQ]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  /* ── New-patient dialog ── */
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", age: "", contact: "", currentWeight: "", idealWeight: "",
    height: "", chest: "", waist: "", lowerWaist: "", thigh: "", gender: "" as Gender | "",
  });
  const [planDuration, setPlanDuration] = useState<number | null>(null);
  const [customDuration, setCustomDuration] = useState("");
  const [planMode, setPlanMode] = useState<"new" | "copy">("new");
  const [sourcePatientId, setSourcePatientId] = useState<string | null>(null);
  const [useDefaultPlan, setUseDefaultPlan] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const filteredPatients = useMemo(() => {
    if (!patientSearch.trim()) return store.patients;
    const q = patientSearch.toLowerCase();
    return store.patients.filter((p) => p.name.toLowerCase().includes(q));
  }, [store.patients, patientSearch]);
  const sourcePatient = store.patients.find((p) => p.id === sourcePatientId);

  useEffect(() => {
    if (useDefaultPlan) {
      const defaultPatient = store.patients.find((p) => p.name.toLowerCase() === "ankitaji sindhe");
      if (defaultPatient) {
        setPlanMode("copy");
        setSourcePatientId(defaultPatient.id);
      }
    } else {
      setPlanMode("new");
      setSourcePatientId(null);
    }
  }, [useDefaultPlan, store.patients]);

  const heightM = Number(form.height) / 100;
  const weightKg = Number(form.currentWeight);
  const bmi = heightM > 0 && weightKg > 0 ? weightKg / (heightM * heightM) : 0;
  const bmiRounded = bmi ? Math.round(bmi * 10) / 10 : 0;

  function resetForm() {
    setForm({ name: "", age: "", contact: "", currentWeight: "", idealWeight: "", height: "", chest: "", waist: "", lowerWaist: "", thigh: "", gender: "" });
    setPlanMode("new");
    setSourcePatientId(null);
    setUseDefaultPlan(false);
    setPlanDuration(3);
    setCustomDuration("");
    setSubmitted(false);
  }

  const effectiveDuration = planDuration === -1 ? (Number(customDuration) || 0) : (planDuration ?? 0);

  /* ── Progress patient selector ── */
  const [progressOpen, setProgressOpen] = useState(false);
  const [progressSearch, setProgressSearch] = useState("");
  const progressFiltered = useMemo(() => {
    if (!progressSearch.trim()) return store.patients;
    const q = progressSearch.toLowerCase();
    return store.patients.filter((p) => p.name.toLowerCase().includes(q));
  }, [store.patients, progressSearch]);

  async function submit() {
    setSubmitted(true);
    if (!form.name.trim()) { toast.error("Patient name is required"); return; }
    if (planMode === "copy" && !sourcePatientId) { toast.error("Please select a patient to copy from"); return; }
    try {
      const today = new Date();
      const startDate = today.toISOString().split("T")[0];
      let endDate: string | undefined;
      if (effectiveDuration > 0) {
        const end = new Date(today);
        end.setMonth(end.getMonth() + effectiveDuration);
        endDate = end.toISOString().split("T")[0];
      }
      const p = await store.addPatient({
        name: form.name.trim(), age: Number(form.age) || 0, contact: form.contact,
        currentWeight: Number(form.currentWeight) || 0,
        idealWeight: Number(form.idealWeight) || undefined,
        height: Number(form.height) || undefined,
        chest: Number(form.chest) || undefined,
        waist: Number(form.waist) || undefined,
        lowerWaist: Number(form.lowerWaist) || undefined,
        thigh: Number(form.thigh) || undefined,
        bmi: bmiRounded || undefined,
        gender: form.gender || undefined,
        paymentStatus: "Pending",
        planStartDate: effectiveDuration > 0 ? startDate : undefined,
        planDurationMonths: effectiveDuration > 0 ? effectiveDuration : undefined,
        planEndDate: endDate,
      });
      if (planMode === "copy" && sourcePatientId) {
        try {
          const sourcePlan = await getPlanForPatient({ data: sourcePatientId });
          if (sourcePlan) {
            await savePlan({ data: { ...sourcePlan, id: "", patientId: p.id, isDraft: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } });
            if (useDefaultPlan) {
              toast.success(`Added ${p.name} with default plan`);
            } else {
              toast.success(`Added ${p.name} with copied plan from ${sourcePatient?.name}`);
            }
          } else { toast.success(`Added ${p.name} (source had no plan)`); }
        } catch { toast.success(`Added ${p.name} (plan copy failed)`); }
      } else { toast.success(`Added ${p.name}`); }
      resetForm(); setOpen(false);
      navigate({ to: "/planner/$patientId", params: { patientId: p.id } });
    } catch (err: any) { toast.error(err.message || "Failed to add patient"); }
  }

  /* ── Initials helper ── */
  function initials(name: string) {
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  return (
    <div className="flex min-h-screen bg-[#faf9f7] print:hidden">
      <AppSidebar />
      {/* ══════ MAIN CONTENT ══════ */}
      <main className="ml-[72px] flex-1 px-8 py-8 sm:px-16 sm:py-12 lg:px-24">
        {/* ── Top bar: date + greeting + bell ── */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-sm text-[#8a8580]">{todayStr()}</p>
            <h1 className="text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
              {greeting()}, Shobhana Thakkar
            </h1>
          </div>
        </div>

        {/* ── Search bar + New patient ── */}
        <div className="mb-6 flex items-center gap-3">
          <div ref={searchRef} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b5b0ab]" />
            <input
              type="text"
              placeholder="Search clients by name or phone"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="h-11 w-full rounded-full border border-[#e8e5e1] bg-[#faf9f7] pl-10 pr-4 text-sm text-[#1a1a1a] shadow-none outline-none transition placeholder:text-[#b5b0ab] focus:border-[#00361a]/40 focus:bg-white focus:ring-2 focus:ring-[#00361a]/10"
            />
            {/* Search dropdown */}
            {searchFocused && searchQ.trim() && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-[#e8e5e1] bg-white shadow-lg">
                {searchResults.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-[#8a8580]">No patients found</p>
                ) : (
                  searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setSearchQ(""); setSearchFocused(false); navigate({ to: "/planner/$patientId", params: { patientId: p.id } }); }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#f5f3f0]"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f5e9] text-xs font-bold text-[#00361a]">
                        {initials(p.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#1a1a1a]">{p.name}</p>
                        {p.contact && <p className="text-xs text-[#8a8580]">{p.contact}</p>}
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#ccc]" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <Button
            onClick={() => { resetForm(); setOpen(true); }}
            className="h-10 gap-1.5 rounded-full bg-[#1b4d2e] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#1b4d2e]/90"
          >
            <UserPlus className="h-4 w-4" /> New patient
          </Button>
        </div>

        {/* ── Stats cards row ── */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Total clients */}
          <div className="rounded-2xl bg-gradient-to-br from-[#e8f5e9] to-[#f1f8f2] p-6 py-8 shadow-sm lg:col-span-6 flex flex-col justify-center">
            <p className="text-sm font-medium text-[#2e7d32]">Total clients</p>
            <p className="mt-2 text-5xl font-extrabold text-[#00361a]">{store.patients.length}</p>
            <p className="mt-1 text-xs font-medium text-[#2e7d32]/70">+{thisMonthCount} this month</p>
          </div>
          {/* Plans & Active sub-grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-6">
            {/* Plans created */}
            <div className="rounded-2xl border border-[#e8e5e1] bg-white p-6 py-8 shadow-sm flex flex-col justify-center">
              <p className="text-sm font-medium text-[#8a8580]">Plans created</p>
              <p className="mt-2 text-4xl font-extrabold text-[#1a1a1a]">{stats.totalPlans}</p>
            </div>
            {/* Active plans */}
            <div className="rounded-2xl border border-[#e8e5e1] bg-white p-6 py-8 shadow-sm flex flex-col justify-center">
              <p className="text-sm font-medium text-[#8a8580]">Active plans</p>
              <p className="mt-2 text-4xl font-extrabold text-[#1a1a1a]">
                {store.patients.filter((p) => getPlanStatus(p) === "On Track").length}
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom row ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Recently viewed */}
          <div className="rounded-2xl border border-[#e8e5e1] bg-white p-5 shadow-sm lg:col-span-6">
            <h2 className="mb-4 text-base font-bold text-[#1a1a1a]">Recently viewed</h2>
            {recentlyViewed.length === 0 ? (
              <p className="py-4 text-center text-sm text-[#b5b0ab]">
                No recently viewed patients. Open a patient's planner to see them here.
              </p>
            ) : (
              <div className="space-y-1">
                {recentlyViewed.slice(0, 3).map((rv, idx) => {
                  const patient = store.patients.find(p => p.id === rv.patientId);
                  const status = patient ? getPlanStatus(patient) : "No Plan";
                  return (
                    <button
                      key={rv.patientId}
                      onClick={() => navigate({ to: "/planner/$patientId", params: { patientId: rv.patientId } })}
                      className={`flex w-full items-center gap-4 px-1 py-3 text-left transition hover:bg-[#faf9f7] ${idx !== recentlyViewed.slice(0, 3).length - 1 ? "border-b border-[#f0eeeb]" : ""}`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0eeeb] text-xs font-bold text-[#1a1a1a]">
                        {initials(rv.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#1a1a1a]">{rv.name}</p>
                        <p className="text-xs text-[#8a8580]">{timeAgo(rv.viewedAt)}</p>
                      </div>
                      {status === "On Track" && <span className="rounded-full bg-[var(--dark-green)] text-white px-3 py-1 text-xs font-medium">On Track</span>}
                      {status === "Completed" && <span className="rounded-full bg-muted text-muted-foreground px-3 py-1 text-xs font-medium">Completed</span>}
                      {status === "No Plan" && <span className="rounded-full bg-muted/50 text-muted-foreground/50 px-3 py-1 text-xs font-medium">No Plan</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right column — Food catalogue + Progress */}
          <div className="flex flex-col gap-4 lg:col-span-6">
            {/* Food catalogue card */}
            <button
              onClick={() => navigate({ to: "/catalogue" })}
              className="group flex flex-1 items-center justify-between rounded-2xl bg-gradient-to-br from-[#fde7db] to-[#fde7db] p-6 py-8 shadow-sm transition hover:shadow-md text-left"
            >
              <div>
                <p className="text-sm font-medium text-[#d95d39]">Food catalogue</p>
                <p className="mt-2 text-3xl font-bold text-[#8a3b1a]">{store.foods.length} items indexed</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e67e50] text-white transition group-hover:scale-105">
                <Apple className="h-6 w-6" />
              </div>
            </button>

            {/* Patient progress card */}
            <button
              onClick={() => { setProgressSearch(""); setProgressOpen(true); }}
              className="group flex flex-1 items-center justify-between rounded-2xl bg-gradient-to-br from-[#e8f5e9] to-[#e8f5e9] p-6 py-8 shadow-sm transition hover:shadow-md text-left"
            >
              <div>
                <p className="text-sm font-medium text-[#2e7d32]">Patient progress</p>
                <p className="mt-2 text-3xl font-bold text-[#00361a]">Track updates</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1b4d2e] text-white transition group-hover:scale-105">
                <TrendingUp className="h-6 w-6" />
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* ══════ NEW PATIENT DIALOG ══════ */}
      <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); setOpen(o); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white border-[#e8e5e1] shadow-xl sm:rounded-2xl sm:max-w-2xl">
          <DialogHeader><DialogTitle className="text-xl text-[var(--dark-green)]">New Patient</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            
            {/* --- Basic Info --- */}
            <div>
              <h4 className="mb-3 text-sm font-bold text-[#00361a] border-b border-[#e8e5e1] pb-1">Basic Info</h4>
              <div className="grid gap-4">
                <Field label="Name *">
                  <Input 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    className={submitted && !form.name.trim() ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-[#00361a]/20"} 
                  />
                </Field>
                <Field label="Gender">
                  <div className="flex gap-2">
                    {(["Male", "Female", "Other"] as Gender[]).map((g) => (
                      <button key={g} type="button" onClick={() => setForm({ ...form, gender: g })}
                        className={"flex items-center justify-center gap-2 flex-1 rounded-md border px-3 py-2 text-sm font-medium transition " + (form.gender === g ? "border-[#00361a] bg-[#00361a] text-white" : "border-input bg-white text-foreground hover:bg-muted")}
                      >
                        {form.gender === g && <Check className="h-3.5 w-3.5" />}
                        {g}
                      </button>
                    ))}
                  </div>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Age"><Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="focus-visible:ring-[#00361a]/20" /></Field>
                  <Field label="Contact"><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="focus-visible:ring-[#00361a]/20" /></Field>
                </div>
              </div>
            </div>

            {/* --- Measurements --- */}
            <div className="mt-2">
              <h4 className="mb-3 text-sm font-bold text-[#00361a] border-b border-[#e8e5e1] pb-1">Measurements</h4>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Current weight (kg)"><Input type="number" value={form.currentWeight} onChange={(e) => setForm({ ...form, currentWeight: e.target.value })} className="focus-visible:ring-[#00361a]/20" /></Field>
                  <Field label="Ideal body weight (kg)">
                    <Input type="number" value={form.idealWeight} onChange={(e) => setForm({ ...form, idealWeight: e.target.value })} className="focus-visible:ring-[#00361a]/20" />
                    {Number(form.idealWeight) > 0 && (
                      <div className="mt-1 text-xs text-muted-foreground">Range: <span className="font-semibold text-[#00361a]">{Math.max(0, Number(form.idealWeight) - 5).toFixed(1)}</span> – <span className="font-semibold text-[#00361a]">{(Number(form.idealWeight) + 5).toFixed(1)}</span> kg (±5)</div>
                    )}
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Field label="Height (cm)"><Input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} className="focus-visible:ring-[#00361a]/20" /></Field>
                  <Field label="Chest (in)"><Input type="number" value={form.chest} onChange={(e) => setForm({ ...form, chest: e.target.value })} className="focus-visible:ring-[#00361a]/20" /></Field>
                  <Field label="Waist (in)"><Input type="number" value={form.waist} onChange={(e) => setForm({ ...form, waist: e.target.value })} className="focus-visible:ring-[#00361a]/20" /></Field>
                  <Field label="Lower waist (in)"><Input type="number" value={form.lowerWaist} onChange={(e) => setForm({ ...form, lowerWaist: e.target.value })} className="focus-visible:ring-[#00361a]/20" /></Field>
                  <Field label="Thigh (in)"><Input type="number" value={form.thigh} onChange={(e) => setForm({ ...form, thigh: e.target.value })} className="focus-visible:ring-[#00361a]/20" /></Field>
                  <Field label="BMI (auto)">
                    <div className="flex h-9 items-center rounded-md border border-[#e8e5e1] bg-[#faf9f7] px-3 text-sm">
                      {bmiRounded ? <span className="font-semibold text-[#00361a]">{bmiRounded}</span> : <span className="text-muted-foreground">Enter height & weight</span>}
                    </div>
                  </Field>
                </div>
              </div>
            </div>
            {/* --- Diet Plan Setup --- */}
            <div className="mt-2">
              <h4 className="mb-3 text-sm font-bold text-[#00361a] border-b border-[#e8e5e1] pb-1">Diet Plan Setup</h4>
              <div className="mb-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="defaultPlan"
                  checked={useDefaultPlan}
                  onChange={(e) => setUseDefaultPlan(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-[#00361a]"
                />
                <label htmlFor="defaultPlan" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Use Default Plan
                </label>
              </div>

              {!useDefaultPlan && (
                <>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => { setPlanMode("new"); setSourcePatientId(null); setPatientSearch(""); }}
                        className={"flex items-center gap-2 rounded-md border px-4 py-2.5 text-left text-sm font-medium transition " + (planMode === "new" ? "border-[#00361a] bg-[#00361a] text-white" : "border-input bg-background hover:bg-muted")}
                      >
                        Start Fresh
                      </button>
                      <button type="button" onClick={() => setPlanMode("copy")}
                        className={"flex items-center gap-2 rounded-md border px-4 py-2.5 text-left text-sm font-medium transition " + (planMode === "copy" ? "border-[#00361a] bg-[#00361a] text-white" : "border-input bg-background hover:bg-muted")}
                      >
                        Copy from Patient
                      </button>
                    </div>
                  </div>
                  {planMode === "copy" && (
                    <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
                      <div className="relative mb-2">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input placeholder="Search patient..." value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} className="h-8 pl-8 text-sm" />
                      </div>
                      <div className="max-h-36 space-y-1 overflow-y-auto">
                        {filteredPatients.length === 0 ? (
                          <p className="py-2 text-center text-xs text-muted-foreground">No patients found</p>
                        ) : filteredPatients.map((p) => (
                          <button key={p.id} type="button" onClick={() => setSourcePatientId(p.id)}
                            className={"flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition " + (sourcePatientId === p.id ? "bg-[#00361a] font-medium text-white" : "text-foreground hover:bg-muted")}
                          >
                            {sourcePatientId === p.id && <Check className="h-3.5 w-3.5 shrink-0" />}
                            <span className="truncate">{p.name}</span>
                            {p.contact && <span className="ml-auto text-xs opacity-70">{p.contact}</span>}
                          </button>
                        ))}
                      </div>
                      {sourcePatient && <p className="mt-2 text-xs font-medium text-[var(--dark-green)]">✓ Will copy diet plan from: {sourcePatient.name}</p>}
                    </div>
                  )}
                </>
              )}
                {/* Plan Duration */}
                <div className="mt-4">
                  <Label className="mb-2 block text-sm font-semibold text-[#00361a]">Plan Duration</Label>
              <div className="flex flex-wrap gap-2">
                {[3, 6, 12].map((m) => (
                  <button key={m} type="button" onClick={() => { setPlanDuration(m); setCustomDuration(""); }}
                    className={"rounded-md border px-4 py-2 text-sm font-medium transition " + (planDuration === m ? "border-[#00361a] bg-[#00361a] text-white" : "border-input bg-background text-foreground hover:bg-muted")}
                  >{m} month{m > 1 ? "s" : ""}</button>
                ))}
                <button type="button" onClick={() => setPlanDuration(-1)}
                  className={"rounded-md border px-4 py-2 text-sm font-medium transition " + (planDuration === -1 ? "border-[#00361a] bg-[#00361a] text-white" : "border-input bg-background text-foreground hover:bg-muted")}
                >Custom</button>
              </div>
              {planDuration === -1 && (
                <div className="mt-2 flex items-center gap-2">
                  <Input type="number" min="1" placeholder="Enter months" value={customDuration} onChange={(e) => setCustomDuration(e.target.value)} className="w-32" />
                  <span className="text-sm text-muted-foreground">months</span>
                </div>
              )}
              {effectiveDuration > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Plan will run from <span className="font-semibold text-[#00361a]">{new Date().toLocaleDateString()}</span> to <span className="font-semibold text-[#00361a]">{(() => { const d = new Date(); d.setMonth(d.getMonth() + effectiveDuration); return d.toLocaleDateString(); })()}</span>
                </p>
              )}
            </div>
          </div>
        </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }}>Cancel</Button>
            <Button onClick={submit} className="bg-[#00361a] hover:bg-[#1b4d2e]">{planMode === "copy" ? "Save & Copy Plan" : "Save & Create Plan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════ PROGRESS PATIENT SELECTOR DIALOG ══════ */}
      <Dialog open={progressOpen} onOpenChange={setProgressOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Select a Patient</DialogTitle></DialogHeader>
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
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f5e9] text-xs font-bold text-[#2e7d32]">{initials(p.name)}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  {p.contact && <p className="text-xs text-muted-foreground">{p.contact}</p>}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── Sidebar icon ─── */
function SidebarIcon({ icon, label, active, to }: { icon: React.ReactNode; label: string; active?: boolean; to: string }) {
  return (
    <Link
      to={to}
      title={label}
      className={
        "flex h-9 w-9 items-center justify-center rounded-full transition " +
        (active
          ? "bg-[#1b4d2e] text-white shadow-sm"
          : "text-[#b5b0ab] hover:bg-[#f5f3f0] hover:text-[#1a1a1a]")
      }
    >
      {icon}
    </Link>
  );
}

/* ─── Field helper ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}
