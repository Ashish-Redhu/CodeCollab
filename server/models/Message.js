// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    default: "",
  },
  fileUrl: {
    type: String,
  },
  fileType: {
    type: String,
    enum: ["image", "audio", "video", "pdf", "none"],
    default: "none",
  },
  timeStamp: {
    type: Date,
    default: Date.now
  }
});

 messageSchema.index({ room: 1, timeStamp: -1 }); // For performance: Efficiently return the latest messages first without scanning the entire collection.

const Message = mongoose.model("Message", messageSchema);
export default Message;


// How we will handle the files: 
// Receiving the file from the frontend
// Uploading it to Cloudinary
// Saving the resulting file URL in the MongoDB database