const getData = function (onSuccess) {
  fetch("https://22.javascript.pages.academy/keksobooking/data")
    .then((response) => response.json())
    .then((offers) => onSuccess(offers));
}

export {getData};