const express=require('express');
const { MongoClient } = require('mongodb');
const cors=require('cors');
require('dotenv').config()
const ObjectId=require('mongodb').ObjectId;

const app=express();
const port= process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${ process.env.DB_PASS}@cluster0.pihjg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database=client.db('travel')
        const servicesCollection=database.collection('services')
        const ordersCollection=database.collection('orders')
        console.log("assignmetn-11 database connected");


        // GET API
        app.get('/services', async(req,res)=>{
            const cursor= servicesCollection.find({})
            const services=await cursor.toArray();
            res.send(services)
        })

        // get singel api service
        app.get('/services/:id', async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result= await servicesCollection.findOne(query)
            res.json(result);
      })

       // API POST for oder
       app.post('/orders',async (req,res)=>{
        
        const order=req.body;
        console.log('hitting the post',order)
         const result = await ordersCollection.insertOne(order);
         console.log(result);
         res.send(result);
     })

       // API POST for new service add
       app.post('/services',async (req,res)=>{
        
        const service=req.body;
        console.log('hitting the post',service)
         const result = await servicesCollection.insertOne(service);
         console.log(result);
         res.send(result);
     })

     // GET API for orders
     app.get('/orders', async(req,res)=>{
        const cursor= ordersCollection.find({})
        const order=await cursor.toArray();
        res.send(order)
    })

     // DELETE API for my orders
     app.delete('/orders/:id', async (req,res)=>{
        const id=req.params.id;
        const query={_id: ObjectId(id)}
        const result=await ordersCollection.deleteOne(query)
        res.json(result)
    })

    }

    finally{
        // await client.close();
    }
}

run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Running assignment-11 server')
})

app.listen(port,()=>{
    console.log('assignment-11 server running port is',port)
})