
from .config import db


users_collection = db["users"]


def create_user(name):
    """Insert a new user into the database."""
    user = {"name": name, "speed": 0, "score": 0}
    return users_collection.insert_one(user).inserted_id

def get_users():
    return list(users_collection.find({}, {"_id": 0}))


def update_user_speed(name,speed):
    """Update a user's speed."""
    return users_collection.update_one({"name": name}, {"$set": {"speed":speed}})

def get_user_score(name):
    return users_collection.find_one({"name": name})

def get_user_by_name(name):
    """Find a user by email."""
    return users_collection.find_one({"name": name})

def update_user_name(id):
    users_collection.find_one()

def update_user_score(name, score):
    """Update a user's email."""
    return users_collection.update_one({"name": name}, {"$set": {"score": score}})

def delete_user(name,score):
    """Delete a user by email."""
    return users_collection.delete_one({"score": score ,"name":name})

def delete_all_users():
    """Supprime tous les utilisateurs de la collection."""
    result = users_collection.delete_many({})
    return result.deleted_count

games_collection = db["games"]
