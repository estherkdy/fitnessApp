from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

def create_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="calorie_tracker"
        )
        if connection.is_connected():
            print("Connected to MySQL DB successfully")
        return connection
    except Error as e:
        print(f"Error: '{e}'")
        return None

def close_connection(connection):
    if connection.is_connected():
        connection.close()
        print("MySQL connection closed")

# ================================================================
# Authentication Functions
# ================================================================

@app.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000')
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    user_type = data.get("user_type")

    connection = create_connection()
    cursor = connection.cursor(dictionary=True)

    if user_type == 'client':
        cursor.execute("SELECT * FROM Client WHERE Email = %s AND Password = %s", (email, password))
    elif user_type == 'trainer':
        cursor.execute("SELECT * FROM Trainer WHERE Email = %s AND Password = %s", (email, password))
    elif user_type == 'admin':
        cursor.execute("SELECT * FROM Admin WHERE Email = %s AND Password = %s", (email, password))
    else:
        return jsonify({"error": "Invalid user type"}), 400

    result = cursor.fetchone()
    close_connection(connection)

    if result and user_type == 'client':
        return jsonify({"message": "Login successful", "user_data": result, "client_id": result["client_id"]})
    elif result and user_type == 'trainer':
        return jsonify({"message": "Login successful", "user_data": result, "trainer_id": result["TrainerID"]})
    elif result and user_type == 'admin':
        return jsonify({"message": "Login successful", "user_data": result, "admin_id": result["AdminId"]})
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# ================================================================
# Client Functions
# ================================================================

@app.route('/client/<int:client_id>/fitness_plan', methods=['GET'])
@cross_origin(origin='*')
def get_fitness_plan(client_id):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT fp.PlanID, fp.Description, fp.EndDate
        FROM FitnessPlan fp
        WHERE fp.ClientID = %s
    """, (client_id,))
    fitness_plans = cursor.fetchall()

    for plan in fitness_plans:
        cursor.execute("""
            SELECT e.ExerciseID, e.Name, e.Reps, e.Sets, e.CaloriesBurned, e.Completed
            FROM Workout w
            JOIN Exercise e ON w.WorkoutID = e.WorkoutID
            WHERE w.PlanID = %s
        """, (plan['PlanID'],))
        plan['exercises'] = cursor.fetchall()

        cursor.execute("""
            SELECT m.MealID, m.meal_name, m.Calories, m.Protein, m.Carbs, m.Fat, m.Completed
            FROM Diet d
            JOIN Meal m ON d.DietID = m.DietID
            WHERE d.PlanID = %s
        """, (plan['PlanID'],))
        plan['meals'] = cursor.fetchall()

    close_connection(connection)
    return jsonify(fitness_plans)

@app.route('/client/<int:client_id>/trainer', methods=['GET', 'OPTIONS'])
@cross_origin(origin='*')
def get_trainer(client_id):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT t.* FROM Trainer t
        JOIN FitnessPlan fp ON fp.TrainerID = t.TrainerID
        WHERE fp.ClientID = %s
    """, (client_id,))
    trainer = cursor.fetchone()
    close_connection(connection)
    return jsonify(trainer)

@app.route('/client/<int:client_id>/exercise_status', methods=['PATCH', 'OPTIONS'])
@cross_origin(origin='*')
def update_exercise_status(client_id):
    data = request.json
    exercise_id = data.get("exercise_id")
    completed = data.get("completed")

    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("""
        UPDATE Exercise
        SET Completed = %s
        WHERE ExerciseID = %s AND EXISTS (
            SELECT 1 FROM FitnessPlan fp
            JOIN Workout w ON w.PlanID = fp.PlanID
            WHERE fp.ClientID = %s AND w.WorkoutID = Exercise.WorkoutID
        )
    """, (completed, exercise_id, client_id))
    connection.commit()
    close_connection(connection)
    return jsonify({"message": "Exercise status updated"})

@app.route('/client/<int:client_id>/meal_status', methods=['PATCH', 'OPTIONS'])
@cross_origin(origin='*')
def update_meal_status(client_id):
    data = request.json
    meal_id = data.get("meal_id")
    completed = data.get("completed")

    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("""
        UPDATE Meal
        SET Completed = %s
        WHERE MealID = %s AND EXISTS (
            SELECT 1 FROM FitnessPlan fp
            JOIN Diet d ON d.PlanID = fp.PlanID
            WHERE fp.ClientID = %s AND d.DietID = Meal.DietID
        )
    """, (completed, meal_id, client_id))
    connection.commit()
    close_connection(connection)
    return jsonify({"message": "Meal status updated"})

@app.route('/client/<int:client_id>/reminders', methods=['GET', 'OPTIONS'])
@cross_origin(origin='*')
def check_reminders(client_id):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM Reminder
        WHERE ClientID = %s
    """, (client_id,))
    reminders = cursor.fetchall()
    close_connection(connection)
    return jsonify(reminders)

@app.route('/client/<int:client_id>/delete', methods=['DELETE', 'OPTIONS'])
@cross_origin(origin='*')
def delete_client_account(client_id):
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM Client WHERE client_id = %s", (client_id,))
    connection.commit()
    close_connection(connection)
    return jsonify({"message": "Client account deleted"})

# ================================================================
# Trainer Functions
# ================================================================

@app.route('/trainer/<int:trainer_id>/clients', methods=['GET', 'OPTIONS'])
@cross_origin(origin='*')
def view_clients_with_details(trainer_id):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT c.client_id, c.FirstName, c.LastName, c.height, c.weight, c.age, c.Email
        FROM Client c
        WHERE c.client_id IN (
            SELECT ClientID FROM FitnessPlan WHERE TrainerID = %s
        )
    """, (trainer_id,))
    clients = cursor.fetchall()
    close_connection(connection)
    return jsonify(clients)

