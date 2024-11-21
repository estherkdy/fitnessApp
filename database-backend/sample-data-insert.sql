USE calorie_tracker;

-- Insert Clients (20 entries)
INSERT INTO Client (FirstName, LastName, height, weight, age, Email, Password)
VALUES 
    ('John', 'Doe', 180, 75, 30, 'john.doe234@example.com', SHA2('password123', 256)),
    ('Jane', 'Smith', 165, 60, 25, 'jane.smith897@example.com', SHA2('securepass', 256)),
    ('Michael', 'Brown', 175, 85, 35, 'michael.brown564@example.com', SHA2('passmike', 256)),
    ('Sarah', 'Davis', 160, 55, 28, 'sarah.davis324@example.com', SHA2('sarahsecure', 256)),
    ('David', 'Miller', 185, 90, 32, 'david.miller890@example.com', SHA2('davidstrong', 256)),
    ('Linda', 'Wilson', 155, 50, 26, 'linda.wilson672@example.com', SHA2('lindapass', 256)),
    ('James', 'Taylor', 170, 72, 34, 'james.taylor439@example.com', SHA2('jamestay', 256)),
    ('Barbara', 'Anderson', 162, 58, 31, 'barbara.anderson125@example.com', SHA2('barbie', 256)),
    ('Robert', 'Thomas', 178, 80, 29, 'robert.thomas777@example.com', SHA2('robthom', 256)),
    ('Mary', 'Jackson', 168, 65, 27, 'mary.jackson902@example.com', SHA2('maryj', 256)),
    ('William', 'White', 180, 75, 33, 'william.white314@example.com', SHA2('willwhite', 256)),
    ('Patricia', 'Harris', 165, 59, 30, 'patricia.harris541@example.com', SHA2('patpass', 256)),
    ('Joseph', 'Martin', 172, 82, 36, 'joseph.martin103@example.com', SHA2('joemart', 256)),
    ('Nancy', 'Thompson', 160, 53, 24, 'nancy.thompson873@example.com', SHA2('nancyt', 256)),
    ('Thomas', 'Garcia', 180, 78, 35, 'thomas.garcia428@example.com', SHA2('tomgar', 256)),
    ('Karen', 'Martinez', 167, 62, 32, 'karen.martinez290@example.com', SHA2('karenm', 256)),
    ('Christopher', 'Rodriguez', 175, 79, 28, 'chris.rodriguez765@example.com', SHA2('chrisr', 256)),
    ('Jessica', 'Lopez', 160, 56, 26, 'jessica.lopez983@example.com', SHA2('jessl', 256)),
    ('Daniel', 'Gonzales', 182, 85, 34, 'daniel.gonzales456@example.com', SHA2('dangon', 256)),
    ('Ashley', 'Clark', 158, 54, 30, 'ashley.clark672@example.com', SHA2('ashc', 256));

-- Insert Trainers (20 entries)
INSERT INTO Trainer (FirstName, LastName, Specialty, Email, Password)
VALUES 
    ('Alice', 'Johnson', 'Strength Training', 'alice.johnson321@example.com', SHA2('trainerpass1', 256)),
    ('Bob', 'Williams', 'Cardio Specialist', 'bob.williams743@example.com', SHA2('trainerpass2', 256)),
    ('Charlie', 'Brown', 'Yoga', 'charlie.brown218@example.com', SHA2('trainerpass3', 256)),
    ('Diana', 'King', 'Weight Loss', 'diana.king678@example.com', SHA2('trainerpass4', 256)),
    ('Edward', 'Wright', 'Endurance', 'edward.wright569@example.com', SHA2('trainerpass5', 256)),
    ('Fiona', 'Green', 'HIIT', 'fiona.green192@example.com', SHA2('trainerpass6', 256)),
    ('George', 'Hall', 'Pilates', 'george.hall376@example.com', SHA2('trainerpass7', 256)),
    ('Hannah', 'Lee', 'Strength Training', 'hannah.lee845@example.com', SHA2('trainerpass8', 256)),
    ('Ian', 'Young', 'Functional Fitness', 'ian.young290@example.com', SHA2('trainerpass9', 256)),
    ('Jill', 'Allen', 'CrossFit', 'jill.allen497@example.com', SHA2('trainerpass10', 256)),
    ('Kevin', 'Scott', 'Strength Training', 'kevin.scott512@example.com', SHA2('trainerpass11', 256)),
    ('Laura', 'Adams', 'Cardio Specialist', 'laura.adams807@example.com', SHA2('trainerpass12', 256)),
    ('Mike', 'Baker', 'Weight Loss', 'mike.baker346@example.com', SHA2('trainerpass13', 256)),
    ('Nina', 'Carter', 'Yoga', 'nina.carter562@example.com', SHA2('trainerpass14', 256)),
    ('Oscar', 'Collins', 'Endurance', 'oscar.collins135@example.com', SHA2('trainerpass15', 256)),
    ('Paula', 'Bell', 'HIIT', 'paula.bell389@example.com', SHA2('trainerpass16', 256)),
    ('Quentin', 'Hill', 'Pilates', 'quentin.hill765@example.com', SHA2('trainerpass17', 256)),
    ('Rachel', 'Moore', 'Functional Fitness', 'rachel.moore891@example.com', SHA2('trainerpass18', 256)),
    ('Steve', 'Ward', 'CrossFit', 'steve.ward492@example.com', SHA2('trainerpass19', 256)),
    ('Tina', 'Brooks', 'Strength Training', 'tina.brooks219@example.com', SHA2('trainerpass20', 256));


