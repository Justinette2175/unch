var express = require('express');
var exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var flash = require('connect-flash');

var config = require('./config');

/////////////////////////////////////
// ENV
var port = process.env.PORT || 8080;
var staticPath = __dirname + '/static';

///////////////////////////////////////
//				App					//

var app = express();

app.engine('handlebars', exphbs({
			defaultLayout: 'main',
			helpers: {
				toJSON : function(object) {
				  return JSON.stringify(object);
				}
			}}));
app.set('view engine', 'handlebars');

/////////////////////////////////////
// Logging
var morgan = require('morgan');
app.use(morgan('dev'));

// Connect Flash
app.use(flash());


/////////////////////////////////////
// App config

//bodyparsing
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'whoareyouandwhyareyoureadingthis', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());


//globals
app.use(function(req, res, next) {
	res.locals.user = req.user || null;
	res.locals.config = config

	if (req.user)
		res.locals.showLogin = true

	res.locals.og_url = 'http://unch.com';
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');

	res.locals.msgs = false;
	if (res.locals.error || res.locals.error_msg || res.locals.success_msg) {
        res.locals.msgs = true;
    }
	next();
});

passport.use(new LocalStrategy(function(username, password, done) {
	User.getUserByUsername(username, function(err, user) {
		if (err) throw err;
		if (!user) return done(null, false, {message: 'User does not exist'});
		User.comparePassword(password, user.password, function(err, isMatch){
			if (err) throw err;
			if (isMatch) {
				return done(null, user, {message: 'Login successful'});
			}
			return done(null, false, {message: 'Invalid password'});
		});

	});
}));

passport.serializeUser( function(user, done) {
	done(null, user.id);
});


passport.deserializeUser(function(user, done) {
	done(null, user);
});

/////////////////////////////////////
// DB + MODELS
var mongoose = require('mongoose');
var User = require('./models/user');

mongoose.connect(config.database, function(error) {
	if (error) {
    	console.log('Failed to connect to database.', error);
    }
});

//app.set('sSecret', config.secret);

/////////////////////////////////////
//Routes
app.use(express.static(staticPath));

var index = require('./routes/index');
var user = require('./routes/user');
var api = require('./routes/api');

app.use('/', index);
app.use('/user', user);
app.use('/api', api);

app.use(function(req, res) {
      req.flash('error', '404 content not found.');
      //res.redirect('/');
});

/////////////////////////////////////
// Make it run!
app.listen(port);
console.log('Server @ http://localhost:' + port);
