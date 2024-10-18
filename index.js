const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.agjw6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const touristsSpotCollection = client.db('spotDB').collection('spot')
    const userCollection = client.db('UsersDB').collection('user')

    app.get('/tourists-spots', async (req, res) => {
      const cursor = touristsSpotCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/tourists-spots/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await touristsSpotCollection.findOne(query)
      res.send(result)
    })

    app.post('/tourists-spots', async (req, res) => {
      const spot = req.body
      const result = await touristsSpotCollection.insertOne(spot)
      res.send(result)
    })

    app.put('/tourists-spots/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const UpdatedSpotData = req.body
      const spot = {
        $set: {
          name: UpdatedSpotData.name,
          email: UpdatedSpotData.email,
          image: UpdatedSpotData.image,
          spotName: UpdatedSpotData.spotName,
          countryName: UpdatedSpotData.countryName,
          location: UpdatedSpotData.location,
          avgCost: UpdatedSpotData.avgCost,
          seasonality: UpdatedSpotData.seasonality,
          travelTime: UpdatedSpotData.travelTime,
          totalVisitorsPerYear: UpdatedSpotData.totalVisitorsPerYear,
          description: UpdatedSpotData.description,
        }
      }
      const result = await touristsSpotCollection.updateOne(filter, spot, options)
      res.send(result)
    })

    app.delete('/tourists-spots/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await touristsSpotCollection.deleteOne(query)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Torists Spot server is running')
})
app.listen(port, () => {
  console.log(`Tourism Server is running on port: ${port}`)
})