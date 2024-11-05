from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

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

# Route to add a new client
@app.route('/add_client', methods=['POST'])
def add_client():
    data = request.json
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    height = data.get("height")
    weight = data.get("weight")
    age = data.get("age")
    email = data.get("email")
    password = data.get("password")
   
    connection = create_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("""
            INSERT INTO Client (FirstName, LastName, height, weight, age, Email, Password)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (first_name, last_name, height, weight, age, email, password))
        connection.commit()
        return jsonify({"message": "Client added successfully"})
    except Error as e:
        return jsonify({"error": str(e)}), 400
    finally:
        close_connection(connection)

# Route to add a new trainer
@app.route('/add_trainer', methods=['POST'])
def add_trainer():
    data = request.json
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    specialty = data.get("specialty")
    email = data.get("email")
    password = data.get("password")
   
    connection = create_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("""
            INSERT INTO Trainer (FirstName, LastName, Specialty, Email, Password)
            VALUES (%s, %s, %s, %s, %s)
        """, (first_name, last_name, specialty, email, password))
        connection.commit()
        return jsonify({"message": "Trainer added successfully"})
    except Error as e:
        return jsonify({"error": str(e)}), 400
    finally:
        close_connection(connection)

# Route to add a new fitness plan
@app.route('/add_fitness_plan', methods=['POST'])
def add_fitness_plan():
    data = request.json
    client_id = data.get("client_id")
    trainer_id = data.get("trainer_id")
    start_date = data.get("start_date")
    end_date = data.get("end_date")
    description = data.get("description")
   
    connection = create_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("""
            INSERT INTO FitnessPlan (ClientID, TrainerID, StartDate, EndDate, Description)
            VALUES (%s, %s, %s, %s, %s)
        """, (client_id, trainer_id, start_date, end_date, description))
        connection.commit()
        return jsonify({"message": "Fitness plan added successfully"})
    except Error as e:
        return jsonify({"error": str(e)}), 400
    finally:
        close_connection(connection)

# Test route to add a new workout
@app.route('/add_workout', methods=['POST'])
def add_workout():
    data = request.json
    plan_id = data.get("plan_id")
    name = data.get("name")
    duration = data.get("duration")

    connection = create_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("""
            INSERT INTO Workout (PlanID, Name, Duration)
            VALUES (%s, %s, %s)
        """, (plan_id, name, duration))
        connection.commit()
        return jsonify({"message": "Workout added successfully"})
    except Error as e:
        return jsonify({"error": str(e)}), 400
    finally:
        close_connection(connection)

# Test route to add a new exercise
@app.route('/add_exercise', methods=['POST'])
def add_exercise():
    data = request.json
    workout_id = data.get("workout_id")
    name = data.get("name")
    reps = data.get("reps")
    sets = data.get("sets")
    calories_burned = data.get("calories_burned")

    connection = create_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("""
            INSERT INTO Exercise (WorkoutID, Name, Reps, Sets, CaloriesBurned)
            VALUES (%s, %s, %s, %s, %s)
        """, (workout_id, name, reps, sets, calories_burned))
        connection.commit()
        return jsonify({"message": "Exercise added successfully"})
    except Error as e:
        return jsonify({"error": str(e)}), 400
    finally:
        close_connection(connection)

@app.route('/')
def home():
    return "Welcome to the Calorie Tracker API!"

if __name__ == '__main__':
    app.run(debug=True)