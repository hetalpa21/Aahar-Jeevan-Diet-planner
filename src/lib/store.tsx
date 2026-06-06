import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { FoodItem, Patient, Plan } from "./types";
import { emptyPlan } from "./types";

const KEY = "aahar_jeevan_v1";

interface StoreState {
  patients: Patient[];
  foods: FoodItem[];
  plans: Plan[];
}

const SEED: StoreState = {
  patients: [
    { id: "p1", name: "Sonia Verma", age: 30, contact: "+91-98200-12345", currentWeight: 72, paymentStatus: "Pending", lastPlanDate: "2026-05-25" },
    { id: "p2", name: "Matthew Green", age: 45, contact: "+1-855-230-7860", currentWeight: 180, paymentStatus: "Done", lastPlanDate: "2026-04-15" },
    { id: "p3", name: "Sarah Lee", age: 52, contact: "+1-835-123-4567", currentWeight: 155, paymentStatus: "Pending", lastPlanDate: "2026-04-10" },
    { id: "p4", name: "David Patel", age: 38, contact: "+1-555-867-8543", currentWeight: 210, paymentStatus: "Partial", lastPlanDate: "2026-04-05" },
    { id: "p5", name: "Samantha Clark", age: 47, contact: "+1-555-855-7890", currentWeight: 130, paymentStatus: "Done", lastPlanDate: "2026-03-25" },
  ],
  foods: [
    { id: "f1", name: "Oats", serving: "40g", calories: 150, protein: 5, carbs: 27, fats: 3, category: "Grains", notes: "Cook with water or milk" },
    { id: "f2", name: "Grilled Chicken", serving: "100g", calories: 165, protein: 31, carbs: 0, fats: 4, category: "Protein" },
    { id: "f3", name: "Apple", serving: "1 medium", calories: 95, protein: 0, carbs: 25, fats: 0, category: "Fruits" },
    { id: "f4", name: "Banana", serving: "1 medium", calories: 105, protein: 1, carbs: 27, fats: 0, category: "Fruits" },
    { id: "f5", name: "Almonds", serving: "10 nuts", calories: 70, protein: 3, carbs: 2, fats: 6, category: "Nuts" },
    { id: "f6", name: "Brown Rice", serving: "1 bowl", calories: 215, protein: 5, carbs: 45, fats: 2, category: "Grains" },
    { id: "f7", name: "Boiled Eggs", serving: "2 eggs", calories: 155, protein: 13, carbs: 1, fats: 11, category: "Protein" },
    { id: "f8", name: "Mixed Vegetables", serving: "1 bowl", calories: 80, protein: 3, carbs: 16, fats: 1, category: "Vegetables" },
    { id: "f9", name: "Greek Yogurt", serving: "150g", calories: 130, protein: 11, carbs: 9, fats: 5, category: "Dairy" },
  ],
  plans: [],
};

function load(): StoreState {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return SEED;
    return JSON.parse(raw);
  } catch {
    return SEED;
  }
}

interface StoreCtx extends StoreState {
  addPatient: (p: Omit<Patient, "id">) => Patient;
  updatePatient: (id: string, p: Partial<Patient>) => void;
  addFood: (f: Omit<FoodItem, "id">) => FoodItem;
  updateFood: (id: string, f: Partial<FoodItem>) => void;
  deleteFood: (id: string) => void;
  savePlan: (plan: Plan) => void;
  getPlanForPatient: (patientId: string) => Plan;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(SEED);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const value: StoreCtx = {
    ...state,
    addPatient: (p) => {
      const newP: Patient = { ...p, id: `p_${Date.now()}` };
      setState((s) => ({ ...s, patients: [newP, ...s.patients] }));
      return newP;
    },
    updatePatient: (id, patch) =>
      setState((s) => ({
        ...s,
        patients: s.patients.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      })),
    addFood: (f) => {
      const newF: FoodItem = { ...f, id: `f_${Date.now()}` };
      setState((s) => ({ ...s, foods: [...s.foods, newF] }));
      return newF;
    },
    updateFood: (id, patch) =>
      setState((s) => ({
        ...s,
        foods: s.foods.map((f) => (f.id === id ? { ...f, ...patch } : f)),
      })),
    deleteFood: (id) =>
      setState((s) => ({ ...s, foods: s.foods.filter((f) => f.id !== id) })),
    savePlan: (plan) => {
      setState((s) => {
        const exists = s.plans.some((p) => p.id === plan.id);
        const plans = exists
          ? s.plans.map((p) => (p.id === plan.id ? plan : p))
          : [...s.plans, plan];
        const patients = s.patients.map((p) =>
          p.id === plan.patientId
            ? { ...p, lastPlanDate: new Date().toISOString().slice(0, 10) }
            : p,
        );
        return { ...s, plans, patients };
      });
    },
    getPlanForPatient: (patientId) => {
      const existing = state.plans.find((p) => p.patientId === patientId);
      if (existing) return existing;
      const patient = state.patients.find((p) => p.id === patientId);
      return emptyPlan(patientId, patient?.name ?? "Patient");
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}