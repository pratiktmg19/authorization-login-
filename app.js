const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');  

const app = express();

//passport config
require('./config/passport')(passport);

 
//mongo db config
const db = require('./config/keys').MongouRI;

//conncet db
mongoose.connect(db,{useNewUrlParser:true, useUnifiedTopology:true})
    .then(()=>console.log("db connceted..."))
    .catch((err) => console.log(err));

//middleware 
app.use(expressLayouts);
app.set('view engine', 'ejs');

//body parser
app.use(express.urlencoded({extended:true}))

//express sesssion
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
   
  }));
 
//passport middleware
app.use(passport.initialize());
app.use(passport.session());  

//conncet falsh
app.use(flash());

//global vars
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//index module
app.use('/', require('./routes/index'));

// users module
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`listenning at port ${PORT}`));
