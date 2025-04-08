import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body
  const userExists = await User.findOne({ email })
  if (userExists) return res.status(400).json({ message: 'User already exists' })

  const user = await User.create({ username, email, password })
  const token = generateToken(user)
  res.cookie('token', token, { httpOnly: true }).json({ message: 'User registered' })
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = generateToken(user)
  res.cookie('token', token, { httpOnly: true }).json({ message: 'Login successful' })
}

export const logoutUser = (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out' })
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

