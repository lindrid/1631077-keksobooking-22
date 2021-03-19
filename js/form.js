/* global _ */

import {getHousingMinPrice} from './offer.js';
import {
  OFFER_TITLE_MIN_LENGTH, 
  OFFER_TITLE_MAX_LENGTH, 
  OFFER_MAX_PRICE
} from './offer.js';
import {sendData} from './server-data.js';

const adFormElement = document.querySelector('.ad-form');
const mapFiltersFormElement = document.querySelector('.map__filters');

const setupFilterForm = function (objects, map) {
  mapFiltersFormElement.addEventListener('change', _.debounce(() => {
    const formData = new FormData(mapFiltersFormElement);
    let controls = [];

    for (let pair of formData.entries()) {
      controls.push({
        name: pair[0],
        value: pair[1],
      });
    }

    objects.forEach((object) => {
      const marker = map.getMarkerBy(object);

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
      let allValuesAreEqual = true;
      
      for (let control of controls) {
        if (['housing-type', 'housing-rooms', 'housing-guests'].includes(control.name)) {
          if (control.value !== 'any' && control.value !== offerValues[control.name]) {
            allValuesAreEqual = false;
            break;
          }
        }
        else if (control.name === 'housing-price') {
          switch (control.value) {
            case 'low':
              if (offerValues[control.name] > 10000) {
                allValuesAreEqual = false;
              }
              break;
            case 'middle':
              if (offerValues[control.name] <= 10000 || offerValues[control.name] > 50000) {
                allValuesAreEqual = false;
              }
              break;
            case 'high':
              if (offerValues[control.name] <= 50000) {
                allValuesAreEqual = false;
              }
              break;
          }
          if (!allValuesAreEqual) {
            break;
          }
        }
        else {
          if (!offer.features.includes(control.value)) {
            allValuesAreEqual = false;
            break;
          }
        }
      }

      if (allValuesAreEqual) {
        map.showMarker(marker);
      }
      else {
        map.hideMarker(marker);
      }
    });
  }, 500));
}

const setFormSubmit = function (onSuccess, onFail) {
  adFormElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    setAddressToDisabled(false);
    const formData = new FormData(adFormElement);
    sendData(
      formData, 
      () => onSuccess(),
      () => onFail(),
    );
  });
}

const resetAdForm = function () {
  adFormElement.reset();
}

const resetMapFiltersForm = function () {
  mapFiltersFormElement.reset();
}

const isEscPressed = (evt) => {
  return evt.key === 'Escape';
};

const showSuccessMessage = function () {
  const successTepmplate = document.querySelector('#success').content;
  const successDivElement = successTepmplate.querySelector('div');
  const successElement = successDivElement.cloneNode(true);
  const mainElement = document.querySelector('main');
  mainElement.append(successElement);

  const onWindowClick = () => {
    successElement.classList.add('hidden');
    window.removeEventListener('click', onWindowClick);
  };
  const onWindowKeyDown = (evt) => {
    if (isEscPressed(evt)) {
      successElement.classList.add('hidden');
      window.removeEventListener('keydown', onWindowKeyDown);
    }
  }
  
  window.addEventListener('click', onWindowClick);
  window.addEventListener('keydown', onWindowKeyDown);
}

const showErrorMessage = function () {
  const errorTepmplate = document.querySelector('#error').content;
  const errorDivElement = errorTepmplate.querySelector('div');
  const errorButtonElement = errorDivElement.querySelector('.error__button');

  const errorElement = errorDivElement.cloneNode(true);
  const mainElement = document.querySelector('main');
  mainElement.append(errorElement);

  const onWindowClick = () => {
    errorElement.classList.add('hidden');
    window.removeEventListener('click', onWindowClick)
  }
  const onWindowKeyDown = (evt) => {
    if (isEscPressed(evt)) {
      errorElement.classList.add('hidden');
      window.removeEventListener('keydown', onWindowKeyDown);
    }
  }
  const onButtonClick = () => {
    errorElement.classList.add('hidden');
    errorButtonElement.removeEventListener('click', onButtonClick);
  };

  window.addEventListener('click', onWindowClick);
  window.addEventListener('keydown', onWindowKeyDown);
  errorButtonElement.addEventListener('click', onButtonClick)
}

const addChangeListeners = function () {
  const typeElement = document.querySelector('#type');
  const priceElement = document.querySelector('#price');
  const timeinElement = document.querySelector('#timein');
  const timeoutElement = document.querySelector('#timeout');

  typeElement.addEventListener('change', (evt) => {
    const minPrice = getHousingMinPrice(evt.target.value);
    priceElement.min = minPrice;
    priceElement.placeholder = minPrice;
  });

  timeinElement.addEventListener('change', (evt) => {
    timeoutElement.value = evt.target.value;
  });

  timeoutElement.addEventListener('change', (evt) => {
    timeinElement.value = evt.target.value;
  });
}

