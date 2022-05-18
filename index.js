// Fundamental setup
const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

//Middlewar
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcg9i.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
      await client.connect();
      const taskCollection=client.db("TaskList").collection("tasks")

      //get all task
      app.get('/task', async(req, res)=>{
        const query = {};
        const result = await taskCollection.find(query).toArray();
        res.send(result)
    })

      // create tasks
      app.post('/task', async(req, res)=>{
        const task = req.body;
        const result = await taskCollection.insertOne(task);
        res.send(result)
      })

      // task delete by id
      app.delete('/task/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await taskCollection.deleteOne(query);
        res.send(result)
    })

    // make task complete
    app.put('/task/complete/:id', async(req, res)=>{
        const id = req.params.id;
        const filter = {_id:ObjectId(id)}
        const updateDoc = {
            $set:{role : 'complete'}
        }
        const result =await taskCollection.updateOne(filter, updateDoc)
        res.send(result)
    })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('to-do app backend code runnig')
})
app.listen(port, ()=>{
    console.log('successfuly running code', port);
})