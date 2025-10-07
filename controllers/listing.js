const Listing = require("../models/listing");
const axios = require("axios")

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = async (req, res) => {
    await res.render("listings/form");
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let listing = new Listing(req.body.listing);
    listing.image.url = url;
    listing.image.filename = filename;
    listing.owner = req.user._id;
    await Listing.insertOne(listing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({ path: "review", populate: { path: "author", model: "User" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Requested Listing does not exists!");
        res.redirect("/listings");
    } else {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: `${listing.location}, ${listing.country}`,
                format: "json",
                addressdetails: 1,
                limit: 1,
            },
            headers: { "User-Agent": "wandrly(h123a1@gmail.com)" }
        });
        let coordinates = null;
        if (response.data.length > 0) {
            coordinates = {
                lat: response.data[0].lat,
                lon: response.data[0].lon,
                display_name: response.data[0].display_name
        };
        }
        res.render("listings/listings", { listing, coordinates });
    }
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Requested Listing does not exists!");
        res.redirect("/listings");
    } else {
        let originalImageUrl = listing.image.url;
        originalImageUrl.replace("/upload", "/upload/w_250");
        res.render("listings/editForm", { listing }, originalImageUrl);
    }
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params
    let updateListing = req.body.listing;

    await Listing.findByIdAndUpdate(id, updateListing);
    if (typeof req.file !== undefined) {
        let url = req.file.url;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Updated Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Deleted Successfully!");
    res.redirect("/listings");
}

module.exports.searchLocation = async (req, res) => {
    let {q} =  req.params;
    let all_Listings = await Listing.find({});
    let allListings = [];
    for (let listing of all_Listings){
        if (listing.location == q || listing.country == q){
            allListings.push(listing);
        }
    }
    if (allListings.length > 0){
        res.render("listings/index", {allListings});
    }
    else{
        req.flash("error", "NO Such Destination Found");
        res.redirect("/listings");
    }
}