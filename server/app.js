const passport = require('passport');
const cookieSession = require('cookie-session');
require('./passport-setup');

// this is where we listen for the server

app.use(cookieSession({
  name: 'beastie-session',
  keys: ['key1', 'key2']
}));

// we might want to move this middleware to another file
// add this middleware to routes that need user authentification
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.sendStatus(401);
  }
}

app.use(passport.initialize());
app.use(passport.session());

// example routes for good and bad login attempts
app.get('/', (req, res) => res.send('You are not logged in.'));
app.get('/failed', (req, res) => res.send('You failed to log in.'))
app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome ${req.user.displayName}!`))

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  // this line needs to redirect to whatever route we want a failed login to direct to
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect to whatever we want
    res.redirect('/good');
  });

app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/')
})