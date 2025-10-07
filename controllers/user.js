const User = require("../models/user.js");

module.exports.signup = (req, res)=>{
    res.render("users/signup");
}

module.exports.createUser = async(req, res, next)=>{
    try{
        let {username, password, email} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err)=>{
            if (err){
                return next(err);
            }
            req.flash("success", "Signed Up Successfully");
            res.redirect("/listings");
        })
        
    }catch(error){
        req.flash("error", error.message);
        res.redirect("signup");
    }
}

module.exports.login = (req, res)=>{
    res.render("users/login.ejs");
}

module.exports.loginUser = async(req, res)=>{
    req.flash("success", "Welcome Back, Login sucessfully");
    if (res.locals.redirectUrl){
    res.redirect(res.locals.redirectUrl);
    }else{
        res.redirect("/listings");
    }
}

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success", "You are logged out");
            res.redirect("/listings");
        }
    });
}