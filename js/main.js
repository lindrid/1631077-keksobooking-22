'use strict';

const GENERATED_OBJECTS_NUMBER = 10;
const OFFER_TITLE_MIN_LENGTH = 30;
const OFFER_TITLE_MAX_LENGTH = 100;

const isWrongRange = (min,max) => (min > max || min < 0 || max < 0);

/**
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random#%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5_%D1%81%D0%BB%D1%83%D1%87%D0%B0%D0%B9%D0%BD%D0%BE%D0%B3%D0%BE_%D1%86%D0%B5%D0%BB%D0%BE%D0%B3%D0%BE_%D1%87%D0%B8%D1%81%D0%BB%D0%B0_%D0%B2_%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D0%BD%D0%BE%D0%BC_%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B2%D0%B0%D0%BB%D0%B5_%D0%B2%D0%BA%D0%BB%D1%8E%D1%87%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE 
 */
const getRandomInt = function (min, max) {
  if (isWrongRange(min, max)) {
    return NaN;
  }
  if (min === max) {
    return max;
  }

  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

// precision - это количество знаков после запятой
const getRandomFloat = function (min, max, precision) {
  if (isWrongRange(min, max) || precision < 0) {
    return NaN;
  }

  if (min === max) {
    let maxStr = max.toString();
    let dotIndex = maxStr.indexOf('.');
    
    if (dotIndex === -1) {
      return max;
    }

    return parseFloat(maxStr.slice(0, dotIndex + precision + 1));
  }

  const getPrecision = function (float) {
    let floatStr = float.toString();
    let dotIndex = floatStr.indexOf('.');

    if (dotIndex === -1) {
      return 0;
    }
  
    return floatStr.slice(dotIndex + 1).length;
  }

  const getFloatWithPrecision = function (float, precision) {
    let floatStr = float.toString();
    let dotIndex = floatStr.indexOf('.');
    
    if (dotIndex === -1) {
      return float;
    }
    
    floatStr = floatStr.slice(0, dotIndex + precision + 1);

    return parseFloat(floatStr);
  }

  let maxPrecision = Math.max(getPrecision(min), getPrecision(max), precision);
  let multiplier = Math.pow(10, maxPrecision);
  let random = getRandomInt(min * multiplier, max * multiplier);
  let result = random / multiplier;

  if (precision < maxPrecision) {
    return getFloatWithPrecision(result, precision);
  }

  return result;
}

/* примеры использования
getRandomInt(1, 10);

getRandomFloat(1, 1 , 0); //1
getRandomFloat(1, 1.5 , 0); //1
getRandomFloat(0.1250, 0.1250, 2); //0.12
getRandomFloat(0.1, 0.1, 4); //0.1
getRandomFloat(1.1, 1.2 , 3); //например, 1.179
getRandomFloat(1.125, 1.2 , 2); //например, 1.16
getRandomFloat(1.1, 10.12345 , 1); //например, 3.8
getRandomFloat(1.555, 6.999 , 3); //например, 2.116
*/

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

const generateOffer = function () {
  const types = ['palace', 'flat', 'house', 'bungalow'];
  const times = ['12:00', '13:00', '14:00'];
  const features = ['elevator', 'wifi', 'dishwasher', 'parking', 
    'washer', 'conditioner'];
  const typeAttributes = {
    palace:   {name: 'дворец',    roomsRange: [10, 20],  coefficientRange: [10, 15]}, 
    flat:     {name: 'квартира',  roomsRange: [1, 5],    coefficientRange: [10, 15]}, 
    house:    {name: 'дом',       roomsRange: [5, 10],   coefficientRange: [10, 15]},
    bungalow: {name: 'бунгало',   roomsRange: [1, 3],    coefficientRange: [0, 5]},
  };
  
  const type = types[getRandomInt(0, 3)];
  const thisType = typeAttributes[type];
  const typeName = thisType.name;
  const [roomsMin, roomsMax] = thisType.roomsRange;
  const rooms = getRandomInt(roomsMin, roomsMax);
  const [minCoefficient, maxCoefficient] = thisType.coefficientRange;
  const coefficient = getRandomInt(minCoefficient, maxCoefficient);
  const price = coefficient * rooms * 100;
  const location = generateLocation();
  const guests = rooms * 5;

  const getWithCapital = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const getTitle = function(minLength, maxLength) {
    let wordRooms = 'комнатами';
    if (rooms === 1) {
      wordRooms = 'комнатой';
    }
    
    let title = `${getWithCapital(typeName)} за ${price}$/ночь в удобном районе,` +
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
  if (type === 'flat') {
    slicedFeatures = features.slice(getRandomInt(0, 5));
  }

  const getDescription = function () {
    let ourStr = 'наш'; 
    let hisStr = 'его';
    let ourType = typeName;
    let doWhat; 
    let already = '';
    let gift;

    if (type === 'flat') {
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
  const photos = new Array(photosNumber).fill(0).map((item, index) => {
    return `http://o0.github.io/assets/images/tokyo/hotel${index+1}.jpg`
  });

  return {
    title: getTitle(OFFER_TITLE_MIN_LENGTH, OFFER_TITLE_MAX_LENGTH) ,
    address: location.x + ', ' + location.y,
    price: price,
    type: type,
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
    return {
      author: generateAuthor(),
      offer: generateOffer(),
      location: generateLocation(),
    }
  })
};

console.log(generateObjects(GENERATED_OBJECTS_NUMBER));