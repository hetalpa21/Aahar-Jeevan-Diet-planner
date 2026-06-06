import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import logoAsset from "@/assets/logo.png.asset.json";
const logo = logoAsset.url;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aahar Jeevan — Nutritionist Workspace" },
      { name: "description", content: "Manage clients, design weekly diet plans, and export PDFs — all in one place." },
      { property: "og:title", content: "Aahar Jeevan" },
      { property: "og:description", content: "Nutritionist workspace for client management and diet planning." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { addPatient } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
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
  });

  const heightM = Number(form.height) / 100;
  const weightKg = Number(form.currentWeight);
  const bmi = heightM > 0 && weightKg > 0 ? weightKg / (heightM * heightM) : 0;
  const bmiRounded = bmi ? Math.round(bmi * 10) / 10 : 0;

  function submit() {
    if (!form.name.trim()) {
      toast.error("Patient name is required");
      return;
    }
    const p = addPatient({
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
      paymentStatus: "Pending",
    });
    toast.success(`Added ${p.name}`);
    setOpen(false);
    navigate({ to: "/planner/$patientId", params: { patientId: p.id } });
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto flex max-w-5xl flex-col items-center px-4 py-12 sm:py-16">
        <img src={logo} alt="Aahar Jeevan" width={320} height={320} className="h-56 w-56 object-contain sm:h-72 sm:w-72" />
        <div className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-2">
          <CTA
            title="Existing Patient"
            subtitle="Search & manage clients"
            onClick={() => navigate({ to: "/clients" })}
          />
          <CTA
            title="New Patient"
            subtitle="Add basic details & create plan"
            onClick={() => setOpen(true)}
          />
        </div>
        <p className="mt-8 font-medium text-[var(--dark-green)]">Select an option to begin</p>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Patient</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Age"><Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></Field>
              <Field label="Contact"><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Current weight (kg)"><Input type="number" value={form.currentWeight} onChange={(e) => setForm({ ...form, currentWeight: e.target.value })} /></Field>
              <Field label="Ideal body weight (kg)"><Input type="number" value={form.idealWeight} onChange={(e) => setForm({ ...form, idealWeight: e.target.value })} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Field label="Height (cm)"><Input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} /></Field>
              <Field label="Chest (cm)"><Input type="number" value={form.chest} onChange={(e) => setForm({ ...form, chest: e.target.value })} /></Field>
              <Field label="Waist (cm)"><Input type="number" value={form.waist} onChange={(e) => setForm({ ...form, waist: e.target.value })} /></Field>
              <Field label="Lower waist (cm)"><Input type="number" value={form.lowerWaist} onChange={(e) => setForm({ ...form, lowerWaist: e.target.value })} /></Field>
              <Field label="Thigh (cm)"><Input type="number" value={form.thigh} onChange={(e) => setForm({ ...form, thigh: e.target.value })} /></Field>
              <Field label="BMI (auto)">
                <div className="flex h-9 items-center rounded-md border border-input bg-muted/40 px-3 text-sm">
                  {bmiRounded ? (
                    <span><span className="font-semibold text-[var(--dark-green)]">{bmiRounded}</span> <span className="text-muted-foreground">(±5: {Math.max(0, bmiRounded - 5).toFixed(1)}–{(bmiRounded + 5).toFixed(1)})</span></span>
                  ) : (
                    <span className="text-muted-foreground">Enter height & weight</span>
                  )}
                </div>
              </Field>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Save & Create Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
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

function CTA({ title, subtitle, onClick }: { title: string; subtitle: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center rounded-xl bg-[var(--primary-orange)] px-6 py-10 text-center text-white shadow-md transition hover:bg-[var(--accent-orange)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dark-green)]"
    >
      <span className="text-2xl font-bold">{title}</span>
      <span className="mt-2 text-sm opacity-90">{subtitle}</span>
    </button>
  );
}
