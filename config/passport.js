 const LocalStrategy = require('passport-local').Strategy;
 const mongoose = require('mongoose');
 const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField:'email'}, 
    function(email, password, done){
        User.findOne({email:email})
        .then(user =>{
            if(!user){
                return done(null, false, {message:"email not registered"});
            }

            //match password with the hashed passwrod
            bcrypt.compare(password, user.password, (err, isMatch)=>{
                if(err) throw err;

                if(isMatch){
                    return done(null, user);
                }
                else{
                    return done(null, false, {message:"password incorrect"});
                }
            });

        })
        .catch(err => console.log(err)); 
        })
    );

  
}
