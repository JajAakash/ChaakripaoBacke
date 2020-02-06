const express=require('express');

const bodyParser=require('body-parser');

const path=require('path');

const api=require('./server/routes/api');

const port =5000;

const app=express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


app.use(express.static(path.join(__dirname,'dist')));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/byjusjobs',api);

app.get('*',(req,res)=>{
    res.sendfile(path.join(__dirname,'dist'));

});

app.listen(port,function(){
    console.log("server running on port:" + port)

});

