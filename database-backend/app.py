from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS, cross_origin
import bcrypt

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
    password = data.get("password").encode('utf-8')  # Encode the password
    user_type = data.get("user_type")

    connection = create_connection()
    cursor = connection.cursor(dictionary=True)

    if user_type == 'client':
        cursor.execute("SELECT * FROM Client WHERE Email = %s", (email,))
    elif user_type == 'trainer':
        cursor.execute("SELECT * FROM Trainer WHERE Email = %s", (email,))
    elif user_type == 'admin':
        cursor.execute("SELECT * FROM Admin WHERE Email = %s", (email,))
    else:
        return jsonify({"error": "Invalid user type"}), 400

    result = cursor.fetchone()
    close_connection(connection)

    if result and bcrypt.checkpw(password, result['Password'].encode('utf-8')):
        if user_type == 'client':
            return jsonify({"message": "Login successful", "user_data": result, "client_id": result["client_id"]})
        elif user_type == 'trainer':
            return jsonify({"message": "Login successful", "user_data": result, "trainer_id": result["TrainerID"]})
        elif user_type == 'admin':
            return jsonify({"message": "Login successful", "user_data": result, "admin_id": result["id"]})
    
    else:
        return jsonify({"message": "Invalid credentials"}), 401



@app.route('/client/<int:client_id>/fitness_plan', methods=['GET'])
@cross_origin(origin='*')
def get_fitness_plan(client_id):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Fetch the fitness plans for the client
        cursor.execute("""
            SELECT fp.PlanID, fp.Description, fp.EndDate
            FROM FitnessPlan fp
            WHERE fp.ClientID = %s
        """, (client_id,))
        fitness_plans = cursor.fetchall()

        for plan in fitness_plans:
            # Fetch exercises directly using ClientID
            cursor.execute("""
                SELECT e.ExerciseID, e.Name, e.Reps, e.Sets, e.CaloriesBurned, e.Completed
                FROM Exercise e
                WHERE e.ClientID = %s
            """, (client_id,))
            plan['exercises'] = cursor.fetchall()

            # Fetch meals directly using ClientID
            cursor.execute("""
                SELECT m.MealID, m.meal_name, m.Calories, m.Protein, m.Carbs, m.Fat, m.Completed
                FROM Meal m
                WHERE m.ClientID = %s
            """, (client_id,))
            plan['meals'] = cursor.fetchall()

        return jsonify(fitness_plans), 200
    except Error as e:
        print(f"Error fetching fitness plans: {e}")
        return jsonify({"error": "Failed to fetch fitness plans"}), 500
    finally:
        close_connection(connection)



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
def view_clients_with_details(trainer_id):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Fetch clients assigned to the trainer
        cursor.execute("""
            SELECT c.client_id, c.FirstName, c.LastName, c.height, c.weight, c.age, c.Email
            FROM Client c
            WHERE c.client_id IN (
                SELECT ClientID FROM FitnessPlan WHERE TrainerID = %s
            )
        """, (trainer_id,))
        clients = cursor.fetchall()

        for client in clients:
            client_id = client['client_id']

            # Fetch fitness plans for the client
            cursor.execute("""
                SELECT PlanID, Description, StartDate, EndDate
                FROM FitnessPlan
                WHERE ClientID = %s AND TrainerID = %s
            """, (client_id, trainer_id))
            fitness_plans = cursor.fetchall()

            for plan in fitness_plans:
                # Fetch exercises directly using ClientID
                cursor.execute("""
                    SELECT e.ExerciseID, e.Name AS ExerciseName, e.Reps, e.Sets, e.CaloriesBurned, e.Completed
                    FROM Exercise e
                    WHERE e.ClientID = %s
                """, (client_id,))
                exercises = cursor.fetchall()
                plan['exercises'] = exercises

                # Fetch meals directly using ClientID
                cursor.execute("""
                    SELECT m.MealID, m.meal_name, m.Calories, m.Protein, m.Carbs, m.Fat, m.Completed
                    FROM Meal m
                    WHERE m.ClientID = %s
                """, (client_id,))
                meals = cursor.fetchall()
                plan['meals'] = meals

            client['fitness_plans'] = fitness_plans

        return jsonify(clients), 200

    except Error as e:
        print(f"Error fetching client details: {e}")
        return jsonify({"error": "Failed to fetch client details"}), 500

    finally:
        close_connection(connection)



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
    password = data.get("password").encode('utf-8')  # Encode the password
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    
    # Hash the password
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

    connection = create_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        if user_type == 'client':
            height = data.get("height")
            weight = data.get("weight")
            age = data.get("age")
            cursor.execute("""
                INSERT INTO Client (FirstName, LastName, Email, Password, height, weight, age)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (first_name, last_name, email, hashed_password, height, weight, age))
            connection.commit()
            cursor.execute("SELECT client_id FROM Client WHERE Email = %s", (email,))
            user_id = cursor.fetchone()["client_id"]
        
        elif user_type == 'trainer':
            specialty = data.get("specialty")
            cursor.execute("""
                INSERT INTO Trainer (FirstName, LastName, Email, Password, Specialty)
                VALUES (%s, %s, %s, %s, %s)
            """, (first_name, last_name, email, hashed_password, specialty))
            connection.commit()
            cursor.execute("SELECT TrainerID FROM Trainer WHERE Email = %s", (email,))
            user_id = cursor.fetchone()["TrainerID"]

        elif user_type == 'admin':
            cursor.execute("""
                INSERT INTO Admin (full_name, email, password)
                VALUES (%s, %s, %s)
            """, (first_name, email, hashed_password))
            connection.commit()
            user_id = None  # Admin does not have a specific ID requirement to return

        else:
            return jsonify({"error": "Invalid user type"}), 400

        response = {"message": "Signup successful"}
        if user_type in ['client', 'trainer']:
            response["id"] = user_id
        
        return jsonify(response), 201

    except Exception as e:
        print(f"Error during signup: {e}")
        return jsonify({"error": "Signup failed"}), 500

    finally:
        close_connection(connection)

@app.route('/trainer/<int:client_id>/delete_fitness_plan', methods=['DELETE'])
@cross_origin(origin='http://localhost:3000')
def delete_fitness_plan(client_id):
    connection = create_connection()
    cursor = connection.cursor()

    try:
        # Check if the client has a fitness plan
        cursor.execute("""
            SELECT PlanID FROM FitnessPlan WHERE ClientID = %s
        """, (client_id,))
        fitness_plan = cursor.fetchone()

        if not fitness_plan:
            return jsonify({"message": "No fitness plan found for the given client ID"}), 404

        # Delete the fitness plan
        cursor.execute("""
            DELETE FROM FitnessPlan WHERE ClientID = %s
        """, (client_id,))
        connection.commit()

        return jsonify({"message": "Fitness plan deleted successfully"}), 200

    except Exception as e:
        print(f"Error deleting fitness plan: {e}")
        return jsonify({"error": "Failed to delete fitness plan"}), 500

    finally:
        close_connection(connection)


@app.route('/trainer/<int:trainer_id>/unassigned_clients', methods=['GET'])
@cross_origin(origin='*')
def view_unassigned_clients(trainer_id):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT c.client_id, c.FirstName, c.LastName, c.height, c.weight, c.age, c.Email
        FROM Client c
        WHERE c.client_id NOT IN (
            SELECT ClientID FROM FitnessPlan WHERE TrainerID IS NOT NULL
        )
    """)
    unassigned_clients = cursor.fetchall()
    close_connection(connection)
    return jsonify(unassigned_clients)

