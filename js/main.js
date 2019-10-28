'use strict';

var NUMBER_OF_ADS = 8;
var KEY_CODE_ENTER = 13;
var KEY_CODE_ESCAPE = 27;
var RADIX_DEC = 10;

var AD_TYPE = {
  BUNGALO: 'bungalo',
  FLAT: 'flat',
  HOUSE: 'house',
  PALACE: 'palace',
};

var AD_NAME = {
  bungalo: 'Бунгало',
  flat: 'Квартира',
  house: 'Дом',
  palace: 'Дворец',
};

var MIN_PRICES = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
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

var mapElement = document.querySelector('.map');
var formElement = document.querySelector('.ad-form');

var mapPinMainElement = mapElement.querySelector('.map__pin--main');
var roomsSelectElement = formElement.querySelector('select[name=rooms]');
var capacitySelectElement = formElement.querySelector('select[name=capacity]');
var typeSelectElement = formElement.querySelector('select[name=type]');
var priceInputElement = formElement.querySelector('input[name=price]');
var timeinSelectElement = formElement.querySelector('select[name=timein]');
var timeoutSelectElement = formElement.querySelector('select[name=timeout]');

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

  var adSelectHandler = function (index) {
    showAdCard(ads[index]);
  };

  ads.forEach(function (ad, index) {
    var pinTemplate = document.querySelector('#pin').cloneNode(true);
    var pinElement = pinTemplate.content.querySelector('.map__pin');

    var pinImageElement = pinElement.querySelector('img');

    // pinElement.dataset.id = index;

    pinElement.style.left = ad.location.x + 'px';
    pinElement.style.top = ad.location.y + 'px';

    pinImageElement.src = ad.author.avatar;
    pinImageElement.alt = ad.title;

    pinElement.addEventListener('click', function () {
      adSelectHandler(index);
    });

    fragment.appendChild(pinElement);
  });

  mapPinsElement.appendChild(fragment);
};

var closeAdCard = function () {
  var prevCardElement = mapElement.querySelector('.map__card');

  if (prevCardElement) {
    mapElement.removeChild(prevCardElement);
  }
};

var showAdCard = function (ad) {
  closeAdCard();

  var cardTemplate = document.querySelector('#card').cloneNode(true);
  var cardElement = cardTemplate.content.querySelector('.map__card');
  var mapFiltersContainerElement = mapElement.querySelector(
      '.map__filters-container'
  );

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
  capacityElement.textContent =
    ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';

  var timeElement = cardElement.querySelector('.popup__text--time');
  timeElement.textContent =
    'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

  var descriptionElement = cardElement.querySelector('.popup__description');
  descriptionElement.textContent = ad.offer.description;

  // Фичи
  var featuresElement = cardElement.querySelector('.popup__features');
  var featureElements = cardElement.querySelectorAll('.popup__feature');

  featureElements.forEach(function (featureElement) {
    featureElement.style.display = 'none';
  });

  ad.offer.features.forEach(function (feature) {
    var featureElement = featuresElement.querySelector(
        '.popup__feature--' + feature
    );
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

  var closeButtonElement = cardElement.querySelector('.popup__close');
  closeButtonElement.addEventListener('click', closeAdCard);

  var keyDownHandler = function (evt) {
    if (evt.keyCode === KEY_CODE_ESCAPE) {
      document.removeEventListener('keydown', keyDownHandler);
      closeAdCard();
    }
  };

  document.addEventListener('keydown', keyDownHandler);

  // Добавляем карточку на страницу
  mapElement.insertBefore(cardElement, mapFiltersContainerElement);
};

var activateMap = function () {
  mapElement.classList.remove('map--faded');

  var ads = generateAds();
  appendAds(ads);
};

var activateForm = function () {
  formElement.classList.remove('ad-form--disabled');

  var fieldsetElements = formElement.querySelectorAll('fieldset');
  fieldsetElements.forEach(function (fieldsetElement) {
    fieldsetElement.disabled = false;
  });
};

var updateAddress = function () {
  var x = parseInt(mapPinMainElement.style.left, RADIX_DEC);
  var y = parseInt(mapPinMainElement.style.top, RADIX_DEC);
  var address = x + ', ' + y;

  var addressInputElement = document.querySelector('input[name=address]');
  addressInputElement.value = address;
};

var validateCapacity = function () {
  var rooms = parseInt(roomsSelectElement.value, RADIX_DEC);
  var guests = parseInt(capacitySelectElement.value, RADIX_DEC);

  if (rooms === 100 && guests > 0) {
    roomsSelectElement.setCustomValidity(
        'Помещение слишком большое для гостей'
    );
    formElement.reportValidity();
    return false;
  }

  if (guests === 0 && rooms !== 100) {
    roomsSelectElement.setCustomValidity('Помещение слишком маленькое');
    formElement.reportValidity();
    return false;
  }

  if (rooms < guests) {
    roomsSelectElement.setCustomValidity(
        'Количество комнат должно быть больше или равно количеству гостей'
    );
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

var formSubmitHandler = function (evt) {
  evt.preventDefault();

  if (validateCapacity()) {
    evt.target.submit();
  }

  formElement.reportValidity();
};

mapPinMainElement.addEventListener('mousedown', function () {
  activateMap();
  activateForm();
  updateAddress();
});

mapPinMainElement.addEventListener('keydown', function (evt) {
  if (evt.keyCode === KEY_CODE_ENTER) {
    activateMap();
    activateForm();
  }
});

roomsSelectElement.addEventListener('change', validateCapacity);
capacitySelectElement.addEventListener('change', validateCapacity);
typeSelectElement.addEventListener('change', typeChangeHandler);
timeinSelectElement.addEventListener('change', timeChangeHandler);
timeoutSelectElement.addEventListener('change', timeChangeHandler);
formElement.addEventListener('submit', formSubmitHandler);
