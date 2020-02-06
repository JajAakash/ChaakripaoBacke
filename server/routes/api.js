var capitalizecase= require('../converter/converter')
//var verifyUser= require('../converter/converter')
const jwt=require('jsonwebtoken')

const express =require ('express');
const router =express.Router();
const mongoose=require('mongoose')
const Jobs=require('../models/jobs');
const passport=require('../config/passport')
const key=require('../config/key')

const url=key.mongodb.dbURI;
mongoose.Promise=global.Promise;

mongoose.connect(url,function(err){
    if(err){
        console.log("Error !!!"+err);
    }
});




router.get('/jobs',(req,res)=>{
        Jobs.find({}).exec(function(err,jobs){
        if(err){
            console.log("Error fetching while jobs")
        }else{
            res.json(jobs)
        }
    })
    
});

router.get('/jobs/:id',verifyUser,(req,res)=>{
    jwt.verify(req.token , 'secretkey' ,(err,authData)=>{
    Jobs.findById(req.params.id).exec(function(err,jobs){
        if(err){
            console.log("error while fetching your jobs")
        }else{
            res.json(jobs)
        }
    })})
});

router.get('/jobsin/:location',verifyUser,(req,res)=>{

    Jobs.find({location:capitalizecase(req.params.location.trim())}).exec(function(err,jobs){
        if(err){
            console.log("error while fetching your job Details")
        }else{
            res.json(jobs)
        }
    })
});

router.get('/jobs-for/:skills',verifyUser,function(req,res){
    Jobs.find({skills:capitalizecase(req.params.skills.trim())}).exec(function(err,jobs){
        if(err){
            console.log("error while fetching your job Details")
        }else{
            res.json(jobs);
        }
    })
});

//double Parameter
router.get('/jobs/:skills/:location',verifyUser,function(req,res){
    Jobs.find({ $and: [ { location:capitalizecase(req.params.location.trim())}, { skills: capitalizecase(req.params.skills.trim())} ] }).exec(function(err,jobs){
        if(err){
            console.log("error while fetching your job Details")
        }else{
            res.json(jobs);
        }
    })
});

//location Experience
router.get('/exp/loc/:experience/:location',verifyUser,function(req,res){
    var exp=parseInt(req.params.experience)
    Jobs.find({ $and: [ { location:capitalizecase(req.params.location.trim())},{$or: [{experience:{$lt:exp}},{ experience: exp }]}] }).exec(function(err,jobs){
        if(err){
            console.log("error while fetching your job Details")
        }else{
            res.json(jobs);
        }
    })
});

//user input skill + experience
router.get('/skill/exp/:experience/:skills',verifyUser,function(req,res){
    var exp=parseInt(req.params.experience)
    
    Jobs.find({ $and: [{ skills: capitalizecase(req.params.skills.trim())},{$or: [{experience:{$lt:exp}},{ experience: exp }]} ] }).exec(function(err,jobs){
        if(err){
            console.log("error while fetching your job Details")
        }else{
            res.json(jobs);
        }
    })
});

//all params
router.get('/jobs/:skills/:location/:experience',verifyUser,function(req,res){
    var exp=parseInt(req.params.experience)
    Jobs.find({ $and: [ { location: capitalizecase(req.params.location.trim())}, { skills: capitalizecase(req.params.skills.trim())},{$or: [{experience:{$lt:exp}},{ experience: exp }]}]}).exec(function(err,jobs){
        if(err){
            console.log("error while fetching your job Details")
        }else{
            res.json(jobs)
        }
    })
});

router.get('/jobs-experience/:experience',verifyUser,function(req,res){
    var exp=parseInt(req.params.experience)
    
    Jobs.find({ $and: [ { maxExp: { $gte:exp  } }, { minExp: { $lte:exp  } }] }).exec(function(err,jobs){
        if(err){
            console.log("error while fetching your job Details",err)
        }else{
            res.json(jobs)
        }
    })
});

router.post('/job/listed',verifyUser,function(req,res){
    
    var postJob = new Jobs();
    postJob.title=capitalizecase(req.body.title);
    postJob.applylink=req.body.applylink;
    postJob.jd=req.body.jd;
    postJob.companyname=capitalizecase(req.body.companyname);
    postJob.experience=req.body.experience;
    postJob.type=req.body.type;
    for(skill of req.body.skills){
        postJob.skills.push(capitalizecase(skill))
    }
    postJob.startdate=req.body.startdate;
    postJob.enddate=req.body.enddate;
    postJob.created=Date.now();

    
    if(capitalizecase(req.body.location)=="Bangalore"){
        postJob.location="Bengaluru"
    }
    else{
        postJob.location=capitalizecase(req.body.location)
    }


    if(req.body.salary===""){
        postJob.salary="Not specified"
    }
    else{postJob.salary=req.body.salary; 
    }

    if(req.body.source===""){
        postJob.source="Not specified"
    }
    else
    {
        postJob.source=req.body.source;
    }
    postJob.maxExp=req.body.experience[1];
    postJob.minExp=req.body.experience[0];
    postJob.experience=req.body.experience;
    
    postJob.save(function(err,postedJob){
        if(err){
            console.log(err,"Error saving Jobs")
        }
        else{
            res.json(postedJob)
        }
    });

});

router.get('/google',passport.authenticate('google',{
    
    scope:[
        
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/userinfo.email'
        //'profile'
    ]
}));

router.get('/google/callback',passport.authenticate('google'),(req,res)=>{
    res.send(req.user);
});

function verifyUser(req, res, next){
    if(! req.headers.authorization){
        return res.status(401).send('unauthorized request')
    }
    let token =req.headers.authorization.split(' ')[1]

    if(token==='null'){
        return res.status(401).send('unauthorized request')
    }
    console.log("tokennnn", token, typeof token)
    let payload=jwt.verify(token, 'secretkey')

    if(! payload){
        return res.status(401).send('unauthorized request')   
    }

    req.userId=payload.subject
    next();
}

module.exports = router;

