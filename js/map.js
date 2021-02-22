import {setAddress as setFormAddress} from './form.js';

class Map {
  #map;
  #mainMarker;
  markers = new Array(0);

  mainPinIcon = L.icon({
    iconUrl: './img/main-pin.svg',
    iconSize: [52, 52],
    iconAnchor: [26, 52],
  });
  pinIcon = L.icon({
    iconUrl: './img/pin.svg',
    iconSize: [52, 52],
    iconAnchor: [26, 52],
  });

  constructor (elementId) {
    this.map = L.map(elementId);
    
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    ).addTo(this.map);
  }

  onLoad = function (toDoOnLoad) {
    this.map.on('load', toDoOnLoad);
  }

  setView = function (point, scale) {
    this.map.setView({
      lat: point.LATITUDE, 
      lng: point.LONGITUDE
    }, scale);
  }

  addMainMarker = function (point) {
    const marker = L.marker(
      {
        lat: point.LATITUDE, 
        lng: point.LONGITUDE
      },
      {
        draggable: true,
        icon: this.mainPinIcon
      }
    ).on('moveend', (evt) => {
      const {lat, lng} = evt.target.getLatLng();
      setFormAddress(lat.toFixed(5), lng.toFixed(5));
    });
    
    marker.addTo(this.map);
  }

  addMarkers = function (objects) {
    objects.forEach((object) => {
      const location = object.location;
      const marker = L.marker(
        {
          lat: location.x, 
          lng: location.y
        },
        {
          icon: this.pinIcon
        }
      );
      marker.addTo(this.map);
      this.markers.push(marker);
    });
  }

  setMarkersPopups = function (popupElements, minWidth, maxHeight) {
    for (let i = 0; i < popupElements.length; i++) {
      this.markers[i].bindPopup(popupElements[i], {
        minWidth: minWidth,
        maxHeight: maxHeight
      });
    }
  }
}

export {Map};