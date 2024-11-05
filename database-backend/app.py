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
    else:
        return jsonify({"error": "Invalid user type"}), 400

    result = cursor.fetchone()
    close_connection(connection)

    if result and user_type == 'client':
        return jsonify({"message": "Login successful", "user_data": result, "client_id": result["client_id"]})
    elif result and user_type =='trainer':
        return jsonify({"message": "Login successful", "user_data": result, "trainer_id": result["TrainerID"]})
    else:
        return jsonify({"message": "Invalid credentials"}), 401



@app.route('/client/<int:client_id>/fitness_plan', methods=['GET', 'OPTIONS'])
@cross_origin(origin='*')
def get_fitness_plan(client_id):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM FitnessPlan
        WHERE ClientID = %s
    """, (client_id,))
    plans = cursor.fetchall()
    close_connection(connection)
    return jsonify(plans)

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

@app.route('/trainer/<int:trainer_id>/clients', methods=['GET', 'OPTIONS'])
@cross_origin(origin='*')
def view_clients(trainer_id):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM Client
        WHERE client_id IN (
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

@app.route('/trainer/<int:trainer_id>/update_plan', methods=['PATCH', 'OPTIONS'])
@cross_origin(origin='*')
def update_fitness_plan(trainer_id):
    data = request.json
    plan_id = data.get("plan_id")
    description = data.get("description")
    end_date = data.get("end_date")

    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("""
        UPDATE FitnessPlan
        SET Description = %s, EndDate = %s
        WHERE PlanID = %s AND TrainerID = %s
    """, (description, end_date, plan_id, trainer_id))
    connection.commit()
    close_connection(connection)
    return jsonify({"message": "Fitness plan updated"})

@app.route('/trainer/<int:trainer_id>/set_reminder', methods=['POST', 'OPTIONS'])
@cross_origin(origin='*')
def set_reminder(trainer_id):
    data = request.json
    client_id = data.get("client_id")
    message = data.get("message")
    reminder_date = data.get("reminder_date")

    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("""
        INSERT INTO Reminder (ClientID, TrainerID, Message, ReminderDate)
        VALUES (%s, %s, %s, %s)
    """, (client_id, trainer_id, message, reminder_date))
    connection.commit()
    close_connection(connection)
    return jsonify({"message": "Reminder set for client"})

@app.route('/trainer/<int:trainer_id>/delete', methods=['DELETE', 'OPTIONS'])
@cross_origin(origin='*')
def delete_trainer_account(trainer_id):
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM Trainer WHERE TrainerID = %s", (trainer_id,))
    connection.commit()
    close_connection(connection)
    return jsonify({"message": "Trainer account deleted"})

@app.route('/signup', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000')
def signup():
    data = request.json
    user_type = data.get("user_type")
    email = data.get("email")
    password = data.get("password")
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    
    connection = create_connection()
    cursor = connection.cursor()
    
    if user_type == 'client':
        height = data.get("height")
        weight = data.get("weight")
        age = data.get("age")
        cursor.execute("""
            INSERT INTO Client (FirstName, LastName, Email, Password, height, weight, age)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (first_name, last_name, email, password, height, weight, age))
        
    elif user_type == 'trainer':
        specialty = data.get("specialty") 
        cursor.execute("""
            INSERT INTO Trainer (FirstName, LastName, Email, Password, Specialty)
            VALUES (%s, %s, %s, %s, %s)
        """, (first_name, last_name, email, password, specialty))
        
    else:
        close_connection(connection)
        return jsonify({"error": "Invalid user type"}), 400

    connection.commit()
    close_connection(connection)
    
    return jsonify({"message": "Sign up successful!"}), 201

@app.after_request
def apply_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

if __name__ == '__main__':
    app.run(debug=True)

