const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: "YOUR_GOOGLE_CLIENT_ID_HERE",         // <--- REPLACE THIS
    clientSecret: "YOUR_GOOGLE_CLIENT_SECRET_HERE", // <--- REPLACE THIS
    callbackURL: "http://localhost:3007/user/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // 1. Check if user already exists
        let existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }

        // 2. Check if user exists with same email
        let emailUser = await User.findOne({ email: profile.emails[0].value });
        if (emailUser) {
            emailUser.googleId = profile.id;
            await emailUser.save();
            return done(null, emailUser);
        }

        // 3. Create new user
        const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
        });
        done(null, newUser);

    } catch (err) {
        console.error(err);
        done(err, null);
    }
}));