import {getHousingMinPrice} from './data.js'

const typeElement = document.querySelector('#type');
const priceElement = document.querySelector('#price');
const timeinElement = document.querySelector('#timein');
const timeoutElement = document.querySelector('#timeout');

const addChangeListeners = function () {
  typeElement.addEventListener('change', (evt) => {
    const minPrice = getHousingMinPrice(evt.target.value);
    priceElement.value = priceElement.placeholder = minPrice;
  });

  timeinElement.addEventListener('change', (evt) => {
    timeoutElement.value = evt.target.value;
  });

  timeoutElement.addEventListener('change', (evt) => {
    timeinElement.value = evt.target.value;
  });
}

export {addChangeListeners};