Template.locations.onCreated(function() {
  this.subscribe('locations');

  GoogleMaps.load();
  GoogleMaps.ready('map', (map) => {

    Locations.find().forEach((location) => {
      let hi = new google.maps.Marker({
        position: new google.maps.LatLng(location.lat, location.lng),
        map: map.instance
      });
    });
  });
});

Template.locations.helpers({
  mapOptions: () => {
    let latLng = LocationManager.currentLocation();
    if (GoogleMaps.loaded() && latLng) {
      return {
        center: new google.maps.LatLng(latLng.lat, latLng.lng),
        zoom: 17
      };
    }
  }
});

