import { createServerFn } from "@tanstack/react-start";
import { supabase } from "../supabase.server";
import type { Patient, FoodItem, Plan, ProgressEntry } from "../types";

// ==========================================
// PATIENTS SERVER FUNCTIONS
// ==========================================

export const getPatients = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  
  // Map snake_case database schema to camelCase frontend schema
  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    age: row.age,
    contact: row.contact,
    gender: row.gender || undefined,
    currentWeight: Number(row.current_weight) || 0,
    idealWeight: row.ideal_weight ? Number(row.ideal_weight) : undefined,
    height: row.height ? Number(row.height) : undefined,
    chest: row.chest ? Number(row.chest) : undefined,
    waist: row.waist ? Number(row.waist) : undefined,
    lowerWaist: row.lower_waist ? Number(row.lower_waist) : undefined,
    thigh: row.thigh ? Number(row.thigh) : undefined,
    bmi: row.bmi ? Number(row.bmi) : undefined,
    paymentStatus: row.payment_status,
    totalAmount: row.total_amount ? Number(row.total_amount) : undefined,
    amountReceived: row.amount_received ? Number(row.amount_received) : undefined,
    lastPlanDate: row.last_plan_date || undefined,
    notes: row.notes || undefined,
  })) as Patient[];
});

export const addPatient = createServerFn({ method: "POST" })
  .handler(async ({ data: p }: { data: Omit<Patient, "id"> }) => {
    const { data, error } = await supabase
      .from("patients")
      .insert([{
        name: p.name,
        age: p.age,
        contact: p.contact,
        gender: p.gender || null,
        current_weight: p.currentWeight,
        ideal_weight: p.idealWeight,
        height: p.height,
        chest: p.chest,
        waist: p.waist,
        lower_waist: p.lowerWaist,
        thigh: p.thigh,
        bmi: p.bmi,
        payment_status: p.paymentStatus,
        total_amount: p.totalAmount || null,
        amount_received: p.amountReceived || null,
        notes: p.notes,
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      name: data.name,
      age: data.age,
      contact: data.contact,
      gender: data.gender || undefined,
      currentWeight: Number(data.current_weight) || 0,
      idealWeight: data.ideal_weight ? Number(data.ideal_weight) : undefined,
      height: data.height ? Number(data.height) : undefined,
      chest: data.chest ? Number(data.chest) : undefined,
      waist: data.waist ? Number(data.waist) : undefined,
      lowerWaist: data.lower_waist ? Number(data.lower_waist) : undefined,
      thigh: data.thigh ? Number(data.thigh) : undefined,
      bmi: data.bmi ? Number(data.bmi) : undefined,
      paymentStatus: data.payment_status,
      totalAmount: data.total_amount ? Number(data.total_amount) : undefined,
      amountReceived: data.amount_received ? Number(data.amount_received) : undefined,
      lastPlanDate: data.last_plan_date || undefined,
      notes: data.notes || undefined,
    } as Patient;
  });

export const updatePatient = createServerFn({ method: "POST" })
  .handler(async ({ data: { id, patch } }: { data: { id: string; patch: Partial<Patient> } }) => {
    const dbPatch: any = {};
    if (patch.name !== undefined) dbPatch.name = patch.name;
    if (patch.age !== undefined) dbPatch.age = patch.age;
    if (patch.contact !== undefined) dbPatch.contact = patch.contact;
    if (patch.gender !== undefined) dbPatch.gender = patch.gender;
    if (patch.currentWeight !== undefined) dbPatch.current_weight = patch.currentWeight;
    if (patch.idealWeight !== undefined) dbPatch.ideal_weight = patch.idealWeight;
    if (patch.height !== undefined) dbPatch.height = patch.height;
    if (patch.chest !== undefined) dbPatch.chest = patch.chest;
    if (patch.waist !== undefined) dbPatch.waist = patch.waist;
    if (patch.lowerWaist !== undefined) dbPatch.lower_waist = patch.lowerWaist;
    if (patch.thigh !== undefined) dbPatch.thigh = patch.thigh;
    if (patch.bmi !== undefined) dbPatch.bmi = patch.bmi;
    if (patch.paymentStatus !== undefined) dbPatch.payment_status = patch.paymentStatus;
    if (patch.totalAmount !== undefined) dbPatch.total_amount = patch.totalAmount;
    if (patch.amountReceived !== undefined) dbPatch.amount_received = patch.amountReceived;
    if (patch.notes !== undefined) dbPatch.notes = patch.notes;
    if (patch.lastPlanDate !== undefined) dbPatch.last_plan_date = patch.lastPlanDate;

    dbPatch.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from("patients")
      .update(dbPatch)
      .eq("id", id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

// ==========================================
// FOODS SERVER FUNCTIONS
// ==========================================

export const getFoods = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabase
    .from("foods")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  
  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    serving: row.serving,
    calories: Number(row.calories) || 0,
    protein: row.protein ? Number(row.protein) : undefined,
    carbs: row.carbs ? Number(row.carbs) : undefined,
    fats: row.fats ? Number(row.fats) : undefined,
    notes: row.notes || undefined,
    category: row.category || undefined,
  })) as FoodItem[];
});

