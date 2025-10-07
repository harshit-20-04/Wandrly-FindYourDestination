const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../controllers/listing");
const {isLoggedIn, hasAccess, validateListing} = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, validateListing, upload.single("listing[image]"), wrapAsync(listingController.createListing));

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.patch(isLoggedIn, hasAccess, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, hasAccess, wrapAsync(listingController.destroyListing));

router.get("/:id/edit", isLoggedIn, hasAccess, wrapAsync(listingController.editListing));

module.exports = router;