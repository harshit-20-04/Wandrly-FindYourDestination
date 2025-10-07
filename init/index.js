const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data");

main().then(() => {
    console.log("connected was established");
})
    .catch((err) => {
        console.log("Error occured");
    })

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/homigo")
}

const initDB = async () => {
    await Listing.deleteMany({});

    const updatedData = initData.data.map((obj) => ({
        ...obj,
        owner: "68ca8d3b4a36338b202046ca",
    }));

    await Listing.insertMany(updatedData);

    console.log("Data has been initialized");
}
initDB();