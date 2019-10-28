'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var mapPinMainElement = mapElement.querySelector('.map__pin--main');

  mapPinMainElement.addEventListener('mousedown', function () {
    window.map.activate();
    window.form.activate();
    window.form.updateAddress();
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

      var ads = window.ads.generate();
      window.ads.append(ads);
    },

    getMainPinAddress: function () {
      var x = window.shared.parseInt(mapPinMainElement.style.left);
      var y = window.shared.parseInt(mapPinMainElement.style.top);
      return x + ', ' + y;
    }
  };
})();
