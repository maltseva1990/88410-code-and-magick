'use strict';


window.form = (function() {
  var formContainer = document.querySelector('.overlay-container');
  var formCloseButton = document.querySelector('.review-form-close');
  /*Находим элементы, с которыми будем работать и сохраняем их в переменные*/
  var formReview = formContainer.querySelector('.review-form');
  var reviewMark = formReview.elements['review-mark'];
  var reviewName = formReview.elements['review-name'];
  var reviewText = formReview.elements['review-text'];
  var reviewSubmitButton = formReview.querySelector('.review-submit');
  var reviewFields = formReview.querySelector('.review-fields');
  var reviewFieldsName = formReview.querySelector('.review-fields-name');
  var reviewFieldsText = formReview.querySelector('.review-fields-text');
  /*Добавляем обработчик событий*/
  reviewName.addEventListener('input', validateForm);
  reviewText.addEventListener('input', validateForm);
  var form = {
    onClose: null,

    /**
     * @param {Function} cb
     */
    open: function(cb) {
      formContainer.classList.remove('invisible');
      cb();
    },

    close: function() {
      formContainer.classList.add('invisible');

      if (typeof this.onClose === 'function') {
        this.onClose();
      }
    }
  };
/*Валидация формы*/
  function validateForm() {
  /*Проверяем поле имя*/
    reviewName.required = true;
    var NameIsValid = Boolean(reviewName.value);
    switchOrToggle(reviewFieldsName, !NameIsValid);

  /*Проверяем, если менее трех звезд*/
    reviewText.required = reviewMark.value < 3;
    var TextIsValid = !reviewText.required || reviewText.value;
    switchOrToggle(reviewFieldsText, !TextIsValid);

  /*Добавляем кнопку и ссылки*/
    var isFieldsValid = NameIsValid && TextIsValid;
    reviewSubmitButton.disabled = !isFieldsValid;
    switchOrToggle(reviewFields, !isFieldsValid);
  }
  /*Функция, чтобы показать/скрыть элемент*/
  function switchOrToggle(elem, show) {
    elem.classList.toggle('invisible', !show);
  }
  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    form.close();
  };
  return form;
})();
