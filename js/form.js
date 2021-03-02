import {getHousingMinPrice} from './test-data.js';
import {OFFER_TITLE_MIN_LENGTH, OFFER_TITLE_MAX_LENGTH, OFFER_MAX_PRICE} from './offer.js';
import {sendData} from './server-data.js';

const formElement = document.querySelector('.ad-form');

const setFormSubmit = function (onSuccess) {
  formElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    setAddressToDisabled(false);
    const formData = new FormData(formElement);
    sendData(formData, (json) => {
      onSuccess(json);
    });
  })
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

const setToState = function (state) {
  const fieldsets = formElement.querySelectorAll('fieldset');
  const filtersFormElement = document.querySelector('.map__filters');

  if (state === 'inactive') {
    formElement.classList.add('.ad-form--disabled');
  }
  if (state === 'active') {
    formElement.classList.remove('.ad-form--disabled');
  }

  fieldsets.forEach((fieldset) => {
    fieldset.disabled = (state === 'inactive')? true : false;
  })

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
    if (priceInput.value < priceInput.min) {
      priceInput.setCustomValidity('Значение должно быть больше или равно ' + priceInput.min);
    }
    else if (priceInput.value > OFFER_MAX_PRICE) {
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

export {
  addChangeListeners, 
  setToState, 
  setAddress, 
  setValidation, 
  setFormSubmit, 
  setAddressToDisabled
};