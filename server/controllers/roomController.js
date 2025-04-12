import Room from '../models/Room.js';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const createRoom = async (req, res) => {
    const { title, passkey } = req.body;
    const userId = req.user.id;  // this will be populated by authentication middleware used in routes. 
    try 
    {   
        // Check if room already exists
        const existingRoom = await Room.findOne({ title });
        if (existingRoom) {
            return res.status(400).json({ message: "Room with this title already exists" });
        }
        
        const hashedPasskey = await bcrypt.hash(passkey, 10);
        const newRoom = new Room({ 
            title, 
            passkey: hashedPasskey,
            owner: userId,
            users: [userId]
        });
        await newRoom.save();
         
        // Add the new room to the user's ownedRooms array.
        const user = await User.findById(userId);
        user.ownedRooms.push(newRoom._id);
        await user.save();

        res.send(newRoom);
        
    } 
    catch(err) 
    {
        res.status(400).send("Room already exists or invalid");
    }
}

export const joinRoom = async (req, res) => {

    const { title, passkey } = req.body;
    const userId = req.user.id; // check if user is authenticated and get userId from token
    try {
      const room = await Room.findOne({ title });
      if (!room) return res.status(404).send("Room not found");
  
      const match = await bcrypt.compare(passkey, room.passkey);
      if (!match) return res.status(401).send("Incorrect passkey");

      // Check if the user is the owner of the room
      if (room.owner.toString() === userId) {
        return res.status(400).send("Owner cannot join their own room as a participant");
      }
  
      // Avoid duplicate join
      if (!room.users.includes(userId)) {
        room.users.push(userId);
        await room.save();
      }
     
      const user = await User.findById(userId);
      if (!user.joinedRooms.includes(room._id)) {
        user.joinedRooms.push(room._id);
        await user.save();
      }
  
      res.send(room);
    } 
    catch (err) 
    {
      console.error("Error joining room:", err);
      res.status(500).send("Something went wrong while joining the room");
    }
  }

export const getRoom = async (req, res) => {
    const { roomId } = req.params;
    try {
        const room = await Room.findById(roomId).populate('users', 'username');
        if (!room) return res.status(404).send("Room not found");
        res.send(room);
    } catch (err) {
        res.status(500).send("Error fetching room");
    }
}
  