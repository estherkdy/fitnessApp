import requests

BASE_URL = "http://127.0.0.1:5000"

def test_login(email, password, user_type):
    response = requests.post(f"{BASE_URL}/login", json={
        "email": email,
        "password": password,
        "user_type": user_type
    })
    print("Login response:", response.json())


def test_get_fitness_plan(client_id):
    response = requests.get(f"{BASE_URL}/client/{client_id}/fitness_plan")
    print("Fitness plan response:", response.json())


def test_update_exercise_status(exercise_id):
    response = requests.patch(f"{BASE_URL}/exercise/{exercise_id}")
    print("Update exercise status response:", response.json())


def test_update_meal_status(meal_id):
    response = requests.patch(f"{BASE_URL}/meal/{meal_id}")
    print("Update meal status response:", response.json())


test_login("client@example.com", "password123", "client")
test_login("trainer@example.com", "password123", "trainer")
test_get_fitness_plan(1)  
test_update_exercise_status(1) 
test_update_meal_status(1) 
