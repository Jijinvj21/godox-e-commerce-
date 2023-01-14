
function adminSession(req,res,next){
    if(req.session.email){
        next()
    }
    else{
        res.redirect('/adminlogin')
    }
}
function withOutAdminSession(req,res,next){
    if(!req.session.email){
        next()
    }
    else{
        res.redirect('/admindashboard')
    }
}
module.exports={ 
    adminSession,
    withOutAdminSession
}