const ERROR_DISPLAY_DURATION = 10000;
const API_GET_DATA_URL = 'https://22.javascript.pages.academy/keksobooking/data';
const API_SEND_DATA_URL = 'https://22.javascript.pages.academy/keksobooking';
const GET_DATA_ERROR_MESSAGE = 'Не удалось получить данные от сервера. ' +
  'Ошибка, которую вернул сервер:';

const showAlert = function (message, selector) {
  const divElement = document.querySelector(selector);
  divElement.innerHTML = message;
  divElement.style = 'text-align: center; background-color: red; color: white; font-size: 18px;' +
    'padding-top: 5px; padding-bottom: 5px;';
  setTimeout(() => {
    divElement.innerHTML = '';
    divElement.style = '';
  }, ERROR_DISPLAY_DURATION);
}

const makeRequest = function (url, method, body) {
  return fetch(url, {
    method: method,
    body: body,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`"${response.status} - ${response.statusText}"`);
    })
}

const getData = function (onSuccess, onFail) {
  makeRequest(API_GET_DATA_URL, 'GET')
    .then((objects) => onSuccess(objects))
    .catch((error) => onFail(`${GET_DATA_ERROR_MESSAGE} ${error}`));
}

const sendData = function (body, onSuccess, onFail) {
  makeRequest(API_SEND_DATA_URL, 'POST', body)
    .then(() => onSuccess())
    .catch(() => onFail());
}

export {getData, sendData, showAlert};