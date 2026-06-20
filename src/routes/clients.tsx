import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { Patient, PaymentStatus, Gender, PlanStatus } from "@/lib/types";
import type { Instruction, PlanInstructions } from "@/lib/types";
import { getPlanStatus, getPlanRemainingText } from "@/lib/types";
import { Plus, Search, Trash2, Pencil, TrendingUp, UserPlus, Ban } from "lucide-react";
import { toast } from "sonner";
import { getInitials, getThemeForName, toTitleCase } from "@/lib/utils";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "Client List — Aahar Jeevan" },
      { name: "description", content: "Search, sort, and manage your nutrition clients." },
    ],
  }),
  component: ClientList,
});

const STATUS_FILTERS: ("All" | PaymentStatus)[] = ["All", "Done", "Pending", "Partial"];

function ClientList() {
  const store = useStore();
  const { patients } = store;
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [sort, setSort] = useState<"name" | "date">("name");

  // Edit dialog
  const [editPatient, setEditPatient] = useState<Patient | null>(null);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);

  // Extend dialog
  const [extendPatient, setExtendPatient] = useState<Patient | null>(null);

  // Terminate dialog
  const [terminateTarget, setTerminateTarget] = useState<Patient | null>(null);
  const [extendDuration, setExtendDuration] = useState<number | null>(null);
  const [customExtend, setCustomExtend] = useState("");
  const effectiveExtend = extendDuration === -1 ? (Number(customExtend) || 0) : (extendDuration ?? 0);

  const rows = useMemo(() => {
    let list = patients.filter((p) =>
      (p.name + " " + p.contact).toLowerCase().includes(q.toLowerCase()),
    );
    if (status !== "All") list = list.filter((p) => p.paymentStatus === status);
    list = [...list].sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : (b.lastPlanDate ?? "").localeCompare(a.lastPlanDate ?? ""),
    );
    return list;
  }, [patients, q, status, sort]);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await store.deletePatient(deleteTarget.id);
      toast.success(`Deleted ${deleteTarget.name}`);
    } catch (err: any) {
      toast.error("Failed to delete: " + err.message);
    }
    setDeleteTarget(null);
  }

  return (
    <div className="flex min-h-screen bg-[#faf9f7]">
      <AppSidebar />
      <main className="ml-[72px] flex-1 px-8 py-8 sm:px-12 lg:px-16 max-w-[1400px]">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Client list</h1>
          <Button onClick={() => navigate({ to: "/" })} className="rounded-full bg-[var(--primary-orange)] px-6 hover:bg-[var(--primary-orange)]/90">
            <UserPlus className="mr-2 h-4 w-4" /> Add patient
          </Button>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-2xl flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="rounded-full border-[#e8e5e1] bg-white pl-11 shadow-sm h-11"
            />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[#8a8580] font-medium">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "name" | "date")}
              className="rounded-full border border-[#e8e5e1] bg-white px-4 py-2.5 text-sm font-medium text-[#1a1a1a] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-orange)]"
            >
              <option value="name">Name</option>
              <option value="date">Last plan date</option>
            </select>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-[#8a8580] mr-2">Payment status</span>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={
                "rounded-full px-5 py-1.5 text-sm font-medium transition " +
                (status === s
                  ? "bg-[#00361a] text-white"
                  : "bg-[#f0eeeb] text-[#1a1a1a] hover:bg-[#e8e5e1]")
              }
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {rows.map((p) => {
            const theme = getThemeForName(p.name);
            const pStatus = getPlanStatus(p);
            return (
              <div key={p.id} className={`flex items-center justify-between rounded-2xl border-l-4 border-y border-r border-y-[#e8e5e1] border-r-[#e8e5e1] bg-white p-4 py-5 shadow-sm transition-all hover:shadow-md ${theme.border}`}>
                <div className="flex items-center gap-5">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${theme.bg} ${theme.text}`}>
                    {getInitials(p.name)}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-[15px] font-bold text-[#1a1a1a]">{toTitleCase(p.name)}</span>
                      
                      {/* Payment Badge */}
                      {p.paymentStatus === "Pending" && <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">Pending · ₹{p.totalAmount?.toLocaleString("en-IN") || 0}</span>}
                      {p.paymentStatus === "Done" && <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Done</span>}
                      {p.paymentStatus === "Partial" && <span className="rounded-full bg-[#f0eeeb] px-2.5 py-0.5 text-xs font-semibold text-[#1a1a1a]">Partial · ₹{p.amountReceived?.toLocaleString("en-IN") || 0}</span>}
                      {p.paymentStatus === "None" && <span className="rounded-full bg-[#f0eeeb] px-2.5 py-0.5 text-xs font-semibold text-[#8a8580]">No Payment</span>}

                      {/* Plan Status Badge */}
                      {pStatus === "On Track" && <span className="rounded-full bg-[#00361a] px-2.5 py-0.5 text-xs font-semibold text-white">On Track · {getPlanRemainingText(p)}</span>}
                      {pStatus === "Completed" && <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">Completed</span>}
                      {pStatus === "Terminated" && <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-semibold text-stone-600">Terminated</span>}
                      {pStatus === "No Plan" && <span className="rounded-full bg-[#f0eeeb] px-2.5 py-0.5 text-xs font-semibold text-[#8a8580]">No Plan</span>}
                    </div>
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#8a8580]">
                      <span>• {p.contact || "No contact"}</span>
                      <span>{p.age} yrs</span>
                      <span>{p.currentWeight} kg</span>
                      <span>Last plan · {p.lastPlanDate ?? "—"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/planner/$patientId"
                    params={{ patientId: p.id }}
                    className="rounded-full bg-[#f0eeeb] px-4 py-2 text-[13px] font-bold text-[#1a1a1a] transition hover:bg-[#e8e5e1]"
                  >
                    Edit plan
                  </Link>
                  <Link
                    to="/progress/$patientId"
                    params={{ patientId: p.id }}
                    className="flex items-center gap-1.5 rounded-full bg-[#e6f4f1] px-4 py-2 text-[13px] font-bold text-[#006b50] transition hover:bg-[#d1eae5]"
                  >
                    <TrendingUp className="h-3.5 w-3.5" /> Progress
                  </Link>
                  {(pStatus === "Completed" || pStatus === "No Plan" || pStatus === "Terminated") && (
                    <button
                      onClick={() => { setExtendPatient(p); setExtendDuration(null); setCustomExtend(""); }}
                      className="flex items-center gap-1.5 rounded-full bg-orange-50 px-4 py-2 text-[13px] font-bold text-orange-700 transition hover:bg-orange-100"
                    >
                      <Plus className="h-3.5 w-3.5" /> {pStatus === "No Plan" ? "Set Duration" : "Extend"}
                    </button>
                  )}
                  {pStatus === "On Track" && (
                    <button
                      onClick={() => setTerminateTarget(p)}
                      className="flex items-center gap-1.5 rounded-full bg-stone-100 px-4 py-2 text-[13px] font-bold text-stone-600 transition hover:bg-stone-200"
                    >
                      <Ban className="h-3.5 w-3.5" /> Terminate
                    </button>
                  )}
                  <button
                    onClick={() => setEditPatient(p)}
                    className="rounded-full p-2 text-[#8a8580] transition hover:bg-[#f0eeeb] hover:text-[#1a1a1a]"
                    aria-label="Edit details"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    className="rounded-full p-2 text-[#8a8580] transition hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete patient"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {rows.length === 0 && (
            <div className="rounded-2xl border border-[#e8e5e1] bg-white p-10 text-center text-[#8a8580]">
              No clients match your filters.
            </div>
          )}
        </div>
      </main>

      {/* Edit Patient Dialog */}
      {editPatient && (
        <EditPatientDialog
          patient={editPatient}
          onClose={() => setEditPatient(null)}
          onSave={async (patch) => {
            try {
              await store.updatePatient(editPatient.id, patch);
              toast.success(`Updated ${patch.name || editPatient.name}`);
              setEditPatient(null);
            } catch (err: any) {
              toast.error("Failed to update: " + err.message);
            }
          }}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {toTitleCase(deleteTarget?.name || "")}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this patient and all their associated plans and progress data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Patient
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Terminate Confirmation */}
      <AlertDialog open={!!terminateTarget} onOpenChange={(o) => !o && setTerminateTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate plan for {toTitleCase(terminateTarget?.name || "")}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will stop the current plan immediately and mark the patient's status as Terminated. They will no longer be considered active.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!terminateTarget) return;
                try {
                  const today = new Date();
                  await store.updatePatient(terminateTarget.id, {
                    isTerminated: true,
                    planEndDate: today.toISOString(),
                  });
                  toast.success("Plan terminated");
                  setTerminateTarget(null);
                } catch (err: any) {
                  toast.error("Failed to terminate plan: " + err.message);
                }
              }}
              className="bg-stone-600 text-white hover:bg-stone-700"
            >
              Terminate Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ══════ EXTEND DIALOG ══════ */}
      <Dialog open={!!extendPatient} onOpenChange={(o) => { if (!o) setExtendPatient(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{extendPatient && getPlanStatus(extendPatient) === "No Plan" ? "Set Plan Duration" : "Extend Plan"}: {toTitleCase(extendPatient?.name || "")}</DialogTitle></DialogHeader>
          <div className="py-2">
            <Label className="mb-3 block text-sm font-semibold text-[#00361a]">{extendPatient && getPlanStatus(extendPatient) === "No Plan" ? "Set Duration To" : "Extend Duration By"}</Label>
            <div className="flex flex-wrap gap-2">
              {[1, 3, 5].map((m) => (
                <button key={m} type="button" onClick={() => { setExtendDuration(m); setCustomExtend(""); }}
                  className={"rounded-md border px-4 py-2 text-sm font-medium transition " + (extendDuration === m ? "border-[#00361a] bg-[#00361a] text-white" : "border-input bg-background text-foreground hover:bg-muted")}
                >{m} month{m > 1 ? "s" : ""}</button>
              ))}
              <button type="button" onClick={() => setExtendDuration(-1)}
                className={"rounded-md border px-4 py-2 text-sm font-medium transition " + (extendDuration === -1 ? "border-[#00361a] bg-[#00361a] text-white" : "border-input bg-background text-foreground hover:bg-muted")}
              >Custom</button>
            </div>
            {extendDuration === -1 && (
              <div className="mt-3 flex items-center gap-2">
                <Input type="number" min="1" placeholder="Enter months" value={customExtend} onChange={(e) => setCustomExtend(e.target.value)} className="w-32" />
                <span className="text-sm text-muted-foreground">months</span>
              </div>
            )}
            {effectiveExtend > 0 && (
              <p className="mt-4 text-xs text-muted-foreground">
                New plan will run from <span className="font-semibold text-[#00361a]">{new Date().toLocaleDateString()}</span> to <span className="font-semibold text-[#00361a]">{(() => { const d = new Date(); d.setMonth(d.getMonth() + effectiveExtend); return d.toLocaleDateString(); })()}</span>
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExtendPatient(null)}>Cancel</Button>
            <Button className="bg-[#00361a] hover:bg-[#1b4d2e]" disabled={effectiveExtend <= 0} onClick={async () => {
              if (extendPatient && effectiveExtend > 0) {
                const today = new Date();
                const startDate = today.toISOString().split("T")[0];
                const end = new Date(today);
                end.setMonth(end.getMonth() + effectiveExtend);
                const endDate = end.toISOString().split("T")[0];
                try {
                  await store.updatePatient(extendPatient.id, {
                    planStartDate: startDate,
                    planDurationMonths: effectiveExtend,
                    planEndDate: endDate,
                  });
                  toast.success(`Extended plan for ${extendPatient.name} by ${effectiveExtend} months`);
                  setExtendPatient(null);
                } catch (e: any) { toast.error("Failed to extend plan: " + e.message); }
              }
            }}>Confirm Extension</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const cls =
    status === "Done"
      ? "bg-[var(--dark-green)] text-white"
      : status === "Pending"
        ? "bg-[var(--primary-orange)] text-white"
        : "bg-[var(--leaf-green)] text-white";
  return <Badge className={"rounded-full px-3 py-1 " + cls}>{status}</Badge>;
}

function PlanStatusBadge({ status }: { status: PlanStatus }) {
  const cls =
    status === "On Track" ? "bg-[var(--dark-green)] text-white" :
    status === "Completed" ? "bg-muted text-muted-foreground" :
    "bg-muted/50 text-muted-foreground/50";
  return <Badge className={"rounded-full px-3 py-1 font-medium shadow-none " + cls}>{status}</Badge>;
}

/* ============================================================
   Edit Patient Dialog
   ============================================================ */

function EditPatientDialog({
  patient,
  onClose,
  onSave,
}: {
  patient: Patient;
  onClose: () => void;
  onSave: (patch: Partial<Patient>) => void;
}) {
  const [form, setForm] = useState({
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
    gender: (patient.gender || "") as Gender | "",
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
      name: toTitleCase(form.name.trim()),
      age: Number(form.age) || 0,
      contact: form.contact,
      currentWeight: Number(form.currentWeight) || 0,
      idealWeight: Number(form.idealWeight) || undefined,
      height: Number(form.height) || undefined,
      chest: Number(form.chest) || undefined,
      waist: Number(form.waist) || undefined,
      lowerWaist: Number(form.lowerWaist) || undefined,
      thigh: Number(form.thigh) || undefined,
      bmi: bmiRounded || undefined,
      gender: form.gender || undefined,
    });
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Patient — {toTitleCase(patient.name)}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Gender">
              <div className="flex gap-2">
                {(["Male", "Female", "Other"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm({ ...form, gender: g })}
                    className={
                      "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition " +
                      (form.gender === g
                        ? "border-[var(--dark-green)] bg-[var(--dark-green)] text-white"
                        : "border-input bg-background text-foreground hover:bg-muted")
                    }
                  >
                    {g}
                  </button>
                ))}
              </div>
            </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Age"><Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></Field>
            <Field label="Contact"><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Current weight (kg)"><Input type="number" value={form.currentWeight} onChange={(e) => setForm({ ...form, currentWeight: e.target.value })} /></Field>
            <Field label="Ideal body weight (kg)">
              <Input type="number" value={form.idealWeight} onChange={(e) => setForm({ ...form, idealWeight: e.target.value })} />
              {Number(form.idealWeight) > 0 && (
                <div className="mt-1 text-xs text-muted-foreground">
                  Range: <span className="font-semibold text-[var(--dark-green)]">{Math.max(0, Number(form.idealWeight) - 5).toFixed(1)}</span> – <span className="font-semibold text-[var(--dark-green)]">{(Number(form.idealWeight) + 5).toFixed(1)}</span> kg (±5)
                </div>
              )}
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Field label="Height (cm)"><Input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} /></Field>
            <Field label="Chest (in)"><Input type="number" value={form.chest} onChange={(e) => setForm({ ...form, chest: e.target.value })} /></Field>
            <Field label="Waist (in)"><Input type="number" value={form.waist} onChange={(e) => setForm({ ...form, waist: e.target.value })} /></Field>
            <Field label="Lower waist (in)"><Input type="number" value={form.lowerWaist} onChange={(e) => setForm({ ...form, lowerWaist: e.target.value })} /></Field>
            <Field label="Thigh (in)"><Input type="number" value={form.thigh} onChange={(e) => setForm({ ...form, thigh: e.target.value })} /></Field>
            <Field label="BMI (auto)">
              <div className="flex h-9 items-center rounded-md border border-input bg-muted/40 px-3 text-sm">
                {bmiRounded ? (
                  <span className="font-semibold text-[var(--dark-green)]">{bmiRounded}</span>
                ) : (
                  <span className="text-muted-foreground">Enter height & weight</span>
                )}
              </div>
            </Field>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}