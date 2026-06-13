-- Seed sample food items
INSERT INTO foods (name, category, serving, calories, protein, carbs, fats, notes) VALUES
('Oats with Skimmed Milk', 'Grains', '1 bowl', 250, 10, 40, 5, 'High fiber breakfast choice'),
('Boiled Egg Whites', 'Protein', '4 pieces', 68, 16, 0.8, 0.2, 'Pure protein source'),
('Grilled Chicken Breast', 'Protein', '150g', 248, 46, 0, 6, 'Lean protein dinner/lunch option'),
('Mixed Vegetable Salad', 'Vegetables', '1 plate', 75, 2, 12, 1, 'Assorted raw vegetables with lemon dressing'),
('Apple with Peanut Butter', 'Fruits', '1 medium + 1 tbsp', 180, 4, 25, 8, 'Perfect afternoon snack'),
('Almonds & Walnuts', 'Nuts', '1 handful (30g)', 190, 6, 6, 17, 'Healthy dietary fats'),
('Brown Rice (Cooked)', 'Grains', '1 cup', 215, 5, 45, 1.6, 'Complex carbohydrate source'),
('Paneer Tikka (Grilled)', 'Dairy', '150g', 280, 18, 8, 20, 'Vegetarian protein option'),
('Green Tea', 'Other', '1 cup', 2, 0, 0, 0, 'Rich in antioxidants');

-- Seed sample patients
INSERT INTO patients (name, age, contact, current_weight, ideal_weight, height, payment_status, notes) VALUES
('Amit Patel', 34, '+91 98765 43210', 82.5, 75.0, 176, 'Done', 'Wants to focus on fat loss and muscle gain.'),
('Priya Sharma', 28, '+91 91234 56789', 64.0, 58.0, 162, 'Pending', 'PCOS management, low glycemic index foods preferred.'),
('Rajesh Kumar', 45, '+91 88888 77777', 91.2, 80.0, 172, 'Partial', 'Hypertension history. Restrict sodium levels.'),
('Sneha Reddy', 22, '+91 99999 00000', 52.3, 55.0, 165, 'Done', 'Weight gain client, needs hypercaloric diet plan.'),
('Vikram Shah', 51, '+91 77777 66666', 78.4, 75.0, 170, 'Pending', 'General wellness and diabetic diet requirements.');
