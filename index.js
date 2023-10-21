const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port  = process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.MY_NAME}:${process.env.MY_PASS}@cluster0.ib5iccz.mongodb.net/?retryWrites=true&w=majority`;

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

    const noteCollection = client.db("noteBD").collection("note")

    app.get('/notes', async(req, res)=> {
        const  result = await noteCollection.find().toArray()
        res.send(result)
    })

    app.get('/notes/:id', async(req, res)=> {
        const id = req.params.id
        const cursor = { _id: new ObjectId(id)}
        const  result = await noteCollection.findOne(cursor)
        res.send(result)
    })

    app.put('/notes/:id', async(req, res)=> {
        const id = req.params.id
        const cursor = { _id: new ObjectId(id)}
        const options = { upsert: true };
        const updatedNote = {
            $set: {
                title: req.body.title,
                details: req.body.details
            }
        }
        const  result = await noteCollection.updateOne(cursor, updatedNote, options)
        res.send(result)
    })

    app.post("/notes", async(req, res)=> {
        const note = req.body
        const result = await noteCollection.insertOne(note);
        res.send(result)
    })

    app.delete('/notes/:id', async(req, res)=> {
        const id = req.params.id
        const cursor = { _id: new ObjectId(id)}
        const  result = await noteCollection.deleteOne(cursor)
        res.send(result)
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


app.get('/', (req, res)=> {
    res.send('Hello world')
})

app.listen(port, ()=> {
    console.table(`server running on port ${port}`);
})