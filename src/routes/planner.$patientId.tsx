import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useStore } from "@/lib/store";
import {
  DAYS,
  SLOTS,
  type DayKey,
  type FoodItem,
  type Plan,
  type PlanItem,
  type SlotName,
} from "@/lib/types";
import { Home, Plus, Search, Trash2, Pencil, Copy, X, Printer } from "lucide-react";
import { toast } from "sonner";
import logoAsset from "@/assets/logo.png.asset.json";
const logo = logoAsset.url;
import { FoodDialog } from "./catalogue";

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

  const [plan, setPlan] = useState<Plan>(() => store.getPlanForPatient(patientId));
  const [dirty, setDirty] = useState(false);
  const [day, setDay] = useState<DayKey>("Mon");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [confirm, setConfirm] = useState<null | (() => void)>(null);
  const [foodDialog, setFoodDialog] = useState<{ open: boolean; food: FoodItem | null }>({ open: false, food: null });
  // Re-init plan when store hydrates
  const didInit = useRef(false);
  useEffect(() => {
    if (!didInit.current) {
      setPlan(store.getPlanForPatient(patientId));
      didInit.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.patients.length, store.plans.length]);

  const currentDay = plan.meals.find((m) => m.day === day)!;
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

  function update(newPlan: Plan) {
    setPlan({ ...newPlan, updatedAt: new Date().toISOString() });
    setDirty(true);
  }

  function addItemToSlot(slot: SlotName, food: FoodItem, portion?: string) {
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
    const meals = plan.meals.map((m) =>
      m.day !== day
        ? m
        : { ...m, slots: m.slots.map((s) => (s.slotName !== slot ? s : { ...s, items: s.items.filter((_, i) => i !== idx) })) },
    );
    update({ ...plan, meals });
  }

  function setSlotTime(slot: SlotName, time: string) {
    const meals = plan.meals.map((m) =>
      m.day !== day
        ? m
        : { ...m, slots: m.slots.map((s) => (s.slotName !== slot ? s : { ...s, time })) },
    );
    update({ ...plan, meals });
  }

  function duplicateDay() {
    const target = window.prompt(`Copy ${day} to which day? (Mon, Tue, Wed, Thu, Fri, Sat, Sun)`);
    const t = (target ?? "").trim() as DayKey;
    if (!DAYS.includes(t)) {
      toast.error("Invalid day");
      return;
    }
    const source = plan.meals.find((m) => m.day === day)!;
    const meals = plan.meals.map((m) => (m.day === t ? { ...source, day: t } : m));
    update({ ...plan, meals });
    toast.success(`Copied ${day} → ${t}`);
  }

  function save(asDraft: boolean) {
    const next = { ...plan, isDraft: asDraft, updatedAt: new Date().toISOString() };
    store.savePlan(next);
    setPlan(next);
    setDirty(false);
    toast.success(asDraft ? "Draft saved" : "Plan saved");
  }

  function goHome() {
    if (dirty) {
      setConfirm(() => () => navigate({ to: "/" }));
    } else {
      navigate({ to: "/" });
    }
  }

  function exportPDF() {
    window.print();
  }

  if (!patient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Patient not found.</p>
          <Button className="mt-4" onClick={() => navigate({ to: "/clients" })}>Back to Clients</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Planner header */}
      <header className="sticky top-0 z-30 border-b border-border bg-[var(--header-bg)] print:hidden">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6">
          <button onClick={goHome} className="flex items-center gap-2 rounded-md px-2 py-1 text-[var(--dark-green)] hover:bg-muted">
            <img src={logo} alt="" width={32} height={32} className="h-8 w-8 rounded object-contain" />
            <Home className="h-4 w-4" />
            <span className="font-medium">Home</span>
          </button>
          <h1 className="hidden truncate text-lg font-semibold text-[var(--dark-green)] sm:block">
            {plan.title}
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => save(false)}>Save</Button>
            <Button variant="outline" onClick={() => save(true)}>Save as Draft</Button>
            <Button variant="outline" onClick={duplicateDay}><Copy className="mr-1 h-4 w-4" />Duplicate Day</Button>
            <Button onClick={exportPDF}><Printer className="mr-1 h-4 w-4" />Export to PDF</Button>
          </div>
        </div>
      </header>

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
            {filteredFoods.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background p-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{f.name}</div>
                  <div className="text-xs text-muted-foreground">{f.serving} · {f.calories} kcal</div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => setFoodDialog({ open: true, food: f })} aria-label="Edit" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <AddToSlotButton food={f} onAdd={(slot) => addItemToSlot(slot, f)} />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => setFoodDialog({ open: true, food: null })}>
              <Plus className="mr-1 h-4 w-4" /> Add catalogue item
            </Button>
          </div>
        </aside>

        {/* Day editor */}
        <section className="overflow-x-auto print:overflow-visible">
          <div className="grid min-w-[900px] grid-cols-5 gap-3 print:min-w-0">
            {SLOTS.map((slotName) => {
              const slot = currentDay.slots.find((s) => s.slotName === slotName)!;
              return (
                <div key={slotName} className="flex flex-col rounded-xl border border-border bg-card p-3">
                  <h3 className="text-base font-semibold text-[var(--dark-green)]">{slotName}</h3>
                  <Input
                    type="time"
                    value={slot.time}
                    onChange={(e) => setSlotTime(slotName, e.target.value)}
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
                            onClick={() => removeItem(slotName, idx)}
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

          {/* Print preview — branded export */}
          <div className="print-export hidden print:block">
            <div className="print-header">
              <img src={logo} alt="Aahar Jeevan" className="print-logo" />
              <div className="print-brand">
                <div className="print-brand-name">Shobhana Thakkar</div>
                <div className="print-brand-sub">Nutritionist · Aahar Jeevan</div>
                <div className="print-brand-sub">Mobile: 9687491796</div>
              </div>
            </div>

            <div className="print-patient">
              <div><span className="print-label">Name:</span> <span className="print-value">{patient.name}</span></div>
              <div><span className="print-label">Current Weight:</span> <span className="print-value">{patient.currentWeight ?? "—"} kg</span></div>
              <div><span className="print-label">Ideal Body Weight:</span> <span className="print-value">{patient.idealWeight ?? "—"} kg</span></div>
              <div><span className="print-label">BMI:</span> <span className="print-value">{patient.bmi ?? "—"}{patient.bmi ? " (±5)" : ""}</span></div>
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
                                return <li key={i}>{food?.name} <span className="print-portion">— {it.portion}</span></li>;
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

            <div className="print-footer">Prepared by Shobhana Thakkar · Aahar Jeevan · 9687491796</div>
          </div>
        </section>
      </div>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>Save draft before leaving?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="outline" onClick={() => { const cb = confirm; setConfirm(null); cb?.(); }}>Discard</Button>
            <AlertDialogAction
              onClick={() => {
                save(true);
                const cb = confirm;
                setConfirm(null);
                cb?.();
              }}
            >
              Save draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FoodDialog
        open={foodDialog.open}
        food={foodDialog.food}
        onClose={() => setFoodDialog({ open: false, food: null })}
        onSave={(data) => {
          if (foodDialog.food) {
            store.updateFood(foodDialog.food.id, data);
            toast.success("Item updated");
          } else {
            store.addFood(data);
            toast.success("Item added");
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

function AddToSlotButton({ food, onAdd }: { food: FoodItem; onAdd: (s: SlotName) => void }) {
  const [open, setOpen] = useState(false);
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
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
            aria-label="Close"
          />
          <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-xs text-muted-foreground">
              Add to slot <X className="h-3 w-3 cursor-pointer" onClick={() => setOpen(false)} />
            </div>
            {SLOTS.map((s) => (
              <button
                key={s}
                onClick={() => { onAdd(s); setOpen(false); toast.success(`Added ${food.name} → ${s}`); }}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}