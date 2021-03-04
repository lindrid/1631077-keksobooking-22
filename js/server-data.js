const ERROR_DISPLAY_DURATION = 10000;

const showAlert = function (message, selector) {
  const div = document.querySelector(selector);
  div.innerHTML = message;
  div.style = 'text-align: center; background-color: red; color: white; font-size: 18px;' +
    'padding-top: 5px; padding-bottom: 5px;';
  setTimeout(() => {
    div.innerHTML = '';
    div.style = '';
  }, ERROR_DISPLAY_DURATION);
}

const request = function (url, method, body) {
  return fetch(url, {
    method: method,
    body: body
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`"${response.status} - ${response.statusText}"`);
    })
}

const getData = function (onSuccess, onFail, body) {
  request('https://22.javascript.pages.academy/keksobooking/data', 'GET')
    .then((offers) => onSuccess(offers))
    .catch((error) => onFail('Не удалось получить данные от сервера. Ошибка, которую вернул сервер: ' + 
      error));
}

const sendData = function (body, onSuccess, onFail) {
  request('https://22.javascript.pages.academy/keksobooking', 'POST', body)
    .then(() => onSuccess())
    .catch(() => onFail());
}

export {getData, sendData, showAlert};