import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    provider: {
        type: String, 
        default: "local",
        // provider is used when we give social logins like "google, github, facebook" etc.
    },
    role: {
        type: String, 
        default: 'normal', // owner, gold, normal
    },
    ownedRooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
        },
    ],
    joinedRooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
        },
    ],

    // this is used for password reset functionality.
    resetToken: {
        type: String,
    },
    resetTokenExpires: {
        type: Date,
    },
}, 
// the below one is an optional field that automatically adds two fields in the schema i) createdAt ii) updatedAt.
    {
        timestamps: true,
    }
);

// this is a pre-save hook or middleware.
userSchema.pre("save", async function(next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
});

// If a User gets deleted
userSchema.pre("deleteOne", {document: true, query: false}, async function(next){
    const userId = this._id;

    try{

        // Remove user from rooms they joined
        await mongoose.model("Room").updateMany(
            { users: userId}, 
            { $pull : {users : userId}}
        )

        // Find and delete rooms where user is the owner
        const roomsOwned = await mongoose.model("Room").find({owner: userId});

        for(const room of roomsOwned){
            await room.deleteOne(); // This will trigger Room's pre deleteOne hook
        }
        next();
    }
    catch(err){
        next(err);


    }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User
