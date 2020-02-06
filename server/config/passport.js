var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const key=require('./key')
const User=require('../models/user')
const express =require ('express');


passport.serializeUser((user, done)=> {
  console.log("serial----------------",user,user.id);
  done(null, user.id);
});


passport.deserializeUser((id, done)=> {
  console.log("user====",id);
  User.findById(id).then((user)=>{
    done(null, user.id);
  })
});


passport.use(new GoogleStrategy({
  callbackURL: '/auth/google/callback',
    clientID: key.google.clientID,
    clientSecret: key.google.clientSecret,
    
  },(accessToken,refreshToken,profile,done)=>{
    User.findOne({googleid:profile.id}).then((currentUser)=>{
      console.log(currentUser+"user already exists")
      if(currentUser){
        console.log(currentUser+"user already exists")
        done(null,currentUser)
      }
      else{
        console.log("profile is", profile)
        var user = new User();
        user.googleid=profile.id;
        user.userName=profile.displayName;
        user.save().then((newUser)=>{
        console.log("user created"+ newUser)
        done(null,newUser)
        });
      }
    });
  }
));


module.exports=passport;