@app.route('/trainer/<int:trainer_id>/assign_client', methods=['POST'])
@cross_origin(origin='*')
def assign_client_to_trainer(trainer_id):
    data = request.json
    client_id = data.get('client_id')

    if not client_id:
        return jsonify({"error": "Missing client_id"}), 400

    connection = create_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO FitnessPlan (ClientID, TrainerID, StartDate, Description)
        VALUES (%s, %s, CURDATE(), 'New Fitness Plan')
    """, (client_id, trainer_id))
    connection.commit()
    close_connection(connection)
    return jsonify({"message": "Client successfully assigned to trainer"}), 201



@app.route('/trainer/<int:trainer_id>/assigned_clients', methods=['GET', 'OPTIONS'])
@cross_origin(origin='*')
def view_assigned_clients(trainer_id):
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
 
    num_clients = len(clients)
  
    response = {
        "num_clients": num_clients,
        "clients": clients
    }

    close_connection(connection)
    return jsonify(response)



@app.route('/trainer/<int:trainer_id>/reminders_sent', methods=['GET', 'OPTIONS'])
@cross_origin(origin='*')
def view_reminders_sent(trainer_id):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT COUNT(*) AS num_reminders
        FROM Reminder
        WHERE TrainerID = %s
    """, (trainer_id,))
    reminder_count = cursor.fetchone()
    close_connection(connection)
    return jsonify(reminder_count)


