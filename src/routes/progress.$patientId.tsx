import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
import type { ProgressEntry } from "@/lib/types";
import { Home, Plus, Trash2, TrendingDown, TrendingUp, Minus, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/progress/$patientId")({
  head: () => ({
    meta: [
      { title: "Progress Tracker — Aahar Jeevan" },
      { name: "description", content: "Track client body measurements week by week." },
    ],
  }),
  component: ProgressTracker,
});

function ProgressTracker() {
  const { patientId } = Route.useParams();
  const navigate = useNavigate();
  const store = useStore();
  const patient = store.patients.find((p) => p.id === patientId);

  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProgressEntry | null>(null);
  const [saving, setSaving] = useState<string | null>(null); // entry id being saved

  useEffect(() => {
    async function load() {
      try {
        const data = await store.getProgressForPatient(patientId);
        setEntries(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [patientId]);

  async function addWeek() {
    const nextWeek = entries.length > 0 ? Math.max(...entries.map((e) => e.weekNumber)) + 1 : 1;
    // Pre-fill weight from patient's current weight for week 1
    const prefillWeight = nextWeek === 1 ? patient?.currentWeight : undefined;
    try {
      const entry = await store.addProgressEntry({
        patientId,
        weekNumber: nextWeek,
        weight: prefillWeight,
        waist: undefined,
        lowerWaist: undefined,
        thigh: undefined,
        notes: undefined,
      });
      setEntries((prev) => [...prev, entry]);
      toast.success(`Week ${nextWeek} added`);
    } catch (err: any) {
      toast.error("Failed to add week: " + err.message);
    }
  }

  async function saveEntry(entry: ProgressEntry) {
    setSaving(entry.id);
    try {
      await store.updateProgressEntry(entry.id, {
        weight: entry.weight,
        waist: entry.waist,
        lowerWaist: entry.lowerWaist,
        thigh: entry.thigh,
        notes: entry.notes,
      });
      toast.success(`Week ${entry.weekNumber} saved`);
    } catch (err: any) {
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
    } catch (err: any) {
      toast.error("Failed to delete: " + err.message);
    }
    setDeleteTarget(null);
  }

  function updateField(id: string, field: keyof ProgressEntry, value: string) {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, [field]: field === "notes" ? value : (value === "" ? undefined : Number(value)) } : e
      )
    );
  }

  function goHome() {
    navigate({ to: "/" });
  }

  if (store.loading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground animate-pulse text-lg">Loading progress data...</p>
      </div>
    );
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
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-[var(--header-bg)]/95 backdrop-blur-md shadow-sm print:hidden">
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
          <button onClick={goHome} className="flex items-center gap-3 group rounded-lg px-2.5 py-1.5 text-[var(--dark-green)] transition hover:bg-muted">
            <img src={logo} alt="" width={44} height={44} className="h-11 w-11 rounded-xl object-contain shadow-sm ring-1 ring-border/50 transition group-hover:shadow-md group-hover:scale-[1.04]" />
            <div className="hidden sm:block text-left">
              <div className="text-sm font-bold leading-tight text-[var(--dark-green)]">Aahar Jeevan</div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Home className="h-3 w-3" />
                Home
              </div>
            </div>
          </button>

          <h1 className="hidden text-lg font-semibold text-[var(--dark-green)] sm:block">Progress Tracker</h1>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate({ to: "/clients" })}>
              <ArrowLeft className="mr-1 h-4 w-4" />Back to Clients
            </Button>
            <Button onClick={addWeek}>
              <Plus className="mr-1 h-4 w-4" />Add Week
            </Button>
          </div>
        </div>
        <div className="h-[2px] bg-gradient-to-r from-[var(--primary-orange)] via-[var(--leaf-green)] to-[var(--primary-orange)] opacity-60" />
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
        {/* Patient info */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary-orange)]/20 text-xl font-bold text-[var(--accent-orange)]">
              {patient.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--dark-green)]">{patient.name}</h2>
              <p className="text-sm text-muted-foreground">
                Age {patient.age} · {patient.contact} · Start weight: {patient.currentWeight} kg
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            <strong>Error loading progress:</strong> {error}
            <p className="mt-1 text-xs text-muted-foreground">Make sure the <code>progress_entries</code> table exists in Supabase.</p>
          </div>
        )}

        {entries.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 py-16 text-center">
            <div className="mb-4 rounded-full bg-[var(--leaf-green)]/10 p-4">
              <TrendingDown className="h-8 w-8 text-[var(--leaf-green)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--dark-green)]">No progress entries yet</h3>
            <p className="mt-1 mb-4 text-sm text-muted-foreground">Start tracking by adding the first week's measurements.</p>
            <Button onClick={addWeek}>
              <Plus className="mr-1 h-4 w-4" />Add Week 1
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="inline-flex gap-4 pb-4" style={{ minWidth: entries.length * 240 }}>
              {entries.map((entry, idx) => {
                const prev = idx > 0 ? entries[idx - 1] : null;
                return (
                  <WeekCard
                    key={entry.id}
                    entry={entry}
                    prev={prev}
                    saving={saving === entry.id}
                    onUpdate={(field, value) => updateField(entry.id, field, value)}
                    onSave={() => saveEntry(entry)}
                    onDelete={() => setDeleteTarget(entry)}
                  />
                );
              })}

              {/* Add week card */}
              <button
                onClick={addWeek}
                className="flex min-w-[200px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/10 p-6 text-muted-foreground transition hover:border-[var(--leaf-green)] hover:bg-[var(--leaf-green)]/5 hover:text-[var(--dark-green)]"
              >
                <Plus className="h-8 w-8" />
                <span className="text-sm font-medium">Add Week</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Week {deleteTarget?.weekNumber}?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the measurements for this week.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ============================================================
   Week measurement card
   ============================================================ */

function Trend({ current, previous, lowerIsBetter = true }: { current?: number; previous?: number; lowerIsBetter?: boolean }) {
  if (current == null || previous == null) return null;
  const diff = current - previous;
  if (Math.abs(diff) < 0.01) return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  const isGood = lowerIsBetter ? diff < 0 : diff > 0;
  return isGood
    ? <TrendingDown className="h-3.5 w-3.5 text-[var(--leaf-green)]" />
    : <TrendingUp className="h-3.5 w-3.5 text-destructive" />;
}

interface WeekCardProps {
  entry: ProgressEntry;
  prev: ProgressEntry | null;
  saving: boolean;
  onUpdate: (field: keyof ProgressEntry, value: string) => void;
  onSave: () => void;
  onDelete: () => void;
}

function WeekCard({ entry, prev, saving, onUpdate, onSave, onDelete }: WeekCardProps) {
  const date = new Date(entry.recordedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" });

  return (
    <div className="flex min-w-[220px] flex-col rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md">
      {/* Week header */}
      <div className="flex items-center justify-between rounded-t-2xl bg-[var(--leaf-green)] px-4 py-3">
        <div>
          <div className="text-base font-bold text-white">Week {entry.weekNumber}</div>
          <div className="text-[11px] text-white/70">{date}</div>
        </div>
        <button onClick={onDelete} className="rounded-md p-1.5 text-white/70 transition hover:bg-white/20 hover:text-white" aria-label="Delete week">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Measurement fields */}
      <div className="flex flex-col gap-3 p-4">
        <MeasurementField
          label="Weight"
          unit="kg"
          value={entry.weight}
          prev={prev?.weight}
          onChange={(v) => onUpdate("weight", v)}
        />
        <MeasurementField
          label="Waist"
          unit="in"
          value={entry.waist}
          prev={prev?.waist}
          onChange={(v) => onUpdate("waist", v)}
        />
        <MeasurementField
          label="Lower Waist"
          unit="in"
          value={entry.lowerWaist}
          prev={prev?.lowerWaist}
          onChange={(v) => onUpdate("lowerWaist", v)}
        />
        <MeasurementField
          label="Thigh"
          unit="in"
          value={entry.thigh}
          prev={prev?.thigh}
          onChange={(v) => onUpdate("thigh", v)}
        />
      </div>

      {/* Save button */}
      <div className="border-t border-border px-4 py-3">
        <Button size="sm" className="w-full gap-1.5" onClick={onSave} disabled={saving}>
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}

function MeasurementField({
  label,
  unit,
  value,
  prev,
  onChange,
}: {
  label: string;
  unit: string;
  value?: number;
  prev?: number;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label} ({unit})</span>
        <Trend current={value} previous={prev} lowerIsBetter />
      </div>
      <Input
        type="number"
        step="0.1"
        placeholder="—"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 text-sm"
      />
    </div>
  );
}
