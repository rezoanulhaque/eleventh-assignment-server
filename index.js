const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express()
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('serviceitem'));
app.use(fileUpload());
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3yghf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
    const userReviewCollection = client.db("eleventhAssignment").collection("userReview");
    const userOrderCollection = client.db("eleventhAssignment").collection("userOrder");
    const serviceListCollection = client.db("eleventhAssignment").collection("serviceList");
    const anonymusCollection = client.db("eleventhAssignment").collection("anonymusList");
    const adminCollection = client.db("eleventhAssignment").collection("adminUser");
       app.post('/adduserorder', (req, res) => {
           const userOrder = req.body;
           userOrderCollection.insertOne(userOrder)
           .then(result => {
               res.send(result.insertedCount>0)
           })
       })
       app.post('/addAdmin', (req, res) => {
        const addAdmin = req.body;
        userOrderCollection.insertOne(addAdmin)
        .then(result => {
            res.send(result.insertedCount>0)
        })
    })
    app.get('/admin', (req, res) => {
        const userEmail = req.query.email;
        adminCollection.find({ email: userEmail })
            .toArray((err, documents) => res.send(documents))
    })
       app.get('/userOrder', (req, res) => {
        userOrderCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents);
            })
        })
        app.get('/orderList', (req, res) => {
            userOrderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
                })
            })
        app.get('/userComment', (req, res) => {
            userReviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
                    })
                })
        app.post('/addreview', (req, res) => {
            const review = req.body;
            userReviewCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount>0)
            })
        })
        app.post('/anonymousReview', (req, res) => {
            const review = req.body;
            anonymusCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount>0)
            })
        })
        app.post('/addService', (req, res) =>{
            const file = req.files.file;
            const name = req.body.name;
            const description = req.body.description;
            const newImg = file.data;
            const encImg = newImg.toString('base64');
                var image = {
                    contentType: file.mimetype,
                    size: file.size,
                    img: Buffer.from(encImg, 'base64')
                };
                serviceListCollection.insertOne({name, description, image})
                .then(result=>{
                        res.send(result.insertedCount>0)
                    })
                })
  });
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
app.listen(process.env.PORT||port);