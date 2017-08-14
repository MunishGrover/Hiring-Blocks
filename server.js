const express = require('express')
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , passport = require('./auth/passporthandler')
  , cookieParser = require('cookie-parser')
  , cors = require('cors')
  , db = require('./db/models').db;

var secrets;
try {
  secrets = require('./secrets.json')
} catch (e) {
  console.error('Create your own secrets file lazybones');
  secrets = require('./secret-sample.json')
}

const app = express();
const apirouter = require('./routes/api')
  , loginrouter = require('./routes/login')
  , logoutrouter = require('./routes/logout')
  , signuprouter = require('./routes/signup')
  , authorizerouter = require('./routes/authorize')
  , profilerouter = require('./routes/profile')
  , unauthorizerouter = require('./routes/unauthorize')


const ensure = require('./auth/authutils');

app.set("view engine", 'hbs');

app.use(cors());
app.use(cookieParser(secrets.EXPRESS_SESSIONS_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: secrets.EXPRESS_SESSIONS_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/', function (req, res) {
  res.status(200).send({
    running: true
  })
});

app.use('/signup', signuprouter);
app.use('/login', loginrouter);
app.use('/profile', profilerouter);
app.use('/logout', logoutrouter);
app.use('/authorize', authorizerouter);
app.use('/unauthorize', unauthorizerouter);


app.use('/api', apirouter);

module.exports = app;
