var express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	bodyParser = require('body-parser'),
	LocalStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose'),
	User = require('./models/user');


mongoose.connect('mongodb://localhost/auth_demo_app');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('express-session')({
	secret: 'decode session',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

// =====
// Routes
// =====

app.get('/', function (req, res) {
	res.render('home');
});

//show form
app.get('/register', function (req, res) {
	res.render('register');
});

//handle user signup
app.post('/register', function (req, res) {
	req.body.username
	req.body.password
	User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
		if(err){
			console.log(err);
			return res.render('/register');
		}
		passport.authenticate('local')(req, res, function () {
			res.redirect('/secret');
		});
	});
});

app.get('/secret', function (req, res) {
	console.log('viewing secret route');
	res.render('secret');
});

// LOGIN ROUTES

app.get('/login', function (req, res) {
	res.render('login');
});

// LOGIN LOGIC
app.post('/login', passport.authenticate('local', {
	successRedirect: '/secret',
	failureRedirect: '/login'
}), function (req, res) {
});

app.listen(3000, function () {
	console.log('Server Started');
});