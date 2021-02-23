import {setAddress as setFormAddress} from './form.js';

class Map {
  constructor (elementId) {
    this.markers = new Array(0);
    this.mainPinIcon = window.L.icon({
      iconUrl: './img/main-pin.svg',
      iconSize: [52, 52],
      iconAnchor: [26, 52],
    });
    this.pinIcon = window.L.icon({
      iconUrl: './img/pin.svg',
      iconSize: [52, 52],
      iconAnchor: [26, 52],
    });

    this.map = window.L.map(elementId);
    
    window.L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    ).addTo(this.map);
  }

  onLoad (toDoOnLoad) {
    this.map.on('load', toDoOnLoad);
  }

  setView (point, scale) {
    this.map.setView({
      lat: point.LATITUDE, 
      lng: point.LONGITUDE,
    }, scale);
  }

  addMainMarker (point) {
    const marker = window.L.marker(
      {
        lat: point.LATITUDE, 
        lng: point.LONGITUDE,
      },
      {
        draggable: true,
        icon: this.mainPinIcon,
      },
    ).on('moveend', (evt) => {
      const {lat, lng} = evt.target.getLatLng();
      setFormAddress(lat.toFixed(5), lng.toFixed(5));
    });
    
    marker.addTo(this.map);
  }

  addMarkers (objects) {
    objects.forEach((object) => {
      const location = object.location;
      const marker = window.L.marker(
        {
          lat: location.x, 
          lng: location.y,
        },
        {
          icon: this.pinIcon,
        },
      );
      marker.addTo(this.map);
      this.markers.push(marker);
    });
  }

  setMarkersPopups (popupElements, minWidth, maxHeight) {
    for (let i = 0; i < popupElements.length; i++) {
      this.markers[i].bindPopup(popupElements[i], {
        minWidth: minWidth,
        maxHeight: maxHeight,
      });
    }
  }
}

export {Map};