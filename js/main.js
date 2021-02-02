'use strict';

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

const getRandomFloat = function (min, max, precision) {
  if (isWrongRange(min, max) || precision < 0) {
    return NaN;
  }

  if (min === max) {
    let string = max.toString();
    let dotIndex = string.indexOf('.');
    
    if (dotIndex === -1) {
      return max;
    }

    return parseFloat(string.slice(0, dotIndex + precision + 1));
  }

  const getPrecision = function (number) {
    let string = number.toString();
    let dotIndex = string.indexOf('.');

    if (dotIndex === -1) {
      return 0;
    }
  
    return string.slice(dotIndex + 1).length;
  }

  const getFloatWithPrecision = function (number, precision) {
    let string = number.toString();
    let dotIndex = string.indexOf('.');
    
    if (dotIndex === -1) {
      return number;
    }
    
    string = string.slice(0, dotIndex + precision + 1);

    return parseFloat(string);
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

// примеры использования

getRandomInt(1, 10);

getRandomFloat(1, 1 , 0); //1
getRandomFloat(1, 1.5 , 0); //1
getRandomFloat(0.1250, 0.1250, 2); //0.12
getRandomFloat(0.1, 0.1, 4); //0.1
getRandomFloat(1.1, 1.2 , 3); //например, 1.179
getRandomFloat(1.125, 1.2 , 2); //например, 1.16
getRandomFloat(1.1, 10.12345 , 1); //например, 3.8
getRandomFloat(1.555, 6.999 , 3); //например, 2.116
