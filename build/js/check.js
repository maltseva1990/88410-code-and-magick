// Функция получает значения, проверяет их и возвращает сообщения

function getMessage (a, b) {
    var numberOfSteps;
    var distancePath;

    function calculatePath (a, b) {
      var sum = 0;
      for (var i = 0; i < a.length; i++) {
        sum = sum + (a[i] * b[i]);
      }
      return sum;
    }
    function summOfArray (arr) {
      var sum = 0;
      for (var i = 0; i < arr.length; i++) {
        sum = sum + arr[i];
      }
      return sum;
    }
    if (typeof (a) === 'boolean') {

      if (a) {
        return ('Я попал в' + b);
    } // если а true
      else  {
        return ('Я никуда не попал');
    } // если a false
  }
    if (typeof (a) === 'number') {
      return ('Я прыгнул на ' + a * 100 + ' сантиметров')
  }
    if (Array.isArray(a) && !Array.isArray(b)) {
      numberOfSteps = summOfArray(a);
      return 'Я прошёл '+ numberOfSteps +' шагов';
}
    if (Array.isArray(a) && Array.isArray(b)) {
      var distancePath = calculatePath(a, b);
      return 'Я прошёл ' + distancePath + ' метров';
  }
};
