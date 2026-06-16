-- Instructions catalogue table
CREATE TABLE instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General' CHECK (category IN ('Tip', 'Avoid', 'General')),
  is_highlighted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add instructions JSONB column to plans table
ALTER TABLE plans ADD COLUMN IF NOT EXISTS instructions JSONB DEFAULT '{"tips":[],"avoidList":[]}';

-- Seed with the existing hardcoded instructions

-- Tips
INSERT INTO instructions (text, category, is_highlighted) VALUES
('7 hrs. Sleep, Stress free life, Exercise help to live a happy and healthy life.', 'Tip', true),
('Vegetables include carrots, cucumber, green peppers, Broccoli, cauliflower, Cabbage, lettuce, mushrooms, onions, red peppers, tomatoes, beetroot, peas, celery, chili, garlic, basil, coriander, parsley, etc.', 'Tip', false),
('Drink at least 4 liters of water per day, (Make sure Urine color should be pale yellow).', 'Tip', false),
('Make sure don''t consume more than the mentioned quantity.', 'Tip', false),
('Daily 45 mins any exercise (5 days in a week).', 'Tip', false);

-- Avoid List
INSERT INTO instructions (text, category, is_highlighted) VALUES
('Wheat, Sugar & Maida completely.', 'Avoid', true),
('Simple sugar, jaggery & honey', 'Avoid', true),
('Package food like chips, biscuits or any snacks', 'Avoid', true),
('Home Fried food like puri, samosa, pakoda etc.', 'Avoid', false),
('Processed food & trans-fat.', 'Avoid', false),
('Pre made snacks like shukadi.....etc.', 'Avoid', false),
('Outside unhealthy snacks like panipuri, pav bhaji, pizza, burger etc.', 'Avoid', false),
('Bakery items like breads, cake, biscuits etc.', 'Avoid', false),
('Ice-cream, candy, Cold coco.', 'Avoid', false),
('Chocolates.', 'Avoid', false),
('Artificial sweeteners like ready fruits juice.', 'Avoid', false),
('Sugar sweetened beverages like soft drink, fruit drink, sports drinks etc.', 'Avoid', false),
('Alcoholic beverages like red bulls.', 'Avoid', false);
