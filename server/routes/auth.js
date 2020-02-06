var passport = require('passport');
var User=require('../models/user')
const express =require ('express');
const router =express.Router();
const jwt=require('jsonwebtoken')
  

// router.get('/google',passport.authenticate('google',{
    
//     scope:[
        
//         'https://www.googleapis.com/auth/plus.login',
//         'https://www.googleapis.com/auth/userinfo.email'
//         //'profile'
//     ]
// }));

// router.get('/google/callback',passport.authenticate('google'),(req,res)=>{
//     res.redirect(('/profile'));
// });


// router.get("/logout", function(req, res , next) {
//     var refURL = 'http://localhost:4200/sign-in';
//     req.logout();
//     res.redirect(refURL);
// });

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