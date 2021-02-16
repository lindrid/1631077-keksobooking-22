import {getBuildingName} from './data.js';

const getRoomsString = function (rooms) {
  let roomsStr = (rooms === 1)? 'комната' : 'комнат';
  if (rooms >= 2 && rooms <= 4) {
    roomsStr = 'комнаты';
  }
  return rooms + ' ' + roomsStr;
}

const createElements = function (objects) {
  const offerElements = objects.map((object) => {
    const {author, offer} = object;
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
        
    const capacity = offerElement.querySelector('.popup__text--capacity');
    capacity.textContent = `${getRoomsString(offer.rooms)} для ${offer.guests} гостей`;
         
    const time = offerElement.querySelector('.popup__text--time');
    time.textContent = `Заезд после ${offer.checkIn}, выезд до ${offer.checkOut}`;
    
    const features = offerElement.querySelector('.popup__features');
    features.innerHTML = offer.features.reduce((accumulator, feature) => {
      return accumulator + `<li class="popup__feature popup__feature--${feature}"></li>\n`;
    }, '');

    const description = offerElement.querySelector('.popup__description');
    description.textContent = offer.description;

    const photos = offerElement.querySelector('.popup__photos');
    photos.innerHTML = offer.photos.reduce((accumulator, photo) => {
      return accumulator + `<img src="${photo}" class="popup__photo" width="45" height="40" ` +
        'alt="Фотография жилья">\n';
    }, '');

    const avatar = offerElement.querySelector('.popup__avatar');
    avatar.src = author.avatar;

    return offerElement;
  });

  return offerElements;
}

export {createElements};