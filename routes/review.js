const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const review = require("../models/review");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review");

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview)); 

router.delete("/:reviewid", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router; 