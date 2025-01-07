require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);
const User = require("./models/user.model");
const Note = require("./models/note.model")

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.get("/", (req, res) => {
  res.json({
    msg: "hello world",
  });
});

app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName) {
    return res.status(400).json({
      error: true,
      message: "Full Name is required",
    });
  }
  if (!email) {
    return res.status(400).json({
      error: true,
      message: "Email is required",
    });
  }
  if (!password) {
    return res.status(400).json({
      error: true,
      message: "Password is required",
    });
  }

  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res.json({
      error: true,
      msg: "User Already exist",
    });
  }

  const user = new User({ fullName, email, password });
  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
});


app.post("/login", async(req, res) => {
    const { email, password } = req.body;

    if(!email)
    {
        return res.status(400).json ({
            msg: "Email is requires"
        })
    }
    if(!password)
    {
        return res.status(400).json ({
            msg: "Email is requires"
        })
    }

    const userInfo = await User.findOne({
          email :email
    });

    if(!userInfo)
    {
        return res.status(400).json({
            msg: "User not found"
        });
    }


    if(userInfo.email == email && userInfo.password == password)
    {
        const user = {
            user : userInfo
        }

        const acessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m"
        });

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            acessToken
        })
    }
    else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credentials"

        })
    }
});

app.post("/add-note", authenticateToken, async(req,res) => {

const { title, content, tags } = req.body
const { user } = req.user

if(!title)
{
    return res.status(400).json({
        error: true,
        msg : "Title is required"
    })
}
if(!content)
{
    return res.status(400).json({
        error: true,
        msg : "content is required"
    })
}

try {
    const note = new Note({
        title, 
        content,
        tags: tags || [],
        userId: user._id,
    });
    
    await note.save();

    return res.json({
        error: false,
        note,
        msg: "Note added successfully"
    });

}catch(error) {
    console.log(error)
    return res.status(500).json({
      
        error:true,
        msg: "Internal server Error",
        
    })
}

})

app.listen(3000);
module.exports = app;
