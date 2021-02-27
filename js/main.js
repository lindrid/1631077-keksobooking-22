import {generateObjects} from './data.js';
import {createElements as createOffersElements} from './offer.js';
import {
  addChangeListeners as addFormChangeListeners, 
  setToState as setFormToState,
  setAddress as setFormAddress,
  setValidation as setFormValidation
} from './form.js';
import {Map} from './map.js';

const GENERATED_OBJECTS_NUMBER = 10;
const MAP_SCALE = 12;
const Tokyo = {
  LATITUDE: 35.65283,
  LONGITUDE: 139.83948,
}

const objects = generateObjects(GENERATED_OBJECTS_NUMBER);
const offersElements = createOffersElements(objects);

addFormChangeListeners();
setFormToState('inactive');

const map = new Map('map-canvas');

map.onLoad(() => {
  setFormToState('active');
  setFormAddress(Tokyo.LATITUDE, Tokyo.LONGITUDE);
});

map.setView(Tokyo, MAP_SCALE);
map.addMainMarker(Tokyo);
map.addMarkers(objects);
map.setMarkersPopups(offersElements, 300, 300);

setFormValidation('#title', '#price', ['#room_number', '#capacity']);