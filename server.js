const dotenv = require ('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require('passport'); 
const session = require('express-session')
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors')

const port = process.env.PORT || 3001;
const app = express();

// Middleware
app
  .use(bodyParser.json())
  .use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Z-key'
  );
  res.setHeader(
    'Access-Control-Allow-Methods', 
    'GET, POST, PUT, DELETE, OPTIONS, PATCH'
  );
  next();
})
.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}))
.use(cors({ origin: '*'}))
.use('/', require('./routes/index.js'));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
  //user.findOrCreate({ githubId: profile.id}, function (err, user) {
  return done(null, profile);
  //})
}
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/', (req, res) => { res.send (req.session.user !== undefined ? `logged in as ${req.session.user.displayName}` : "Logged out")});
app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false}),
    (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  });

app.use('/books', require('./routes/books')); // Route for Books CRUD operations
app.use('/author', require('./routes/author'));

// Handle 404 - Undefined Routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Connect to MongoDB and start server
mongodb.initDb((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Stop server if DB fails to connect
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and Node is running on port ${port}`);
    });
  }
});