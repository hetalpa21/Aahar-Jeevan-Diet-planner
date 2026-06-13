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
import type { Gender } from "@/lib/types";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { Users, UserPlus, ArrowRight } from "lucide-react";

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
    gender: "" as Gender | "",
  });

  const heightM = Number(form.height) / 100;
  const weightKg = Number(form.currentWeight);
  const bmi = heightM > 0 && weightKg > 0 ? weightKg / (heightM * heightM) : 0;
  const bmiRounded = bmi ? Math.round(bmi * 10) / 10 : 0;

  async function submit() {
    if (!form.name.trim()) {
      toast.error("Patient name is required");
      return;
    }
    try {
      const p = await addPatient({
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
        paymentStatus: "Pending",
      });
      toast.success(`Added ${p.name}`);
      setOpen(false);
      navigate({ to: "/planner/$patientId", params: { patientId: p.id } });
    } catch (err: any) {
      toast.error(err.message || "Failed to add patient");
    }
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "linear-gradient(180deg, #b9efc5 0%, #ddf5e3 40%, #f0faf3 100%)" }}>
      <AppHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-5 py-12 sm:py-16">
        {/* Logo circle */}
        <div
          className="mb-8 flex items-center justify-center rounded-full bg-white shadow-[0_8px_32px_-8px_rgba(27,77,46,0.12)]"
          style={{ width: 192, height: 192 }}
        >
          <img
            src={logo}
            alt="Aahar Jeevan"
            width={160}
            height={160}
            className="h-[140px] w-[140px] object-contain"
          />
        </div>

        {/* Welcome heading */}
        <h1
          className="mb-2 text-center text-[32px] font-bold leading-tight tracking-tight text-[#00361a] sm:text-[40px]"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Welcome back, Shobhana Thakkar
        </h1>
        <p
          className="mx-auto mb-12 max-w-xl text-center text-[16px] leading-relaxed text-[#414942] sm:text-[18px]"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Manage your consultations and track patient wellness efficiently.
        </p>

        {/* CTA Cards */}
        <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          <CTA
            icon={<Users className="h-6 w-6" />}
            title="Existing Patient"
            subtitle="Search & manage clients"
            onClick={() => navigate({ to: "/clients" })}
          />
          <CTA
            icon={<UserPlus className="h-6 w-6" />}
            title="New Patient"
            subtitle="Add basic details & create plan"
            onClick={() => setOpen(true)}
          />
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Patient</DialogTitle>
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
                        ? "border-[#00361a] bg-[#00361a] text-white"
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
                    Range: <span className="font-semibold text-[#00361a]">{Math.max(0, Number(form.idealWeight) - 5).toFixed(1)}</span> – <span className="font-semibold text-[#00361a]">{(Number(form.idealWeight) + 5).toFixed(1)}</span> kg (±5)
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
                    <span className="font-semibold text-[#00361a]">{bmiRounded}</span>
                  ) : (
                    <span className="text-muted-foreground">Enter height & weight</span>
                  )}
                </div>
              </Field>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} className="bg-[#00361a] hover:bg-[#1b4d2e]">Save & Create Plan</Button>
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

function CTA({ icon, title, subtitle, onClick }: { icon: React.ReactNode; title: string; subtitle: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 rounded-xl border border-transparent px-6 py-6 text-left shadow-[0_8px_32px_-8px_rgba(27,77,46,0.08)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_48px_-12px_rgba(27,77,46,0.15)] focus:outline-none focus:ring-2 focus:ring-[#00361a]/30 focus:ring-offset-2 active:scale-[0.98]"
      style={{ backgroundColor: "rgba(254, 142, 39, 0.8)", backdropFilter: "blur(4px)" }}
    >
      {/* Icon circle */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#00361a] text-white shadow-md transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      {/* Text */}
      <div className="flex flex-col">
        <span className="text-[18px] font-bold text-[#00361a]" style={{ fontFamily: "'Manrope', sans-serif" }}>{title}</span>
        <span className="text-[14px] text-[#414942]">{subtitle}</span>
      </div>
      {/* Arrow */}
      <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-[#00361a] transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
}
