// Функция получает значения, проверяет их и возвращает сообщения

function getMessage (a, b) {
    if (typeof (a) === 'boolean' {
      if (a) {
        return ('Я попал в b');
    } // если а true
      else  {
        return ('Я никуда не попал');
    } // если a false
  }
    if (typeof (a) === 'number') {
      return ('Я прыгнул на ' + a * 100 + ' сантиметров';)
  }
    if (Array.isArray(a) {
-     var numberOfSteps = summArrays(a);
-     return 'Я прошёл '+ numberOfSteps +' шагов';
-  }
    if (Array.isArray(a) && Array.isArray(b)) {
+     var distancePath = calculatePath(a, b);
+     return 'Я прошёл ' + distancePath + ' метров';
  }
};

// getMessage (a, b); - надо ли вызывать функцию или она вызывается в другом js файле?
