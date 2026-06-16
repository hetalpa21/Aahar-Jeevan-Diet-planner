import { c as createServerRpc } from "./createServerRpc-CwiB1qMI.mjs";
import { c as createServerFn } from "./server-BVPxk9Ny.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables in .env");
}
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});
const getPatients_createServerFn_handler = createServerRpc({
  id: "66af482de39a6f8183715cde3c2da0f2b1cca898fcb9fa1c8b0d9a3a3acf1fb3",
  name: "getPatients",
  filename: "src/lib/api/database.functions.ts"
}, (opts) => getPatients.__executeServer(opts));
const getPatients = createServerFn({
  method: "GET"
}).handler(getPatients_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabase.from("patients").select("*").order("name", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    age: row.age,
    contact: row.contact,
    gender: row.gender || void 0,
    currentWeight: Number(row.current_weight) || 0,
    idealWeight: row.ideal_weight ? Number(row.ideal_weight) : void 0,
    height: row.height ? Number(row.height) : void 0,
    chest: row.chest ? Number(row.chest) : void 0,
    waist: row.waist ? Number(row.waist) : void 0,
    lowerWaist: row.lower_waist ? Number(row.lower_waist) : void 0,
    thigh: row.thigh ? Number(row.thigh) : void 0,
    bmi: row.bmi ? Number(row.bmi) : void 0,
    paymentStatus: row.payment_status,
    totalAmount: row.total_amount ? Number(row.total_amount) : void 0,
    amountReceived: row.amount_received ? Number(row.amount_received) : void 0,
    lastPlanDate: row.last_plan_date || void 0,
    notes: row.notes || void 0
  }));
});
const addPatient_createServerFn_handler = createServerRpc({
  id: "0be4c5e2fb38d0d04ca779c54fc9bcd56845ba36585f434eb043d3a83c0abaed",
  name: "addPatient",
  filename: "src/lib/api/database.functions.ts"
}, (opts) => addPatient.__executeServer(opts));
const addPatient = createServerFn({
  method: "POST"
}).handler(addPatient_createServerFn_handler, async ({
  data: p
}) => {
  const {
    data,
    error
  } = await supabase.from("patients").insert([{
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
    notes: p.notes
  }]).select().single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    name: data.name,
    age: data.age,
    contact: data.contact,
    gender: data.gender || void 0,
    currentWeight: Number(data.current_weight) || 0,
    idealWeight: data.ideal_weight ? Number(data.ideal_weight) : void 0,
    height: data.height ? Number(data.height) : void 0,
    chest: data.chest ? Number(data.chest) : void 0,
    waist: data.waist ? Number(data.waist) : void 0,
    lowerWaist: data.lower_waist ? Number(data.lower_waist) : void 0,
    thigh: data.thigh ? Number(data.thigh) : void 0,
    bmi: data.bmi ? Number(data.bmi) : void 0,
    paymentStatus: data.payment_status,
    totalAmount: data.total_amount ? Number(data.total_amount) : void 0,
    amountReceived: data.amount_received ? Number(data.amount_received) : void 0,
    lastPlanDate: data.last_plan_date || void 0,
    notes: data.notes || void 0
  };
});
const updatePatient_createServerFn_handler = createServerRpc({
  id: "375d997bd1a4828cf68e97f84fc29c8bafed29b37f9a18ed2f0c2cf37cb292dc",
  name: "updatePatient",
  filename: "src/lib/api/database.functions.ts"
}, (opts) => updatePatient.__executeServer(opts));
const updatePatient = createServerFn({
  method: "POST"
}).handler(updatePatient_createServerFn_handler, async ({
  data: {
    id,
    patch
  }
}) => {
  const dbPatch = {};
  if (patch.name !== void 0) dbPatch.name = patch.name;
  if (patch.age !== void 0) dbPatch.age = patch.age;
  if (patch.contact !== void 0) dbPatch.contact = patch.contact;
  if (patch.gender !== void 0) dbPatch.gender = patch.gender;
  if (patch.currentWeight !== void 0) dbPatch.current_weight = patch.currentWeight;
  if (patch.idealWeight !== void 0) dbPatch.ideal_weight = patch.idealWeight;
  if (patch.height !== void 0) dbPatch.height = patch.height;
  if (patch.chest !== void 0) dbPatch.chest = patch.chest;
  if (patch.waist !== void 0) dbPatch.waist = patch.waist;
  if (patch.lowerWaist !== void 0) dbPatch.lower_waist = patch.lowerWaist;
  if (patch.thigh !== void 0) dbPatch.thigh = patch.thigh;
  if (patch.bmi !== void 0) dbPatch.bmi = patch.bmi;
  if (patch.paymentStatus !== void 0) dbPatch.payment_status = patch.paymentStatus;
  if (patch.totalAmount !== void 0) dbPatch.total_amount = patch.totalAmount;
  if (patch.amountReceived !== void 0) dbPatch.amount_received = patch.amountReceived;
  if (patch.notes !== void 0) dbPatch.notes = patch.notes;
  if (patch.lastPlanDate !== void 0) dbPatch.last_plan_date = patch.lastPlanDate;
  dbPatch.updated_at = (/* @__PURE__ */ new Date()).toISOString();
  const {
    error
  } = await supabase.from("patients").update(dbPatch).eq("id", id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const getFoods_createServerFn_handler = createServerRpc({
  id: "7aa5e07fa5742934acc25a1ac72ea66b4003fc6052a69a3bfec34905ff3c0bbf",
  name: "getFoods",
  filename: "src/lib/api/database.functions.ts"
}, (opts) => getFoods.__executeServer(opts));
const getFoods = createServerFn({
  method: "GET"
}).handler(getFoods_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabase.from("foods").select("*").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    serving: row.serving,
    calories: Number(row.calories) || 0,
    protein: row.protein ? Number(row.protein) : void 0,
    carbs: row.carbs ? Number(row.carbs) : void 0,
    fats: row.fats ? Number(row.fats) : void 0,
    notes: row.notes || void 0,
    category: row.category || void 0
  }));
});
const addFood_createServerFn_handler = createServerRpc({
  id: "2261613e621672cf612b2a746c83b30ebbce91c4084579d7b45ef72a11d63e17",
  name: "addFood",
  filename: "src/lib/api/database.functions.ts"
}, (opts) => addFood.__executeServer(opts));
const addFood = createServerFn({
  method: "POST"
}).handler(addFood_createServerFn_handler, async ({
  data: f
}) => {
  const {
    data,
    error
  } = await supabase.from("foods").insert([{
    name: f.name,
    serving: f.serving,
    calories: f.calories,
    protein: f.protein,
    carbs: f.carbs,
    fats: f.fats,
    notes: f.notes,
    category: f.category
  }]).select().single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    name: data.name,
    serving: data.serving,
    calories: Number(data.calories) || 0,
    protein: data.protein ? Number(data.protein) : void 0,
    carbs: data.carbs ? Number(data.carbs) : void 0,
    fats: data.fats ? Number(data.fats) : void 0,
    notes: data.notes || void 0,
    category: data.category || void 0
  };
});
const updateFood_createServerFn_handler = createServerRpc({
  id: "42ac39f2959eaa3d8152cb30609721ba34cd7aeab93061b7a262f8ff207308a9",
  name: "updateFood",
  filename: "src/lib/api/database.functions.ts"
}, (opts) => updateFood.__executeServer(opts));
const updateFood = createServerFn({
  method: "POST"
}).handler(updateFood_createServerFn_handler, async ({
  data: {
    id,
    patch
  }
}) => {
  const dbPatch = {};
  if (patch.name !== void 0) dbPatch.name = patch.name;
  if (patch.serving !== void 0) dbPatch.serving = patch.serving;
  if (patch.calories !== void 0) dbPatch.calories = patch.calories;
  if (patch.protein !== void 0) dbPatch.protein = patch.protein;
  if (patch.carbs !== void 0) dbPatch.carbs = patch.carbs;
  if (patch.fats !== void 0) dbPatch.fats = patch.fats;
  if (patch.notes !== void 0) dbPatch.notes = patch.notes;
  if (patch.category !== void 0) dbPatch.category = patch.category;
  const {
    error
  } = await supabase.from("foods").update(dbPatch).eq("id", id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const deleteFood_createServerFn_handler = createServerRpc({
  id: "4a054d10d5a5732fa92e0edc20fecc809429be5855f482bc12f27624383226ee",
  name: "deleteFood",
  filename: "src/lib/api/database.functions.ts"
}, (opts) => deleteFood.__executeServer(opts));
const deleteFood = createServerFn({
  method: "POST"
}).handler(deleteFood_createServerFn_handler, async ({
  data: id
}) => {
  const {
    error
  } = await supabase.from("foods").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const getPlanForPatient_createServerFn_handler = createServerRpc({
  id: "755e2d6cacd1a25565bc1233237561ddb031c0a989955e02a221e0b0f4c75112",
  name: "getPlanForPatient",
  filename: "src/lib/api/database.functions.ts"
}, (opts) => getPlanForPatient.__executeServer(opts));
const getPlanForPatient = createServerFn({
  method: "GET"
}).handler(getPlanForPatient_createServerFn_handler, async ({
  data: patientId
}) => {
  const {
    data,
    error
  } = await supabase.from("plans").select("*").eq("patient_id", patientId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    id: data.id,
    patientId: data.patient_id,
    title: data.title,
    isDraft: data.is_draft,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    meals: data.meals
  };
});
const savePlan_createServerFn_handler = createServerRpc({
  id: "f452290df2ee5c30fd2396414c5b4b2d92ee3001f4514240cafe4b5cfefded4d",
  name: "savePlan",
  filename: "src/lib/api/database.functions.ts"
}, (opts) => savePlan.__executeServer(opts));
const savePlan = createServerFn({
  method: "POST"
}).handler(savePlan_createServerFn_handler, async ({
  data: p
}) => {
  const {
    data: existing
  } = await supabase.from("plans").select("id").eq("patient_id", p.patientId).maybeSingle();
  let planData;
  let planError;
  if (existing) {
    const result = await supabase.from("plans").update({
      title: p.title,
      is_draft: p.isDraft,
      meals: p.meals,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", existing.id).select().single();
    planData = result.data;
    planError = result.error;
  } else {
    const result = await supabase.from("plans").insert({
      patient_id: p.patientId,
      title: p.title,
      is_draft: p.isDraft,
      meals: p.meals,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).select().single();
    planData = result.data;
    planError = result.error;
  }
  if (planError) throw new Error(planError.message);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const {
    error: patientError
  } = await supabase.from("patients").update({
    last_plan_date: today
  }).eq("id", p.patientId);
  if (patientError) throw new Error(patientError.message);
  return {
    id: planData.id,
    patientId: planData.patient_id,
    title: planData.title,
    isDraft: planData.is_draft,
    createdAt: planData.created_at,
    updatedAt: planData.updated_at,
    meals: planData.meals
  };
});
const deletePatient_createServerFn_handler = createServerRpc({
  id: "c260d2d6674852f91abad0d06aa0b32e0dbad59e8885851140a70962e4cb953b",
  name: "deletePatient",
  filename: "src/lib/api/database.functions.ts"
}, (opts) => deletePatient.__executeServer(opts));
const deletePatient = createServerFn({
  method: "POST"
}).handler(deletePatient_createServerFn_handler, async ({
  data: id
}) => {
  const {
    error
  } = await supabase.from("patients").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const getProgressForPatient_createServerFn_handler = createServerRpc({
  id: "8542ceca8f92e07044762468e1d9b43091d9c337b3383d8950bc33eb18763fd7",
  name: "getProgressForPatient",
  filename: "src/lib/api/database.functions.ts"
}, (opts) => getProgressForPatient.__executeServer(opts));
const getProgressForPatient = createServerFn({
  method: "GET"
}).handler(getProgressForPatient_createServerFn_handler, async ({
  data: patientId
}) => {
  const {
    data,
    error
  } = await supabase.from("progress_entries").select("*").eq("patient_id", patientId).order("week_number", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return (data || []).map((row) => ({
    id: row.id,
    patientId: row.patient_id,
    weekNumber: row.week_number,
    weight: row.weight ? Number(row.weight) : void 0,
    waist: row.waist ? Number(row.waist) : void 0,
    lowerWaist: row.lower_waist ? Number(row.lower_waist) : void 0,
    thigh: row.thigh ? Number(row.thigh) : void 0,
    notes: row.notes || void 0,
    recordedAt: row.recorded_at
  }));
});
const addProgressEntry_createServerFn_handler = createServerRpc({
  id: "f753cc5a6a451f7ffc6c166fe8f25268accb08e2728e9a60a1fa43d2e9001fa9",
  name: "addProgressEntry",
  filename: "src/lib/api/database.functions.ts"
}, (opts) => addProgressEntry.__executeServer(opts));
const addProgressEntry = createServerFn({
  method: "POST"
}).handler(addProgressEntry_createServerFn_handler, async ({
  data: e
}) => {
  const {
    data,
    error
  } = await supabase.from("progress_entries").insert([{
    patient_id: e.patientId,
    week_number: e.weekNumber,
    weight: e.weight,
    waist: e.waist,
    lower_waist: e.lowerWaist,
    thigh: e.thigh,
    notes: e.notes
  }]).select().single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    patientId: data.patient_id,
    weekNumber: data.week_number,
    weight: data.weight ? Number(data.weight) : void 0,
    waist: data.waist ? Number(data.waist) : void 0,
    lowerWaist: data.lower_waist ? Number(data.lower_waist) : void 0,
    thigh: data.thigh ? Number(data.thigh) : void 0,
    notes: data.notes || void 0,
    recordedAt: data.recorded_at
  };
});
const updateProgressEntry_createServerFn_handler = createServerRpc({
  id: "c418bd9896403311ccd7fe87bffcf795c15617fb4a0f5bb7c861e2270056a1ea",
  name: "updateProgressEntry",
  filename: "src/lib/api/database.functions.ts"
}, (opts) => updateProgressEntry.__executeServer(opts));
const updateProgressEntry = createServerFn({
  method: "POST"
}).handler(updateProgressEntry_createServerFn_handler, async ({
  data: {
    id,
    patch
  }
}) => {
  const dbPatch = {};
  if (patch.weight !== void 0) dbPatch.weight = patch.weight;
  if (patch.waist !== void 0) dbPatch.waist = patch.waist;
  if (patch.lowerWaist !== void 0) dbPatch.lower_waist = patch.lowerWaist;
  if (patch.thigh !== void 0) dbPatch.thigh = patch.thigh;
  if (patch.notes !== void 0) dbPatch.notes = patch.notes;
  const {
    error
  } = await supabase.from("progress_entries").update(dbPatch).eq("id", id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
const deleteProgressEntry_createServerFn_handler = createServerRpc({
  id: "55e750c373d5c050d313bf4afbab306c84a10fe3b2f0633ccb6ed2a65c7b1e97",
  name: "deleteProgressEntry",
  filename: "src/lib/api/database.functions.ts"
}, (opts) => deleteProgressEntry.__executeServer(opts));
const deleteProgressEntry = createServerFn({
  method: "POST"
}).handler(deleteProgressEntry_createServerFn_handler, async ({
  data: id
}) => {
  const {
    error
  } = await supabase.from("progress_entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return {
    success: true
  };
});
export {
  addFood_createServerFn_handler,
  addPatient_createServerFn_handler,
  addProgressEntry_createServerFn_handler,
  deleteFood_createServerFn_handler,
  deletePatient_createServerFn_handler,
  deleteProgressEntry_createServerFn_handler,
  getFoods_createServerFn_handler,
  getPatients_createServerFn_handler,
  getPlanForPatient_createServerFn_handler,
  getProgressForPatient_createServerFn_handler,
  savePlan_createServerFn_handler,
  updateFood_createServerFn_handler,
  updatePatient_createServerFn_handler,
  updateProgressEntry_createServerFn_handler
};
