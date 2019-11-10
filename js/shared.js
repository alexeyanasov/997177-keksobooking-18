'use strict';

(function () {
  var KEY_CODE_ENTER = 13;
  var KEY_CODE_ESCAPE = 27;
  var RADIX_DEC = 10;

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
    }
  };
})();
