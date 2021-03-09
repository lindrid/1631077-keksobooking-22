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
    this.marker = window.L.marker(
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
    
    this.marker.addTo(this.map);
  }

  moveMainMarkerTo(point) {
    this.marker.setLatLng(window.L.latLng(point.LATITUDE, point.LONGITUDE));
    setFormAddress(point.LATITUDE, point.LONGITUDE);
  }

  addMarkers (objects, popups) {
    objects.forEach((object, index) => {
      const location = object.location;
      const marker = window.L.marker(
        {
          lat: location.lat, 
          lng: location.lng,
        },
        {
          icon: this.pinIcon,
        },
      );
      marker.addTo(this.map);
      marker.bindPopup(popups.elements[index], {
        minWidth: popups.width,
        maxHeight: popups.height,
      });
      const key = `${location.lat},${location.lng}`;
      this.markers[key] = marker;
    });
  }

  getMarkerBy (object) {
    const location = object.location;
    const key = `${location.lat},${location.lng}`;
    if (key in this.markers) {
      return this.markers[key];
    }
    return null;
  }

  hideMarker (marker) {
    marker.remove();
  }

  showMarker (marker) {
    marker.addTo(this.map);
  }

  setMarkersPopups (popupElements, minWidth, maxHeight) {
    let i = 0;
    this.markers.forEach((marker) => {
      marker.bindPopup(popupElements[i], {
        minWidth: minWidth,
        maxHeight: maxHeight,
      });
      i++;
    });
  }
}

export {Map};