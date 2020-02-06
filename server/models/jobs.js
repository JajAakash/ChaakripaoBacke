const mongoose=require('mongoose')

const Schema=mongoose.Schema;

const jobSchema=new Schema({
    title:String,
    applylink:String,
    jd:String,
    companyname:String,
    location:String,
    experience:[],
    salary:String,
    type:String,
    skills:[],
    startdate:Date,
    enddate:Date,
    created:Date,
    source:String,
    maxExp:Number,
    minExp:Number
})

module.exports=mongoose.model('jobs',jobSchema,'BYJUSJOBS')