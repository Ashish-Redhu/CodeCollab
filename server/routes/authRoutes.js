import express from 'express'
import passport from 'passport'
import { registerUser, loginUser, logoutUser, oauthCallback, checkAuth, forgotPassword, resetPassword } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logoutUser)
router.get('/checkAuth', checkAuth)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login` }),
  oauthCallback
)

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: `${process.env.CLIENT_URL}/login` }),
  oauthCallback
)

export default router
