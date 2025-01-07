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
app.use(cors(
  {
    origin: "*"
  }
));

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");


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

        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m"
        });
        console.log(accessToken)

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken
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
console.log(acessToken)

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


app.put("/edit-note/:noteId", authenticateToken, async ( req, res) => {
   const noteId = req.params.noteId;
   const { title, content, tags, isPinned } = req.body;
   const { user } = req.user

   if(!title && !content && !tags) {
     return res.status(400).json({
      error: true,
      msg: "No chnages provided"
     })
   }

   try {
    const note = await Note.findOne({_id: noteId, userId: user._id});

    if(!note)
    {
      return res.status(404).json({
        error:true,
        msg: "Notes not found"
      })
    }
    if(title)
      note.title = title;
    if(content)
      note.content = content;
    if(tags)
      note.tags= tags;
    if(isPinned)
      note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      msg: "Note updated  successfully",
    })


   } catch(error)
   {
    return res.status(500).json({
      error: true,
      msg: "Internal server Error",
    });
   }

})

app.get("/getallnotes", authenticateToken,  async (req,res) => {
  const { user } = req.user;
  try {
    const notes = await Note.find({ userId: user._id}).sort({ isPinned: -1});

    return res.json ({
      error: false,
      notes,
      msg: "All notes retrived sucessfully "
    });
  } catch (error)
  { console.log(err)
    return res.status(500).json ({
      error: true,
      msg: "Internal Server Error"
    });
  }
})


app.delete("/deleteNote/:noteId/" , authenticateToken, async(req ,res) => {

  const noteId = req.params.noteId;
  const { user } = req.user;


try{
  const note = await Note.findOne({_id: noteId, userId: user._id})

  if(!note) {
    return res.status(404).json ({
      error: true,
      msg: "Note not Found"

    })
  }


  await Note.deleteOne({_id: noteId, userId: user._id});

  return res.json({
    error: false,
    msg: "Notes deleted successfully",
  });
} catch(error) {
  return res.status(500).josn ({
    error: true,
    msg: "Internal Server Error"
  })
}

})

app.put("/update-note-pinned/:noteId", authenticateToken, async ( req ,res ) => {

  const noteId = req.params.noteId
  const { isPinned } = req.body
  const { user } = req.user

  if(!isPinned) {
    return res.status(400).json({
     error: true,
     msg: "No chnages provided"
    })
  }

  try {
   const note = await Note.findOne({_id: noteId, userId: user._id});

   if(!note)
   {
     return res.status(404).json({
       error:true,
       msg: "Notes not found"
     })
   }
  
   
    note.isPinned = isPinned  ;
   

   await note.save();

   return res.json({
     error: false,
     note,
     msg: "Note updated  successfully",
   })


  } catch(error)
  {
   return res.status(500).json({
     error: true,
     msg: "Internal server Error",
   });
  }

});

app.listen(3000);
module.exports = app;