-- Insert Fitness Plans (20 entries)
INSERT INTO FitnessPlan (ClientID, TrainerID, StartDate, EndDate, Description)
VALUES 
    (1, 1, '2024-01-01', '2024-03-01', 'Weight Loss Plan for John'),
    (2, 2, '2024-01-15', '2024-04-15', 'Flexibility Improvement Plan for Jane'),
    (3, 3, '2024-01-10', '2024-02-10', 'Strength Training for Michael'),
    (4, 4, '2024-02-01', '2024-05-01', 'Endurance Training for Sarah'),
    (5, 5, '2024-01-20', '2024-03-20', 'Weight Loss and Toning for David'),
    (6, 6, '2024-01-05', '2024-04-05', 'Muscle Building for Linda'),
    (7, 7, '2024-01-25', '2024-03-25', 'Flexibility Training for James'),
    (8, 8, '2024-01-12', '2024-03-12', 'CrossFit Program for Barbara'),
    (9, 9, '2024-02-05', '2024-04-05', 'Cardio and Core for Robert'),
    (10, 10, '2024-01-20', '2024-04-20', 'General Health Improvement for Mary'),
    (11, 11, '2024-01-15', '2024-04-15', 'Strength Training for William'),
    (12, 12, '2024-01-25', '2024-03-25', 'Cardio Plan for Patricia'),
    (13, 13, '2024-02-10', '2024-05-10', 'Weight Loss Program for Joseph'),
    (14, 14, '2024-01-22', '2024-03-22', 'Flexibility Program for Nancy'),
    (15, 15, '2024-02-01', '2024-04-01', 'Cardio and Strength for Thomas'),
    (16, 16, '2024-01-30', '2024-04-30', 'Endurance Program for Karen'),
    (17, 17, '2024-01-12', '2024-03-12', 'Strength and Conditioning for Christopher'),
    (18, 18, '2024-02-15', '2024-04-15', 'Yoga and Flexibility for Jessica'),
    (19, 19, '2024-01-15', '2024-04-15', 'Weight Loss Plan for Daniel'),
    (20, 20, '2024-02-05', '2024-04-05', 'CrossFit and Endurance for Ashley');

-- Insert Workouts (20 entries for different Fitness Plans)
INSERT INTO Workout (PlanID, Name, Duration)
VALUES 
    (1, 'Cardio Blast', 30),
    (2, 'Yoga Basics', 60),
    (3, 'Strength Circuit', 45),
    (4, 'Endurance Run', 50),
    (5, 'HIIT Routine', 25),
    (6, 'Muscle Builder', 40),
    (7, 'Flexibility Stretch', 20),
    (8, 'CrossFit Starter', 35),
    (9, 'Core Cardio', 30),
    (10, 'Health Circuit', 40),
    (11, 'Strength Training', 55),
    (12, 'Cardio Burn', 30),
    (13, 'Weight Loss Cardio', 45),
    (14, 'Flexibility Flow', 25),
    (15, 'Combined Training', 50),
    (16, 'Endurance Routine', 40),
    (17, 'Strength Conditioning', 45),
    (18, 'Yoga and Relaxation', 60),
    (19, 'Fat Burn HIIT', 30),
    (20, 'CrossFit Advanced', 60);

-- Insert Exercises (at least 20 entries across different Workouts)
INSERT INTO Exercise (WorkoutID, Name, Reps, Sets, CaloriesBurned, Completed)
VALUES 
    (1, 'Running', 15, 3, 300, FALSE),
    (2, 'Downward Dog', 5, 2, 50, FALSE),
    (3, 'Bench Press', 10, 3, 100, TRUE),
    (4, 'Sprints', 20, 4, 200, FALSE),
    (5, 'Burpees', 10, 4, 150, TRUE),
    (6, 'Bicep Curls', 12, 3, 100, FALSE),
    (7, 'Leg Stretch', 5, 3, 30, FALSE),
    (8, 'Box Jumps', 15, 2, 120, TRUE),
    (9, 'Plank', 1, 3, 75, FALSE),
    (10, 'Cycling', 20, 2, 250, FALSE),
    (11, 'Push Ups', 10, 3, 80, FALSE),
    (12, 'Jumping Jacks', 20, 3, 90, TRUE),
    (13, 'Squats', 15, 4, 150, FALSE),
    (14, 'Forward Fold', 5, 3, 30, TRUE),
    (15, 'Rowing', 15, 3, 200, FALSE),
    (16, 'Stair Climb', 10, 3, 130, TRUE),
    (17, 'Shoulder Press', 12, 3, 100, FALSE),
    (18, 'Sun Salutation', 3, 5, 60, FALSE),
    (19, 'Mountain Climbers', 15, 3, 140, TRUE),
    (20, 'Deadlifts', 10, 3, 180, FALSE);

