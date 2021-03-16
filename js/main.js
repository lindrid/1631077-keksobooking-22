import {getData as getServerData, showAlert} from './server-data.js';
import {createElements as createOffersElements} from './offer.js';
import {
  addChangeListeners as addFormChangeListeners, 
  setPageToState,
  setAddress as setFormAddress,
  setAdFormValidation,
  setAdFormSubmit,
  setAddressToDisabled as setFormAddressToDisabled,
  resetAdForm,
  resetMapFiltersForm,
  showSuccessMessage,
  showErrorMessage,
  setClearButtonClick,
  setupFilterForm
} from './form.js';
import {Map} from './map.js';

const OFFERS_NUMBER = 10;
const MAP_SCALE = 10;
const Tokyo = {
  LATITUDE: 35.65283,
  LONGITUDE: 139.83948,
}

setPageToState('inactive');
addFormChangeListeners(['#type', '#price', '#timein', '#timeout']);

let doOnSuccessGetData = (objects) => {
  objects = objects.slice(0, OFFERS_NUMBER);
  const offersElements = createOffersElements(objects);  
  const popups = {
    elements: offersElements,
    width: 300,
    height: 300,
  }

  map.addMainMarker(Tokyo);
  setFormAddress(Tokyo.LATITUDE, Tokyo.LONGITUDE);
  setFormAddressToDisabled(true);
  map.addMarkers(objects, popups);

  setAdFormValidation('#title', '#price', ['#room_number', '#capacity']);
  setupFilterForm(objects, map);
};

let doOnFailGetData = (message) => {
  showAlert(message, '.server__map_data_error');
};

const map = new Map('map-canvas');
map.onLoad(() => {
  setPageToState('active');
  getServerData(doOnSuccessGetData, doOnFailGetData); 
});
map.setView(Tokyo, MAP_SCALE);

const doOnSuccessFormSubmit = () => {
  resetAdForm();
  resetMapFiltersForm();
  map.moveMainMarkerTo(Tokyo);
  setFormAddressToDisabled(true);
  showSuccessMessage();
};

const doOnFailFormSubmit = () => showErrorMessage();

setAdFormSubmit(doOnSuccessFormSubmit, doOnFailFormSubmit);
setClearButtonClick(doOnSuccessFormSubmit);