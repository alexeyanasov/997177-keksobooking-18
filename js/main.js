'use strict';

var NUMBER_OF_ADS = 8;

var AD_TYPE = {
  PALACE: 'palace',
  FLAT: 'flat',
  HOUSE: 'house',
  BUNGALO: 'bungalo'
};

var AD_NAME = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
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

var getAdTypeName = function (type) {
  return AD_NAME[type];
};

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
  var ads = [];

  for (var i = 1; i <= NUMBER_OF_ADS; i++) {
    var ad = generateAd(i);
    ads.push(ad);
  }

  return ads;
};

var appendAds = function (ads) {
  var fragment = document.createDocumentFragment();
  var mapPinsElement = document.querySelector('.map__pins');

  ads.forEach(function (ad) {
    var pinTemplate = document.querySelector('#pin').cloneNode(true);
    var pinElement = pinTemplate.content.querySelector('.map__pin');

    var pinImageElement = pinElement.querySelector('img');

    pinElement.style.left = ad.location.x + 'px';
    pinElement.style.top = ad.location.y + 'px';

    pinImageElement.src = ad.author.avatar;
    pinImageElement.alt = ad.title;

    fragment.appendChild(pinElement);
  });

  mapPinsElement.appendChild(fragment);
};

var showAdCard = function (ad) {
  var cardTemplate = document.querySelector('#card').cloneNode(true);
  var cardElement = cardTemplate.content.querySelector('.map__card');
  var mapFiltersContainerElement = mapElement.querySelector('.map__filters-container');

  var avatarElement = cardElement.querySelector('.popup__avatar');
  avatarElement.src = ad.author.avatar;
  avatarElement.alt = ad.offer.title;

  var titleElement = cardElement.querySelector('.popup__title');
  titleElement.textContent = ad.offer.title;

  var addressElement = cardElement.querySelector('.popup__text--address');
  addressElement.textContent = ad.offer.address;

  var priceElement = cardElement.querySelector('.popup__text--price');
  priceElement.textContent = ad.offer.price + '₽/ночь';

  var typeElement = cardElement.querySelector('.popup__type');
  typeElement.textContent = getAdTypeName(ad.offer.type);

  var capacityElement = cardElement.querySelector('.popup__text--capacity');
  capacityElement.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';

  var timeElement = cardElement.querySelector('.popup__text--time');
  timeElement.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

  var descriptionElement = cardElement.querySelector('.popup__description');
  descriptionElement.textContent = ad.offer.description;

  // Фичи
  var featuresElement = cardElement.querySelector('.popup__features');
  var featureElements = cardElement.querySelectorAll('.popup__feature');

  featureElements.forEach(function (featureElement) {
    featureElement.style.display = 'none';
  });

  ad.offer.features.forEach(function (feature) {
    var featureElement = featuresElement.querySelector('.popup__feature--' + feature);
    featureElement.style.display = 'inline-block';
  });

  // Фото
  var photosFragment = document.createDocumentFragment();
  var photosElement = cardElement.querySelector('.popup__photos');
  var dummyPhotoElement = photosElement.querySelector('.popup__photo');

  ad.offer.photos.forEach(function (photo) {
    var photoElement = cardElement.querySelector('.popup__photo').cloneNode();
    photoElement.src = photo;

    photosFragment.appendChild(photoElement);
  });

  photosElement.removeChild(dummyPhotoElement);
  photosElement.appendChild(photosFragment);

  // Добавляем карточку на страницу
  mapElement.insertBefore(cardElement, mapFiltersContainerElement);
};

var ads = generateAds();
appendAds(ads);
showAdCard(ads[0]);
