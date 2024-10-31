from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

def create_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="calorie_tracker"
        )
        if connection.is_connected():
            print("Connection to MySQL DB successful")
        return connection
    except Error as e:
        print(f"Error: '{e}'")
        return None


def close_connection(connection):
    if connection.is_connected():
        connection.close()
        print("MySQL connection is closed")

@app.route('/login', methods=['POST'])
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

    if result:
        return jsonify({"message": "Login successful", "user_data": result})
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/client/<int:client_id>/fitness_plan', methods=['GET'])
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

@app.route('/exercise/<int:exercise_id>', methods=['PATCH'])
def update_exercise_status(exercise_id):
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("UPDATE Exercise SET Completed = TRUE WHERE ExerciseID = %s", (exercise_id,))
    connection.commit()
    close_connection(connection)
    return jsonify({"message": "Exercise status updated"})

@app.route('/meal/<int:meal_id>', methods=['PATCH'])
def update_meal_status(meal_id):
    connection = create_connection()
    cursor = connection.cursor()
    cursor.execute("UPDATE Meal SET Completed = TRUE WHERE MealID = %s", (meal_id,))
    connection.commit()
    close_connection(connection)
    return jsonify({"message": "Meal status updated"})

if __name__ == '__main__':
    app.run(debug=True)
