import {shuffle} from './util.js';
import {generateObjects} from './test-data.js';
import {getData as getServerData, showAlert} from './server-data.js';
import {createElements as createOffersElements} from './offer.js';
import {Map} from './map.js';
import {
  getFiltersFormData,
  addAdFormChangeListeners, 
  setPageToState,
  setAddress as setAdFormAddress,
  setAdFormValidation,
  setAdFormSubmit,
  setAddressToDisabled as setAdFormAddressToDisabled,
  resetAdForm,
  resetMapFiltersForm,
  showSuccessMessage,
  showErrorMessage,
  setClearButtonClick,
  setupFilterForm,
  setAvatarChangeListener,
  setPhotoChangeListener,
  resetAdFormDivImgElement,
  clearAdFormDivElement
} from './form.js';

const OFFERS_NUMBER = 10;
const MAP_SCALE = 10;
const Tokyo = {
  LATITUDE: 35.65283,
  LONGITUDE: 139.83948,
}

setPageToState('inactive');

let doOnSuccessGetData = (objects) => {
  const extraObjects = generateObjects(OFFERS_NUMBER);
  objects = shuffle(objects.concat(extraObjects));

  const offersElements = createOffersElements(objects);  
  const popups = {
    elements: offersElements,
    width: 300,
    height: 300,
  }

  map.addMainMarker(Tokyo);
  setAdFormAddress(Tokyo.LATITUDE, Tokyo.LONGITUDE);
  setAdFormAddressToDisabled(true);
  
  map.createMarkers(objects, popups);
  map.drawMarkers(OFFERS_NUMBER);

  addAdFormChangeListeners(['#type', '#price', '#timein', '#timeout']);
  setAdFormValidation('#title', '#price', ['#room_number', '#capacity']);
  
  setupFilterForm(map);
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
  map.redrawMarkers(getFiltersFormData());
  map.moveMainMarkerTo(Tokyo);
  setAdFormAddressToDisabled(true);
  showSuccessMessage();
};

const doOnFailFormSubmit = () => showErrorMessage();

setAdFormSubmit(doOnSuccessFormSubmit, doOnFailFormSubmit);
setClearButtonClick(doOnSuccessFormSubmit);

setAvatarChangeListener('#avatar', '.ad-form-header__preview');
setPhotoChangeListener('#images', '.ad-form__photo');