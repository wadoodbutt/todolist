const express = require("express");
const bodyParser = require("body-parser"); 
const app = express();
const dotenv = require('dotenv').config({ path: './.env' });

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.kmw9jvg.mongodb.net/?retryWrites=true&w=majority`;
// const databaseAndCollection = {db: "CMSC335_DB", collection:"campApplicants"};

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
// }
// run().catch(console.dir);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.listen(3000);

app.get("/", (req, res) => {
    res.render("index")
});

const prompt = "Web server started and running at http://localhost:3000/";
process.stdout.write(prompt);
