'use strict';

(function () {
  var MIN_PIN_Y = 130;
  var MAX_PIN_Y = 630;
  var PIN_HALF_WIDTH = 32;

  var isMapActivated = false;

  var mapElement = document.querySelector('.map');
  var mapPinMainElement = mapElement.querySelector('.map__pin--main');

  var initialMainPinPosition = {
    x: mapPinMainElement.offsetLeft,
    y: mapPinMainElement.offsetTop,
  };

  var limitPinX = function (x) {
    var minMainPinX = PIN_HALF_WIDTH;
    var maxMainPinX = mapElement.offsetWidth - PIN_HALF_WIDTH;

    return window.shared.limit(x, minMainPinX, maxMainPinX);
  };

  var limitPinY = function (y) {
    return window.shared.limit(y, MIN_PIN_Y, MAX_PIN_Y);
  };

  var setMainPinPosition = function (position) {
    mapPinMainElement.style.left = position.x + 'px';
    mapPinMainElement.style.top = position.y + 'px';

    window.form.updateAddress();
  };

  setMainPinPosition(initialMainPinPosition);

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

      var nextPosition = {
        x: mapPinMainElement.offsetLeft - shift.x,
        y: mapPinMainElement.offsetTop - shift.y
      };

      nextPosition.x = limitPinX(nextPosition.x);
      nextPosition.y = limitPinY(nextPosition.y);

      setMainPinPosition(nextPosition);
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
        window.ads.activate();
      }
    },

    deactivate: function () {
      isMapActivated = false;

      window.ads.deactivate();
      setMainPinPosition(initialMainPinPosition);

      mapElement.classList.add('map--faded');
    },
  };
})();
