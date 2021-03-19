/* global _ */

import {getHousingMinPrice} from './offer.js';
import {
  OFFER_TITLE_MIN_LENGTH, 
  OFFER_TITLE_MAX_LENGTH, 
  OFFER_MAX_PRICE
} from './offer.js';
import {sendData} from './server-data.js';

const adForm = document.querySelector('.ad-form');
const mapFiltersForm = document.querySelector('.map__filters');

const setupFilterForm = function (objects, map) {
  mapFiltersForm.addEventListener('change', _.debounce(() => {
    const formData = new FormData(mapFiltersForm);
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
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    setAddressToDisabled(false);
    const formData = new FormData(adForm);
    sendData(
      formData, 
      () => onSuccess(),
      () => onFail(),
    );
  });
}

const resetAdForm = function () {
  adForm.reset();
}

const resetMapFiltersForm = function () {
  mapFiltersForm.reset();
}

const showSuccessMessage = function () {
  const successTepmplate = document.querySelector('#success').content;
  const successDiv = successTepmplate.querySelector('div');
  const successElement = successDiv.cloneNode(true);
  const mainElement = document.querySelector('main');
  mainElement.append(successElement);

  const onWindowClick = () => {
    successElement.classList.add('hidden');
    window.removeEventListener('click', onWindowClick);
  };
  const onWindowKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      successElement.classList.add('hidden');
      window.removeEventListener('keydown', onWindowKeyDown);
    }
  }
  
  window.addEventListener('click', onWindowClick);
  window.addEventListener('keydown', onWindowKeyDown);
}

const showErrorMessage = function () {
  const errorTepmplate = document.querySelector('#error').content;
  const errorDiv = errorTepmplate.querySelector('div');
  const errorButton = errorDiv.querySelector('.error__button');

  const errorElement = errorDiv.cloneNode(true);
  const mainElement = document.querySelector('main');
  mainElement.append(errorElement);

  const onWindowClick = () => {
    errorElement.classList.add('hidden');
    window.removeEventListener('click', onWindowClick)
  }
  const onWindowKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      errorElement.classList.add('hidden');
      window.removeEventListener('keydown', onWindowKeyDown);
    }
  }
  const onButtonClick = () => {
    errorElement.classList.add('hidden');
    errorButton.removeEventListener('click', onButtonClick);
  };

  window.addEventListener('click', onWindowClick);
  window.addEventListener('keydown', onWindowKeyDown);
  errorButton.addEventListener('click', onButtonClick)
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
  const fieldsets = adForm.querySelectorAll('fieldset');
  const filtersFormElement = document.querySelector('.map__filters');

  if (state === 'inactive') {
    adForm.classList.add('.ad-form--disabled');
  }
  if (state === 'active') {
    adForm.classList.remove('.ad-form--disabled');
  }

  fieldsets.forEach((fieldset) => {
    fieldset.disabled = (state === 'inactive')? true : false;
  });

  const filters = filtersFormElement.children;
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
  const titleInput = document.querySelector(title);
  titleInput.addEventListener('input', () => {
    if (titleInput.value.length < OFFER_TITLE_MIN_LENGTH) {
      const count = OFFER_TITLE_MIN_LENGTH - titleInput.value.length;
      titleInput.setCustomValidity('Еще ' + count + ' симв.');
    }
    else if (titleInput.value.length > OFFER_TITLE_MAX_LENGTH) {
      const count = titleInput.value.length - OFFER_TITLE_MAX_LENGTH;
      titleInput.setCustomValidity('Превышение максимальной длины на ' + count + ' симв.');
    }
    else {
      titleInput.setCustomValidity('');
    }
    titleInput.reportValidity();
  });

  const priceInput = document.querySelector(price);
  priceInput.addEventListener('input', () => {
    if (Number(priceInput.value) < priceInput.min) {
      priceInput.setCustomValidity('Значение должно быть больше или равно ' + priceInput.min);
    }
    else if (Number(priceInput.value) > OFFER_MAX_PRICE) {
      priceInput.setCustomValidity('Максимальное значение — ' + OFFER_MAX_PRICE);
    }
    else {
      priceInput.setCustomValidity('');
    }
    priceInput.reportValidity();
  });
  
  const roomNumberSelect = document.querySelector(roomNumber);
  const capacitySelect = document.querySelector(capacity);
  roomNumberSelect.addEventListener('change', () => {
    const value = +roomNumberSelect.value;
    capacitySelect.value = value;

    if (value === 100) {
      for (let option of capacitySelect.options) {
        option.disabled = false;
        if (+option.value !== value) {
          option.disabled = true;
        }
      }
    }
    else {
      for (let option of capacitySelect.options) {
        option.disabled = false; 
        if (+option.value > value) {
          option.disabled = true;
        }
      }
    }
  });
}

const setClearButtonClick = function (callback) {
  const clearButton = document.querySelector('.ad-form__reset');
  clearButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    callback();
  })
}

const setFileChangeListener = function (type, [fileSelector, imageDivSelector]) {
  const fileElement = adForm.querySelector(fileSelector);
  const div = adForm.querySelector(imageDivSelector);
  let previewImg;

  if (type === 'avatar') {
    previewImg = div.querySelector('img');
  }
  else if (type === 'housing-photo') {
    previewImg = document.createElement('img');
    previewImg.width = 70;
    previewImg.height = 70;  
  }

  fileElement.addEventListener('change', (evt) => {
    const files = evt.target.files;
    if (files.length < 1) {
      return;
    }
    previewImg.src = URL.createObjectURL(files[0]);
    
    if (type === 'avatar') {
      div.style = 'padding: 0px';
      previewImg.width = 70;
      previewImg.height = 70;
    }
    else if (type === 'housing-photo') {
      div.appendChild(previewImg);
    }
  });

  previewImg.addEventListener('load', () => {
    URL.revokeObjectURL(previewImg.src);
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