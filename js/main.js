'use strict';

const GENERATED_OBJECTS_NUMBER = 10;

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

const generateAuthors = function (numberOfObjects) {
  return new Array(numberOfObjects).fill(0).map(() => {
    const random = '0' + getRandomInt(1, 8).toString();
    const author = {
      avatar: `img/avatars/user${random}.png`,
    };
    return author;
  });
};

const generateLocation = function () {
  return {
    x: getRandomFloat(35.65000, 35.70000, 5),
    y: getRandomFloat(139.70000, 139.80000, 5),
  }
};

const generateOffers = function (numberOfObjects) {
  const getWithCapital = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const types = ['palace', 'flat', 'house', 'bungalow'];
  const times = ['12:00', '13:00', '14:00'];
  const features = ['elevator', 'wifi', 'dishwasher', 'parking', 
    'washer', 'conditioner'];

  return new Array(numberOfObjects).fill(0).map(() => {
    const typeAttributes = {
      palace:   {name: 'дворец', rooms: getRandomInt(10, 20), coefficient: 4}, 
      flat:     {name: 'квартира', rooms: getRandomInt(1, 4), coefficient: 1}, 
      house:    {name: 'дом', rooms: getRandomInt(4, 10), coefficient: 2},
      bungalow: {name: 'бунгало', rooms: getRandomInt(1, 4), coefficient: 2},
    };
    const type = types[getRandomInt(0, 3)];
    const thisType = typeAttributes[type];
    const typeName = thisType.name;
    const rooms = thisType.rooms;
    const price = thisType.coefficient * rooms * 20000;
    const location = generateLocation();
    const guests = rooms * thisType.coefficient * 5;
    
    let ourStr = 'наш'; 
    let hisStr = 'его';
    let ourType = typeName;
    let doWhat; 
    let already = '';
    let slicedFeatures = features.slice(getRandomInt(1, 5));

    if (type === 'flat') {
      ourStr = 'нашу';
      ourType = 'квартиру';
      hisStr = 'её';
      slicedFeatures = features.slice(getRandomInt(0, 5));
    }

    if (rooms <= 3) {
      doWhat = 'устроит';
    }
    else if (rooms <= 6) {
      doWhat = 'приятно удивит';
    }
    else if (rooms <= 12) {
      doWhat = 'обрадует';
    }
    else {
      doWhat = 'точно поразит';
      already = 'аж';
    }

    const photosNumber = getRandomInt(1, 10);
    const photos = new Array(photosNumber).fill(0).map((item, index) => {
      return `http://o0.github.io/assets/images/tokyo/hotel${index+1}.jpg`
    }); 

    return {
      title: `${getWithCapital(typeName)} за ${price}$`,
      address: location.x + ', ' + location.y,
      price: price,
      type: type,
      rooms: rooms,
      guests: guests,
      checkIn: times[getRandomInt(0, 2)],
      checkOut: times[getRandomInt(0, 2)],
      features: slicedFeatures,
      description: `Купите ${ourStr} ${ourType} за ${price}$! ` +
        `${getWithCapital(hisStr)} локация имеет координаты ${location.x}, ${location.y}. ` +
        `Количество комнат Вас ${doWhat}, их ${already} ${rooms}шт. ` +
        `Купите ${ourStr} ${ourType} за ${price}$ и Вы не пожалеете!`,
      photos: photos,
    };
  });
};

const generateLocations = function (numberOfObjects) {
  return new Array(numberOfObjects).fill(0).map(() => generateLocation());
};

generateAuthors(GENERATED_OBJECTS_NUMBER);
generateOffers(GENERATED_OBJECTS_NUMBER);
generateLocations(GENERATED_OBJECTS_NUMBER);