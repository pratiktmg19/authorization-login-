const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const passport = require('passport'); 

//for login page
router.get('/login', (req, res)=>{
    res.render('login');
});

//for register page
router.get('/register', (req, res)=>{
    res.render('register');
});

router.post('/register', (req, res) =>{
    const { name, email, password, password2} = req.body;

    let errors =[];
    if(!name || !email || !password || !password2){
        errors.push({msg:"insert all the required fields"})
    }
    
    if(password != password2){
        errors.push({msg:"password do not match"})
    }

    if(password.length < 6){
        errors.push({msg:'password should be atleast 6 char long'})
    }

    if(errors.length > 0){
        //while rendering we can also pass  some values with it
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        //validation passed
        User.findOne({email: email}) //if email already exist
        
        .then(user => {
                if(user){
                    errors.push({msg:"email already exists"});
                    res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2

                    });
                  } 
                else{
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                  
                  
                    //hash password
                    //fist generate salt(random bytes) and make it hash
                    //10 is the bcrypt deault round value
                    bcrypt.genSalt(5,(err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        if(err) throw err;
                        newUser.password = hash;
                       
                        newUser.save()
                        .then(user =>{
                            req.flash('success_msg', 'you are now successfully registered and can login')
                            res.redirect('login');
                        })
                        .catch((err) => console.log(err));
                    })) 
                    
                  }
                });
            }
        });

        //login
router.post('/login', (req, res, next)=>{
    //accept the inputs
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
   
});         

router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg', "You are logged out");
    res.redirect('/users/login');

});
module.exports = router; 