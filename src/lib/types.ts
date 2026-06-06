export type PaymentStatus = "Done" | "Pending" | "Partial";

export interface Patient {
  id: string;
  name: string;
  age: number;
  contact: string;
  currentWeight: number;
  targetWeight: number;
  paymentStatus: PaymentStatus;
  lastPlanDate?: string;
  notes?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  serving: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  notes?: string;
  category?: string;
}

export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export const DAYS: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type SlotName = "Early Morning" | "Breakfast" | "Lunch" | "Evening Snack" | "Dinner";
export const SLOTS: SlotName[] = [
  "Early Morning",
  "Breakfast",
  "Lunch",
  "Evening Snack",
  "Dinner",
];
export const DEFAULT_TIMES: Record<SlotName, string> = {
  "Early Morning": "06:30",
  Breakfast: "08:00",
  Lunch: "13:00",
  "Evening Snack": "16:30",
  Dinner: "19:30",
};

export interface PlanItem {
  foodId: string;
  portion: string;
  notes?: string;
}
export interface PlanSlot {
  slotName: SlotName;
  time: string;
  items: PlanItem[];
}
export interface PlanDay {
  day: DayKey;
  slots: PlanSlot[];
}
export interface Plan {
  id: string;
  patientId: string;
  title: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  meals: PlanDay[];
}

export function emptyPlan(patientId: string, patientName: string): Plan {
  return {
    id: `plan_${Date.now()}`,
    patientId,
    title: `Week Plan — ${patientName}`,
    isDraft: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    meals: DAYS.map((day) => ({
      day,
      slots: SLOTS.map((s) => ({ slotName: s, time: DEFAULT_TIMES[s], items: [] })),
    })),
  };
}