import {getBuildingName} from './data.js';

const createElements = function (offers) {
  const offerElements = offers.map((offer, index) => {
    const cardTemplate = document.querySelector('#card').content;
    const elementTemplate = cardTemplate.querySelector('article.popup');
    const offerElement = elementTemplate.cloneNode(true);
    
    const title = offerElement.querySelector('.popup__title');
    title.textContent = offer.title;

    const address = offerElement.querySelector('.popup__text--address');
    address.textContent = offer.address;

    const price = offerElement.querySelector('.popup__text--price');
    price.textContent = offer.price + ' ₽/ночь';
        
    const type = offerElement.querySelector('.popup__type');
    type.textContent = getBuildingName(offer.type);
        
    return offerElement;
  });

  return offerElements;
}

export {createElements};