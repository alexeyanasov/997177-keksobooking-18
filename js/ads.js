'use strict';

(function () {
  var DATA_URL = 'https://js.dump.academy/keksobooking/data';
  var PRICE_LOW = 10000;
  var PRICE_HIGH = 50000;

  var AD_NAME = {
    bungalo: 'Бунгало',
    flat: 'Квартира',
    house: 'Дом',
    palace: 'Дворец',
  };

  var mapElement = document.querySelector('.map');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var mainMapPinElement = mapElement.querySelector('.map__pin--main');

  var mapFiltersElement = document.querySelector('.map__filters');
  var mapFiltersSelectElements = mapFiltersElement.querySelectorAll('select');
  var mapFiltersFieldsetElements = mapFiltersElement.querySelectorAll('fieldset');

  var typeSelectElement = mapFiltersElement.querySelector('select[name=housing-type]');
  var priceSelectElement = mapFiltersElement.querySelector('select[name=housing-price]');
  var roomsSelectElement = mapFiltersElement.querySelector('select[name=housing-rooms]');
  var guestsSelectElement = mapFiltersElement.querySelector('select[name=housing-guests]');
  var featuresInputElements = mapFiltersElement.querySelectorAll('input[name=features]');

  var allAds = [];
  var filteredAds = [];
  var filters = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any',
    features: {
      wifi: false,
      dishwasher: false,
      parking: false,
      washer: false,
      elevator: false,
      conditioner: false
    },
    count: 5,
  };

  var getPriceType = function (price) {
    if (price < PRICE_LOW) {
      return 'low';
    }

    if (price > PRICE_HIGH) {
      return 'high';
    }

    return 'middle';
  };

  var getAdTypeName = function (type) {
    return AD_NAME[type];
  };

  var loadPins = function () {
    var onSuccess = function (ads) {
      allAds = ads;
      applyFilters();
    };

    var onError = function (message) {
      window.shared.showErrorMessage(message, loadPins);
    };

    window.network.get(DATA_URL, onSuccess, onError);
  };

  var appendPins = function (ads) {
    var fragment = document.createDocumentFragment();

    var adSelectHandler = function (index) {
      window.ads.showCard(ads[index]);
    };

    ads.forEach(function (ad, index) {
      var pinTemplate = document.querySelector('#pin').cloneNode(true);
      var pinElement = pinTemplate.content.querySelector('.map__pin');

      var pinImageElement = pinElement.querySelector('img');

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

  var removePins = function () {
    var pinElements = mapElement.querySelectorAll('.map__pin');

    pinElements.forEach(function (pinElement) {
      if (pinElement !== mainMapPinElement) {
        mapPinsElement.removeChild(pinElement);
      }
    });
  };

  var applyFilter = function (filter, ads, predicate) {
    if (filters[filter] !== 'any') {
      return ads.filter(predicate);
    }

    return ads;
  };

  var applyFilters = function () {
    filteredAds = allAds;

    filteredAds = applyFilter('type', filteredAds, function (ad) {
      return ad.offer.type === filters.type;
    });

    filteredAds = applyFilter('price', filteredAds, function (ad) {
      var price = getPriceType(ad.offer.price);
      return price === filters.price;
    });

    filteredAds = applyFilter('rooms', filteredAds, function (ad) {
      return ad.offer.rooms === window.shared.parseInt(filters.rooms);
    });

    filteredAds = applyFilter('guests', filteredAds, function (ad) {
      return ad.offer.guests === window.shared.parseInt(filters.guests);
    });

    Object.keys(filters.features).forEach(function (filterFeature) {
      if (!filters.features[filterFeature]) {
        return;
      }

      filteredAds = filteredAds.filter(function (ad) {
        return ad.offer.features.find(function (offerFeature) {
          return offerFeature === filterFeature;
        });
      });
    });

    filteredAds = filteredAds.slice(0, filters.count);

    removePins();
    appendPins(filteredAds);
  };

  var filterChangeHandler = function (filter) {
    return function (evt) {
      filters[filter] = evt.target.value;
      applyFilters();
    };
  };

  var featureChangeHandler = function (evt) {
    var feature = evt.target.value;
    var checked = evt.target.checked;

    filters.features[feature] = checked;
    applyFilters();
  };

  typeSelectElement.addEventListener('change', filterChangeHandler('type'));
  priceSelectElement.addEventListener('change', filterChangeHandler('price'));
  roomsSelectElement.addEventListener('change', filterChangeHandler('rooms'));
  guestsSelectElement.addEventListener('change', filterChangeHandler('guests'));

  featuresInputElements.forEach(function (featureInputElement) {
    featureInputElement.addEventListener('change', featureChangeHandler);
  });

  window.ads = {
    activate: function () {
      mapFiltersElement.classList.remove('.map__filters--disabled');

      mapFiltersSelectElements.forEach(function (selectElement) {
        selectElement.disabled = false;
      });

      mapFiltersFieldsetElements.forEach(function (fieldsetElement) {
        fieldsetElement.disabled = false;
      });

      loadPins();
    },

    deactivate: function () {
      mapFiltersElement.classList.add('.map__filters--disabled');

      mapFiltersSelectElements.forEach(function (selectElement) {
        selectElement.disabled = true;
      });

      mapFiltersFieldsetElements.forEach(function (fieldsetElement) {
        fieldsetElement.disabled = true;
      });

      removePins();
    },

    closeCard: function () {
      var prevCardElement = mapElement.querySelector('.map__card');

      if (prevCardElement) {
        mapElement.removeChild(prevCardElement);
      }
    },

    showCard: function (ad) {
      window.ads.closeCard();

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
      closeButtonElement.addEventListener('click', window.ads.closeCard);

      var keyDownHandler = function (evt) {
        if (evt.keyCode === window.shared.KEY_CODE_ESCAPE) {
          document.removeEventListener('keydown', keyDownHandler);
          window.ads.closeCard();
        }
      };

      document.addEventListener('keydown', keyDownHandler);

      // Добавляем карточку на страницу
      mapElement.insertBefore(cardElement, mapFiltersContainerElement);
    }
  };
})();
