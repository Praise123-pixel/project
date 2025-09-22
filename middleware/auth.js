// ensure the user is aunthenticated
exports.ensureaunthenticated = (req,res,next)=>{
    if(req.session.user){
        return next()
    }
    res.redirect('/login')
};

// ensure user is a salesagent
exports.ensureAgent = (req,res,next)=>{
    if(req.session.user && req.session.user.role==="salesAgent"){
        return next()
    }
    res.redirect('/')
};

// ensure user is a manager
exports.ensureManager = (req,res,next)=>{
    if(req.session.user && req.session.user.role==="manager"){
        return next()
    }
    res.redirect('/')
};