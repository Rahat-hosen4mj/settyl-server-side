const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middle wire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.squ4tld.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    console.log('data base connection ok');
    const employeeCollection = client.db("settyl").collection("employees");
    const userCollection = client.db("settyl").collection("users");
   
      // get all the employees info
      app.get("/employees", async (req, res) => {
        const employees = await employeeCollection.find({}).toArray();
        res.send(employees);
      });
      // get all the user info
      app.get("/users", async (req, res) => {
        const users = await userCollection.find({}).toArray();
        res.send(users);
      });

    // get a specific user info
    app.get('/user/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const user =await userCollection.findOne(query);
        res.send(user)
      });
    

      // get a specific employee info
    app.get('/employee/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result =await employeeCollection.findOne(query);
        console.log(result)
        res.send(result)
      });
    
     // add a employee (post method)
     app.post('/employee', async(req, res) =>{
        const employee = req.body;
        const result = await employeeCollection.insertOne(employee);
        res.send(result);
      });

     // add a user (post method)
     app.post('/user', async(req, res) =>{
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
      });

      // update a user info
      app.put('/user/:id', async (req,res) =>{
        const updateEmployee = req.body;
        const id = req.params.id
        // console.log(updateEmployee);
        const filter = {_id: ObjectId(id)}
        const option = {upsert: true}
        const updatedDoc ={
          $set: {
            first_name: updateEmployee.first_name,
            last_name: updateEmployee.last_name,
            email: updateEmployee.email,
            age: updateEmployee.age,
            salary: updateEmployee.salary
          },
        }
        const result = await userCollection.updateOne(filter, updatedDoc, option)
        res.send(result)
      });

      // update a Employee info
      app.put('/employee/:id', async (req,res) =>{
        const updateEmployee = req.body;
        const id = req.params.id
        // console.log(updateEmployee);
        const filter = {_id: ObjectId(id)}
        const option = {upsert: true}
        const updatedDoc ={
          $set: {
            employee_name: updateEmployee.employee_name,  
            employee_age: updateEmployee.employee_age,
            employee_salary: updateEmployee.employee_salary
          },
        }
        const result = await employeeCollection.updateOne(filter, updatedDoc, option)
        res.send(result)
      });

     // Delete a specific employee 
     app.delete('/employee/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result =await employeeCollection.deleteOne(query);
        res.send(result)
      });
  } finally {
  }
}
run().catch(console.dir);

// app listen koranor jonno server side eh
app.get("/", async (req, res) => {
  res.send("settyl server side is running");
});

// app listen korate hobe
app.listen(port, () => {
  console.log(`settyl server side is running on ${port}`);
});
