const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 5000;

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

    // create usersDb here
    const usersDb = client.db("usersDb");
    const usersCollection = usersDb.collection("usersCollection");

    // basic POST req for creating a user if not exits
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user?.email };
      const isExistingUser = await usersCollection.findOne(query);
      if (isExistingUser?.email) {
        return res.send({
          status: "success",
          message: "Login Successfull.User already exists!",
        });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // GET req for getting UserInfo in DB by id for "editProfile" page
    app.get("/users/get/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    // GET req for getting UserInfo in DB by email for "Profile" page
    app.get("/users/:email", async (req, res) => {
      const { email } = req.params;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    // PATCH req for updating UserInfo in DB
    app.patch("/users/:email", async (req, res) => {
      const { email } = req.params;
      const updatedUser = req.body;
      const query = { email }; // { email: email }
      const updateDoc = {
        $set: updatedUser,
      };
      const options = { upsert: true }; // if the document does not exist, insert it
      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    console.log("Successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`Hello World! http://localhost:${port}/`);
});

app.listen(port, () => {
  console.log(`Example app listening on port: ${port}`);
});

// asifaowadud
// sof6vxfRNfUEvdCg
