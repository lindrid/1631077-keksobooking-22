import { isArray } from 'lodash';

const OFFER_TITLE_MIN_LENGTH = 30;
const OFFER_TITLE_MAX_LENGTH = 100;
const OFFER_MAX_PRICE = 1000000;

const MIN_BUNGALOW_PRICE = 0;
const MIN_FLAT_PRICE = 1000;
const MIN_HOUSE_PRICE = 5000;
const MIN_PALACE_PRICE = 10000;

const BUNGALOW_NAME = 'бунгало';
const FLAT_NAME = 'квартира';
const HOUSE_NAME = 'дом';
const PALACE_NAME = 'дворец';

const MAX_LOW_HOUSING_PRICE = 10000;
const MAX_MIDDLE_HOUSING_PRICE = 50000;

const housingsAttributes = {
  palace: {
    name: PALACE_NAME,
    minPrice: MIN_PALACE_PRICE,
  },
  flat: {
    name: FLAT_NAME,
    minPrice: MIN_FLAT_PRICE,
  },
  house: {
    name: HOUSE_NAME,
    minPrice: MIN_HOUSE_PRICE,
  },
  bungalow: {
    name: BUNGALOW_NAME,
    minPrice: MIN_BUNGALOW_PRICE,
  },
};

const getHousingMinPrice = function (type) {
  return housingsAttributes[type].minPrice;
}

const getRoomsString = function (roomsNumber) {
  let roomsStr = (roomsNumber === 1)? 'комната' : 'комнат';
  if (roomsNumber >= 2 && roomsNumber <= 4) {
    roomsStr = 'комнаты';
  }
  return roomsNumber + ' ' + roomsStr;
}

const getGuestsString = function (guestsNumber) {
  let guestsStr = (guestsNumber === 1)? 'гостя' : 'гостей';
  return guestsNumber + ' ' + guestsStr;
}

const cardTemplate = document.querySelector('#card').content;
const elementTemplate = cardTemplate.querySelector('article.popup');    

const createElements = function (objects) {
  const offerElements = objects.map((object) => {
    const {author, offer} = object;
    const offerElement = elementTemplate.cloneNode(true);

    const setTextContent = function (className, value) {
      if (value) {
        offerElement.querySelector(className).textContent = value;
      }
      else {
        offerElement.querySelector(className).classList.add('hidden');
      }
    }

    const getType = function () {
      if (offer.type in housingsAttributes) {
        return housingsAttributes[offer.type].name;
      }
      return false;
    }

    const getCapacity = function () {
      if (
        !offer.rooms && offer.rooms !== 0 ||
        !offer.guests && offer.guests !== 0
      ) {
        return false;
      }
      return `${getRoomsString(offer.rooms)} для ${getGuestsString(offer.guests)}`;
    }

    const getTime = function () {
      if (!offer.checkin || !offer.checkout) {
        return false;
      }
      return `Заезд после ${offer.checkin}, выезд ` + `до ${offer.checkout}`;
    }

    const getPrice = function () {
      if (!offer.price && offer.price !== 0) {
        return false;
      }
      return offer.price + ' ₽/ночь';
    }

    setTextContent('.popup__title', offer.title);
    setTextContent('.popup__text--address', offer.address);
    setTextContent('.popup__text--price', getPrice());
    setTextContent('.popup__type', getType());
    setTextContent('.popup__text--capacity', getCapacity());
    setTextContent('.popup__text--time', getTime());
    setTextContent('.popup__description', offer.description);
    setTextContent('.popup__avatar', author.avatar);
   
    if (isArray(offer.features) && offer.features.length > 0) {
      offerElement.querySelector('.popup__features').innerHTML =
        offer.features.reduce((string, item) => string + 
          `<li class="popup__feature popup__feature--${item}"></li>`, '',
        );
    }
    else {
      const featuresElement = offerElement.querySelector('.popup__features');
      featuresElement.classList.add('hidden');
    }
    
    if (isArray(offer.photos) && offer.photos.length > 0) {
      offerElement.querySelector('.popup__photos').innerHTML =
        offer.photos.reduce((string, item) => string + 
          `<img src="${item}" class="popup__photo" width="45" ` + 
          'height="40" alt="Фотография жилья">\n', '',
        );
    }
    else {
      const photosElement = offerElement.querySelector('.popup__photos');
      photosElement.classList.add('hidden');
    }

    return offerElement;
  });

  return offerElements;
}

const isOfferMatchedToFilter = function (offer, filterControls) {
  const offerValues = {
    'housing-type': offer.type.toString(), 
    'housing-price': offer.price.toString(), 
    'housing-rooms': offer.rooms.toString(), 
    'housing-guests': offer.guests.toString(),
  };
  let isOfferMatched = true;
  
  for (let control of filterControls) {
    if (['housing-type', 'housing-rooms', 'housing-guests'].includes(control.name)) {
      if (control.value !== 'any' && control.value !== offerValues[control.name]) {
        isOfferMatched = false;
        break;
      }
    }
    else if (control.name === 'housing-price') {
      switch (control.value) {
        case 'low':
          if (offerValues[control.name] > MAX_LOW_HOUSING_PRICE) {
            isOfferMatched = false;
          }
          break;
        case 'middle':
          if (
            offerValues[control.name] <= MAX_LOW_HOUSING_PRICE ||
            offerValues[control.name] > MAX_MIDDLE_HOUSING_PRICE
          ) {
            isOfferMatched = false;
          }
          break;
        case 'high':
          if (offerValues[control.name] <= MAX_MIDDLE_HOUSING_PRICE) {
            isOfferMatched = false;
          }
          break;
      }
      if (!isOfferMatched) {
        break;
      }
    }
    else {
      if (!offer.features.includes(control.value)) {
        isOfferMatched = false;
        break;
      }
    }
  }

  return isOfferMatched;
}

export {
  isOfferMatchedToFilter,
  createElements, 
  getHousingMinPrice, 
  OFFER_TITLE_MIN_LENGTH, 
  OFFER_TITLE_MAX_LENGTH, 
  OFFER_MAX_PRICE,
  MIN_BUNGALOW_PRICE,
  MIN_FLAT_PRICE, 
  MIN_HOUSE_PRICE, 
  MIN_PALACE_PRICE,
  MAX_LOW_HOUSING_PRICE,
  MAX_MIDDLE_HOUSING_PRICE,
  BUNGALOW_NAME,
  FLAT_NAME,
  HOUSE_NAME,
  PALACE_NAME
};