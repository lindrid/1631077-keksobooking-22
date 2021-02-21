import {generateObjects} from './data.js';
import {createElements as createOfferElements} from './offer.js';
import {
  addChangeListeners as addFormChangeListeners, 
  setToState as setFormToState,
  setAddress as setFormAddress
} from './form.js';

const GENERATED_OBJECTS_NUMBER = 10;
const Tokyo = {
  LATITUDE: 35.65283,
  LONGITUDE: 139.83948
}

const objects = generateObjects(GENERATED_OBJECTS_NUMBER);
const offerElements = createOfferElements(objects);

addFormChangeListeners();
setFormToState('inactive');

const map = L.map('map-canvas')
  .on('load', () => {
    setFormToState('active');
    setFormAddress(Tokyo.LATITUDE, Tokyo.LONGITUDE);
  })
  .setView({
    lat: Tokyo.LATITUDE, 
    lng: Tokyo.LONGITUDE
  }, 10);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const mainPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const marker = L.marker(
  {
    lat: Tokyo.LATITUDE, 
    lng: Tokyo.LONGITUDE
  },
  {
    draggable: true,
    icon: mainPinIcon
  }
).on('moveend', (evt) => {
  const {lat, lng} = evt.target.getLatLng();
  setFormAddress(lat.toFixed(5), lng.toFixed(5));
});

marker.addTo(map);