@app.route('/trainer/<int:trainer_id>/exercises_created', methods=['GET', 'OPTIONS'])
@cross_origin(origin='*')
def view_exercises_created(trainer_id):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT COUNT(*) AS num_exercises
        FROM Exercise
        WHERE TrainerID = %s
    """, (trainer_id,))
    exercise_count = cursor.fetchone()
    close_connection(connection)
    return jsonify(exercise_count)

@app.route('/trainer/<int:trainer_id>/workouts_created', methods=['GET', 'OPTIONS'])
@cross_origin(origin='*')
def view_workouts_created(trainer_id):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT COUNT(*) AS num_workouts
            FROM Workout w
            JOIN FitnessPlan fp ON w.PlanID = fp.PlanID
            WHERE fp.TrainerID = %s
        """, (trainer_id,))
        workout_count = cursor.fetchone()
        return jsonify(workout_count), 200
    except Error as e:
        print(f"Error fetching workouts created: {e}")
        return jsonify({"error": "Failed to fetch workouts created"}), 500
    finally:
        close_connection(connection)

@app.route('/trainer/<int:trainer_id>/meals_created', methods=['GET', 'OPTIONS'])
@cross_origin(origin='*')
def view_meals_created(trainer_id):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Query to count meals associated with clients managed by the trainer
        cursor.execute("""
            SELECT COUNT(*) AS num_meals
            FROM Meal m
            JOIN FitnessPlan fp ON m.ClientID = fp.ClientID
            WHERE fp.TrainerID = %s
        """, (trainer_id,))
        meal_count = cursor.fetchone()

        return jsonify(meal_count), 200
    except Error as e:
        print(f"Error fetching meals created: {e}")
        return jsonify({"error": "Failed to fetch meals created"}), 500
    finally:
        close_connection(connection)



@app.route('/trainer/<int:trainer_id>/statistics', methods=['GET'])
def get_statistics(trainer_id):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT COUNT(*) AS num_clients
        FROM Client c
        WHERE c.client_id IN (
            SELECT ClientID FROM FitnessPlan WHERE TrainerID = %s
        )
    """, (trainer_id,))
    num_clients = cursor.fetchone()['num_clients']
    
    cursor.execute("""
        SELECT COUNT(*) AS num_reminders
        FROM Reminder
        WHERE TrainerID = %s
    """, (trainer_id,))
    num_reminders = cursor.fetchone()['num_reminders']
    
    cursor.execute("""
        SELECT COUNT(*) AS num_exercises
        FROM Exercise
        WHERE TrainerID = %s
    """, (trainer_id,))
    num_exercises = cursor.fetchone()['num_exercises']
    
    cursor.execute("""
        SELECT COUNT(*) AS num_meals
        FROM Meal
        WHERE TrainerID = %s
    """, (trainer_id,))
    num_meals = cursor.fetchone()['num_meals']
    
    statistics = {
        'numClients': num_clients,
        'numReminders': num_reminders,
        'numExercises': num_exercises,
        'numMeals': num_meals
    }
    
    close_connection(connection)
    return jsonify(statistics)

@app.route('/admin/users', methods=['GET'])
@cross_origin(origin='*')
def get_all_users():
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT 
                client_id, 'client' AS UserType, FirstName, LastName, Email, Height, Weight, Age, NULL AS Specialty 
            FROM Client
            UNION ALL
            SELECT 
                TrainerId, 'trainer' AS UserType, FirstName, LastName, Email, NULL AS Height, NULL AS Weight, NULL AS Age, Specialty 
            FROM Trainer
        """)
        users = cursor.fetchall()
        return jsonify(users)
    except Error as e:
        print(f"Error fetching users: {e}")
        return jsonify({"error": "Error fetching users"}), 500
    finally:
        close_connection(connection)

