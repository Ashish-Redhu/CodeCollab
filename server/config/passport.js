// server.js
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import passport from 'passport'; // Imports the Passport.js library for authentication.
import { Strategy as LocalStrategy } from 'passport-local'; // Imports the specific LocalStrategy for username/password authentication.
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github2'
import User from '../models/User.js'; 

// Configures Passport to use the Local Strategy for authentication.
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Specifies that the 'email' field from the login form will be used as the username.
    },
    async (email, password, done) => {
      // This asynchronous function is called by Passport to authenticate a user.
      // 'email' and 'password' are the values submitted in the login form.
      // 'done' is a callback function that Passport expects to be called with the authentication result.

      try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
          //   - null: indicating no error occurred during the process.
          //   - false: indicating that authentication failed.
          //   - { message: 'Invalid credentials' }: an optional object containing an error message to be sent back to the user.
          return done(null, false, { message: 'Invalid credentials' });
        }

        // If a user is found and the password matches:
        // Call 'done' with:
        //   - null: indicating no error.
        //   - user: the authenticated user object that Passport will attach to the 'req.user' property.
        return done(null, user);
      } catch (err) {
        // If an error occurs during the database query or password comparison:
        // Call 'done' with the error object to pass the error to Passport's error handling middleware.
        return done(err);
      }
    }
  )
);

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value
  const user = await User.findOneAndUpdate(
    { email },
    { email, username: profile.displayName, provider: 'google' },
    { upsert: true, new: true }
  )
  return done(null, user)
}))

// GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/api/auth/github/callback`
}, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails?.[0]?.value || `${profile.username}@github.com` // fallback
  const user = await User.findOneAndUpdate(
    { email },
    { email, username: profile.displayName || profile.username, provider: 'github' },
    { upsert: true, new: true }
  )
  return done(null, user)
}))