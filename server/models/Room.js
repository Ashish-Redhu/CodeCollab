// models/Room.js
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  passkey: {
    type: String,
    required: true
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }], 
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  }]
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
