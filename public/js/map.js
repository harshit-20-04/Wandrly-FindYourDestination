var map = L.map('map').setView([coordinates.lat ,  coordinates.lon ], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([coordinates.lat ,  coordinates.lon]).addTo(map)
  .bindPopup(
    `<h5>${listing.title}</h5>`+
    coordinates.display_name+"<br>"+
    "Exact Location will be display after Booking."
  )
  .openPopup();


map.on("click", function(e) {
  console.log(e);
  L.popup()
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
});