const OFFER_TITLE_MIN_LENGTH = 30;
const OFFER_TITLE_MAX_LENGTH = 100;
const OFFER_MAX_PRICE = 1000000;
const MIN_BUNGALOW_PRICE = 0;
const MIN_FLAT_PRICE = 1000;
const MIN_HOUSE_PRICE = 5000;
const MIN_PALACE_PRICE = 10000;

const housingsAttributes = {
  palace: {
    name: 'дворец',
    minPrice: MIN_PALACE_PRICE,
  },
  flat: {
    name: 'квартира',
    minPrice: MIN_FLAT_PRICE,
  },
  house: {
    name: 'дом',
    minPrice: MIN_HOUSE_PRICE,
  },
  bungalow: {
    name: 'бунгало',
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

const createElements = function (objects) {
  const offerElements = objects.map((object) => {
    const {author, offer} = object;
    const cardTemplate = document.querySelector('#card').content;
    const elementTemplate = cardTemplate.querySelector('article.popup');
    const offerElement = elementTemplate.cloneNode(true);

    const setTextContent = function (className, value) {
      offerElement.querySelector(className).textContent = value;
    }

    const setInnerHTML = function (className, array, htmlPrefix, htmlPostfix) {
      offerElement.querySelector(className).innerHTML = 
        array.reduce((accumulator, item) => {
          return accumulator + htmlPrefix + item + htmlPostfix;
        }, '');
    }
    
    setTextContent('.popup__title', offer.title);
    setTextContent('.popup__text--address', offer.address);
    setTextContent('.popup__text--price', offer.price + ' ₽/ночь');
    setTextContent('.popup__type', housingsAttributes[offer.type].name);
    setTextContent('.popup__text--capacity', `${getRoomsString(offer.rooms)} для ` +
      `${getGuestsString(offer.guests)}`);
    setTextContent('.popup__text--time', `Заезд после ${offer.checkin}, выезд ` +
      `до ${offer.checkout}`);
    setTextContent('.popup__description', offer.description);
    setTextContent('.popup__avatar', author.avatar);
   
    if (offer.features.length > 0) {
      setInnerHTML('.popup__features', offer.features, 
        '<li class="popup__feature popup__feature--', '"></li>\n');
    }
    else {
      const featuresElement = offerElement.querySelector('.popup__features');
      featuresElement.classList.add('hidden');
    }
    setInnerHTML('.popup__photos', offer.photos, '<img src="',
      '" class="popup__photo" width="45" height="40" alt="Фотография жилья">\n');

    return offerElement;
  });

  return offerElements;
}

export {
  createElements, 
  getHousingMinPrice, 
  OFFER_TITLE_MIN_LENGTH, 
  OFFER_TITLE_MAX_LENGTH, 
  OFFER_MAX_PRICE,
  MIN_BUNGALOW_PRICE,
  MIN_FLAT_PRICE, 
  MIN_HOUSE_PRICE, 
  MIN_PALACE_PRICE
};