@app.route('/admin/create_user', methods=['POST'])
@cross_origin(origin='*')
def create_user():
    data = request.json
    user_type = data.get('userType')
    email = data.get('email')
    password = data.get('password').encode('utf-8')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

    connection = create_connection()
    cursor = connection.cursor()

    try:
        if user_type == 'client':
            height = data.get('height')
            weight = data.get('weight')
            age = data.get('age')
            cursor.execute("""
                INSERT INTO Client (FirstName, LastName, Email, Password, Height, Weight, Age)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (first_name, last_name, email, hashed_password, height, weight, age))
        elif user_type == 'trainer':
            specialty = data.get('specialty')
            cursor.execute("""
                INSERT INTO Trainer (FirstName, LastName, Email, Password, Specialty)
                VALUES (%s, %s, %s, %s, %s)
            """, (first_name, last_name, email, hashed_password, specialty))
        else:
            return jsonify({"error": "Invalid user type"}), 400

        connection.commit()
        return jsonify({"message": "User created successfully"}), 201
    except Error as e:
        print(f"Error creating user: {e}")
        return jsonify({"error": "Error creating user"}), 500
    finally:
        close_connection(connection)

@app.route('/admin/delete_user/<int:user_id>', methods=['DELETE'])
@cross_origin(origin='*')
def delete_user(user_id):
    connection = create_connection()
    cursor = connection.cursor()

    try:
        # Attempt to delete from Client table
        cursor.execute("DELETE FROM Client WHERE id = %s", (user_id,))
        if cursor.rowcount == 0:
            # If not in Client, try Trainer table
            cursor.execute("DELETE FROM Trainer WHERE id = %s", (user_id,))
            if cursor.rowcount == 0:
                return jsonify({"error": "User not found"}), 404

        connection.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Error as e:
        print(f"Error deleting user: {e}")
        return jsonify({"error": "Error deleting user"}), 500
    finally:
        close_connection(connection)


@app.route('/client/exercises_by_date/<int:client_id>', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def get_exercises_by_date(client_id):
    date = request.args.get("date")  # Fetch the date parameter from the query string

    connection = create_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Fetch exercises based on the client ID and date
        cursor.execute("""
            SELECT * 
            FROM Exercise
            WHERE ClientID = %s AND Date = %s
        """, (client_id, date))
        exercises = cursor.fetchall()

        return jsonify(exercises), 200
    except Error as e:
        print(f"Error fetching exercises by date: {e}")
        return jsonify({"error": "Failed to fetch exercises"}), 500
    finally:
        close_connection(connection)



@app.route('/client/log_exercise/<int:client_id>', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def log_exercise(client_id):
    data = request.json
    name = data.get("name")
    reps = data.get("reps")
    sets = data.get("sets")
    calories_burned = data.get("calories_burned")
    date = data.get("date")

    connection = create_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Step 1: Retrieve the TrainerID associated with the ClientID
        cursor.execute("""
            SELECT TrainerID
            FROM FitnessPlan
            WHERE ClientID = %s AND (EndDate IS NULL OR EndDate >= CURDATE())
            LIMIT 1
        """, (client_id,))
        trainer_row = cursor.fetchone()

        trainer_id = trainer_row['TrainerID'] if trainer_row else None

        # Step 2: Insert the exercise data into the Exercise table
        cursor.execute("""
            INSERT INTO Exercise (ClientID, TrainerID, Name, Reps, Sets, CaloriesBurned, Date)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (client_id, trainer_id, name, reps, sets, calories_burned, date))
        connection.commit()

        return jsonify({"message": "Exercise logged successfully"}), 201
    except Error as e:
        print(f"Error logging exercise: {e}")
        return jsonify({"error": "Failed to log exercise"}), 500
    finally:
        close_connection(connection)


