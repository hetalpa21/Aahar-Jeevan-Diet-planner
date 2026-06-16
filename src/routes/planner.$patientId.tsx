import { createFileRoute, useNavigate, useBlocker } from "@tanstack/react-router";
import { useEffect, useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import {
  DAYS,
  SLOTS,
  type DayKey,
  type FoodItem,
  type Plan,
  type PlanItem,
  type SlotName,
  type PaymentStatus,
} from "@/lib/types";
import type { Instruction, PlanInstructions } from "@/lib/types";
import { Home, Plus, Search, Trash2, Pencil, Copy, X, Printer, ArrowRight, ArrowLeft, CheckCircle2, IndianRupee, Check, Undo2, Redo2, FileText, ListX } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { FoodDialog } from "./catalogue";

type PlannerStep = "planner" | "instructions" | "review";

export const Route = createFileRoute("/planner/$patientId")({
  head: () => ({
    meta: [
      { title: "Diet Planner — Aahar Jeevan" },
      { name: "description", content: "Design weekly diet plans for your clients." },
    ],
  }),
  component: Planner,
});

function Planner() {
  const { patientId } = Route.useParams();
  const navigate = useNavigate();
  const store = useStore();
  const patient = store.patients.find((p) => p.id === patientId);

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [dirty, setDirty] = useState(false);
  const blocker = useBlocker({ shouldBlockFn: () => dirty, enableBeforeUnload: dirty, withResolver: true });
  const [day, setDay] = useState<DayKey>("Mon");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [step, setStep] = useState<PlannerStep>("planner");
  const [saving, setSaving] = useState(false);
  const [deleteFoodTarget, setDeleteFoodTarget] = useState<FoodItem | null>(null);
  const [copyPopover, setCopyPopover] = useState(false);
  const [copyTargets, setCopyTargets] = useState<DayKey[]>([]);
  
  const [foodDialog, setFoodDialog] = useState<{ open: boolean; food: FoodItem | null }>({ open: false, food: null });

  useEffect(() => {
    async function loadPlan() {
      try {
        const p = await store.getPlanForPatient(patientId);
        setPlan(p);
      } catch (err: any) {
        toast.error("Failed to load plan: " + err.message);
      } finally {
        setLoadingPlan(false);
      }
    }
    loadPlan();
  }, [patientId, store.patients.length]);

  const currentDay = plan?.meals.find((m) => m.day === day);
  const categories = useMemo(() => {
    const set = new Set(store.foods.map((f) => f.category ?? "Other"));
    return ["All", ...Array.from(set)];
  }, [store.foods]);
  const filteredFoods = useMemo(() => {
    return store.foods.filter((f) => {
      const matchQ = f.name.toLowerCase().includes(search.toLowerCase());
      const matchC = category === "All" || (f.category ?? "Other") === category;
      return matchQ && matchC;
    });
  }, [store.foods, search, category]);

  // Undo / Redo history
  const historyRef = useRef<Plan[]>([]);
  const futureRef = useRef<Plan[]>([]);
  const [historyLen, setHistoryLen] = useState(0);
  const [futureLen, setFutureLen] = useState(0);

  function update(newPlan: Plan) {
    if (plan) {
      historyRef.current = [...historyRef.current, plan];
      setHistoryLen(historyRef.current.length);
    }
    futureRef.current = [];
    setFutureLen(0);
    setPlan({ ...newPlan, updatedAt: new Date().toISOString() });
    setDirty(true);
  }

  const undo = useCallback(() => {
    if (historyRef.current.length === 0 || !plan) return;
    const prev = historyRef.current[historyRef.current.length - 1];
    historyRef.current = historyRef.current.slice(0, -1);
    setHistoryLen(historyRef.current.length);
    futureRef.current = [...futureRef.current, plan];
    setFutureLen(futureRef.current.length);
    setPlan(prev);
    setDirty(true);
  }, [plan]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0 || !plan) return;
    const next = futureRef.current[futureRef.current.length - 1];
    futureRef.current = futureRef.current.slice(0, -1);
    setFutureLen(futureRef.current.length);
    historyRef.current = [...historyRef.current, plan];
    setHistoryLen(historyRef.current.length);
    setPlan(next);
    setDirty(true);
  }, [plan]);

  // Keyboard shortcuts: Ctrl+Z / Ctrl+Y
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [undo, redo]);

  function addItemToSlot(slot: SlotName, food: FoodItem, portion?: string) {
    if (!plan) return;
    const meals = plan.meals.map((m) =>
      m.day !== day
        ? m
        : {
            ...m,
            slots: m.slots.map((s) =>
              s.slotName !== slot
                ? s
                : { ...s, items: [...s.items, { foodId: food.id, portion: portion ?? food.serving }] },
            ),
          },
    );
    update({ ...plan, meals });
  }

  function removeItem(slot: SlotName, idx: number) {
    if (!plan) return;
    const meals = plan.meals.map((m) =>
      m.day !== day
        ? m
        : { ...m, slots: m.slots.map((s) => (s.slotName !== slot ? s : { ...s, items: s.items.filter((_, i) => i !== idx) })) },
    );
    update({ ...plan, meals });
  }

  function setSlotTime(slot: SlotName, time: string) {
    if (!plan) return;
    const meals = plan.meals.map((m) =>
      m.day !== day
        ? m
        : { ...m, slots: m.slots.map((s) => (s.slotName !== slot ? s : { ...s, time })) },
    );
    update({ ...plan, meals });
  }

  function addSlot() {
    const name = window.prompt("Enter slot name (e.g. Mid-Morning Snack):");
    if (!name?.trim()) return;
    const trimmed = name.trim();
    if (!plan) return;
    // Check if slot already exists in current day
    const exists = plan.meals.find((m) => m.day === day)?.slots.some((s) => s.slotName === trimmed);
    if (exists) { toast.error(`Slot "${trimmed}" already exists`); return; }
    // Add to ALL days so the plan stays consistent
    const meals = plan.meals.map((m) => ({
      ...m,
      slots: [...m.slots, { slotName: trimmed, time: "", items: [] }],
    }));
    update({ ...plan, meals });
    toast.success(`Added slot "${trimmed}"`);
  }

  function renameSlot(oldName: string) {
    const newName = window.prompt(`Rename "${oldName}" to:`, oldName);
    if (!newName?.trim() || newName.trim() === oldName) return;
    const trimmed = newName.trim();
    if (!plan) return;
    const exists = plan.meals.find((m) => m.day === day)?.slots.some((s) => s.slotName === trimmed);
    if (exists) { toast.error(`Slot "${trimmed}" already exists`); return; }
    // Rename across ALL days
    const meals = plan.meals.map((m) => ({
      ...m,
      slots: m.slots.map((s) => s.slotName === oldName ? { ...s, slotName: trimmed } : s),
    }));
    update({ ...plan, meals });
    toast.success(`Renamed to "${trimmed}"`);
  }

  function deleteSlot(slotName: string) {
    if (!plan) return;
    if (!window.confirm(`Delete slot "${slotName}" from all days? Items in it will be lost.`)) return;
    const meals = plan.meals.map((m) => ({
      ...m,
      slots: m.slots.filter((s) => s.slotName !== slotName),
    }));
    update({ ...plan, meals });
    toast.success(`Removed slot "${slotName}"`);
  }

  function duplicateDayTo(targets: DayKey[]) {
    if (!plan || targets.length === 0) return;
    const source = plan.meals.find((m) => m.day === day)!;
    const meals = plan.meals.map((m) =>
      targets.includes(m.day) ? { ...source, day: m.day } : m
    );
    update({ ...plan, meals });
    toast.success(`Copied ${day} → ${targets.join(", ")}`);
    setCopyPopover(false);
    setCopyTargets([]);
  }

  async function save(asDraft: boolean) {
    if (!plan) return;
    const next = { ...plan, isDraft: asDraft, updatedAt: new Date().toISOString() };
    try {
      setSaving(true);
      const saved = await store.savePlan(next);
      setPlan(saved);
      setDirty(false);
      toast.success(asDraft ? "Draft saved" : "Plan saved");
    } catch (err: any) {
      toast.error("Failed to save plan: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveAndNext() {
    if (!plan) return;
    const next = { ...plan, isDraft: false, updatedAt: new Date().toISOString() };
    try {
      setSaving(true);
      const saved = await store.savePlan(next);
      setPlan(saved);
      setDirty(false);
      setStep("instructions");
      toast.success("Plan saved! Now set instructions.");
    } catch (err: any) {
      toast.error("Failed to save plan: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handlePaymentUpdate(status: PaymentStatus, totalAmount?: number, amountReceived?: number) {
    if (!patient) return;
    try {
      await store.updatePatient(patient.id, { paymentStatus: status, totalAmount, amountReceived });
      toast.success(`Payment status updated to ${status}`);
    } catch (err: any) {
      toast.error("Failed to update payment: " + err.message);
    }
  }

  function goHome() {
    navigate({ to: "/" });
  }

  function exportPDF() {
    window.print();
  }

  if (store.loading || loadingPlan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground animate-pulse text-lg">Loading plan details...</p>
      </div>
    );
  }

  if (!patient || !plan || !currentDay) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Patient or plan data not found.</p>
          <Button className="mt-4" onClick={() => navigate({ to: "/clients" })}>Back to Clients</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Planner header */}
      <header className="sticky top-0 z-30 border-b border-border bg-[var(--header-bg)]/95 backdrop-blur-md shadow-sm print:hidden">
        <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-8">
          <button onClick={goHome} className="flex items-center gap-3 group rounded-lg px-2.5 py-1.5 text-[var(--dark-green)] transition hover:bg-muted">
            <img
              src={logo}
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 rounded-xl object-contain shadow-sm ring-1 ring-border/50 transition group-hover:shadow-md group-hover:scale-[1.04]"
            />
            <div className="hidden sm:block text-left">
              <div className="text-sm font-bold leading-tight text-[var(--dark-green)]">Aahar Jeevan</div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Home className="h-3 w-3" />
                Home
              </div>
            </div>
            <Home className="h-4 w-4 sm:hidden" />
          </button>

          {/* Step indicator */}
          <div className="hidden items-center gap-2 sm:flex">
            <div className={"flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition " + (step === "planner" ? "bg-[var(--leaf-green)] text-white" : "bg-muted text-muted-foreground")}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">1</span>
              Diet Plan
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            <div className={"flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition " + (step === "instructions" ? "bg-[var(--leaf-green)] text-white" : "bg-muted text-muted-foreground")}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">2</span>
              Instructions
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            <div className={"flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition " + (step === "review" ? "bg-[var(--leaf-green)] text-white" : "bg-muted text-muted-foreground")}>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">3</span>
              Payment & Export
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step === "planner" ? (
              <>
                <div className="flex items-center gap-1 mr-1">
                  <button
                    onClick={undo}
                    disabled={historyLen === 0}
                    title="Undo (Ctrl+Z)"
                    className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Undo2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={redo}
                    disabled={futureLen === 0}
                    title="Redo (Ctrl+Y)"
                    className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Redo2 className="h-4 w-4" />
                  </button>
                </div>
                <Button variant="outline" onClick={() => save(true)} disabled={saving}>
                  {saving ? "Saving..." : "Save as Draft"}
                </Button>
                <div className="relative">
                  <Button variant="outline" onClick={() => { setCopyPopover(!copyPopover); setCopyTargets([]); }}>
                    <Copy className="mr-1 h-4 w-4" />Duplicate Day
                  </Button>
                  {copyPopover && (
                    <div className="absolute right-0 top-full z-30 mt-1 w-60 rounded-xl border border-border bg-card p-3 shadow-xl">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">Copy <strong>{day}</strong> to:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {DAYS.filter((d) => d !== day).map((d) => {
                          const selected = copyTargets.includes(d);
                          return (
                            <button
                              key={d}
                              onClick={() => setCopyTargets((prev) => selected ? prev.filter((x) => x !== d) : [...prev, d])}
                              className={
                                "flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium transition " +
                                (selected
                                  ? "border-[var(--leaf-green)] bg-[var(--leaf-green)] text-white"
                                  : "border-border bg-background text-foreground hover:bg-muted")
                              }
                            >
                              {selected && <Check className="h-3 w-3" />}
                              {d}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setCopyTargets(DAYS.filter((d) => d !== day))}
                          className="text-xs text-muted-foreground hover:text-foreground transition"
                        >
                          Select all
                        </button>
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="ghost" onClick={() => setCopyPopover(false)}>Cancel</Button>
                          <Button size="sm" disabled={copyTargets.length === 0} onClick={() => duplicateDayTo(copyTargets)}>
                            Copy to {copyTargets.length || ""} day{copyTargets.length !== 1 ? "s" : ""}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Button onClick={saveAndNext} disabled={saving}>
                  {saving ? "Saving..." : <>Save & Next <ArrowRight className="ml-1 h-4 w-4" /></>}
                </Button>
              </>
            ) : step === "instructions" ? (
              <>
                <Button variant="outline" onClick={() => setStep("planner")}>
                  <ArrowLeft className="mr-1 h-4 w-4" />Back to Planner
                </Button>
                <Button onClick={() => setStep("review")}>
                  Next <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setStep("instructions")}>
                  <ArrowLeft className="mr-1 h-4 w-4" />Back to Instructions
                </Button>
                <Button onClick={exportPDF}>
                  <Printer className="mr-1 h-4 w-4" />Export to PDF
                </Button>
              </>
            )}
          </div>
        </div>
        {/* Brand gradient line */}
        <div className="h-[2px] bg-gradient-to-r from-[var(--primary-orange)] via-[var(--leaf-green)] to-[var(--primary-orange)] opacity-60" />
      </header>

      {/* ====== STEP 1: Diet Planner ====== */}
      {step === "planner" && (
        <>
          {/* Day pills */}
          <div className="mx-auto max-w-[1600px] px-4 pt-6 print:hidden sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              {DAYS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDay(d)}
                  className={
                    "min-w-[60px] rounded-md border px-4 py-2 text-sm font-medium transition " +
                    (day === d
                      ? "border-[var(--leaf-green)] bg-[var(--leaf-green)] text-white"
                      : "border-border bg-card text-foreground hover:bg-muted")
                  }
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Select a day to design its meals.</p>
          </div>

          <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_1fr] print:block print:px-0">
            {/* Catalogue panel */}
            <aside className="rounded-xl border border-border bg-card p-4 print:hidden">
              <h2 className="mb-3 text-2xl font-bold text-[var(--dark-green)]">{fullDay(day)}</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search foods" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={
                      "rounded-full px-3 py-1 text-xs transition " +
                      (category === c ? "bg-[var(--leaf-green)] text-white" : "bg-muted text-foreground hover:bg-muted/70")
                    }
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full mb-1" onClick={() => setFoodDialog({ open: true, food: null })}>
                  <Plus className="mr-1 h-4 w-4" /> Add catalogue item
                </Button>
                {filteredFoods.map((f) => (
                  <div key={f.id} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background p-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{f.name}</div>
                      <div className="text-xs text-muted-foreground">{f.notes || f.category || ""}</div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button onClick={() => setFoodDialog({ open: true, food: f })} aria-label="Edit" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteFoodTarget(f)} aria-label="Delete" className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <AddToSlotButton food={f} slots={currentDay.slots.map((s) => s.slotName)} onAdd={(slot, portion) => addItemToSlot(slot, f, portion)} />
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* Day editor */}
            <section className="overflow-x-auto print:overflow-visible">
              <div className={`grid min-w-[900px] gap-3 print:hidden`} style={{ gridTemplateColumns: `repeat(${currentDay.slots.length}, minmax(0, 1fr))` }}>
                {currentDay.slots.map((slot) => {
                  return (
                    <div key={slot.slotName} className="flex flex-col rounded-xl border border-border bg-card p-3">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="truncate text-base font-semibold text-[var(--dark-green)]">{slot.slotName}</h3>
                        <div className="flex shrink-0 gap-0.5">
                          <button onClick={() => renameSlot(slot.slotName)} aria-label="Rename slot" className="rounded p-1 text-muted-foreground hover:bg-muted"><Pencil className="h-3 w-3" /></button>
                          <button onClick={() => deleteSlot(slot.slotName)} aria-label="Delete slot" className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                        </div>
                      </div>
                      <Input
                        type="time"
                        value={slot.time}
                        onChange={(e) => setSlotTime(slot.slotName, e.target.value)}
                        className="mt-2 h-9"
                      />
                      <div className="mt-2 text-xs text-muted-foreground">{slot.items.length} item{slot.items.length === 1 ? "" : "s"}</div>
                      <ul className="mt-3 space-y-2">
                        {slot.items.map((it, idx) => {
                          const food = store.foods.find((f) => f.id === it.foodId);
                          if (!food) return null;
                          return (
                            <li key={idx} className="group flex items-start justify-between gap-2 rounded-md border border-border bg-background p-2">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium">{food.name}</div>
                                <div className="text-xs text-muted-foreground">{it.portion}</div>
                              </div>
                              <button
                                onClick={() => removeItem(slot.slotName, idx)}
                                aria-label="Remove"
                                className="rounded-md p-1 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive print:opacity-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 print:hidden">
                <Button variant="outline" size="sm" onClick={addSlot}><Plus className="mr-1 h-4 w-4" /> Add Slot</Button>
              </div>
            </section>
          </div>
        </>
      )}

      {/* ====== STEP 2: Instructions ====== */}
      {step === "instructions" && plan && (
        <InstructionsStep
          plan={plan}
          store={store}
          onUpdate={(instr) => {
            update({ ...plan, instructions: instr });
          }}
        />
      )}

      {/* ====== STEP 3: Payment & Export Review ====== */}
      {step === "review" && (
        <ReviewStep
          patient={patient}
          plan={plan}
          store={store}
          onPaymentUpdate={handlePaymentUpdate}
          onExportPDF={exportPDF}
          onBack={() => setStep("instructions")}
          onDone={goHome}
        />
      )}

      {/* Print preview — branded export (always in DOM for print) */}
      <div className="print-export hidden print:block">
        <div className="print-header">
          <img src={logo} alt="Aahar Jeevan" className="print-logo" />
          <div className="print-brand">
            <div className="print-brand-name">Shobhana Thakkar</div>
            <div className="print-brand-sub">Internationally Certified Nutritionist</div>
            <div className="print-brand-sub">Mobile: 9687491796</div>
          </div>
        </div>

        <div className="print-patient">
          <div><span className="print-label">Name:</span> <span className="print-value">{patient.name}</span></div>
          <div><span className="print-label">Current Weight:</span> <span className="print-value">{patient.currentWeight ?? "—"} kg</span></div>
          <div><span className="print-label">Ideal Body Weight:</span> <span className="print-value">{patient.idealWeight ?? "—"}{patient.idealWeight ? ` kg (±5: ${Math.max(0, patient.idealWeight - 5).toFixed(1)}–${(patient.idealWeight + 5).toFixed(1)} kg)` : ""}</span></div>
          <div><span className="print-label">BMI:</span> <span className="print-value">{patient.bmi ?? "—"}</span></div>
        </div>

        <h2 className="print-plan-title">7-Day Diet Plan</h2>

        {plan.meals.map((m) => (
          <div key={m.day} className="print-day">
            <h3 className="print-day-title">{fullDay(m.day)}</h3>
            <table className="print-table">
              <thead>
                <tr>
                  <th style={{ width: "18%" }}>Meal</th>
                  <th style={{ width: "14%" }}>Time</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {m.slots.map((s) => (
                  <tr key={s.slotName}>
                    <td className="print-slot">{s.slotName}</td>
                    <td>{s.time || "—"}</td>
                    <td>
                      {s.items.length === 0 ? (
                        <span className="print-empty">—</span>
                      ) : (
                        <ul className="print-items">
                          {s.items.map((it, i) => {
                            const food = store.foods.find((f) => f.id === it.foodId);
                            return (
                              <li key={i}>
                                {food?.name} <span className="print-portion">— {it.portion}</span>
                                {food?.notes && <span className="print-notes">Note: {food.notes}</span>}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <div style={{ pageBreakBefore: "always", paddingTop: "40px" }}>
          <h2 className="text-center text-xl font-bold text-[#0070c0] mb-6 tracking-wide">TIPS:</h2>
          
          <ul className="list-disc pl-8 mb-10 space-y-2 text-[15px] marker:text-black">
            {(() => {
              const tipIds = plan?.instructions?.tips ?? [];
              const tipItems = tipIds.map((id) => store.instructions.find((i) => i.id === id)).filter(Boolean) as Instruction[];
              if (tipItems.length > 0) {
                return tipItems.map((tip) => (
                  <li key={tip.id} className={tip.isHighlighted ? "text-[#c00000] font-bold marker:text-[#c00000]" : ""}>
                    {tip.text}
                  </li>
                ));
              }
              // Fallback to hardcoded
              return (
                <>
                  <li className="text-[#c00000] font-bold marker:text-[#c00000]">7 hrs. Sleep, Stress free life, Exercise help to live a happy and healthy life.</li>
                  <li>Vegetables include carrots, cucumber, green peppers, Broccoli, cauliflower, Cabbage, lettuce, mushrooms, onions, red peppers, tomatoes, beetroot, peas, celery, chili, garlic, basil, coriander, parsley, etc.</li>
                  <li>Drink at least 4 liters of water per day, (Make sure Urine color should be pale yellow).</li>
                  <li>Make sure don't consume more than the mentioned quantity.</li>
                  <li>Daily 45 mins any exercise (5 days in a week).</li>
                </>
              );
            })()}
          </ul>

          <h2 className="text-2xl font-bold text-[#c00000] mb-6">Avoid List</h2>
          
          <div className="space-y-3 pl-2 text-[15px]">
            {(() => {
              const avoidIds = plan?.instructions?.avoidList ?? [];
              const avoidItems = avoidIds.map((id) => store.instructions.find((i) => i.id === id)).filter(Boolean) as Instruction[];
              if (avoidItems.length > 0) {
                return avoidItems.map((item) => (
                  <div key={item.id} className={item.isHighlighted ? "text-[#c00000] font-bold" : ""}>
                    ☐ {item.text}
                  </div>
                ));
              }
              // Fallback to hardcoded
              return (
                <>
                  <div className="text-[#c00000] font-bold">☐ Wheat, Sugar & Maida completely.</div>
                  <div className="text-[#c00000] font-bold">☐ Simple sugar, jaggery & honey</div>
                  <div className="text-[#c00000] font-bold">☐ Package food like chips, biscuits or any snacks</div>
                  <div>☐ Home Fried food like puri, samosa, pakoda etc.</div>
                  <div>☐ Processed food & trans-fat.</div>
                  <div>☐ Pre made snacks like shukadi.....etc.</div>
                  <div>☐ Outside unhealthy snacks like panipuri, pav bhaji, pizza, burger etc.</div>
                  <div>☐ Bakery items like breads, cake, biscuits etc.</div>
                  <div>☐ Ice-cream, candy, Cold coco.</div>
                  <div>☐ Chocolates.</div>
                  <div>☐ Artificial sweeteners like ready fruits juice.</div>
                  <div>☐ Sugar sweetened beverages like soft drink, fruit drink, sports drinks etc.</div>
                  <div>☐ Alcoholic beverages like red bulls.</div>
                </>
              );
            })()}
          </div>
        </div>

        <div className="print-footer mt-12">Prepared by Shobhana Thakkar · Aahar Jeevan · 9687491796</div>
      </div>

      <AlertDialog open={blocker.status === 'blocked'} onOpenChange={(o) => !o && blocker.reset?.()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>Save draft before leaving?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => blocker.reset?.()}>Cancel</AlertDialogCancel>
            <Button variant="outline" onClick={() => blocker.proceed?.()}>Discard</Button>
            <AlertDialogAction
              onClick={() => {
                save(true);
                blocker.proceed?.();
              }}
            >
              Save draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteFoodTarget} onOpenChange={(o) => !o && setDeleteFoodTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Food Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteFoodTarget?.name}</strong> from the food catalogue? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deleteFoodTarget) {
                  try {
                    await store.deleteFood(deleteFoodTarget.id);
                    toast.success(`Deleted "${deleteFoodTarget.name}" from catalogue`);
                  } catch (err: any) {
                    toast.error("Failed to delete food item: " + err.message);
                  } finally {
                    setDeleteFoodTarget(null);
                  }
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FoodDialog
        open={foodDialog.open}
        food={foodDialog.food}
        onClose={() => setFoodDialog({ open: false, food: null })}
        onSave={async (data) => {
          try {
            if (foodDialog.food) {
              await store.updateFood(foodDialog.food.id, data);
              toast.success("Item updated");
            } else {
              await store.addFood(data);
              toast.success("Item added");
            }
          } catch (err: any) {
            toast.error("Failed to save food: " + err.message);
          }
          setFoodDialog({ open: false, food: null });
        }}
      />
    </div>
  );
}

function fullDay(d: DayKey) {
  return { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" }[d];
}

/* ============================================================
   STEP 2 — Instructions
   ============================================================ */

interface InstructionsStepProps {
  plan: Plan;
  store: ReturnType<typeof useStore>;
  onUpdate: (instr: PlanInstructions) => void;
}

function InstructionsStep({ plan, store, onUpdate }: InstructionsStepProps) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<"All" | "Tip" | "Avoid" | "General">("All");
  const [editingInstr, setEditingInstr] = useState<Instruction | null>(null);
  const [instrDialogOpen, setInstrDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Instruction | null>(null);

  const instructions = plan.instructions ?? { tips: [], avoidList: [] };

  const filtered = useMemo(() => {
    return store.instructions.filter((i) => {
      const matchQ = i.text.toLowerCase().includes(search.toLowerCase());
      const matchC = catFilter === "All" || i.category === catFilter;
      return matchQ && matchC;
    });
  }, [store.instructions, search, catFilter]);

  function addToTips(id: string) {
    if (instructions.tips.includes(id)) return;
    onUpdate({ ...instructions, tips: [...instructions.tips, id] });
  }

  function addToAvoid(id: string) {
    if (instructions.avoidList.includes(id)) return;
    onUpdate({ ...instructions, avoidList: [...instructions.avoidList, id] });
  }

  function removeFromTips(id: string) {
    onUpdate({ ...instructions, tips: instructions.tips.filter((x) => x !== id) });
  }

  function removeFromAvoid(id: string) {
    onUpdate({ ...instructions, avoidList: instructions.avoidList.filter((x) => x !== id) });
  }

  const tipItems = instructions.tips.map((id) => store.instructions.find((i) => i.id === id)).filter(Boolean) as Instruction[];
  const avoidItems = instructions.avoidList.map((id) => store.instructions.find((i) => i.id === id)).filter(Boolean) as Instruction[];

  return (
    <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_1fr] print:hidden">
      {/* Left: Instructions Catalogue */}
      <aside className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Instructions Catalogue</h3>
          <Button size="sm" variant="outline" onClick={() => { setEditingInstr(null); setInstrDialogOpen(true); }}>
            <Plus className="mr-1 h-3 w-3" /> Add
          </Button>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 text-sm h-8" />
        </div>

        <div className="mb-3 flex gap-1 flex-wrap">
          {(["All", "Tip", "Avoid", "General"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={"rounded-md border px-2 py-0.5 text-[11px] font-medium transition " + (catFilter === c ? "border-[var(--leaf-green)] bg-[var(--leaf-green)] text-white" : "border-border bg-background text-muted-foreground hover:bg-muted")}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="max-h-[60vh] overflow-y-auto space-y-1.5">
          {filtered.map((instr) => {
            const inTips = instructions.tips.includes(instr.id);
            const inAvoid = instructions.avoidList.includes(instr.id);
            return (
              <div key={instr.id} className="group rounded-lg border border-border bg-background p-2.5 text-xs">
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <span className={"rounded px-1.5 py-0.5 text-[10px] font-semibold " + (instr.category === "Tip" ? "bg-blue-100 text-blue-700" : instr.category === "Avoid" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700")}>
                    {instr.category}
                    {instr.isHighlighted && " ★"}
                  </span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => { setEditingInstr(instr); setInstrDialogOpen(true); }} className="rounded p-1 hover:bg-muted">
                      <Pencil className="h-3 w-3 text-muted-foreground" />
                    </button>
                    <button onClick={() => setDeleteTarget(instr)} className="rounded p-1 hover:bg-destructive/10">
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </button>
                  </div>
                </div>
                <p className="text-foreground leading-snug mb-2">{instr.text}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => addToTips(instr.id)}
                    disabled={inTips}
                    className={"rounded border px-2 py-0.5 text-[10px] font-medium transition " + (inTips ? "border-blue-300 bg-blue-50 text-blue-400 cursor-default" : "border-blue-300 bg-white text-blue-600 hover:bg-blue-50")}
                  >
                    {inTips ? "✓ In Tips" : "+ Tips"}
                  </button>
                  <button
                    onClick={() => addToAvoid(instr.id)}
                    disabled={inAvoid}
                    className={"rounded border px-2 py-0.5 text-[10px] font-medium transition " + (inAvoid ? "border-red-300 bg-red-50 text-red-400 cursor-default" : "border-red-300 bg-white text-red-600 hover:bg-red-50")}
                  >
                    {inAvoid ? "✓ In Avoid" : "+ Avoid"}
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-6 text-center text-xs text-muted-foreground">No instructions found</p>
          )}
        </div>
      </aside>

      {/* Right: Tips & Avoid List */}
      <div className="space-y-6">
        {/* Tips section */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#0070c0]" />
            <h3 className="text-lg font-bold text-[#0070c0]">Tips</h3>
            <span className="ml-auto rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">{tipItems.length}</span>
          </div>
          {tipItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No tips added yet. Add from the catalogue on the left.</p>
          ) : (
            <ul className="space-y-2">
              {tipItems.map((tip, idx) => (
                <li key={tip.id} className={"flex items-start gap-3 rounded-lg border border-border bg-background p-3 " + (tip.isHighlighted ? "border-l-4 border-l-[#c00000]" : "")}>
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">{idx + 1}</span>
                  <p className={"flex-1 text-sm " + (tip.isHighlighted ? "font-semibold text-[#c00000]" : "text-foreground")}>{tip.text}</p>
                  <button onClick={() => removeFromTips(tip.id)} className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Avoid List section */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <ListX className="h-5 w-5 text-[#c00000]" />
            <h3 className="text-lg font-bold text-[#c00000]">Avoid List</h3>
            <span className="ml-auto rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">{avoidItems.length}</span>
          </div>
          {avoidItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No avoid items added yet. Add from the catalogue on the left.</p>
          ) : (
            <ul className="space-y-2">
              {avoidItems.map((item) => (
                <li key={item.id} className={"flex items-start gap-3 rounded-lg border border-border bg-background p-3 " + (item.isHighlighted ? "border-l-4 border-l-[#c00000]" : "")}>
                  <span className="mt-0.5 text-base">☐</span>
                  <p className={"flex-1 text-sm " + (item.isHighlighted ? "font-bold text-[#c00000]" : "text-foreground")}>{item.text}</p>
                  <button onClick={() => removeFromAvoid(item.id)} className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Instruction Dialog (Add/Edit) */}
      <InstructionDialog
        open={instrDialogOpen}
        instruction={editingInstr}
        onClose={() => { setInstrDialogOpen(false); setEditingInstr(null); }}
        onSave={async (data) => {
          try {
            if (editingInstr) {
              await store.updateInstruction(editingInstr.id, data);
              toast.success("Instruction updated");
            } else {
              await store.addInstruction(data as Omit<Instruction, "id">);
              toast.success("Instruction added");
            }
          } catch (err: any) {
            toast.error("Failed: " + err.message);
          }
          setInstrDialogOpen(false);
          setEditingInstr(null);
        }}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Instruction?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this instruction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deleteTarget) {
                  try {
                    // Also remove from plan if present
                    const newInstr = {
                      tips: instructions.tips.filter((x) => x !== deleteTarget.id),
                      avoidList: instructions.avoidList.filter((x) => x !== deleteTarget.id),
                    };
                    onUpdate(newInstr);
                    await store.deleteInstruction(deleteTarget.id);
                    toast.success("Instruction deleted");
                  } catch (err: any) {
                    toast.error("Failed: " + err.message);
                  } finally {
                    setDeleteTarget(null);
                  }
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* Instruction Dialog — Add / Edit */
function InstructionDialog({
  open, instruction, onClose, onSave,
}: {
  open: boolean;
  instruction: Instruction | null;
  onClose: () => void;
  onSave: (data: Omit<Instruction, "id">) => void;
}) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<"Tip" | "Avoid" | "General">("General");
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    if (open) {
      setText(instruction?.text ?? "");
      setCategory(instruction?.category ?? "General");
      setIsHighlighted(instruction?.isHighlighted ?? false);
    }
  }, [open, instruction]);

  function submit() {
    if (!text.trim()) { toast.error("Text is required"); return; }
    onSave({ text: text.trim(), category, isHighlighted });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{instruction ? "Edit Instruction" : "Add Instruction"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Text</Label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Enter instruction text..."
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Category</Label>
              <div className="mt-1 flex gap-1.5">
                {(["Tip", "Avoid", "General"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={"rounded-md border px-3 py-1.5 text-xs font-medium transition " + (category === c ? "border-[var(--leaf-green)] bg-[var(--leaf-green)] text-white" : "border-border bg-background hover:bg-muted")}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Highlight</Label>
              <div className="mt-1">
                <button
                  onClick={() => setIsHighlighted(!isHighlighted)}
                  className={"rounded-md border px-3 py-1.5 text-xs font-medium transition " + (isHighlighted ? "border-[#c00000] bg-[#c00000]/10 text-[#c00000]" : "border-border bg-background hover:bg-muted")}
                >
                  {isHighlighted ? "★ Bold/Red" : "Normal"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>{instruction ? "Update" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
   STEP 3 — Payment & Export Review
   ============================================================ */

const PAYMENT_OPTIONS: { value: PaymentStatus; label: string; color: string; icon: typeof CheckCircle2 }[] = [
  { value: "Done",    label: "Paid",    color: "border-[var(--leaf-green)] bg-[var(--leaf-green)]/10 text-[var(--dark-green)]", icon: CheckCircle2 },
  { value: "Partial", label: "Partial", color: "border-[var(--primary-orange)] bg-[var(--primary-orange)]/10 text-[var(--accent-orange)]", icon: IndianRupee },
  { value: "Pending", label: "Pending", color: "border-destructive bg-destructive/10 text-destructive", icon: IndianRupee },
];

interface ReviewStepProps {
  patient: { id: string; name: string; currentWeight: number; idealWeight?: number; bmi?: number; paymentStatus: PaymentStatus; totalAmount?: number; amountReceived?: number; contact: string };
  plan: Plan;
  store: ReturnType<typeof useStore>;
  onPaymentUpdate: (s: PaymentStatus, totalAmount?: number, amountReceived?: number) => void;
  onExportPDF: () => void;
  onBack: () => void;
  onDone: () => void;
}

function ReviewStep({ patient, plan, store, onPaymentUpdate, onExportPDF, onBack, onDone }: ReviewStepProps) {
  const totalItems = plan.meals.reduce((sum, m) => sum + m.slots.reduce((s2, sl) => s2 + sl.items.length, 0), 0);
  const filledDays = plan.meals.filter((m) => m.slots.some((sl) => sl.items.length > 0)).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 print:hidden">
      {/* Plan summary card */}
      <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-1 text-2xl font-bold text-[var(--dark-green)]">{plan.title}</h2>
        <p className="mb-4 text-sm text-muted-foreground">Plan for {patient.name} · Last updated {new Date(plan.updatedAt).toLocaleDateString()}</p>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-background p-4 text-center">
            <div className="text-2xl font-bold text-[var(--leaf-green)]">{filledDays}</div>
            <div className="mt-1 text-xs text-muted-foreground">Days planned</div>
          </div>
          <div className="rounded-xl border border-border bg-background p-4 text-center">
            <div className="text-2xl font-bold text-[var(--primary-orange)]">{totalItems}</div>
            <div className="mt-1 text-xs text-muted-foreground">Food items</div>
          </div>
          <div className="rounded-xl border border-border bg-background p-4 text-center">
            <div className="text-2xl font-bold text-[var(--dark-green)]">{plan.isDraft ? "Draft" : "Final"}</div>
            <div className="mt-1 text-xs text-muted-foreground">Plan status</div>
          </div>
        </div>

        {/* Compact day overview */}
        <div className="mt-5">
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Day Overview</h3>
          <div className="grid grid-cols-7 gap-2">
            {plan.meals.map((m) => {
              const count = m.slots.reduce((s, sl) => s + sl.items.length, 0);
              return (
                <div
                  key={m.day}
                  className={"rounded-lg border p-2 text-center text-xs transition " + (count > 0 ? "border-[var(--leaf-green)] bg-[var(--leaf-green)]/5" : "border-border bg-muted/30")}
                >
                  <div className="font-semibold">{m.day}</div>
                  <div className={"mt-0.5 " + (count > 0 ? "text-[var(--dark-green)]" : "text-muted-foreground")}>
                    {count} item{count !== 1 ? "s" : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payment status */}
      <PaymentCard patient={patient} onPaymentUpdate={onPaymentUpdate} />

      {/* Export & Finish actions */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-bold text-[var(--dark-green)]">
          <Printer className="mr-1.5 inline h-5 w-5" />
          Export & Finish
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">Export the diet plan as a branded PDF or return to editing.</p>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={onExportPDF} className="gap-2">
            <Printer className="h-4 w-4" />
            Export to PDF
          </Button>
          <Button size="lg" variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Planner
          </Button>
          <Button size="lg" variant="outline" onClick={onDone} className="gap-2 ml-auto border-[var(--leaf-green)] text-[var(--dark-green)] hover:bg-[var(--leaf-green)]/10">
            <CheckCircle2 className="h-4 w-4" />
            Done — Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
function PaymentCard({ patient, onPaymentUpdate }: {
  patient: { paymentStatus: PaymentStatus; totalAmount?: number; amountReceived?: number };
  onPaymentUpdate: (s: PaymentStatus, totalAmount?: number, amountReceived?: number) => void;
}) {
  const [totalAmount, setTotalAmount] = useState(String(patient.totalAmount ?? ""));
  const [amountReceived, setAmountReceived] = useState(String(patient.amountReceived ?? ""));
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>(patient.paymentStatus);

  const total = Number(totalAmount) || 0;
  const received = Number(amountReceived) || 0;

  function handleStatusClick(status: PaymentStatus) {
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
      // Partial — don't auto-save, wait for user to enter amount
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
      // Save total amount when user leaves the field
      onPaymentUpdate(selectedStatus, t, selectedStatus === "Done" ? t : selectedStatus === "Pending" ? 0 : received);
    }
  }

  return (
    <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-1 text-lg font-bold text-[var(--dark-green)]">
        <IndianRupee className="mr-1.5 inline h-5 w-5" />
        Payment
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">Enter the consultation fee and update payment status.</p>

      {/* Total Amount */}
      <div className="mb-5">
        <Label className="text-sm font-medium">Total Amount (₹)</Label>
        <div className="relative mt-1.5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
          <Input
            type="number"
            placeholder="e.g. 1500"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            onBlur={handleTotalBlur}
            className="pl-7"
          />
        </div>
      </div>

      {/* Payment Status Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {PAYMENT_OPTIONS.map((opt) => {
          const active = selectedStatus === opt.value;
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={() => handleStatusClick(opt.value)}
              className={
                "flex flex-col items-center gap-2 rounded-xl border-2 p-5 text-center transition-all hover:scale-[1.03] " +
                (active
                  ? opt.color + " ring-2 ring-offset-2 ring-offset-background shadow-md"
                  : "border-border bg-background text-foreground hover:bg-muted")
              }
            >
              <Icon className={"h-7 w-7 " + (active ? "" : "text-muted-foreground")} />
              <span className="text-sm font-semibold">{opt.label}</span>
              {active && <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">Current</span>}
            </button>
          );
        })}
      </div>

      {/* Partial Amount Input */}
      {selectedStatus === "Partial" && (
        <div className="mt-5 rounded-xl border border-[var(--primary-orange)]/30 bg-[var(--primary-orange)]/5 p-4">
          <Label className="text-sm font-medium">Amount Received (₹)</Label>
          <div className="mt-1.5 flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
              <Input
                type="number"
                placeholder="e.g. 500"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePartialSave()}
                className="pl-7"
              />
            </div>
            <Button onClick={handlePartialSave} size="sm" className="shrink-0">Save</Button>
          </div>
          {total > 0 && received > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Remaining: <span className="font-semibold text-[var(--accent-orange)]">₹{(total - received).toLocaleString("en-IN")}</span>
            </p>
          )}
        </div>
      )}

      {/* Summary */}
      {total > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
          <span>
            <span className="font-semibold text-[var(--dark-green)]">₹{(selectedStatus === "Done" ? total : selectedStatus === "Pending" ? 0 : received).toLocaleString("en-IN")}</span>
            <span className="text-muted-foreground"> received of </span>
            <span className="font-semibold">₹{total.toLocaleString("en-IN")}</span>
            <span className="text-muted-foreground"> total</span>
          </span>
        </div>
      )}
    </div>
  );
}

function AddToSlotButton({ food, slots, onAdd }: { food: FoodItem; slots: string[]; onAdd: (s: SlotName, portion: string) => void }) {
  const [open, setOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotName | null>(null);
  const [serving, setServing] = useState("");

  function reset() {
    setOpen(false);
    setSelectedSlot(null);
    setServing("");
  }

  function handleSlotClick(s: SlotName) {
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

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Add ${food.name}`}
        className="rounded-md bg-[var(--primary-orange)] p-1.5 text-white hover:bg-[var(--accent-orange)]"
      >
        <Plus className="h-4 w-4" />
      </button>
      {open && (
        <>
          <button
            onClick={reset}
            className="fixed inset-0 z-10 cursor-default"
            aria-label="Close"
          />
          <div className="absolute right-0 top-full z-20 mt-1 w-52 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-xs text-muted-foreground">
              {selectedSlot ? `Serving for ${selectedSlot}` : "Add to slot"} <X className="h-3 w-3 cursor-pointer" onClick={reset} />
            </div>
            {!selectedSlot ? (
              slots.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSlotClick(s)}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  {s}
                </button>
              ))
            ) : (
              <div className="p-3">
                <Input
                  autoFocus
                  placeholder="e.g. 4 pieces, 40g, 1 cup"
                  value={serving}
                  onChange={(e) => setServing(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                  className="h-8 text-sm"
                />
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedSlot(null)}>Back</Button>
                  <Button size="sm" className="flex-1" onClick={handleConfirm}>Add</Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}