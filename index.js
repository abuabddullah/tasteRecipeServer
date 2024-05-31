const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://asifaowadud:sof6vxfRNfUEvdCg@cluster0.gjcwx8p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect(); // Connect the client to the server

    // create recipesDb here
    const recipesDb = client.db("recipesDb");
    const recipesCollection = recipesDb.collection("recipesColl");

    // basic POST req
    app.post("/recipes", async (req, res) => {
      const newRecipe = req.body;
      const result = await recipesCollection.insertOne(newRecipe);
      res.send(result);
    });

    // basic GET req for getting all recipes
    app.get("/recipes", async (req, res) => {
      const cursor4RecipiesData = recipesCollection.find({});
      const results = await cursor4RecipiesData.toArray();
      res.send(results);
    });

    // basic GET req for getting a single recipe
    // here multiple params could be passed like "/recipes/:id/:name" and we can get like const { id, name } = req.params;
    app.get("/recipes/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const recipe = await recipesCollection.findOne(query);
      res.send(recipe);
    });

    // basic PATCH req for updatting a single recipe
    app.patch("/recipes/:id", async (req, res) => {
      const { id } = req.params;
      const updatedRecipe = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updatedRecipe,
      };
      const options = { upsert: true }; // if the document does not exist, insert it
      const result = await recipesCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    // basic DELETE req for deleting a single recipe
    app.delete("/recipes/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await recipesCollection.deleteOne(query);
      res.send(result);
    });

    console.log("Successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World! http://localhost:3000/");
});

app.listen(port, () => {
  console.log(`Example app listening on port: ${port}`);
});

// asifaowadud
// sof6vxfRNfUEvdCg
