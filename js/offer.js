import {getBuildingName} from './data.js';

const getRoomsString = function (rooms) {
  let roomsStr = (rooms === 1)? 'комната' : 'комнат';
  if (rooms >= 2 && rooms <= 4) {
    roomsStr = 'комнаты';
  }
  return rooms + ' ' + roomsStr;
}

const getGuestsString = function (guests) {
  let guestsStr = (guests === 1)? 'гостя' : 'гостей';
  return guests + ' ' + guestsStr;
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
    setTextContent('.popup__type', getBuildingName(offer.type));
    setTextContent('.popup__text--capacity', `${getRoomsString(offer.rooms)} для ` +
      `${getGuestsString(offer.guests)}`);
    setTextContent('.popup__text--time', `Заезд после ${offer.checkIn}, выезд ` +
      `до ${offer.checkOut}`);
    setTextContent('.popup__description', offer.description);
    setTextContent('.popup__avatar', author.avatar);
   
    setInnerHTML('.popup__features', offer.features, 
      '<li class="popup__feature popup__feature--', '"></li>\n');
    setInnerHTML('.popup__photos', offer.photos, '<img src="',
      '" class="popup__photo" width="45" height="40" alt="Фотография жилья">\n');

    return offerElement;
  });

  return offerElements;
}

export {createElements};