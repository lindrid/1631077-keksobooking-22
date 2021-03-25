import {getRandomInt, getRandomFloat} from './util.js';
import {
  OFFER_TITLE_MIN_LENGTH,
  OFFER_TITLE_MAX_LENGTH,
  MIN_BUNGALOW_PRICE,
  MIN_FLAT_PRICE,
  MIN_HOUSE_PRICE,
  MIN_PALACE_PRICE,
  BUNGALOW_NAME,
  FLAT_NAME,
  HOUSE_NAME,
  PALACE_NAME
} from './offer.js';

const PRECISION = 5;
const MIN_LATITUDE = 35.66000;
const MAX_LATITUDE = 36.00000;
const MIN_LONGITUDE = 139.50000;
const MAX_LONGITUDE = 140.00000;

const PALACE_PRICE_COEFFICIENT = 20000;
const FLAT_PRICE_COEFFICIENT = 5000;
const HOUSE_PRICE_COEFFICIENT = 10000;
const BUNGALOW_PRICE_COEFFICIENT = 5000;

const AVATARS_URL = 'img/avatars/user';
const PHOTOES_URL = 'http://o0.github.io/assets/images/tokyo/hotel';

const generateAuthor = function () {
  const random = '0' + getRandomInt(1, 8);
  const author = {
    avatar: `${AVATARS_URL}${random}.png`,
  };

  return author;
};

const generateLocation = function () {
  return {
    lat: getRandomFloat(MIN_LATITUDE, MAX_LATITUDE, PRECISION),
    lng: getRandomFloat(MIN_LONGITUDE, MAX_LONGITUDE, PRECISION),
  }
};

const housingsAttributes = {
  palace:   {name: PALACE_NAME,   rooms: [1,2,3,100],   priceCoefficient: PALACE_PRICE_COEFFICIENT, 
    minPrice: MIN_PALACE_PRICE}, 
  flat:     {name: FLAT_NAME,     rooms: [1,2,3],       priceCoefficient: FLAT_PRICE_COEFFICIENT, 
    minPrice: MIN_FLAT_PRICE}, 
  house:    {name: HOUSE_NAME,    rooms: [1,2,3,100],   priceCoefficient: HOUSE_PRICE_COEFFICIENT,
    minPrice: MIN_HOUSE_PRICE},
  bungalow: {name: BUNGALOW_NAME, rooms: [1,2,3],       priceCoefficient: BUNGALOW_PRICE_COEFFICIENT,   
    minPrice: MIN_BUNGALOW_PRICE},
};

const getWithCapital = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getHousingName = function (housing) {
  return getWithCapital(housingsAttributes[housing].name);
}

const generateOffer = function (location) {
  const housings = ['palace', 'flat', 'house', 'bungalow'];
  const times = ['12:00', '13:00', '14:00'];
  const features = ['elevator', 'wifi', 'dishwasher', 'parking', 
    'washer', 'conditioner'];
  
  const housing = housings[getRandomInt(0, 3)];
  const housingAttributes = housingsAttributes[housing];
  const housingName = getHousingName(housing);
  const roomIndex = getRandomInt(0, housingAttributes.rooms.length-1);
  const rooms = housingAttributes.rooms[roomIndex];
  const price = housingAttributes.minPrice + housingAttributes.priceCoefficient * rooms;
  const guests = rooms * getRandomInt(1, 2);

  const getTitle = function(minLength, maxLength) {
    let wordRooms = 'комнатами';
    if (rooms === 1) {
      wordRooms = 'комнатой';
    }
    
    let title = `${housingName} за ${price} ₽/ночь в удобном районе,` +
      ` с ${rooms} ${wordRooms}.`;
    
    do {
      title += ' Срочное объявление!';
    } while (title.length < minLength)

    while (title.length > maxLength) {
      title = title.slice(-5);
    }

    return title;
  };

  const checkin = times[getRandomInt(0, 2)];
  const checkout = checkin;

  let randomInt;
  if (housing === 'palace' || housing === 'flat') {
    randomInt = getRandomInt(0, 6);
  }
  else {
    randomInt = getRandomInt(1, 6);
  }
  let randomFeatures = features.slice(randomInt);
 
  const getDescription = function () {
    let ourStr = 'наш'; 
    let hisStr = 'его';
    let ourType = housingName;
    let doWhat; 
    let already = '';
    let gift;

    if (housing === 'flat') {
      ourStr = 'нашу';
      ourType = 'квартиру';
      hisStr = 'её';
    }

    if (rooms <= 3) {
      gift = 'кресло-качалку';
      doWhat = 'устроит';
    }
    else if (rooms <= 6) {
      gift = 'надувного медведя';
      doWhat = 'приятно удивит';
    }
    else if (rooms <= 12) {
      gift = 'стерео систему';
      doWhat = 'обрадует';
    }
    else {
      gift = 'золотой ершик';
      doWhat = 'точно поразит';
      already = 'аж';
    }

    return `Забронируйте ${ourStr} ${ourType} за ${price}₽ на ночь! ` +
      `${getWithCapital(hisStr)} локация имеет координаты ${location.lat}, ${location.lng}. ` +
      `Количество комнат Вас ${doWhat}, их ${already} ${rooms}шт. ` +
      `Забронируйте прямо сейчас и получите ${gift} в подарок!`;
  }

  const photosNumber = getRandomInt(1, 10);
  const photos = new Array(photosNumber).fill(0).map(() => {
    const i = getRandomInt(1, 3);
    return `${PHOTOES_URL}${i}.jpg`;
  });

  return {
    title: getTitle(OFFER_TITLE_MIN_LENGTH, OFFER_TITLE_MAX_LENGTH) ,
    address: location.lat + ', ' + location.lng,
    price: price,
    type: housing,
    rooms: rooms,
    guests: guests,
    checkin: checkin,
    checkout: checkout,
    features: randomFeatures,
    description: getDescription(),
    photos: photos,
  };
};

const generateObjects = function (quantity) {
  return new Array(quantity).fill(0).map(() => {
    const location = generateLocation();
    return {
      author: generateAuthor(),
      offer: generateOffer(location),
      location: location,
    }
  })
};

export {generateObjects}