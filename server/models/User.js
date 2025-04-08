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

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User
