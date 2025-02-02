const { MongoClient } = require('mongodb');
const { client } = require('./config'); // On suppose que config.js exporte le client MongoDB

const db = client.db("danger-town");
const usersCollection = db.collection("users");
const gamesCollection = db.collection("games");

async function createUser(name) {
  const user = { name, speed: 0, score: 0 };
  const result = await usersCollection.insertOne(user);
  return result.insertedId;
}

async function getUsers() {
  return await usersCollection.find({}, { projection: { _id: 0 } }).toArray();
}

async function updateUserSpeed(name, speed) {
  const result = await usersCollection.updateOne({ name }, { $set: { speed } });
  return result.modifiedCount > 0;
}

async function getUserByName(name) {
  return await usersCollection.findOne({ name });
}

async function updateUserScore(name, score) {
  const result = await usersCollection.updateOne({ name }, { $set: { score } });
  return result.modifiedCount > 0;
}

async function deleteUser(name, score) {
  const result = await usersCollection.deleteOne({ name, score });
  return result.deletedCount > 0;
}

async function deleteAllUsers() {
  const result = await usersCollection.deleteMany({});
  return result.deletedCount;
}

module.exports = {
  createUser,
  getUsers,
  updateUserSpeed,
  getUserByName,
  updateUserScore,
  deleteUser,
  deleteAllUsers,
  gamesCollection
};
