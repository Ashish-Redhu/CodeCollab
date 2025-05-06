import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto' // To generate secure tokens
import nodemailer from 'nodemailer'

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, password });

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "None", }).json({ message: 'User registered' });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "None", }).json({ message: 'Login successful' });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,       // Only over HTTPS
      sameSite: 'None',   // Required for cross-site cookies
    });

    return res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};



export const deleteUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete all rooms owned by user (cascade handled there)
    const ownedRooms = await Room.find({ owner: userId });
    for (let room of ownedRooms) {
      await Message.deleteMany({ room: room._id });
      await room.deleteOne();
    }

    // Remove user from rooms they joined
    await Room.updateMany({}, { $pull: { users: userId } });

    // Delete user
    await user.deleteOne();

    res.clearCookie('token').json({ message: 'User and related data deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting user' });
  }
};


export const checkAuth = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ authenticated: false, message: 'No token found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)
    .select('-password')
    .populate('ownedRooms', 'title _id')
    .populate('joinedRooms', 'title _id');

    if (!user) {
      return res.status(401).json({ authenticated: false, message: 'Invalid user' });
    }


    return res.status(200).json({
      authenticated: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        ownedRooms: user.ownedRooms,
        joinedRooms: user.joinedRooms,
      }
    });

  } catch (error) {
    res.clearCookie('token');
    return res.status(401).json({ authenticated: false, message: 'Invalid token' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Generate a reset token
    const token = crypto.randomBytes(32).toString('hex')
    user.resetToken = token
    user.resetTokenExpires = Date.now() + 10 * 60 * 1000 // 1 hour
    await user.save()

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}&email=${email}`

    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in next 10 minutes.</p>`,
    })

    res.json({ message: 'Reset link sent to your email.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const resetPassword = async (req, res) => {
  const { email, newPassword, token } = req.body
  try {

    const user = await User.findOne({
      email,
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }, // check if token is still valid
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }

    user.password = newPassword
    user.resetToken = undefined
    user.resetTokenExpires = undefined
    await user.save()
    res.json({ message: 'Password reset successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}



// For OAuth2.0 authentication with Google and GitHub
// The OAuth2.0 authentication process is handled by Passport.js strategies (GoogleStrategy and GitHubStrategy) in the passport.js file
export const oauthCallback = (req, res) => {
  const token = generateToken(req.user)
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }).redirect(`${process.env.CLIENT_URL}/home`)
}

