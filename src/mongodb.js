const mongoose = require("mongoose")


mongoose.connect("mongodb://localhost:27017/ParKar-Main")
.then(()=>{
    console.log("connected to database");
})

.catch(()=>{
    console.log("not connected to database");
})

const LogInSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})



//collection part

const collection=new mongoose.model("LogInCollection",LogInSchema)

module.exports=collection