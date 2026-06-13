-- 1. Create Patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL DEFAULT 0,
  contact TEXT DEFAULT '',
  current_weight NUMERIC DEFAULT 0,
  ideal_weight NUMERIC,
  height NUMERIC,
  chest NUMERIC,
  waist NUMERIC,
  lower_waist NUMERIC,
  thigh NUMERIC,
  bmi NUMERIC,
  payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Done', 'Pending', 'Partial')),
  last_plan_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Food catalogue table
CREATE TABLE foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  serving TEXT NOT NULL,
  calories NUMERIC NOT NULL DEFAULT 0,
  protein NUMERIC,
  carbs NUMERIC,
  fats NUMERIC,
  notes TEXT,
  category TEXT DEFAULT 'Other',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Diet plans table
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_draft BOOLEAN DEFAULT true,
  meals JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for plan queries
CREATE INDEX idx_plans_patient ON plans(patient_id);
