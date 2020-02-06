const express =require ('express');
const router =express.Router();
const mongoose=require('mongoose')
const Jobs=require('../models/jobs');

const url="mongodb://admin:admin123@ds257551.mlab.com:57551/byjusjobs"
mongoose.Promise=global.Promise;

mongoose.connect(url,function(err){
    if(err){
        console.log("Error !!!"+err);
    }
});

router.get('/jobs',function(req,res){
    console.log('finding all jobsss for u');
    Jobs.find({}).exec(function(err,jobs){
        if(err){
            console.log("Error fetching while jobs")
        }else{
            res.json(jobs)
        }
    })
});


router.get('/jobs/:id',function(req,res){
    console.log('finding all jobs for u');
    Jobs.findById(req.params.id).exec(function(err,jobs){
        if(err){
            console.log("error while fetching your jobs")
        }else{
            res.json(jobs)
        }
    })
});


router.get('/jobsin/:location',function(req,res){
    Jobs.find({location:req.params.location}).exec(function(err,jobs){
        if(err){
            console.log("error while fetching your job Details")
        }else{
            res.json(jobs)
        }
    })
});

router.get('/jobsin/:location',function(req,res){
    console.log('finding all jobs for5 u');
    Jobs.find({location:req.params.location}).exec(function(err,jobs){
        if(err){
            console.log("error while fetching your job Details")
        }else{
            res.json(jobs)
        }
    })
});


router.get('/jobs-for/:skills',function(req,res){
    console.log('finding all jobs 4 u');
    Jobs.find({skills:req.params.skills}).exec(function(err,jobs){
        if(err){
            console.log("error while fetching your job Details")
        }else{
            //console.log(jobs.companyname)
            res.json(jobs)
        }
    })
});

//double Parameter
router.get('/jobs/:skills/:location',function(req,res){
    console.log('finding all jobs for78 u');
    Jobs.find({ $and: [ { location: req.params.location}, { skills: req.params.skills  } ] }).exec(function(err,jobs){
        if(err){
            console.log("error while fetching your job Details")
        }else{
            res.json(jobs)
        }
    })
});

//all params
router.get('/jobs/:skills/:location/:experience',function(req,res){
    var exp=parseInt(req.params.experience)
    // if(req.params.location=="Bengaluru/Bangalore"){
    //     req.params.location="Bangalore"
    // }
    console.log('finding all jobs for78 u');
    Jobs.find({ $and: [ { location: req.params.location}, { skills: req.params.skills},{$or: [{experience:{$lt:exp}},{ experience: exp }]}]}).exec(function(err,jobs){
        if(err){
            console.log("error while fetching your job Details")
        }else{
            res.json(jobs)
        }
    })
});


router.get('/jobs-experience/:experience',function(req,res){
    var exp=parseInt(req.params.experience)
    console.log('finding all jobs 3 u',req.params.experience);
    
    Jobs.find({ $and: [ { maxExp: { $gte:exp  } }, { minExp: { $lte:exp  } }] }).exec(function(err,jobs){
        if(err){
            console.log("error while fetching your job Details",err)
        }else{
            res.json(jobs)
        }
    })
});

// // Jobs.aggregate([
// //     { $project: 
// //         {
// //             exp1:{$lt:[exp, { $max: "$experience"}]} 
// //         } 
// //     }
// //  ])




// router.get('/jobs-experience/:experience',function(req,res){
//     var exp=parseInt(req.params.experience)
//     console.log('finding all jobs 345 u',req.params.experience,exp);
    
//     Jobs.find
//     (
//         { $and: [ { maxExp: { $gte:exp  } }, { minExp: { $lte:exp  } }] }
//         //{experience: exp }
//         // { exp: { $eq: maxExp } }

//     ).exec(function(err,jobs){
//         if(err){
//             console.log("error while fetching your job Details",err)
//         }else{
//             res.json(jobs)
//         }
//     })
// });




router.post('/job/listed',function(req,res){
    
    var postJob = new Jobs();
    postJob.title=req.body.title;
    postJob.applylink=req.body.applylink;
    postJob.jd=req.body.jd;
    postJob.companyname=req.body.companyname;
    postJob.location=req.body.location;
    postJob.experience=req.body.experience;
    postJob.salary=req.body.salary;
    postJob.type=req.body.type;
    postJob.skills=req.body.skills;
    postJob.startdate=req.body.startdate;
    postJob.enddate=req.body.enddate;
    postJob.created=Date.now();
    postJob.source=req.body.source;
    postJob.maxExp=req.body.experience[1];
    postJob.minExp=req.body.experience[0];
    postJob.experience=req.body.experience;
    console.log("222222222222222",postJob.experience,postJob.maxExp,postJob.minExp)
    
    postJob.save(function(err,postedJob){
        console.log("99999999");
        if(err){
            console.log(err,"Error saving Jobs")
        }
        else{
            res.json(postedJob)
        }
    });

});


module.exports = router;