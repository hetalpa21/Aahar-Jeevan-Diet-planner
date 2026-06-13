import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
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
import type { Patient, PaymentStatus, Gender } from "@/lib/types";
import { Search, Pencil, Trash2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h1 className="text-3xl font-bold text-[var(--dark-green)]">Client List</h1>
          <Button onClick={() => navigate({ to: "/" })}>Add Patient</Button>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "name" | "date")}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="name">Name</option>
              <option value="date">Last plan date</option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Payment Status</span>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={
                "rounded-full px-3 py-1 text-sm transition " +
                (status === s
                  ? "bg-[var(--dark-green)] text-white"
                  : "bg-muted text-foreground hover:bg-muted/70")
              }
            >
              {s}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Age</th>
                  <th className="px-4 py-3 font-medium">Current</th>
                  <th className="px-4 py-3 font-medium">Last plan</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className="border-t border-border align-middle">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-orange)]/20 font-semibold text-[var(--accent-orange)]">
                          {p.name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.contact}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{p.age}</td>
                    <td className="px-4 py-3">{p.currentWeight} kg</td>
                    <td className="px-4 py-3">{p.lastPlanDate ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={p.paymentStatus} />
                        {p.totalAmount ? (
                          <span className="text-xs text-muted-foreground">
                            {p.paymentStatus === "Partial" ? `₹${(p.amountReceived ?? 0).toLocaleString("en-IN")}/` : ""}
                            ₹{p.totalAmount.toLocaleString("en-IN")}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to="/planner/$patientId"
                          params={{ patientId: p.id }}
                          className="rounded-md px-2.5 py-1.5 text-sm font-medium text-[var(--accent-orange)] transition hover:bg-[var(--primary-orange)]/10"
                        >
                          Edit Plan
                        </Link>
                        <Link
                          to="/progress/$patientId"
                          params={{ patientId: p.id }}
                          className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium text-[var(--leaf-green)] transition hover:bg-[var(--leaf-green)]/10"
                        >
                          <TrendingUp className="h-3.5 w-3.5" />
                          Progress
                        </Link>
                        <button
                          onClick={() => setEditPatient(p)}
                          className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          aria-label="Edit details"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Delete patient"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No clients match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
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
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
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
      name: form.name.trim(),
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
          <DialogTitle>Edit Patient — {patient.name}</DialogTitle>
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