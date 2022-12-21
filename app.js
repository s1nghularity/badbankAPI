const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
const cors = require('cors');
app.use(cors());
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//used openssl ran -base64 32 to generate secret
const JWT_SECRET = "rtUSnZXjdZuR6PwXCmyN0OUGcpxePI5KwzblSoOQPzA=" 

const mongoUrl = "mongodb+srv://badbank:badbank@cluster0.og9udqp.mongodb.net/?retryWrites=true&w=majority"

const PORT = process.env.PORT || 5000



mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => console.log(err));

  require ("./userDetails")

  const User = mongoose.model("UserInfo")

  app.use(express.static(path.resolve(__dirname, 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });

  app.post("/register", async(req,res)=>{
  const {name, email, password, balance}=req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);

  try{
    const oldUser = await User.findOne({email});
    if(oldUser){
      return res.json({error:"Sorreh...user already exists..."})
    }

    await User.create(
      {
        name, 
        email, 
        password:encryptedPassword, 
        balance, 
        transactionHistory:[]
      }
      );
    res.send({status:"ok"}) 
  } catch (error) {
    res.send({status:"Error"})
  }
  });




  app.post("/login", async(req,res)=>{
    const {email, password}=req.body;

    const user = await User.findOne({email});
    if(!user){
      return res.json({error:"User not found..."})
    }
    if (await bcrypt.compare(password, user.password)){
      const token = jwt.sign({email: user.email}, JWT_SECRET);

      if(res.status(201)) {
        return res.json({status:"ok", data:token})
      } else {
        return res.json({error:"error"})
      }
    }
    res.json({ status: "error", error:"Invalid Password"})
  });


  app.post("/userData", async (req, res) => {
    const { token } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET);
      const userEmail = user.email;
      User.findOne({ email: userEmail })
        .then((data) => {
          res.send({ status: "ok", data: data });
        })
        .catch((error) => {
          res.send({ status: "error", data: error });
        });
    } catch (error) {}
  });
  
// update - deposit/withdraw amount
app.put('/updatebalance', async (req, res) => {
  const { token } = req.body;
  // Validate the token and user
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const newTotal = user.balance;
    User.findOneAndUpdate({ balance: newTotal },
      { $set: { balance: newTotal } },
      { new: true }
    );
  
    res.send({ status: 'Balance updated', data: updatedUser });
  } catch (error) {
    res.send({ error: error });
  }
  });



  app.post("/post", async(req,res)=>{
    console.log(req.body);
    const {data}=req.body;
  
    try {
      if(data === "vikram"){
        res.send({status:"ok"})
      } else {
        res.send({status:"User Not Found"})
      }
  
    } catch (error) {
      res.send({status:"Something went wrong, please try again."})
    }
  })

  app.listen(PORT, ()=>{
  console.log("Server successfully started!")
})
