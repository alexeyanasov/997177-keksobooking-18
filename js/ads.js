'use strict';

(function () {
  var DATA_URL = 'https://js.dump.academy/keksobooking/data';

  var AD_NAME = {
    bungalo: 'Бунгало',
    flat: 'Квартира',
    house: 'Дом',
    palace: 'Дворец',
  };

  var mapElement = document.querySelector('.map');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var mainMapPinElement = mapElement.querySelector('.map__pin--main');

  var getAdTypeName = function (type) {
    return AD_NAME[type];
  };

  window.ads = {
    load: function () {
      var onSuccess = function (ads) {
        window.ads.append(ads);
      };

      var onError = function (message) {
        window.shared.showErrorMessage(message, window.ads.load);
      };

      window.network.get(DATA_URL, onSuccess, onError);
    },

    append: function (ads) {
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
    },

    clear: function () {
      var pinElements = mapElement.querySelectorAll('.map__pin');

      pinElements.forEach(function (pinElement) {
        if (pinElement !== mainMapPinElement) {
          mapPinsElement.removeChild(pinElement);
        }
      });
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
