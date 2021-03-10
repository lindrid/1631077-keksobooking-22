import {getData as getServerData, showAlert} from './server-data.js';
import {createElements as createOffersElements} from './offer.js';
import {
  addChangeListeners as addFormChangeListeners, 
  setToState as setFormToState,
  setAddress as setFormAddress,
  setValidation as setFormValidation,
  setFormSubmit,
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

setFormToState('inactive');
addFormChangeListeners();

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

  setFormValidation('#title', '#price', ['#room_number', '#capacity']);
  setupFilterForm(objects, map);
};

let doOnFailGetData = (message) => {
  showAlert(message, '.server__map_data_error');
};

const map = new Map('map-canvas');
map.onLoad(() => {
  setFormToState('active');
  getServerData(doOnSuccessGetData, doOnFailGetData); 
});
map.setView(Tokyo, MAP_SCALE);

const doOnSuccessSendForm = () => {
  resetAdForm();
  resetMapFiltersForm();
  map.moveMainMarkerTo(Tokyo);
  setFormAddressToDisabled(true);
  showSuccessMessage();
};

const doOnFailSendForm = () => showErrorMessage();

setFormSubmit(doOnSuccessSendForm, doOnFailSendForm);
setClearButtonClick(doOnSuccessSendForm);