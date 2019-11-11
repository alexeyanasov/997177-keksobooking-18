'use strict';

(function () {
  var KEY_CODE_ENTER = 13;
  var KEY_CODE_ESCAPE = 27;
  var RADIX_DEC = 10;

  var mainElement = document.querySelector('main');

  var errorTemplate = document.querySelector('#error').cloneNode(true);
  var successTemplate = document.querySelector('#success').cloneNode(true);

  var errorElement = errorTemplate.content.querySelector('.error');
  var successElement = successTemplate.content.querySelector('.success');

  var errorMessageElement = errorElement.querySelector('.error__message');
  var errorButtonElement = errorElement.querySelector('.error__button');

  errorElement.style.display = 'none';
  successElement.style.display = 'none';

  mainElement.appendChild(successElement);
  mainElement.appendChild(errorElement);

  window.shared = {
    KEY_CODE_ENTER: KEY_CODE_ENTER,
    KEY_CODE_ESCAPE: KEY_CODE_ESCAPE,
    RADIX_DEC: RADIX_DEC,

    parseInt: function (str) {
      return parseInt(str, RADIX_DEC);
    },

    getRandomNumber: function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    limit: function (value, min, max) {
      return Math.min(max, Math.max(min, value));
    },

    debounce: function (cb, interval) {
      var lastTimeout = null;

      return function () {
        var parameters = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          cb.apply(null, parameters);
        }, interval);
      };
    },

    showSuccessMessage: function () {
      successElement.style.display = 'block';

      var keyDownHandler = function (evt) {
        if (evt.keyCode === KEY_CODE_ESCAPE) {
          window.shared.hideSuccessMessage();
        }

        document.removeEventListener('keydown', keyDownHandler);
      };

      successElement.addEventListener('click', window.shared.hideSuccessMessage);
      document.addEventListener('keydown', keyDownHandler);
    },

    showErrorMessage: function (message, onClickHandler) {
      errorMessageElement.textContent = message;
      errorElement.style.display = 'block';

      var keyDownHandler = function (evt) {
        if (evt.keyCode === KEY_CODE_ESCAPE) {
          window.shared.hideErrorMessage();
        }

        document.removeEventListener('keydown', keyDownHandler);
      };

      errorButtonElement.addEventListener('click', onClickHandler);
      errorElement.addEventListener('click', window.shared.hideErrorMessage);
      document.addEventListener('keydown', keyDownHandler);
    },

    hideSuccessMessage: function () {
      successElement.style.display = 'none';
    },

    hideErrorMessage: function () {
      errorElement.style.display = 'none';
    }
  };
})();
