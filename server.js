

const express = require('express');
const app = express();
const session = require('express-session')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs')

const mode = require('./routes/mode.js');
const api =  require('./routes/api.js');
require('./function.js');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


require('dotenv').config()

app.set('view engine', 'ejs');


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Your authentication logic here
  // The 'profile' object contains information about the authenticated user
  return done(null, profile);
}));


// Serialize user information into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});


app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
function  islogged(res,req,next){
  if(req.session.user){
    next();
  }else{
    res.sendStatus(401);
  }
}

app.use(passport.initialize());
app.use(passport.session());


app.use(express.static('public'));
app.use('/mode',mode);
app.use('/api',api);

app.get('/',(req, res)=>{
  res.redirect('/home');
})
app.get('/home', (req,res)=> {
  res.render('index');
});

app.get('/contact', (req, res) =>{
  res.render('contact');
});

app.get('/gearshift', (req, res) =>{
  res.render('gearshift');
});

// continue form here
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email','profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/gearshift' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
// app.get('/auth/google/success',islogged,(res,req)=>{
//   var name = req.user.displayNAME;
//   res.send('logged in suucessfully'+name)
// })
// app.get('/auth/google/failure',(res,req)=>{
//   res.sendStatus(401);
// })

app.get('/services', (req, res) =>{
  res.render('services');
});
// about page
app.get('/about', (req, res) =>{
  res.render('about');
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});



// var temp_code = {};
function encrpyt(text){
  var empty="";
  for(var i =0;i<text.length;i++){
    empty+=(text.charCodeAt(i))+";";
  }
  return empty;
}
function generatePass() {
  let pass = '';
  let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
      'abcdefghijklmnopqrstuvwxyz'+'0123456789';
  for (let i = 1; i <= 20; i++) {
      let char = Math.floor(Math.random()
          * str.length + 1);
      pass += str.charAt(char)
  }
  return pass;
}

function save_api(text){
  var api = generatePass();
  var date = new  Date() ;
  var time = `${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()}` ;

  var encrpytedtext = encrpyt(text);
  
  console.log(encrpytedtext);
  fs.appendFile('api/temp-code/acc-data.csv', `${api},${time},${encrpytedtext}\n`, function (err) {
    if (err) throw err;
    console.log('Saved! ', `${api},${time},***`);
    
  })
  return api;
}

io.on('connection', (socket) => {
  console.log('a user connected:'+socket.id);
socket.on('get',(text)=>{
  socket.emit('api', save_api(text));
})

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});