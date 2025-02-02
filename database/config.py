from pymongo import MongoClient



uri = "mongodb+srv://Cemecla:wouldrathernotsay@cluster0.jm8sh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri)
client = MongoClient(uri)


db = client["danger-town"]
print(db.list_collection_names()) 

print(f"Connecting . . .")