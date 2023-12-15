const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require('dotenv').config({ path: './.env' });

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.wyklqw4.mongodb.net/?retryWrites=true&w=majority`;
const databaseAndCollection = {db: "TODO_335", collection:"users"};

let userGLB = "";
let passGLB = "";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
}
run().catch(console.dir);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.listen(3000);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});


app.post("/registerSubmit", async (req, res) => {
    const {
        first_name, last_name, userid, 
        password, email, phoneFirstPart, 
        phoneSecondPart, phoneThirdPart
    } = req.body

    const name = first_name.trim() + " " + last_name.trim();
    const user = {
        name: name,
        userid: userid,
        password: password,
        email: email,
        phone: phoneFirstPart.trim() + "-" + phoneSecondPart.trim() + "-" + phoneThirdPart.trim(),
        tasks: [
            "Welcome to the best To-Do Organizer ever",
        ]
    }

    let tbltask = `<h1>Tasks</h1>`;
    tbltask += `<table border="1"><tr><th>Task</th></tr>`;
    tbltask += `<tr><td>Welcome to the best To-Do Organizer ever</td></tr>`;
    tbltask += `</table>`;

    await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(user);
    userGLB = userid;
    passGLB = password;
    res.render("displayItems", {name, tbltask});
});

app.post("/loginSubmit", async (req, res) => {
    try {
        const {userid, password} = req.body
        const cursor = await client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .find({userid: userid, password: password}).toArray();
        const tasks = cursor[0].tasks;
        const name = cursor[0].name;

        let tbltask = `<h1>Tasks</h1>`;
        tbltask += `<table border="1"><tr><th>Task</th></tr>`;
        tasks.forEach((element) => {
            tbltask += `<tr><td>${element}</td></tr>`;
        });
        tbltask += `</table>`;

        if (cursor != []) {
            userGLB = userid;
            passGLB = password;
            res.render("displayItems", {name, tbltask})
        } else {
            alert('Invalid login credentials');
        }
    } catch (e) {
        console.log(e);
    }
});

app.post("/add", async (req, res) => {
    try {
        const {task} = req.body;
        let tbltask = "";
        const cs = await client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .find({userid: userGLB, password: passGLB}).toArray();
        const tasks = cs[0].tasks;
        const name = cs[0].name;

        if (task === "Delete All") {
            const cursor = await client.db(databaseAndCollection.db)
            .collection(databaseAndCollection.collection)
            .updateOne(
                {
                    userid: userGLB,
                },
                {
                    $set: {tasks: []}
                }
            );
            tbltask = `<h1>Tasks</h1>`;
            tbltask += `<table border="1"><tr><th>Task</th></tr>`;
            tbltask += `</table>`;
        } else {
            const cursor = await client.db(databaseAndCollection.db)
            .collection(databaseAndCollection.collection)
            .updateOne(
                {
                    userid: userGLB,
                },
                {
                    $push: {tasks: task}
                }
            );
            tbltask = `<h1>Tasks</h1>`;
            tbltask += `<table border="1"><tr><th>Task</th></tr>`;
            tasks.forEach((element) => {
                tbltask += `<tr><td>${element}</td></tr>`;
            });
            tbltask += `<tr><td>${task}</td></tr>`;
            tbltask += `</table>`;
        }

        res.render("displayItems", {name, tbltask});
    } catch(e) {
        console.log(e)
    }
});


const prompt = "Web server started and running at http://localhost:3000/";
process.stdout.write(prompt);
process.stdin.on("readable", function () {
    let input = process.stdin.read().trim();
    if (input !== null) {
        if (input === "stop") {
            process.stdout.write("Shutting down the server");
            process.exit(0);
        } else {
            process.stdout.write(`Invalid command: ${input}\n`);
            process.stdout.write(prompt);
            process.stdin.resume();
        }
    }
});