const setPageToState = function (state) {
  const fieldsetElements = adFormElement.querySelectorAll('fieldset');

  if (state === 'inactive') {
    adFormElement.classList.add('.ad-form--disabled');
  }
  if (state === 'active') {
    adFormElement.classList.remove('.ad-form--disabled');
  }

  fieldsetElements.forEach((fieldset) => {
    fieldset.disabled = (state === 'inactive')? true : false;
  });

  const filters = mapFiltersFormElement.children;
  for (let filter of filters) {
    filter.disabled = (state === 'inactive')? true : false;
  }
}

const setAddress = function (latitude, longitude) {
  const addressElement = document.querySelector('#address');
  addressElement.value = `${latitude}, ${longitude}`;
}

const setAddressToDisabled = function (disabled) {
  const addressElement = document.querySelector('#address');
  addressElement.disabled = disabled;
}

const setValidation = function (title, price, [roomNumber, capacity]) {
  const titleElement = document.querySelector(title);
  titleElement.addEventListener('input', () => {
    if (titleElement.value.length < OFFER_TITLE_MIN_LENGTH) {
      const count = OFFER_TITLE_MIN_LENGTH - titleElement.value.length;
      titleElement.setCustomValidity('Еще ' + count + ' симв.');
    }
    else if (titleElement.value.length > OFFER_TITLE_MAX_LENGTH) {
      const count = titleElement.value.length - OFFER_TITLE_MAX_LENGTH;
      titleElement.setCustomValidity('Превышение максимальной длины на ' + count + ' симв.');
    }
    else {
      titleElement.setCustomValidity('');
    }
    titleElement.reportValidity();
  });

  const priceElement = document.querySelector(price);
  priceElement.addEventListener('input', () => {
    if (Number(priceElement.value) < priceElement.min) {
      priceElement.setCustomValidity('Значение должно быть больше или равно ' + priceElement.min);
    }
    else if (Number(priceElement.value) > OFFER_MAX_PRICE) {
      priceElement.setCustomValidity('Максимальное значение — ' + OFFER_MAX_PRICE);
    }
    else {
      priceElement.setCustomValidity('');
    }
    priceElement.reportValidity();
  });
  
  const roomNumberElement = document.querySelector(roomNumber);
  const capacityElement = document.querySelector(capacity);
  roomNumberElement.addEventListener('change', () => {
    const value = +roomNumberElement.value;
    capacityElement.value = value;

    if (value === 100) {
      for (let option of capacityElement.options) {
        option.disabled = false;
        if (+option.value !== value) {
          option.disabled = true;
        }
      }
    }
    else {
      for (let option of capacityElement.options) {
        option.disabled = false; 
        if (+option.value > value) {
          option.disabled = true;
        }
      }
    }
  });
}

const setClearButtonClick = function (callback) {
  const clearButtonElement = document.querySelector('.ad-form__reset');
  clearButtonElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    callback();
  })
}

const setFileChangeListener = function (type, [fileSelector, imageDivSelector]) {
  const fileElement = adFormElement.querySelector(fileSelector);
  const divElement = adFormElement.querySelector(imageDivSelector);
  let previewImgElement;

  if (type === 'avatar') {
    previewImgElement = divElement.querySelector('img');
  }
  else if (type === 'housing-photo') {
    previewImgElement = document.createElement('img');
    previewImgElement.width = 70;
    previewImgElement.height = 70;  
  }

  fileElement.addEventListener('change', (evt) => {
    const files = evt.target.files;
    if (files.length < 1) {
      return;
    }
    previewImgElement.src = URL.createObjectURL(files[0]);
    
    if (type === 'avatar') {
      divElement.style = 'padding: 0px';
      previewImgElement.width = 70;
      previewImgElement.height = 70;
    }
    else if (type === 'housing-photo') {
      divElement.appendChild(previewImgElement);
    }
  });

  previewImgElement.addEventListener('load', () => {
    URL.revokeObjectURL(previewImgElement.src);
  });
}

export {
  setFileChangeListener,
  addChangeListeners, 
  setPageToState, 
  setAddress, 
  setValidation, 
  setFormSubmit, 
  setAddressToDisabled,
  resetAdForm,
  resetMapFiltersForm,
  showSuccessMessage,
  showErrorMessage,
  setClearButtonClick,
  setupFilterForm
};