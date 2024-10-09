const mongoose=require('mongoose')
const PostsSchema=new mongoose.Schema({

    username:{
        type:String,
        required:true

    },
  
    content:{
        type:String,
        required:true
    }
})

const posts=mongoose.model('posts',PostsSchema)
module.exports=posts