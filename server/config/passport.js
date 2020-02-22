var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

const key=require('./key')
const User=require('../models/user')
const express =require ('express');


passport.serializeUser((user, done)=> {
  done(null, user.id);
});


passport.deserializeUser((id, done)=> {
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


passport.use(new LinkedInStrategy({
  callbackURL: '/auth/linkedin/callback',
  //callbackURL='https://naukrichakri.herokuapp.com/auth/linkedin/callback',
    clientID: key.linkedin.clientID,
    clientSecret: key.linkedin.clientSecret,
    scope: ['r_emailaddress', 'r_liteprofile'],
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline'],
    
  },(accessToken,refreshToken,profile,done)=>{
    User.findOne({googleid:profile.id}).then((currentUser)=>{
      if(currentUser){
        done(null,currentUser)
      }
      else{
          var user = new User();
          user.googleid=profile.id;
          user.userName=profile.displayName;
          user.email=profile.emails[0].value;
          user.firstName=profile.name.givenName;
          user.lastName=profile.name.familyName;
          user.photoUrl="NA"
          user.save().then((newUser)=>{
          console.log(newUser);
          done(null,newUser)
      } 
      );
      }
    });
  }
));






module.exports=passport;