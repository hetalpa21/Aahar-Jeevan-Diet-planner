export type PaymentStatus = "Done" | "Pending" | "Partial";

export type Gender = "Male" | "Female" | "Other";

export interface Patient {
  id: string;
  name: string;
  age: number;
  contact: string;
  gender?: Gender;
  currentWeight: number;
  paymentStatus: PaymentStatus;
  totalAmount?: number;
  amountReceived?: number;
  lastPlanDate?: string;
  notes?: string;
  idealWeight?: number;
  height?: number;
  chest?: number;
  waist?: number;
  lowerWaist?: number;
  thigh?: number;
  bmi?: number;
  planStartDate?: string;
  planDurationMonths?: number;
  planEndDate?: string;
  isTerminated?: boolean;
  createdAt?: string;
}

export type PlanStatus = "On Track" | "Completed" | "No Plan" | "Terminated";

export function getPlanStatus(patient: Patient): PlanStatus {
  if (patient.isTerminated) return "Terminated";
  if (!patient.planStartDate || !patient.planEndDate) return "No Plan";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(patient.planEndDate);
  end.setHours(0, 0, 0, 0);
  return today <= end ? "On Track" : "Completed";
}

export function getPlanRemainingText(patient: Patient): string {
  if (patient.isTerminated) return "Terminated";
  if (!patient.planEndDate) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(patient.planEndDate);
  end.setHours(0, 0, 0, 0);
  const diffMs = end.getTime() - today.getTime();
  if (diffMs < 0) return "Plan ended";
  if (diffMs === 0) return "Last day";
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? "s" : ""} left`;
  const months = Math.floor(diffDays / 30);
  const days = diffDays % 30;
  if (days === 0) return `${months} month${months !== 1 ? "s" : ""} left`;
  return `${months}m ${days}d left`;
}

export interface ProgressEntry {
  id: string;
  patientId: string;
  weekNumber: number;
  weight?: number;
  chest?: number;
  waist?: number;
  lowerWaist?: number;
  thigh?: number;
  notes?: string;
  recordedAt: string;
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

export type SlotName = string;
export const DEFAULT_SLOTS: string[] = [
  "Early Morning",
  "After 1 Hour",
  "Workout",
  "Breakfast",
  "Lunch",
  "Evening",
  "Dinner",
  "Bedtime",
];
export const SLOTS = DEFAULT_SLOTS; // backward compat alias
export const DEFAULT_TIMES: Record<string, string> = {
  "Early Morning": "06:00",
  "After 1 Hour": "07:00",
  Workout: "07:30",
  Breakfast: "08:30",
  Lunch: "13:00",
  Evening: "16:30",
  Dinner: "19:30",
  Bedtime: "21:30",
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
  instructions?: PlanInstructions;
}

export type InstructionCategory = "Tip" | "Avoid" | "General";

export interface Instruction {
  id: string;
  text: string;
  category: InstructionCategory;
  isHighlighted: boolean;
}

export interface PlanInstructions {
  tips: string[];      // instruction IDs
  avoidList: string[]; // instruction IDs
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