const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helper')(app);
const cors = require('cors');
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000, ()=> {
    console.log('chatServer is listening on port 5000');
});

const path = require('path');

if (env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path , 'scss'),
        dest: path.join(__dirname, env.asset_path , 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }))
};


// app.use(express.urlencoded());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static(env.asset_path));
//make the upload path available to browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
// Extract styles and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


app.set('view engine', 'ejs');
app.set('views', './views');

//Use mongo store the session cookies in db
app.use(session({
    name: 'Faceloop',
    // TODO change the secret before deployment
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore (
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function (err) {
            console.log(err || "connect-mobgodb setup ok");
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport-local-strategy')

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash)

app.use('/', require('./routes'));

app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    };

    console.log(`Server is up and running on port: ${port}`);
});