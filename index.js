const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Genius car server');
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6onkfsj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const servicesCollection = client.db('geniusCar').collection('services')
        const orderCollection = client.db('geniusCar').collection('orders')
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray()
            res.send(services)
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.send(service)
        })
        app.get('/orders', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = orderCollection.find(query)
            const orders = await cursor.toArray()
            res.send(orders)
        })

        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await orderCollection.insertOne(orders)
            res.send(result)
        })
        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const status = req.body.status;
            const updateDoc = {
                $set: {
                    status: status
                }
            }
            const result = await orderCollection.updateOne(query, updateDoc)
            res.send(result)
        })


        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const order = await orderCollection.deleteOne(query)
            res.send(order)
        })

    }
    finally {

    }

}
run().catch(err => console.log(err))

app.listen(port, () => {
    console.log(`My Server is Comming port ${port}`)
})