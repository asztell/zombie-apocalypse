//node modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
// var passport = require('passport');
var methodOverride = require('method-override');
// var session = require('express-session');
var exphbs = require('express-handlebars');

var routes = require('./routes/routes.js');
var auth = require('./routes/auth.js');
var signup = require('./routes/signup.js');
var users = require('./routes/users.js');
var controller = require('./controllers/controller.js');

//express setup
var app = express();

//sets up express to serve static files
app.use(express.static(process.cwd() + '/public'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: false
}));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// app.use(session({
//   secret: 'anything',
//   resave: false,
//   saveUninitialized: false
// }));

require('./config/passport')(app);


app.use('/', routes);
app.use('/auth', auth);
app.use('/signup', signup);
app.use('/users', users);
app.use('/controller', controller)

// var port = process.env.PORT || 3000;
// app.listen(port);
module.exports = app;