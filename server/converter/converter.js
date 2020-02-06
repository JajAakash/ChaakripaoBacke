function capitalize(word){
    return word.charAt(0).toUpperCase()+word.slice(1).toLowerCase()
    
};

// function verifyUser(req, res, next){
//     const bearerHeader= req.Header['authorization'];
//     if(typeof bearerHeader !== 'undefined'){
//         const bearer= bearerHeader.split(' ')
//         const bearerToken=bearer[1];
//         req.token= bearerToken
//     }
//     else{
//         res.sendStatus(403);
//     }
// }


module.exports=capitalize;
//module.exports=verifyUser;