@app.route('/trainer/<int:trainer_id>/fitness_plans', methods=['GET', 'OPTIONS'])
@cross_origin(origin='*')
def view_fitness_plans(trainer_id):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM FitnessPlan WHERE TrainerID = %s
    """, (trainer_id,))
    fitness_plans = cursor.fetchall()
    close_connection(connection)
    return jsonify(fitness_plans)

@app.route('/trainer/<int:trainer_id>/assign_workout', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*')
def assign_workout(trainer_id):
    data = request.json
    plan_id = data.get("plan_id")
    workout_name = data.get("workout_name")
    duration = data.get("duration")

    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO Workout (PlanID, Name, Duration)
        VALUES (%s, %s, %s)
    """, (plan_id, workout_name, duration))
    connection.commit()
    close_connection(connection)
    return jsonify({"message": "Workout assigned successfully"}), 201

@app.route('/trainer/<int:trainer_id>/assign_meal', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*')
def assign_meal(trainer_id):
    data = request.json
    plan_id = data.get("plan_id")
    meal_name = data.get("meal_name")
    calories = data.get("calories")
    protein = data.get("protein")
    carbs = data.get("carbs")
    fat = data.get("fat")

    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO Meal (DietID, meal_name, Calories, Protein, Carbs, Fat)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (plan_id, meal_name, calories, protein, carbs, fat))
    connection.commit()
    close_connection(connection)
    return jsonify({"message": "Meal assigned successfully"}), 201

@app.route('/trainer/unassigned_clients', methods=['GET'])
@cross_origin(origin='*')
def get_unassigned_clients():
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    
    # Query to find clients without a trainer (no associated fitness plan)
    cursor.execute("""
        SELECT c.client_id, c.FirstName, c.LastName, c.Email, c.Height, c.Weight, c.Age
        FROM Client c
        WHERE c.client_id NOT IN (
            SELECT DISTINCT ClientID
            FROM FitnessPlan
            WHERE TrainerID IS NOT NULL
        )
    """)
    unassigned_clients = cursor.fetchall()
    close_connection(connection)

    return jsonify(unassigned_clients)

@app.route('/trainer/<int:trainer_id>/assign_client', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*')
def assign_client_to_trainer(trainer_id):
    data = request.json
    client_id = data.get('client_id')

    if not client_id:
        return jsonify({"error": "Missing client_id"}), 400

    connection = create_connection()
    cursor = connection.cursor()

    try:
        # Check if the client is already assigned to a trainer
        cursor.execute("""
            SELECT TrainerID
            FROM FitnessPlan
            WHERE ClientID = %s
        """, (client_id,))
        existing_assignment = cursor.fetchone()

        if existing_assignment:
            return jsonify({"error": "Client is already assigned to a trainer"}), 400

        # Assign the client to the trainer by creating a fitness plan
        cursor.execute("""
            INSERT INTO FitnessPlan (ClientID, TrainerID, StartDate, Description)
            VALUES (%s, %s, CURDATE(), 'New Fitness Plan')
        """, (client_id, trainer_id))
        connection.commit()

        return jsonify({"message": "Client successfully assigned to trainer"}), 201

    except Error as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        close_connection(connection)


# ================================================================
# Admin Functions
# ================================================================

@app.route('/admin/users', methods=['GET'])
def get_all_users():
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, FirstName, LastName, Email, UserType, Height, Weight, Age, Specialty
        FROM (
            SELECT client_id AS id, FirstName, LastName, Email, 'client' AS UserType, Height, Weight, Age, NULL AS Specialty
            FROM Client
            UNION
            SELECT TrainerID AS id, FirstName, LastName, Email, 'trainer' AS UserType, NULL AS Height, NULL AS Weight, NULL AS Age, Specialty
            FROM Trainer
        ) AS users
    """)
    users = cursor.fetchall()
    close_connection(connection)
    return jsonify(users)

@app.route('/admin/create_user', methods=['POST'])
def create_user():
    data = request.json
    user_type = data.get("userType")
    connection = create_connection()
    cursor = connection.cursor()
    if user_type == 'client':
        cursor.execute("""
            INSERT INTO Client (FirstName, LastName, Email, Password, Height, Weight, Age)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (data['firstName'], data['lastName'], data['email'], data['password'], data['height'], data['weight'], data['age']))
    elif user_type == 'trainer':
        cursor.execute("""
            INSERT INTO Trainer (FirstName, LastName, Email, Password, Specialty)
            VALUES (%s, %s, %s, %s, %s)
        """, (data['firstName'], data['lastName'], data['email'], data['password'], data['specialty']))
    else:
        return jsonify({"error": "Invalid user type"}), 400
    connection.commit()
    close_connection(connection)
    return jsonify({"message": "User created successfully"})

@app.route('/admin/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM Client WHERE client_id = %s", (user_id,))
    cursor.execute("DELETE FROM Trainer WHERE TrainerID = %s", (user_id,))
    connection.commit()
    close_connection(connection)
    return jsonify({"message": "User deleted successfully"})

@app.after_request
def apply_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

if __name__ == '__main__':
    app.run(debug=True)
