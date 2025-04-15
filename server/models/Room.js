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


// // If a room gets deleted.
// roomSchema.pre("deleteOne", {document: true, query: false}, async function(next){
//   const roomId = this._id;

//   try{

//     // Remove the room from all users' joinedRooms
//     await mongoose.model("User").updateMany(
//       {joinedRooms: roomId},
//       {$pull : {joinedRooms : roomId}}
//     )

//     // Remove the room from the owner's ownedRooms
//     await mongoose.model("User").updateMany(
//       {ownedRooms: roomId},
//       {$pull : {ownedRooms : roomId}}
//     )

//     // Delete all messages of the room
//     await mongoose.model("Message").deleteMany({room : roomId});
//     next()
//   }
//   catch(err){
//     next(err);
//   }
// });

const Room = mongoose.model("Room", roomSchema);
export default Room;
