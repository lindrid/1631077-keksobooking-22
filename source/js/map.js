/* global L */

import {getRandomIntegers} from './util.js';
import {setAddress as setAdFormAddress} from './form.js';
import {isOfferMatchedToFilter} from './offer.js';

const MAIN_PIN_ICON_URL = './img/main-pin.svg';
const PIN_ICON_URL = './img/pin.svg';
const ICON_X_SIZE = 52;
const ICON_Y_SIZE = 52;
const LAYER_URL_TEMPLATE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'; 
const LAYER_COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

class Map {
  constructor (elementId) {
    this.markers = new Array(0);
    this.mainPinIcon = L.icon({
      iconUrl: MAIN_PIN_ICON_URL,
      iconSize: [ICON_X_SIZE, ICON_Y_SIZE],
      iconAnchor: [ICON_X_SIZE / 2, ICON_Y_SIZE],
    });
    this.pinIcon = L.icon({
      iconUrl: PIN_ICON_URL,
      iconSize: [ICON_X_SIZE, ICON_Y_SIZE],
      iconAnchor: [ICON_X_SIZE / 2, ICON_Y_SIZE],
    });

    this.map = L.map(elementId);
    
    L.tileLayer(
      LAYER_URL_TEMPLATE,
      {
        attribution: LAYER_COPYRIGHT,
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
    this.marker = L.marker(
      {
        lat: point.LATITUDE, 
        lng: point.LONGITUDE,
      },
      {
        draggable: true,
        icon: this.mainPinIcon,
      },
    ).on('drag', (evt) => {
      const {lat, lng} = evt.target.getLatLng();
      setAdFormAddress(lat.toFixed(5), lng.toFixed(5));
    });
    
    this.marker.addTo(this.map);
  }

  moveMainMarkerTo(point) {
    this.marker.setLatLng(L.latLng(point.LATITUDE, point.LONGITUDE));
    setAdFormAddress(point.LATITUDE, point.LONGITUDE);
  }

  createMarkers (objects, popups) {
    this.objects = objects;
  
    objects.forEach((object, index) => {
      const location = object.location;
      const marker = L.marker(
        {
          lat: location.lat, 
          lng: location.lng,
        },
        {
          icon: this.pinIcon,
        },
      );
      marker.bindPopup(popups.elements[index], {
        minWidth: popups.width,
        maxHeight: popups.height,
      });
      const key = `${location.lat},${location.lng}`;
      this.markers[key] = marker;
    });
  }

  drawMarkers (quantity) {
    this.maxMarkersToDraw = quantity;
    const objects = this.objects.slice(0, quantity);
    const thisMap = this;
    objects.forEach((object) => {
      const marker = thisMap.getMarkerBy(object);
      marker.addTo(thisMap.map);
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

  redrawMarkers(formData) {
    let filterControls = [];
  
    for (let pair of formData.entries()) {
      filterControls.push({
        name: pair[0],
        value: pair[1],
      });
    }
  
    let i = 1;
    let allMarkersAreShown = false;
    for (let object of this.objects) {
      const marker = this.getMarkerBy(object);
  
      if (!marker) {
        continue;
      }
      
      if (marker.isPopupOpen()) {
        marker.closePopup();
      }

      this.hideMarker(marker);
  
      const offer = object.offer;
  
      if (isOfferMatchedToFilter(offer, filterControls)) {
        if (!allMarkersAreShown) {
          this.showMarker(marker);
          if (i === this.maxMarkersToDraw) {
            allMarkersAreShown = true;
          }
          i++;
        }
      }
    }
  }
}

export {Map};