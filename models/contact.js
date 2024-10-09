const mongoose=require("mongoose");


const ContactSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
    },
    subject:{
        type:String
    },
    message:{
        type:String,
    }

})

const contact=mongoose.model('contact',ContactSchema)
module.exports=contact