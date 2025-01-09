const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
connectToMongo();
const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());
// various routes
app.use('/api/auth',cors(),require("./routes/auth.controller"))
app.use('/api/notes',cors(),require("./routes/notes.controller"))

app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.listen(port,()=>{
    console.log(`Listening at port ${port}`);
})