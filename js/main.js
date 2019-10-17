'use strict';

var NUMBER_OF_ADS = 8;

var AD_TYPE = {
  PALACE: 'palace',
  FLAT: 'flat',
  HOUSE: 'house',
  BUNGALO: 'bungalo'
};

var AD_CHECKIN = ['12:00', '13:00', '14:00'];

var AD_CHECKOUT = ['12:00', '13:00', '14:00'];

var AD_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var getRandomNumber = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getAvatar = function (index) {
  return 'img/avatars/user0' + index + '.png';
};

var getRandomAdType = function () {
  var keys = Object.keys(AD_TYPE);
  var index = getRandomNumber(0, keys.length - 1);

  return AD_TYPE[keys[index]];
};

var getRandomLocation = function () {
  return {
    x: getRandomNumber(0, 1200),
    y: getRandomNumber(130, 630)
  };
};

var generateAd = function (index) {
  return {
    author: {
      avatar: getAvatar(index)
    },

    offer: {
      title: 'Title',
      address: '600, 350',
      price: 100,
      type: getRandomAdType(),
      rooms: 1,
      guests: 1,
      checkin: AD_CHECKIN[0],
      checkout: AD_CHECKOUT[0],
      features: AD_FEATURES,
      description: '',
      photos: [
        'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
        'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
        'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
      ]
    },

    location: getRandomLocation()
  };
};

var mapElement = document.querySelector('.map');
mapElement.classList.remove('map--faded');

var generateAds = function () {
  var fragment = document.createDocumentFragment();
  var mapPinsElement = document.querySelector('.map__pins');

  for (var i = 1; i <= NUMBER_OF_ADS; i++) {
    var ad = generateAd(i);

    var pinTemplate = document.querySelector('#pin').cloneNode(true);
    var pinElement = pinTemplate.content.querySelector('.map__pin');

    var pinImageElement = pinElement.querySelector('img');

    pinElement.style.left = ad.location.x + 'px';
    pinElement.style.top = ad.location.y + 'px';

    pinImageElement.src = ad.author.avatar;
    pinImageElement.alt = ad.title;

    fragment.appendChild(pinElement);
  }

  mapPinsElement.appendChild(fragment);
};

generateAds();
