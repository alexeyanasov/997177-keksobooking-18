'use strict';

(function () {
  var SUCCESS_RESPONSE_STATUS = 200;
  var TIMEOUT = 10000;

  var createXMLHTTPRequest = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_RESPONSE_STATUS) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  };

  window.network = {
    get: function (url, onSuccess, onError) {
      var xhr = createXMLHTTPRequest(onSuccess, onError);
      xhr.open('GET', url);
      xhr.send();
    },
    post: function (url, data, onSuccess, onError) {
      var xhr = createXMLHTTPRequest(onSuccess, onError);
      xhr.open('POST', url);
      xhr.send(data);
    }
  };
})();
