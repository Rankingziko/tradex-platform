// ================================
// GOOGLE OAUTH CONFIGURATION
// ================================

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const fileDB = require('./file-database');
const { generateToken } = require('./auth');
const crypto = require('crypto');

// Generate ID
const generateId = () => crypto.randomBytes(12).toString('hex');

// Generate referral code
const generateReferralCode = () => {
  return 'TRX' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists by Google ID
        const users = await fileDB.getAllUsers();
        let user = users.find(u => u.googleId === profile.id);

        if (!user) {
          // Check if user exists by email
          user = users.find(u => u.email === profile.emails[0].value.toLowerCase());

          if (user) {
            // Link Google ID to existing user
            user.googleId = profile.id;
            await fileDB.updateUser(user._id, user);
          } else {
            // Create new user
            const newUser = {
              _id: generateId(),
              googleId: profile.id,
              firstName: profile.given_name || profile.displayName.split(' ')[0],
              lastName: profile.family_name || profile.displayName.split(' ')[1] || '',
              email: profile.emails[0].value.toLowerCase(),
              profileImage: profile.photos[0]?.value,
              referralCode: generateReferralCode(),
              balance: 0,
              role: 'trader',
              password: null, // No password for OAuth users
              verified: true, // Auto-verify OAuth users
              createdAt: new Date(),
            };

            user = await fileDB.createUser(newUser);

            // Create default wallets
            const cryptos = ['BTC', 'ETH', 'USDT', 'BNB', 'XRP'];
            for (const crypto of cryptos) {
              await fileDB.createWallet({
                userId: user._id,
                currency: crypto,
                balance: 0,
                totalDeposited: 0,
                totalWithdrawn: 0,
                address: `${crypto.toLowerCase()}_address_${user._id.substring(0, 8)}`,
              });
            }
          }
        }

        return done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for sessions
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from sessions
passport.deserializeUser(async (userId, done) => {
  try {
    const user = await fileDB.getUserById(userId);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
