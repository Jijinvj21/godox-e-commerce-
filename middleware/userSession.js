
const userSession=(req,res,next)=>{
    if(req.session.userEmail){// req.session.userEmail
        next()
    }
    else{
        res.redirect('/userlogin')
    }
}
function noSession(req,res,next){
    if(!req.session.userEmail){
        next()
    }
    else{
        res.redirect('/')
    }
}
module.exports={
    userSession,
    noSession
}
