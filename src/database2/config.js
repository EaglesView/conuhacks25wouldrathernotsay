const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Cemecla:wouldrathernotsay@cluster0.jm8sh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    const db = client.db("danger-town");
    const collections = await db.listCollections().toArray();
    console.log(collections);
    console.log("Connecting . . .");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

connect();
