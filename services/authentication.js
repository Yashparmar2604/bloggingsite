const JWT=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config();

const secret=process.env.SECRET

function createTokenForUser(user){
    const payload={
        _id: user.id,
        email: user.email,
        username:user.username,
    }

    const token=JWT.sign(payload,secret);
    return token;
}

function validateToken(req,res,next){
  
    if(token){
        JWT.verify(token,secret,(err,decoded)=>{
        if(err){
            res.send("internal server error")
        }
        else{
            req.user=decoded;
            next();
        }

        })

    }else{
        res.redirect("/login")
    }
    

}

module.exports={
    createTokenForUser,
    validateToken,
}