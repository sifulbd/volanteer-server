const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());


const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eobd6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const volenteerCollection = client.db("volenteerNetwork").collection("volenteers");
  const registerCollection = client.db("volenteerNetwork").collection("register");

    //Insert Many Products
    app.post('/addPorducts', (req, res) => {
        const products = req.body;
        volenteerCollection.insertMany(products)
        .then(result => {          
            console.log(result)            
        })
    })  

    //add single event
    app.post('/addsingleevent', (req, res) => {
        const volenteers = req.body;
        console.log(req.body)
        volenteerCollection.insertOne(volenteers)
        .then(result => {
            res.send(result.deletedCount > 0);
        })
    })
    app.get('/volenteers', (req, res) => {
        registerCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.get('/volunteer/:key', (req, res) => {
        volenteerCollection.find({_id: ObjectId(req.params.key)})
        .toArray( (err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post("/addRegister", (req, res) => {
        const register = req.body;
        registerCollection.insertOne(register)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    app.get('/events', (req, res) => {
        registerCollection.find({email: req.query.email})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.get('/allEvents', (req, res) => {
        volenteerCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.delete("/delete/:id", (req, res) => {
        registerCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0);
        })
    })   

});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen((process.env.PORT || 5000), () => {
    console.log('app is listening..')   
})