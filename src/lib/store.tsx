import { createContext, useContext, type ReactNode } from "react";
import type { FoodItem, Patient, Plan, ProgressEntry } from "./types";
import { emptyPlan } from "./types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPatients,
  addPatient as apiAddPatient,
  updatePatient as apiUpdatePatient,
  deletePatient as apiDeletePatient,
  getFoods,
  addFood as apiAddFood,
  updateFood as apiUpdateFood,
  deleteFood as apiDeleteFood,
  getPlanForPatient as apiGetPlanForPatient,
  savePlan as apiSavePlan,
  getProgressForPatient as apiGetProgress,
  addProgressEntry as apiAddProgress,
  updateProgressEntry as apiUpdateProgress,
  deleteProgressEntry as apiDeleteProgress,
} from "./api/database.functions";

interface StoreCtx {
  patients: Patient[];
  foods: FoodItem[];
  plans: Plan[];
  loading: boolean;
  addPatient: (p: Omit<Patient, "id">) => Promise<Patient>;
  updatePatient: (id: string, p: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  addFood: (f: Omit<FoodItem, "id">) => Promise<FoodItem>;
  updateFood: (id: string, f: Partial<FoodItem>) => Promise<void>;
  deleteFood: (id: string) => Promise<void>;
  savePlan: (plan: Plan) => Promise<Plan>;
  getPlanForPatient: (patientId: string) => Promise<Plan>;
  getProgressForPatient: (patientId: string) => Promise<ProgressEntry[]>;
  addProgressEntry: (entry: Omit<ProgressEntry, "id" | "recordedAt">) => Promise<ProgressEntry>;
  updateProgressEntry: (id: string, patch: Partial<ProgressEntry>) => Promise<void>;
  deleteProgressEntry: (id: string, patientId: string) => Promise<void>;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Queries
  const { data: patients = [], isLoading: loadingPatients } = useQuery({
    queryKey: ["patients"],
    queryFn: () => getPatients(),
  });

  const { data: foods = [], isLoading: loadingFoods } = useQuery({
    queryKey: ["foods"],
    queryFn: () => getFoods(),
  });

  // Mutations with optimistic updates

  const addPatientMutation = useMutation({
    mutationFn: (p: Omit<Patient, "id">) => apiAddPatient({ data: p }),
    onSuccess: (newPatient) => {
      queryClient.setQueryData<Patient[]>(["patients"], (old = []) => [...old, newPatient]);
    },
  });

  const updatePatientMutation = useMutation({
    mutationFn: (args: { id: string; patch: Partial<Patient> }) =>
      apiUpdatePatient({ data: args }),
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: ["patients"] });
      const prev = queryClient.getQueryData<Patient[]>(["patients"]);
      queryClient.setQueryData<Patient[]>(["patients"], (old = []) =>
        old.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["patients"], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });

  const deletePatientMutation = useMutation({
    mutationFn: (id: string) => apiDeletePatient({ data: id }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["patients"] });
      const prev = queryClient.getQueryData<Patient[]>(["patients"]);
      queryClient.setQueryData<Patient[]>(["patients"], (old = []) =>
        old.filter((p) => p.id !== id),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["patients"], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });

  const addFoodMutation = useMutation({
    mutationFn: (f: Omit<FoodItem, "id">) => apiAddFood({ data: f }),
    onSuccess: (newFood) => {
      queryClient.setQueryData<FoodItem[]>(["foods"], (old = []) => [newFood, ...old]);
    },
  });

  const updateFoodMutation = useMutation({
    mutationFn: (args: { id: string; patch: Partial<FoodItem> }) =>
      apiUpdateFood({ data: args }),
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: ["foods"] });
      const prev = queryClient.getQueryData<FoodItem[]>(["foods"]);
      queryClient.setQueryData<FoodItem[]>(["foods"], (old = []) =>
        old.map((f) => (f.id === id ? { ...f, ...patch } : f)),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["foods"], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["foods"] }),
  });

  const deleteFoodMutation = useMutation({
    mutationFn: (id: string) => apiDeleteFood({ data: id }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["foods"] });
      const prev = queryClient.getQueryData<FoodItem[]>(["foods"]);
      queryClient.setQueryData<FoodItem[]>(["foods"], (old = []) =>
        old.filter((f) => f.id !== id),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["foods"], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["foods"] }),
  });

  const savePlanMutation = useMutation({
    mutationFn: (plan: Plan) => apiSavePlan({ data: plan }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["plan", data.patientId] });
    },
  });

  const addProgressMutation = useMutation({
    mutationFn: (e: Omit<ProgressEntry, "id" | "recordedAt">) => apiAddProgress({ data: e }),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["progress", vars.patientId] });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: (args: { id: string; patch: Partial<ProgressEntry> }) =>
      apiUpdateProgress({ data: args }),
  });

  const deleteProgressMutation = useMutation({
    mutationFn: (id: string) => apiDeleteProgress({ data: id }),
  });

  const value: StoreCtx = {
    patients,
    foods,
    plans: [],
    loading: loadingPatients || loadingFoods,
    addPatient: async (p) => {
      return await addPatientMutation.mutateAsync(p);
    },
    updatePatient: async (id, patch) => {
      await updatePatientMutation.mutateAsync({ id, patch });
    },
    deletePatient: async (id) => {
      await deletePatientMutation.mutateAsync(id);
    },
    addFood: async (f) => {
      return await addFoodMutation.mutateAsync(f);
    },
    updateFood: async (id, patch) => {
      await updateFoodMutation.mutateAsync({ id, patch });
    },
    deleteFood: async (id) => {
      await deleteFoodMutation.mutateAsync(id);
    },
    savePlan: async (plan) => {
      return await savePlanMutation.mutateAsync(plan);
    },
    getPlanForPatient: async (patientId) => {
      const plan = await apiGetPlanForPatient({ data: patientId });
      if (plan) return plan;
      const patient = patients.find((p) => p.id === patientId);
      return emptyPlan(patientId, patient?.name ?? "Patient");
    },
    getProgressForPatient: async (patientId) => {
      return await apiGetProgress({ data: patientId });
    },
    addProgressEntry: async (entry) => {
      return await addProgressMutation.mutateAsync(entry);
    },
    updateProgressEntry: async (id, patch) => {
      await updateProgressMutation.mutateAsync({ id, patch });
    },
    deleteProgressEntry: async (id, patientId) => {
      await deleteProgressMutation.mutateAsync(id);
      queryClient.invalidateQueries({ queryKey: ["progress", patientId] });
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}