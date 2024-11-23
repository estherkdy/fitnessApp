USE calorie_tracker;

-- Drop existing tables that reference Client
DROP TABLE IF EXISTS ClientHobby;
DROP TABLE IF EXISTS ClientGoals;
DROP TABLE IF EXISTS Exercise;
DROP TABLE IF EXISTS Workout;
DROP TABLE IF EXISTS Meal;
DROP TABLE IF EXISTS Diet;
DROP TABLE IF EXISTS Reminder;
DROP TABLE IF EXISTS FitnessPlan;
DROP TABLE IF EXISTS Trainer;
DROP TABLE IF EXISTS Client;
DROP TABLE IF EXISTS Admin;


-- Client Table
CREATE TABLE Client (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    height FLOAT CHECK (height > 0),
    weight FLOAT CHECK (weight > 0),
    age INT CHECK (age > 0),
    Email VARCHAR(100) UNIQUE,
    Password VARCHAR(255) NOT NULL
);

-- ClientHobby Table (references Client)
CREATE TABLE ClientHobby (
    client_id INT,
    hobby VARCHAR(100),
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE
);

-- ClientGoals Table (references Client)
CREATE TABLE ClientGoals (
    goal_id INT AUTO_INCREMENT PRIMARY KEY,
    goal_description VARCHAR(255),
    client_id INT,
    FOREIGN KEY (client_id) REFERENCES Client(client_id) ON DELETE CASCADE
);

-- Trainer Table
CREATE TABLE Trainer (
    TrainerID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Specialty VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    Password VARCHAR(255) NOT NULL
);

-- FitnessPlan Table (references Client and Trainer)
CREATE TABLE FitnessPlan (
    PlanID INT AUTO_INCREMENT PRIMARY KEY,
    ClientID INT,
    TrainerID INT,
    StartDate DATE NOT NULL,
    EndDate DATE,
    Description VARCHAR(255),
    FOREIGN KEY (ClientID) REFERENCES Client(client_id) ON DELETE CASCADE,
    FOREIGN KEY (TrainerID) REFERENCES Trainer(TrainerID) ON DELETE SET NULL,
    CHECK (EndDate IS NULL OR EndDate > StartDate)
);

-- Workout Table (references FitnessPlan)
CREATE TABLE Workout (
    WorkoutID INT AUTO_INCREMENT PRIMARY KEY,
    PlanID INT,
    Name VARCHAR(100) NOT NULL,
    Duration INT CHECK (Duration > 0), -- Duration in minutes
    FOREIGN KEY (PlanID) REFERENCES FitnessPlan(PlanID) ON DELETE CASCADE
);

CREATE TABLE Exercise (
    ExerciseID INT AUTO_INCREMENT PRIMARY KEY,
    ClientID INT,
    TrainerID INT,
    Date DATE DEFAULT NULL,   
    Name VARCHAR(100) NOT NULL,
    Reps INT CHECK (Reps > 0),
    Sets INT CHECK (Sets > 0),
    CaloriesBurned FLOAT CHECK (CaloriesBurned >= 0),
    Completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (ClientID) REFERENCES Client(client_id) ON DELETE CASCADE,
    FOREIGN KEY (TrainerID) REFERENCES Trainer(TrainerID) ON DELETE SET NULL
);

-- Diet Table (references FitnessPlan)
CREATE TABLE Diet (
    DietID INT AUTO_INCREMENT PRIMARY KEY,
    PlanID INT,
    diet_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (PlanID) REFERENCES FitnessPlan(PlanID) ON DELETE CASCADE
);

CREATE TABLE Meal (
    MealID INT AUTO_INCREMENT PRIMARY KEY,
    ClientID INT,
    Date DATE DEFAULT NULL,
    meal_name VARCHAR(255) NOT NULL,
    Calories FLOAT CHECK (Calories >= 0),
    Protein FLOAT CHECK (Protein >= 0),
    Carbs FLOAT CHECK (Carbs >= 0),
    Fat FLOAT CHECK (Fat >= 0),
    Completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (ClientID) REFERENCES Client(client_id) ON DELETE CASCADE
    
);


-- Reminder Table (references Client and Trainer)
CREATE TABLE Reminder (
    ReminderID INT AUTO_INCREMENT PRIMARY KEY,
    ClientID INT,
    TrainerID INT,
    Message VARCHAR(255) NOT NULL,
    ReminderDate DATE NOT NULL,
    FOREIGN KEY (ClientID) REFERENCES Client(client_id) ON DELETE CASCADE,
    FOREIGN KEY (TrainerID) REFERENCES Trainer(TrainerID) ON DELETE SET NULL
);


CREATE TABLE Admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL
);
