const express = require("express");
var methodOverride = require("method-override");
const app = express();
const ejs = require("ejs");
const path = require("path");
const db = require("./db");
const posts = require("./models/posts");
const User = require("./models/user"); // Correct the import for User model

const bodyParser = require("body-parser");
const { set } = require("mongoose");
const { validateToken } = require("./services/authentication");
const cookieParser = require("cookie-parser");
const JWT = require("jsonwebtoken");
const user = require("./models/user");
const secret = process.env.SECRET;
const contact=require("./models/contact")

app.use(bodyParser.json());
app.use(cookieParser());
const port = process.env.PORT||3000

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));



app.get("/posts", async (req, res) => {
  try {
    const datas = await posts.find();
    console.log("Data fetched");
    res.render("index.ejs", { datas });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Invalid Server error" });
  }
});

app.get("/posts/new", async (req, res) => {
  const token = req.cookies.jwt;
  let loogeduser;

  if (token) {
    JWT.verify(token, secret,async (err, decoded) => {
      if (err) {
        res.send("internal server error");
      } else {
        loogeduser = decoded;
       loogedinuser = await user.findById(loogeduser._id);

  const data = loogedinuser;

  res.render("new.ejs", data);
      }
    });
  } else {
    res.redirect("/login");
  }

  
});

app.post("/posts", async (req, res) => {
  try {
    const data = req.body;
    const newposts = new posts(data);
    console.log(data);

    const response = await newposts.save();
    console.log("Data saved");
    res.redirect("/posts");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Invalid Server error" });
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let post = await posts.findById(id);
    res.render("show.ejs", { post });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Invalid Server error" });
  }
});

app.patch("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const response = await posts.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!response) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.redirect("/posts");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Invalid Server error" });
  }
});

app.get("/posts/:id/edit", async (req, res) => {
  try {
    let { id } = req.params;
    let post = await posts.findById(id);
    res.render("edit.ejs", { post });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Invalid Server error" });
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    let { id } = req.params;
    const response = await posts.findByIdAndDelete(id);
    if (!response) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Invalid Server error" });
  }
});

app.get("/", (req, res) => {
  const token = req.cookies.jwt;
  let loggedinuser;
  if (token) {
    JWT.verify(token, secret, (err, decoded) => {
      if (err) {
        console.log(err);
      } else {
        loggedinuser = decoded;
        console.log(loggedinuser);
        res.render("home.ejs", { loggedinuser });
      }
    });
  } else {
    res.render("home.ejs", { loggedinuser });
  }
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async (req, res) => {
  try {
    let userdata = req.body;
    const Newuser = new User(userdata); // Correct 'user' to 'User'
    const response = await Newuser.save();

    console.log("Data saved");
    res.redirect("/signin");
  } catch (err) {
    res.send(err);
  }
});

app.get("/signin", (req, res) => {
  res.render("signin.ejs");
});

app.post("/signin", async (req, res) => {
  let { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenrateToken(email, password);
    await res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.render("signin.ejs", {
      error: "INCORRECT EMAIL OR PASSWORD",
    });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/signin");
});

app.get("/myblog", async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (token) {
      JWT.verify(token, secret, async (err, decoded) => {
        if (err) {
          console.log(err);
        } else {
         console.log(decoded);
         let loggedinuser=decoded
         const username=loggedinuser.username
         
          const datas = await posts.find({username});
        
          console.log("Data fetched");

          res.render("myblog.ejs", { datas , loggedinuser});
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Invalid Server error" });
  }
});

app.get("/contactus",(req,res)=>{
  res.render("contactus.ejs");
})

app.post("/contactus",async(req,res)=>{
  try{
  const data=req.body;
  const newcontact = new contact(data);
  console.log(data);
 const response = await newcontact.save();
 res.render("response.ejs");
  }
  catch(err){
    console.log(err)
  }

})

app.get("/about",(req,res)=>{
  res.render("about.ejs")
})



app.listen(port, () => {
  console.log(`The server is listening on port ${port}`);
});