export const addFood = createServerFn({ method: "POST" })
  .handler(async ({ data: f }: { data: Omit<FoodItem, "id"> }) => {
    const { data, error } = await supabase
      .from("foods")
      .insert([{
        name: f.name,
        serving: f.serving,
        calories: f.calories,
        protein: f.protein,
        carbs: f.carbs,
        fats: f.fats,
        notes: f.notes,
        category: f.category,
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      name: data.name,
      serving: data.serving,
      calories: Number(data.calories) || 0,
      protein: data.protein ? Number(data.protein) : undefined,
      carbs: data.carbs ? Number(data.carbs) : undefined,
      fats: data.fats ? Number(data.fats) : undefined,
      notes: data.notes || undefined,
      category: data.category || undefined,
    } as FoodItem;
  });

export const updateFood = createServerFn({ method: "POST" })
  .handler(async ({ data: { id, patch } }: { data: { id: string; patch: Partial<FoodItem> } }) => {
    const dbPatch: any = {};
    if (patch.name !== undefined) dbPatch.name = patch.name;
    if (patch.serving !== undefined) dbPatch.serving = patch.serving;
    if (patch.calories !== undefined) dbPatch.calories = patch.calories;
    if (patch.protein !== undefined) dbPatch.protein = patch.protein;
    if (patch.carbs !== undefined) dbPatch.carbs = patch.carbs;
    if (patch.fats !== undefined) dbPatch.fats = patch.fats;
    if (patch.notes !== undefined) dbPatch.notes = patch.notes;
    if (patch.category !== undefined) dbPatch.category = patch.category;

    const { error } = await supabase
      .from("foods")
      .update(dbPatch)
      .eq("id", id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

export const deleteFood = createServerFn({ method: "POST" })
  .handler(async ({ data: id }: { data: string }) => {
    const { error } = await supabase
      .from("foods")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

// ==========================================
// PLANS SERVER FUNCTIONS
// ==========================================

export const getPlanForPatient = createServerFn({ method: "GET" })
  .handler(async ({ data: patientId }: { data: string }) => {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("patient_id", patientId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return {
      id: data.id,
      patientId: data.patient_id,
      title: data.title,
      isDraft: data.is_draft,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      meals: data.meals,
    } as Plan;
  });

export const savePlan = createServerFn({ method: "POST" })
  .handler(async ({ data: p }: { data: Plan }) => {
    // 1. Check if a plan already exists for this patient
    const { data: existing } = await supabase
      .from("plans")
      .select("id")
      .eq("patient_id", p.patientId)
      .maybeSingle();

    let planData: any;
    let planError: any;

    if (existing) {
      // Update existing plan
      const result = await supabase
        .from("plans")
        .update({
          title: p.title,
          is_draft: p.isDraft,
          meals: p.meals,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
      planData = result.data;
      planError = result.error;
    } else {
      // Insert new plan (let DB generate UUID)
      const result = await supabase
        .from("plans")
        .insert({
          patient_id: p.patientId,
          title: p.title,
          is_draft: p.isDraft,
          meals: p.meals,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      planData = result.data;
      planError = result.error;
    }

    if (planError) throw new Error(planError.message);

    // 2. Update patient's last plan date to today
    const today = new Date().toISOString().split("T")[0];
    const { error: patientError } = await supabase
      .from("patients")
      .update({ last_plan_date: today })
      .eq("id", p.patientId);

    if (patientError) throw new Error(patientError.message);

    return {
      id: planData.id,
      patientId: planData.patient_id,
      title: planData.title,
      isDraft: planData.is_draft,
      createdAt: planData.created_at,
      updatedAt: planData.updated_at,
      meals: planData.meals,
    } as Plan;
  });

// ==========================================
// DELETE PATIENT
// ==========================================

export const deletePatient = createServerFn({ method: "POST" })
  .handler(async ({ data: id }: { data: string }) => {
    const { error } = await supabase
      .from("patients")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

// ==========================================
// PROGRESS ENTRIES SERVER FUNCTIONS
// ==========================================

export const getProgressForPatient = createServerFn({ method: "GET" })
  .handler(async ({ data: patientId }: { data: string }) => {
    const { data, error } = await supabase
      .from("progress_entries")
      .select("*")
      .eq("patient_id", patientId)
      .order("week_number", { ascending: true });

    if (error) throw new Error(error.message);

    return (data || []).map((row: any) => ({
      id: row.id,
      patientId: row.patient_id,
      weekNumber: row.week_number,
      weight: row.weight ? Number(row.weight) : undefined,
      waist: row.waist ? Number(row.waist) : undefined,
      lowerWaist: row.lower_waist ? Number(row.lower_waist) : undefined,
      thigh: row.thigh ? Number(row.thigh) : undefined,
      notes: row.notes || undefined,
      recordedAt: row.recorded_at,
    })) as ProgressEntry[];
  });

export const addProgressEntry = createServerFn({ method: "POST" })
  .handler(async ({ data: e }: { data: Omit<ProgressEntry, "id" | "recordedAt"> }) => {
    const { data, error } = await supabase
      .from("progress_entries")
      .insert([{
        patient_id: e.patientId,
        week_number: e.weekNumber,
        weight: e.weight,
        waist: e.waist,
        lower_waist: e.lowerWaist,
        thigh: e.thigh,
        notes: e.notes,
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      id: data.id,
      patientId: data.patient_id,
      weekNumber: data.week_number,
      weight: data.weight ? Number(data.weight) : undefined,
      waist: data.waist ? Number(data.waist) : undefined,
      lowerWaist: data.lower_waist ? Number(data.lower_waist) : undefined,
      thigh: data.thigh ? Number(data.thigh) : undefined,
      notes: data.notes || undefined,
      recordedAt: data.recorded_at,
    } as ProgressEntry;
  });

export const updateProgressEntry = createServerFn({ method: "POST" })
  .handler(async ({ data: { id, patch } }: { data: { id: string; patch: Partial<ProgressEntry> } }) => {
    const dbPatch: any = {};
    if (patch.weight !== undefined) dbPatch.weight = patch.weight;
    if (patch.waist !== undefined) dbPatch.waist = patch.waist;
    if (patch.lowerWaist !== undefined) dbPatch.lower_waist = patch.lowerWaist;
    if (patch.thigh !== undefined) dbPatch.thigh = patch.thigh;
    if (patch.notes !== undefined) dbPatch.notes = patch.notes;

    const { error } = await supabase
      .from("progress_entries")
      .update(dbPatch)
      .eq("id", id);

    if (error) throw new Error(error.message);
    return { success: true };
  });

export const deleteProgressEntry = createServerFn({ method: "POST" })
  .handler(async ({ data: id }: { data: string }) => {
    const { error } = await supabase
      .from("progress_entries")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
    return { success: true };
  });
