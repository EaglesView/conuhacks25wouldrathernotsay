from database.models import *


user_id = create_user("Tommy")
user_id = create_user("Jean")
user_id = create_user("Killyan")
users = get_users()
print("Liste des utilisateurs :", users)

# Ajouter des utilisateurs
update_user_score("Tommy", 25)
update_user_score("Jean", 200)
update_user_speed("Killyan",23)
print(f"Dernier Utilisateur inséré avec l'ID : {user_id}")
print("Liste des utilisateurs :", users)

user = get_user_by_name("Jean")
print("Utilisateur: ", user)

delete_user("Killyan",200)
# Récupérer les utilisateurs
users = get_users()
print("Liste des utilisateurs :", users)

deleted = delete_all_users()
print(deleted," Users have been removed, none are left")

users = get_users()
print("List of users: ", users)
