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
  setClearButtonClick
} from './form.js';
import {Map} from './map.js';

const MAP_SCALE = 10;
const Tokyo = {
  LATITUDE: 35.65283,
  LONGITUDE: 139.83948,
}

addFormChangeListeners();
setFormToState('inactive');

const map = new Map('map-canvas');

map.onLoad(() => {
  setFormToState('active');
  setFormAddress(Tokyo.LATITUDE, Tokyo.LONGITUDE);
  setFormAddressToDisabled(true);
});

map.setView(Tokyo, MAP_SCALE);
map.addMainMarker(Tokyo);


let doOnSuccess = (objects) => {  
  map.addMarkers(objects);
  map.setMarkersPopups(createOffersElements(objects), 300, 300);
};

let doOnFail = (message) => {
  showAlert(message, '.server__map_data_error');
};

getServerData(doOnSuccess, doOnFail); 


setFormValidation('#title', '#price', ['#room_number', '#capacity']);


doOnSuccess = () => {
  resetAdForm();
  resetMapFiltersForm();
  map.moveMainMarkerTo(Tokyo);
  setFormAddressToDisabled(true);
  showSuccessMessage();
};

doOnFail = () => showErrorMessage();

setFormSubmit(doOnSuccess, doOnFail);
setClearButtonClick(doOnSuccess);