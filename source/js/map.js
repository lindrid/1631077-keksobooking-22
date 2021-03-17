/* global L */

import {setAddress as setAdFormAddress} from './form.js';

class Map {
  constructor (elementId) {
    this.markers = new Array(0);
    this.mainPinIcon = L.icon({
      iconUrl: './img/main-pin.svg',
      iconSize: [52, 52],
      iconAnchor: [26, 52],
    });
    this.pinIcon = L.icon({
      iconUrl: './img/pin.svg',
      iconSize: [52, 52],
      iconAnchor: [26, 52],
    });

    this.map = L.map(elementId);
    
    L.tileLayer(
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
    this.marker = L.marker(
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
      setAdFormAddress(lat.toFixed(5), lng.toFixed(5));
    });
    
    this.marker.addTo(this.map);
  }

  moveMainMarkerTo(point) {
    this.marker.setLatLng(L.latLng(point.LATITUDE, point.LONGITUDE));
    setAdFormAddress(point.LATITUDE, point.LONGITUDE);
  }

  addMarkers (objects, popups) {
    if (!this.objects) {
      this.objects = objects;
    }
    else {
      // merge array without duplicates
      this.objects = [...new Set([...this.objects, ...objects])];
    }
  
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

  redrawMarkers(formData) {
    let controls = [];
  
    for (let pair of formData.entries()) {
      controls.push({
        name: pair[0],
        value: pair[1],
      });
    }
  
    for (let i = 0; i < this.objects.length; i++) {
      const object = this.objects[i];
      const marker = this.getMarkerBy(object);
  
      if (!marker) {
        return;
      }
      
      if (marker.isPopupOpen()) {
        marker.closePopup();
      }
  
      const offer = object.offer;
      const offerValues = {
        'housing-type': offer.type.toString(), 
        'housing-price': offer.price.toString(), 
        'housing-rooms': offer.rooms.toString(), 
        'housing-guests': offer.guests.toString(),
      };
      let isOfferEqualToControl = true;
      
      for (let control of controls) {
        if (['housing-type', 'housing-rooms', 'housing-guests'].includes(control.name)) {
          if (control.value !== 'any' && control.value !== offerValues[control.name]) {
            isOfferEqualToControl = false;
            break;
          }
        }
        else if (control.name === 'housing-price') {
          switch (control.value) {
            case 'low':
              if (offerValues[control.name] > 10000) {
                isOfferEqualToControl = false;
              }
              break;
            case 'middle':
              if (offerValues[control.name] <= 10000 || offerValues[control.name] > 50000) {
                isOfferEqualToControl = false;
              }
              break;
            case 'high':
              if (offerValues[control.name] <= 50000) {
                isOfferEqualToControl = false;
              }
              break;
          }
          if (!isOfferEqualToControl) {
            break;
          }
        }
        else {
          if (!offer.features.includes(control.value)) {
            isOfferEqualToControl = false;
            break;
          }
        }
      }
  
      if (isOfferEqualToControl) {
        this.showMarker(marker);
      }
      else {
        this.hideMarker(marker);
      }
    }
  }
}

export {Map};