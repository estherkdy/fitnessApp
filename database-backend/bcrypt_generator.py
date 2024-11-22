import bcrypt

# sample passwords in order to be hashed
passwords = [
    "password123",
    "securepass",
    "passmike",
    "sarahsecure",
    "davidstrong",
    "lindapass",
    "jamestay",
    "barbie",
    "robthom",
    "maryj",
    "willwhite",
    "patpass",
    "joemart",
    "nancyt",
    "tomgar",
    "karenm",
    "chrisr",
    "jessl",
    "dangon",
    "ashc"
]

#   bcrypt hashes for each password
for password in passwords: 
    salt = bcrypt.gensalt(rounds=12)
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    print(hashed_password.decode('utf-8'))


print("________")

trainer_passwords = [
    "adminpass", "trainerpass2", "trainerpass3", "trainerpass4", "trainerpass5",
    "trainerpass6", "trainerpass7", "trainerpass8", "trainerpass9", "trainerpass10",
    "trainerpass11", "trainerpass12", "trainerpass13", "trainerpass14", "trainerpass15",
    "trainerpass16", "trainerpass17", "trainerpass18", "trainerpass19", "trainerpass20"
]

 
for password in trainer_passwords:
    salt = bcrypt.gensalt(rounds=12)
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    print(hashed_password.decode('utf-8'))
