import {getHousingMinPrice} from './data.js'
import {OFFER_TITLE_MIN_LENGTH, OFFER_TITLE_MAX_LENGTH} from './offer.js'

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
  const formElement = document.querySelector('.ad-form');
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

const setFormValidation = function () {
  const titleInput = document.querySelector('#title');
  titleInput.addEventListener('input', (evt) => {
    if (titleInput.value.length < OFFER_TITLE_MIN_LENGTH) {
      
    }
  });
}

export {addChangeListeners, setToState, setAddress};