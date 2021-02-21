import {getHousingMinPrice} from './data.js'

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

const setToInactiveState = function () {
  const formElement = document.querySelector('.ad-form');
  formElement.classList.add('.ad-form--disabled');

  const fieldsets = formElement.querySelectorAll('fieldset');
  fieldsets.forEach((fieldset) => {
    fieldset.disabled = true;
  })

  const filtersFormElement = document.querySelector('.map__filters');
  const filters = filtersFormElement.children;
  for (let filter of filters) {
    filter.disabled = true;
  }
}

export {addChangeListeners, setToInactiveState};