-- Insert Diets (each FitnessPlan can have one Diet)
INSERT INTO Diet (PlanID, diet_name)
VALUES 
    (1, 'Low Carb Diet'),
    (2, 'Vegetarian Diet'),
    (3, 'High Protein Diet'),
    (4, 'Endurance Diet'),
    (5, 'Balanced Diet'),
    (6, 'Muscle Gain Diet'),
    (7, 'Plant-Based Diet'),
    (8, 'Paleo Diet'),
    (9, 'Mediterranean Diet'),
    (10, 'General Health Diet'),
    (11, 'Strength Diet'),
    (12, 'Cardio-Friendly Diet'),
    (13, 'Low Calorie Diet'),
    (14, 'Flexibility Diet'),
    (15, 'Energy Boost Diet'),
    (16, 'Endurance and Recovery Diet'),
    (17, 'Strength and Conditioning Diet'),
    (18, 'Yoga Diet'),
    (19, 'Weight Loss Diet'),
    (20, 'CrossFit Nutrition');

-- Insert Meals (at least 20 entries across different Diets)
INSERT INTO Meal (DietID, meal_name, Calories, Protein, Carbs, Fat, Completed)
VALUES 
    (1, 'Grilled Chicken Salad', 400, 30, 10, 15, FALSE),
    (2, 'Vegetable Stir Fry', 350, 10, 45, 10, FALSE),
    (3, 'Protein Shake', 250, 20, 15, 5, TRUE),
    (4, 'Pasta Salad', 500, 15, 60, 10, FALSE),
    (5, 'Omelette', 300, 20, 5, 20, TRUE),
    (6, 'Beef Stir Fry', 450, 25, 20, 15, FALSE),
    (7, 'Tofu Scramble', 300, 20, 15, 10, TRUE),
    (8, 'Fruit Salad', 200, 2, 50, 0, FALSE),
    (9, 'Steak and Vegetables', 600, 40, 15, 25, TRUE),
    (10, 'Quinoa Bowl', 400, 15, 50, 10, FALSE),
    (11, 'Chicken Wrap', 350, 25, 30, 15, TRUE),
    (12, 'Fish Tacos', 400, 20, 45, 10, FALSE),
    (13, 'Veggie Burger', 300, 10, 40, 10, FALSE),
    (14, 'Smoothie', 150, 5, 35, 5, TRUE),
    (15, 'Avocado Toast', 250, 5, 30, 15, FALSE),
    (16, 'Chia Pudding', 200, 8, 30, 10, FALSE),
    (17, 'Protein Bowl', 450, 30, 40, 15, TRUE),
    (18, 'Baked Salmon', 500, 35, 20, 25, FALSE),
    (19, 'Chicken Stir Fry', 400, 25, 30, 10, TRUE),
    (20, 'Vegetable Soup', 150, 5, 20, 5, FALSE);

-- Insert Reminders (for a variety of Clients and Trainers)
INSERT INTO Reminder (ClientID, TrainerID, Message, ReminderDate)
VALUES 
    (1, 1, 'Drink water before workout', '2024-01-10'),
    (2, 2, 'Attend yoga session', '2024-01-12'),
    (3, 3, 'Check diet log daily', '2024-01-13'),
    (4, 4, 'Remember stretching exercises', '2024-01-14'),
    (5, 5, 'Focus on cardio intensity', '2024-01-15'),
    (6, 6, 'Log weight daily', '2024-01-16'),
    (7, 7, 'Bring a towel to CrossFit', '2024-01-17'),
    (8, 8, 'Check protein intake', '2024-01-18'),
    (9, 9, 'Maintain a balanced diet', '2024-01-19'),
    (10, 10, 'Focus on flexibility exercises', '2024-01-20'),
    (11, 11, 'Hydrate well', '2024-01-21'),
    (12, 12, 'Review progress weekly', '2024-01-22'),
    (13, 13, 'Take supplements as advised', '2024-01-23'),
    (14, 14, 'Wear appropriate shoes', '2024-01-24'),
    (15, 15, 'Attend all cardio sessions', '2024-01-25'),
    (16, 16, 'Take breaks as needed', '2024-01-26'),
    (17, 17, 'Complete workout log', '2024-01-27'),
    (18, 18, 'Track stretching sessions', '2024-01-28'),
    (19, 19, 'Consult for progress updates', '2024-01-29'),
    (20, 20, 'Follow meal plan strictly', '2024-01-30');
