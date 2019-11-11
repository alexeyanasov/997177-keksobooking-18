'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var avatarFileChooser = document.querySelector('.ad-form__field input[type=file]');
  var avatarPreview = document.querySelector('.ad-form-header__preview');

  var houseFileChooser = document.querySelector('.ad-form__upload input[type=file]');
  var housePreview = document.querySelector('.ad-form__photo');

  var avatarFileLoadHandler = function () {
    var file = avatarFileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (extension) {
      return fileName.endsWith(extension);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreview.querySelector('img').src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  var houseFileLoadHandler = function () {
    var file = houseFileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (extension) {
      return fileName.endsWith(extension);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        housePreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  avatarFileChooser.addEventListener('change', avatarFileLoadHandler);
  houseFileChooser.addEventListener('change', houseFileLoadHandler);
})();
