const review = require("../models/review");
const Listing = require("../models/listing.js");

module.exports.createReview=async(req, res, next)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async(req, res)=>{
    let {id, reviewid} = req.params;
    await review.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id, {$pull:{review: reviewid}});
    res.redirect(`/listings/${id}`);
}