@app.route('/client/meals_by_date/<int:user_id>', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def get_meals_by_date(user_id):
    date = request.args.get("date")  # Get the date from query parameters

    if not date:
        return jsonify({"error": "Date parameter is required"}), 400

    connection = create_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT *
            FROM Meal
            WHERE Date = %s AND ClientID = %s
        """, (date, user_id))
        meals = cursor.fetchall()

        return jsonify(meals), 200
    except Error as e:
        print(f"Error fetching meals by date: {e}")
        return jsonify({"error": "Failed to fetch meals"}), 500
    finally:
        close_connection(connection)


@app.route('/client/log_meal/<int:client_id>', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def log_meal(client_id):
    data = request.json
    meal_name = data.get("name")
    calories = data.get("calories")
    protein = data.get("protein")
    carbs = data.get("carbs")
    fat = data.get("fat")
    date = data.get("date")

    connection = create_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            INSERT INTO Meal (ClientID, meal_name, Calories, Protein, Carbs, Fat, Date)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (client_id, meal_name, calories, protein, carbs, fat, date))
        connection.commit()

        return jsonify({"message": "Meal logged successfully"}), 201
    except Error as e:
        print(f"Error logging meal: {e}")
        return jsonify({"error": "Failed to log meal"}), 500
    finally:
        close_connection(connection)


@app.route('/client/<int:client_id>/reminder/<int:reminder_id>', methods=['DELETE'])
@cross_origin(origin='http://localhost:3000')
def delete_reminder(client_id, reminder_id):
    connection = create_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            DELETE FROM Reminder 
            WHERE ReminderID = %s AND ClientID = %s
        """, (reminder_id, client_id))
        if cursor.rowcount == 0:
            return jsonify({"error": "Reminder not found or does not belong to the client"}), 404

        connection.commit()
        return jsonify({"message": "Reminder marked as complete and deleted"}), 200
    except Error as e:
        print(f"Error deleting reminder: {e}")
        return jsonify({"error": "Failed to delete reminder"}), 500
    finally:
        close_connection(connection)

@app.route('/trainers/<string:specialty>/specific', methods=['GET'])
@cross_origin(origin='http://localhost:3000')
def get_trainers_by_specialty(specialty):
    connection = create_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Query to fetch trainers based on specialty
        cursor.execute("""
            SELECT TrainerID, FirstName, LastName, Specialty, Email
            FROM Trainer
            WHERE Specialty = %s
        """, (specialty,))
        
        trainers = cursor.fetchall()
        
        if not trainers:
            return jsonify({"message": "No trainers found for this specialty."}), 404
        
        return jsonify(trainers), 200
    except Error as e:
        print(f"Error fetching trainers by specialty: {e}")
        return jsonify({"error": "Failed to fetch trainers."}), 500
    finally:
        close_connection(connection)

@app.route('/trainer/<int:trainer_id>/assign_workout', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def assign_workout(trainer_id):
    data = request.json
    client_id = data.get("client_id")
    workout_name = data.get("workout_name")
    duration = data.get("duration")

    if not client_id or not workout_name or not duration:
        return jsonify({"error": "Missing required fields"}), 400

    connection = create_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO Workout (PlanID, Name, Duration)
            SELECT PlanID, %s, %s
            FROM FitnessPlan
            WHERE ClientID = %s AND TrainerID = %s
        """, (workout_name, duration, client_id, trainer_id))
        connection.commit()
        return jsonify({"message": "Workout assigned successfully"}), 201
    except Error as e:
        print(f"Error assigning workout: {e}")
        return jsonify({"error": "Failed to assign workout"}), 500
    finally:
        close_connection(connection)

@app.route('/trainer/<int:trainer_id>/assign_meal', methods=['POST'])
@cross_origin(origin='http://localhost:3000')
def assign_meal(trainer_id):
    data = request.json
    client_id = data.get("client_id")
    meal_name = data.get("meal_name")
    calories = data.get("calories")
    protein = data.get("protein")
    carbs = data.get("carbs")
    fat = data.get("fat")

    if not client_id or not meal_name or not calories or not protein or not carbs or not fat:
        return jsonify({"error": "Missing required fields"}), 400

    connection = create_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO Meal (ClientID, meal_name, Calories, Protein, Carbs, Fat)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (client_id, meal_name, calories, protein, carbs, fat))
        connection.commit()
        return jsonify({"message": "Meal assigned successfully"}), 201
    except Error as e:
        print(f"Error assigning meal: {e}")
        return jsonify({"error": "Failed to assign meal"}), 500
    finally:
        close_connection(connection)




if __name__ == '__main__':
    app.run(debug=True)
