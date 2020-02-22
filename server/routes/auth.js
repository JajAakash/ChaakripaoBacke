var passport = require('passport');
var User=require('../models/user')
const express =require ('express');
const router =express.Router();
const jwt=require('jsonwebtoken')

var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

// --------------------LINKEDIN-----------------
router.get('/linkedin',
passport.authenticate('linkedin', { state: 'SOME STATE'  }),
function(req, res){

});


router.get('/linkedin/callback', passport.authenticate('linkedin'),(req,res)=> {
    // successRedirect: 'http://localhost:4200/',
    // failureRedirect: '/login'
    let payload={subject: req.body.id}
    console.log(payload,req.body.id)
    let token=jwt.sign(payload, 'secretkey')
    console.log(token)
    res.send(token);
});



router.post('/login',function(req,res){
    User.findOne({googleid:req.body.id}).then((currentUser)=>{
        if(currentUser){
            let payload={subject: req.body.id}
            let token=jwt.sign(payload, 'secretkey')
          res.json(token)
        }
        else{
          var user = new User();
          user.googleid=req.body.id;
          user.userName=req.body.name;
          user.email=req.body.email;
          user.photoUrl=req.body.photoUrl;
          user.firstName=req.body.firstName;
          user.lastName=req.body.lastName;
        user.save(function(err,newUser){
            if(err){
                console.log(err,"Error saving Jobs")
            }
            else{
                //jwt;
                let payload={subject: req.body.id}
                let token=jwt.sign(payload, 'secretkey')
                res.json(token)
            }
        });
        }
      }
)})

module.exports=router