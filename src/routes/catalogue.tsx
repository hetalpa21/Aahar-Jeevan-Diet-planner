import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import type { FoodItem } from "@/lib/types";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/catalogue")({
  head: () => ({
    meta: [
      { title: "Food Catalogue — Aahar Jeevan" },
      { name: "description", content: "Manage your shared food catalogue used across all client diet plans." },
    ],
  }),
  component: Catalogue,
});

function Catalogue() {
  const { foods, addFood, updateFood, deleteFood } = useStore();
  const [editing, setEditing] = useState<FoodItem | null>(null);
  const [open, setOpen] = useState(false);

  function openNew() {
    setEditing(null);
    setOpen(true);
  }
  function openEdit(f: FoodItem) {
    setEditing(f);
    setOpen(true);
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[var(--dark-green)]">Food Catalogue</h1>
          <Button onClick={openNew}><Plus className="mr-1 h-4 w-4" /> Add New Item</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((f) => (
            <div key={f.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--dark-green)]">{f.name}</h3>
                  <p className="text-sm text-muted-foreground">{f.serving} · {f.calories} kcal</p>
                  {f.category && (
                    <span className="mt-2 inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{f.category}</span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(f)} aria-label="Edit" className="rounded-md p-2 text-muted-foreground hover:bg-muted">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => { deleteFood(f.id); toast.success("Item removed"); }} aria-label="Delete" className="rounded-md p-2 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <Stat label="Protein" v={f.protein} />
                <Stat label="Carbs" v={f.carbs} />
                <Stat label="Fats" v={f.fats} />
              </div>
              {f.notes && <p className="mt-3 text-xs text-muted-foreground">{f.notes}</p>}
            </div>
          ))}
        </div>
      </main>

      <FoodDialog
        open={open}
        onClose={() => setOpen(false)}
        food={editing}
        onSave={(data) => {
          if (editing) {
            updateFood(editing.id, data);
            toast.success("Item updated");
          } else {
            addFood(data);
            toast.success("Item added");
          }
          setOpen(false);
        }}
      />
    </div>
  );
}

function Stat({ label, v }: { label: string; v?: number }) {
  return (
    <div className="rounded-md bg-muted/50 py-1">
      <div className="font-semibold">{v ?? 0}g</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}

export function FoodDialog({
  open,
  onClose,
  food,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  food: FoodItem | null;
  onSave: (data: Omit<FoodItem, "id">) => void;
}) {
  const [name, setName] = useState(food?.name ?? "");
  const [serving, setServing] = useState(food?.serving ?? "");
  const [calories, setCalories] = useState(String(food?.calories ?? ""));
  const [protein, setProtein] = useState(String(food?.protein ?? ""));
  const [carbs, setCarbs] = useState(String(food?.carbs ?? ""));
  const [fats, setFats] = useState(String(food?.fats ?? ""));
  const [notes, setNotes] = useState(food?.notes ?? "");

  // re-init when food changes
  useStateSync(food, (f) => {
    setName(f?.name ?? "");
    setServing(f?.serving ?? "");
    setCalories(String(f?.calories ?? ""));
    setProtein(String(f?.protein ?? ""));
    setCarbs(String(f?.carbs ?? ""));
    setFats(String(f?.fats ?? ""));
    setNotes(f?.notes ?? "");
  });

  function submit() {
    if (!name.trim()) { toast.error("Name is required"); return; }
    onSave({
      name: name.trim(),
      serving: serving.trim() || "1 serving",
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
      notes,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{food ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5"><Label>Serving</Label><Input value={serving} onChange={(e) => setServing(e.target.value)} placeholder="40g" /></div>
            <div className="grid gap-1.5"><Label>Calories</Label><Input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5"><Label>Protein</Label><Input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} /></div>
            <div className="grid gap-1.5"><Label>Carbs</Label><Input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} /></div>
            <div className="grid gap-1.5"><Label>Fats</Label><Input type="number" value={fats} onChange={(e) => setFats(e.target.value)} /></div>
          </div>
          <div className="grid gap-1.5"><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          <p className="text-xs text-muted-foreground">Hint: Items can be added and edited from the Diet Planner.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useEffect } from "react";
function useStateSync<T>(value: T, fn: (v: T) => void) {
  useEffect(() => { fn(value); /* eslint-disable-next-line */ }, [value]);
}