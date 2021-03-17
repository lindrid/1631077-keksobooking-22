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

const getFiltersFormData = function () {
  return new FormData(mapFiltersFormElement);
}

const setupFilterForm = function (map) {
  mapFiltersFormElement.addEventListener('change', _.debounce(() => {
    map.redrawMarkers(getFiltersFormData());
  }, 500));
}

const setAdFormSubmit = function (onSuccess, onFail) {
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

const resetAdFormDivImgElement = function (divSelector, value) {
  const divElement = adFormElement.querySelector(divSelector);
  const imgElement = divElement.querySelector('img');
  URL.revokeObjectURL(imgElement.src);
  imgElement.src = value;
  imgElement.width = 40;
  imgElement.height = 44;
  divElement.style = '';
}

const clearAdFormDivElement = function (selector) {
  const divElement = adFormElement.querySelector(selector);
  divElement.innerHTML = '';
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

  const removeEventsListeners = () => {
    window.removeEventListener('click', onWindowClick);
    window.removeEventListener('keydown', onWindowKeyDown);
  }

  const onWindowClick = () => {
    successElement.classList.add('hidden');
    removeEventsListeners();
  };
  const onWindowKeyDown = (evt) => {
    if (isEscPressed(evt)) {
      successElement.classList.add('hidden');
      removeEventsListeners();
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

  const removeEventsListeners = () => {
    window.removeEventListener('click', onWindowClick)
    window.removeEventListener('keydown', onWindowKeyDown);
    errorButtonElement.removeEventListener('click', onButtonClick);
  }

  const onWindowClick = () => {
    errorElement.classList.add('hidden');
    removeEventsListeners();
  }
  const onWindowKeyDown = (evt) => {
    if (isEscPressed(evt)) {
      errorElement.classList.add('hidden');
      removeEventsListeners();
    }
  }
  const onButtonClick = () => {
    errorElement.classList.add('hidden');
    removeEventsListeners();
  };

  window.addEventListener('click', onWindowClick);
  window.addEventListener('keydown', onWindowKeyDown);
  errorButtonElement.addEventListener('click', onButtonClick)
}

const addAdFormChangeListeners = function ([typeSelector, priceSelector, 
  timeinSelector, timeoutSelector]) {
  const typeElement = adFormElement.querySelector(typeSelector);
  const priceElement = adFormElement.querySelector(priceSelector);
  const timeinElement = adFormElement.querySelector(timeinSelector);
  const timeoutElement = adFormElement.querySelector(timeoutSelector);

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

const addressElement = adFormElement.querySelector('#address');

const setAddress = function (latitude, longitude) {
  addressElement.value = `${latitude}, ${longitude}`;
}

const setAddressToDisabled = function (disabled) {
  addressElement.disabled = disabled;
}

const setAdFormValidation = function (title, price, [roomsNumber, capacity]) {
  const titleElement = adFormElement.querySelector(title);
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

  const priceElement = adFormElement.querySelector(price);
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
  
  const roomsNumberElement = adFormElement.querySelector(roomsNumber);
  const capacityElement = adFormElement.querySelector(capacity);
  roomsNumberElement.addEventListener('change', () => {
    const value = +roomsNumberElement.value;
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
  const clearButtonElement = adFormElement.querySelector('.ad-form__reset');
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
  getFiltersFormData,
  resetAdFormDivImgElement,
  clearAdFormDivElement,
  setFileChangeListener,
  addAdFormChangeListeners, 
  setPageToState, 
  setAddress, 
  setAdFormValidation, 
  setAdFormSubmit, 
  setAddressToDisabled,
  resetAdForm,
  resetMapFiltersForm,
  showSuccessMessage,
  showErrorMessage,
  setClearButtonClick,
  setupFilterForm
};