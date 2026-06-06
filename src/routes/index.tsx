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
import logo from "@/assets/logo.png";

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
  const [form, setForm] = useState({ name: "", age: "", contact: "", currentWeight: "", targetWeight: "" });

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
      targetWeight: Number(form.targetWeight) || 0,
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
        <img src={logo} alt="Aahar Jeevan" width={160} height={160} className="h-32 w-32 sm:h-40 sm:w-40" />
        <h1 className="mt-4 text-center font-serif text-4xl font-bold tracking-wide text-[var(--dark-green)] sm:text-5xl">
          AAHAR JEEVAN
        </h1>
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
        <DialogContent>
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
              <Field label="Target weight (kg)"><Input type="number" value={form.targetWeight} onChange={(e) => setForm({ ...form, targetWeight: e.target.value })} /></Field>
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
