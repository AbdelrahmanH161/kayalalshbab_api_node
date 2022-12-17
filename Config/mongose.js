// const mongoose = require("mongoose");
// mongoose.connect('mongodb+srv://abdelrahman:mVOSes850ZJFl95R@cluster0.kpcj9of.mongodb.net/?retryWrites=true&w=majority').then((x)=>
// {
//     console.log("connection is open");
// });

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://abdelrahman:mVOSes850ZJFl95R@cluster0.kpcj9of.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    console.log("connection is open");
//   const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});