import {getRandomInt, getRandomFloat} from './util.js';

const OFFER_TITLE_MIN_LENGTH = 30;
const OFFER_TITLE_MAX_LENGTH = 100;

const generateAuthor = function () {
  const random = '0' + getRandomInt(1, 8);
  const author = {
    avatar: `img/avatars/user${random}.png`,
  };

  return author;
};

const generateLocation = function () {
  return {
    x: getRandomFloat(35.65000, 35.70000, 5),
    y: getRandomFloat(139.70000, 139.80000, 5),
  }
};

const buildingsAttributes = {
  palace:   {name: 'дворец',    roomsRange: [10, 20],  coefficientRange: [10, 15]}, 
  flat:     {name: 'квартира',  roomsRange: [1, 5],    coefficientRange: [10, 15]}, 
  house:    {name: 'дом',       roomsRange: [5, 10],   coefficientRange: [10, 15]},
  bungalow: {name: 'бунгало',   roomsRange: [1, 3],    coefficientRange: [0, 5]},
};

const getWithCapital = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getBuildingName = function (building) {
  return getWithCapital(buildingsAttributes[building].name);
}

const generateOffer = function (location) {
  const buildings = ['palace', 'flat', 'house', 'bungalow'];
  const times = ['12:00', '13:00', '14:00'];
  const features = ['elevator', 'wifi', 'dishwasher', 'parking', 
    'washer', 'conditioner'];
  
  const building = buildings[getRandomInt(0, 3)];
  const buildingAttributes = buildingsAttributes[building];
  const buildingName = getBuildingName(building);
  const [roomsMin, roomsMax] = buildingAttributes.roomsRange;
  const rooms = getRandomInt(roomsMin, roomsMax);
  const [minCoefficient, maxCoefficient] = buildingAttributes.coefficientRange;
  const coefficient = getRandomInt(minCoefficient, maxCoefficient);
  const price = coefficient * rooms * 100;
  const guests = rooms * 5;

  const getTitle = function(minLength, maxLength) {
    let wordRooms = 'комнатами';
    if (rooms === 1) {
      wordRooms = 'комнатой';
    }
    
    let title = `${buildingName} за ${price}$/ночь в удобном районе,` +
      ` с ${rooms} ${wordRooms}.`;
    
    do {
      title += ' Срочное объявление!';
    } while (title.length < minLength)

    while (title.length > maxLength) {
      title = title.slice(-5);
    }

    return title;
  };

  const checkTime = times[getRandomInt(0, 2)];

  let slicedFeatures = features.slice(getRandomInt(1, 5));
  if (building === 'flat') {
    slicedFeatures = features.slice(getRandomInt(0, 5));
  }

  const getDescription = function () {
    let ourStr = 'наш'; 
    let hisStr = 'его';
    let ourType = buildingName;
    let doWhat; 
    let already = '';
    let gift;

    if (building === 'flat') {
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

    return `Забронируйте ${ourStr} ${ourType} за ${price}$ на ночь! ` +
      `${getWithCapital(hisStr)} локация имеет координаты ${location.x}, ${location.y}. ` +
      `Количество комнат Вас ${doWhat}, их ${already} ${rooms}шт. ` +
      `Забронируйте прямо сейчас и получите ${gift} в подарок!`;
  }

  const photosNumber = getRandomInt(1, 10);
  const photos = new Array(photosNumber).fill(0).map((item) => {
    const i = getRandomInt(1, 3);
    return `http://o0.github.io/assets/images/tokyo/hotel${i}.jpg`
  });

  return {
    title: getTitle(OFFER_TITLE_MIN_LENGTH, OFFER_TITLE_MAX_LENGTH) ,
    address: location.x + ', ' + location.y,
    price: price,
    type: building,
    rooms: rooms,
    guests: guests,
    checkIn: checkTime,
    checkOut: checkTime,
    features: slicedFeatures,
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

export {generateObjects, getBuildingName};