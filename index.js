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
       app.post('/adduserorder', (req, res) => {
           const userOrder = req.body;
           userOrderCollection.insertOne(userOrder)
           .then(result => {
               res.send(result.insertedCount>0)
           })
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
            userReviewCollection.insertOne(review)
            .then(result => {
                res.send(result.insertedCount>0)
            })
        })
        app.post('/addService', (req, res) =>{
            const file = req.files.file;
            const name = req.body.name;
            const description = req.body.description;
            const filePath = `${__dirname}/serviceitem/${file.name}`;
            file.mv(filePath, err=>{
                if(err){
                    console.log(err);
                    res.status(500).send({msg:'failed'});
                }
                const newImg = fs.readFileSync(filePath);
                const encImg = newImg.toString('base64');
                var image = {
                    contentType: req.files.file.mimetype,
                    size: req.files.file.size,
                    img: Buffer(encImg, 'base64')
                };
                serviceListCollection.insertOne({name, description, image})
                .then(result=>{
                    fs.remove(filePath, error=>{
                        if(error){console.log(error)}
                        res.send(result.insertedCount>0)
                    })
                })
            })
        })
  });
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
app.listen(port);