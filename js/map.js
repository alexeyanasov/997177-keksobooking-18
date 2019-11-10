'use strict';

(function () {
  var MIN_PIN_Y = 130;
  var MAX_PIN_Y = 630;
  var PIN_HALF_WIDTH = 32;

  var mapElement = document.querySelector('.map');
  var mapPinMainElement = mapElement.querySelector('.map__pin--main');

  var isMapActivated = false;

  var limitPinX = function (x) {
    var minMainPinX = PIN_HALF_WIDTH;
    var maxMainPinX = mapElement.offsetWidth - PIN_HALF_WIDTH;

    return window.shared.limit(x, minMainPinX, maxMainPinX);
  };

  var limitPinY = function (y) {
    return window.shared.limit(y, MIN_PIN_Y, MAX_PIN_Y);
  };

  mapPinMainElement.addEventListener('mousedown', function (mouseDownEvent) {
    mouseDownEvent.preventDefault();

    window.map.activate();
    window.form.activate();
    window.form.updateAddress();

    var startCoords = {
      x: mouseDownEvent.clientX,
      y: mouseDownEvent.clientY
    };

    var onMouseMove = function (mouseMoveEvent) {
      mouseMoveEvent.preventDefault();

      var shift = {
        x: startCoords.x - mouseMoveEvent.clientX,
        y: startCoords.y - mouseMoveEvent.clientY
      };

      startCoords = {
        x: mouseMoveEvent.clientX,
        y: mouseMoveEvent.clientY
      };

      var nextX = mapPinMainElement.offsetLeft - shift.x;
      var nextY = mapPinMainElement.offsetTop - shift.y;

      nextX = limitPinX(nextX);
      nextY = limitPinY(nextY);

      mapPinMainElement.style.left = nextX + 'px';
      mapPinMainElement.style.top = nextY + 'px';

      window.form.updateAddress();
    };

    var onMouseUp = function (mouseUpEvent) {
      mouseUpEvent.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  mapPinMainElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.shared.KEY_CODE_ENTER) {
      window.map.activate();
      window.form.activate();
    }
  });

  window.map = {
    activate: function () {
      mapElement.classList.remove('map--faded');

      if (!isMapActivated) {
        isMapActivated = true;
        window.ads.load();
      }
    },

    deactivate: function () {
      isMapActivated = false;
    },

    getMainPinAddress: function () {
      var x = window.shared.parseInt(mapPinMainElement.style.left);
      var y = window.shared.parseInt(mapPinMainElement.style.top);
      return x + ', ' + y;
    }
  };
})();
