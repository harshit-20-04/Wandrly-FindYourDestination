const ExpressError = require("./utils/ExpressError");
const {listingSchema, reviewSchema} = require("./schema");
const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", 'You must be logged in.');
        res.redirect("/users/login");
    }
    else{
        next();
    }
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.hasAccess = async(req, res, next)=>{
    let {id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You don't have access.");
    }
    next();
}

module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        console.log("error in vlidation");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if (error){
        let errMsg = error.details.map((e)=> e.message).join(",");
        console.log("error in vlidation");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next)=>{
    let { id ,reviewid } = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You don't have access.");
    }
    next();
}