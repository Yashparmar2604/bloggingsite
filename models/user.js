
const { createHmac,randomBytes } = require('crypto');

const mongoose=require('mongoose');
const {createTokenForUser} = require('../services/authentication');

const UserSchema=new mongoose.Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        uppercase:true,

    },
    salt:{
        type:String
        


    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    dob:{
        type:Date,
    },
    gender:{
        type:String,
        required:true,
        enum:['male','female']

    }
    

},{timestamps:true})


UserSchema.pre('save', function(next){
    const user=this;
    if(!user.isModified('password')) return next();
    const salt=randomBytes(16).toString()
    const hashedPassword= createHmac('sha512',salt)
    .update(user.password)
    .digest("hex")

    this.salt=salt
    this.password=hashedPassword

    next()

})


UserSchema.static("matchPasswordAndGenrateToken", async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("email not found");
    const salt = user.salt;
    const hashedPassword = user.password;

    const Userprovidedhash = createHmac('sha512', salt)
        .update(password)
        .digest("hex");

    if (Userprovidedhash !== hashedPassword) throw new Error("password not matched");

 const token = createTokenForUser(user)
 return token;
});

const user = mongoose.model('user',UserSchema)
module.exports = user