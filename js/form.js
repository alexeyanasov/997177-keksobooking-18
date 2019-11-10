'use strict';

(function () {
  var SUMBIT_URL = 'https://js.dump.academy/keksobooking';

  var MIN_PRICES = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000,
  };

  var formElement = document.querySelector('.ad-form');
  var addressInputElement = formElement.querySelector('input[name=address]');
  var roomsSelectElement = formElement.querySelector('select[name=rooms]');
  var capacitySelectElement = formElement.querySelector('select[name=capacity]');
  var typeSelectElement = formElement.querySelector('select[name=type]');
  var priceInputElement = formElement.querySelector('input[name=price]');
  var timeinSelectElement = formElement.querySelector('select[name=timein]');
  var timeoutSelectElement = formElement.querySelector('select[name=timeout]');
  var fieldsetElements = formElement.querySelectorAll('fieldset');

  var mapPinMainElement = document.querySelector('.map__pin--main');

  var validateCapacity = function () {
    var rooms = window.shared.parseInt(roomsSelectElement.value);
    var guests = window.shared.parseInt(capacitySelectElement.value);

    if (rooms === 100 && guests > 0) {
      roomsSelectElement.setCustomValidity('Помещение слишком большое для гостей');
      formElement.reportValidity();
      return false;
    }

    if (guests === 0 && rooms !== 100) {
      roomsSelectElement.setCustomValidity('Помещение слишком маленькое');
      formElement.reportValidity();
      return false;
    }

    if (rooms < guests) {
      roomsSelectElement.setCustomValidity('Количество комнат должно быть больше или равно количеству гостей');
      formElement.reportValidity();
      return false;
    }

    roomsSelectElement.setCustomValidity('');
    return true;
  };

  var typeChangeHandler = function (evt) {
    var type = evt.target.value;
    var minPrice = MIN_PRICES[type];

    priceInputElement.placeholder = minPrice;
    priceInputElement.min = minPrice;
  };

  var timeChangeHandler = function (evt) {
    var time = evt.target.value;

    timeinSelectElement.value = time;
    timeoutSelectElement.value = time;
  };

  var submitForm = function () {
    var onSuccess = function () {
      window.ads.closeCard();
      window.map.deactivate();
      window.form.deactivate();
      window.shared.showSuccessMessage();
    };

    var onError = function (message) {
      window.shared.showErrorMessage(message, submitForm);
    };

    var data = new FormData(formElement);
    window.network.post(SUMBIT_URL, data, onSuccess, onError);
  };

  var formSubmitHandler = function (evt) {
    evt.preventDefault();

    if (validateCapacity()) {
      submitForm();
    }

    formElement.reportValidity();
  };

  roomsSelectElement.addEventListener('change', validateCapacity);
  capacitySelectElement.addEventListener('change', validateCapacity);
  typeSelectElement.addEventListener('change', typeChangeHandler);
  timeinSelectElement.addEventListener('change', timeChangeHandler);
  timeoutSelectElement.addEventListener('change', timeChangeHandler);
  formElement.addEventListener('submit', formSubmitHandler);

  window.form = {
    activate: function () {
      formElement.classList.remove('ad-form--disabled');

      fieldsetElements.forEach(function (fieldsetElement) {
        fieldsetElement.disabled = false;
      });
    },

    deactivate: function () {
      formElement.reset();

      window.form.updateAddress();
      priceInputElement.placeholder = MIN_PRICES[typeSelectElement.value];

      fieldsetElements.forEach(function (fieldsetElement) {
        fieldsetElement.disabled = true;
      });

      formElement.classList.add('ad-form--disabled');
    },

    updateAddress: function () {
      var x = window.shared.parseInt(mapPinMainElement.style.left);
      var y = window.shared.parseInt(mapPinMainElement.style.top);
      var address = x + ', ' + y;

      addressInputElement.value = address;
    }
  };
})();
