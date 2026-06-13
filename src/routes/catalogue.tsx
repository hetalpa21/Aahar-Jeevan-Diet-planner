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

                  {f.category && (
                    <span className="mt-2 inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{f.category}</span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(f)} aria-label="Edit" className="rounded-md p-2 text-muted-foreground hover:bg-muted">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={async () => {
                    try {
                      await deleteFood(f.id);
                      toast.success("Item removed");
                    } catch (err: any) {
                      toast.error("Failed to remove item: " + err.message);
                    }
                  }} aria-label="Delete" className="rounded-md p-2 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
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
        onSave={async (data) => {
          try {
            if (editing) {
              await updateFood(editing.id, data);
              toast.success("Item updated");
            } else {
              await addFood(data);
              toast.success("Item added");
            }
          } catch (err: any) {
            toast.error("Failed to save item: " + err.message);
          }
          setOpen(false);
        }}
      />
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
  const [notes, setNotes] = useState(food?.notes ?? "");

  // re-init when food changes
  useStateSync(food, (f) => {
    setName(f?.name ?? "");
    setNotes(f?.notes ?? "");
  });

  function submit() {
    if (!name.trim()) { toast.error("Name is required"); return; }
    onSave({
      name: name.trim(),
      serving: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
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