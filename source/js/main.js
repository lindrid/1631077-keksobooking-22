import {getData as getServerData, showAlert} from './server-data.js';
import {createElements as createOffersElements} from './offer.js';
import {
  addAdFormChangeListeners, 
  setPageToState,
  setAddress as setAdFormAddress,
  setAdFormValidation,
  setFormSubmit,
  setAddressToDisabled as setAdFormAddressToDisabled,
  resetAdForm,
  resetMapFiltersForm,
  showSuccessMessage,
  showErrorMessage,
  setClearButtonClick,
  setupFilterForm,
  setFileChangeListener,
  resetAdFormDivImgElement,
  clearAdFormDivElement
} from './form.js';
import {Map} from './map.js';

const OFFERS_NUMBER = 10;
const MAP_SCALE = 10;
const Tokyo = {
  LATITUDE: 35.65283,
  LONGITUDE: 139.83948,
}

setPageToState('inactive');

let doOnSuccessGetData = (objects) => {
  objects = objects.slice(0, OFFERS_NUMBER);
  const offersElements = createOffersElements(objects);  
  const popups = {
    elements: offersElements,
    width: 300,
    height: 300,
  }

  map.addMainMarker(Tokyo);
  setAdFormAddress(Tokyo.LATITUDE, Tokyo.LONGITUDE);
  setAdFormAddressToDisabled(true);
  
  map.addMarkers(objects, popups);

  addAdFormChangeListeners(['#type', '#price', '#timein', '#timeout']);
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
  resetAdFormDivImgElement('.ad-form-header__preview', 'img/muffin-grey.svg');
  clearAdFormDivElement('.ad-form__photo');
  resetMapFiltersForm();
  map.moveMainMarkerTo(Tokyo);
  setAdFormAddressToDisabled(true);
  showSuccessMessage();
};

const doOnFailFormSubmit = () => showErrorMessage();

setFormSubmit(doOnSuccessFormSubmit, doOnFailFormSubmit);
setClearButtonClick(doOnSuccessFormSubmit);

setFileChangeListener('avatar', ['#avatar', '.ad-form-header__preview']);
setFileChangeListener('housing-photo', ['#images', '.ad-form__photo']);