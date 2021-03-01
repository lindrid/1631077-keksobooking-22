const ERROR_DISPLAY_DURATION = 10000;

const showAlert = function (message, selector, br = '') {
  const div = document.querySelector(selector);
  div.innerHTML = message;
  div.style = "text-align: center; background-color: red; color: white; font-size: 18px;" +
    "padding-top: 5px; padding-bottom: 5px;";
  setTimeout(() => {
    div.innerHTML = '' + br;
    div.style = '';
  }, ERROR_DISPLAY_DURATION);
}

const getData = function (onSuccess) {
  fetch("https://22.javascript.pages.academy/keksobooking/data")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`"${response.status} - ${response.statusText}"`);
    })
    .then((offers) => onSuccess(offers))
    .catch((error) => showAlert('Не удалось получить данные от сервера. Ошибка, которую вернул сервер: ' + 
      error, '.server__map_error'));
}

const sendData = function (body, onSuccess) {
  fetch('https://22.javascript.pages.academy/keksobooking', {
      method: 'POST',
      body: body,
    })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        return response.json();
      }
      throw new Error(`"${response.status} - ${response.statusText}"`);
    })
    .then((json) => onSuccess(json))
    .catch((error) => showAlert('Не удалось submit the form. Ошибка, которую вернул сервер: ' + 
      error, '.server__submit_error', '<br><br>'));
}

export {getData, sendData};