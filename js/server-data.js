const ERROR_DISPLAY_DURATION = 10000;

const showAlert = function (message) {
  const div = document.querySelector('.server__error');
  div.innerHTML = message;
  div.style = "text-align: center; background-color: red; color: white; font-size: 18px;" +
    "padding-top: 5px; padding-bottom: 5px;";
  setTimeout(() => {
    div.innerHTML = '';
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
      error));
}

export {getData};