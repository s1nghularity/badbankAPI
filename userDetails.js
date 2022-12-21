const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(

  {
    id: Number,
    name: String,
    email: {type: String, unique: true},
    password: String,
    balance: Number,
    transactionHistory: Array,
  }

);

mongoose.model("UserInfo", UserDetailsSchema);

