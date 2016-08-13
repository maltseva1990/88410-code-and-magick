/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	window.form = (function() {
	  var formContainer = document.querySelector('.overlay-container');
	  var formCloseButton = document.querySelector('.review-form-close');
	
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
	
	
	  formCloseButton.onclick = function(evt) {
	    evt.preventDefault();
	    form.close();
	  };
	
	  return form;
	})();


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	window.Game = (function() {
	  /**
	   * @const
	   * @type {number}
	   */
	  var HEIGHT = 300;
	
	  /**
	   * @const
	   * @type {number}
	   */
	  var WIDTH = 700;
	
	  /**
	   * ID уровней.
	   * @enum {number}
	   */
	  var Level = {
	    INTRO: 0,
	    MOVE_LEFT: 1,
	    MOVE_RIGHT: 2,
	    LEVITATE: 3,
	    HIT_THE_MARK: 4
	  };
	
	  /**
	   * Порядок прохождения уровней.
	   * @type {Array.<Level>}
	   */
	  var LevelSequence = [
	    Level.INTRO
	  ];
	
	  /**
	   * Начальный уровень.
	   * @type {Level}
	   */
	  var INITIAL_LEVEL = LevelSequence[0];
	
	  /**
	   * Допустимые виды объектов на карте.
	   * @enum {number}
	   */
	  var ObjectType = {
	    ME: 0,
	    FIREBALL: 1
	  };
	
	  /**
	   * Допустимые состояния объектов.
	   * @enum {number}
	   */
	  var ObjectState = {
	    OK: 0,
	    DISPOSED: 1
	  };
	
	  /**
	   * Коды направлений.
	   * @enum {number}
	   */
	  var Direction = {
	    NULL: 0,
	    LEFT: 1,
	    RIGHT: 2,
	    UP: 4,
	    DOWN: 8
	  };
	
	  /**
	   * Правила перерисовки объектов в зависимости от состояния игры.
	   * @type {Object.<ObjectType, function(Object, Object, number): Object>}
	   */
	  var ObjectsBehaviour = {};
	
	  /**
	   * Обновление движения мага. Движение мага зависит от нажатых в данный момент
	   * стрелок. Маг может двигаться одновременно по горизонтали и по вертикали.
	   * На движение мага влияет его пересечение с препятствиями.
	   * @param {Object} object
	   * @param {Object} state
	   * @param {number} timeframe
	   */
	  ObjectsBehaviour[ObjectType.ME] = function(object, state, timeframe) {
	    // Пока зажата стрелка вверх, маг сначала поднимается, а потом левитирует
	    // в воздухе на определенной высоте.
	    // NB! Сложность заключается в том, что поведение описано в координатах
	    // канваса, а не координатах, относительно нижней границы игры.
	    if (state.keysPressed.UP && object.y > 0) {
	      object.direction = object.direction & ~Direction.DOWN;
	      object.direction = object.direction | Direction.UP;
	      object.y -= object.speed * timeframe * 2;
	
	      if (object.y < 0) {
	        object.y = 0;
	      }
	    }
	
	    // Если стрелка вверх не зажата, а маг находится в воздухе, он плавно
	    // опускается на землю.
	    if (!state.keysPressed.UP) {
	      if (object.y < HEIGHT - object.height) {
	        object.direction = object.direction & ~Direction.UP;
	        object.direction = object.direction | Direction.DOWN;
	        object.y += object.speed * timeframe / 3;
	      } else {
	        object.Direction = object.direction & ~Direction.DOWN;
	      }
	    }
	
	    // Если зажата стрелка влево, маг перемещается влево.
	    if (state.keysPressed.LEFT) {
	      object.direction = object.direction & ~Direction.RIGHT;
	      object.direction = object.direction | Direction.LEFT;
	      object.x -= object.speed * timeframe;
	    }
	
	    // Если зажата стрелка вправо, маг перемещается вправо.
	    if (state.keysPressed.RIGHT) {
	      object.direction = object.direction & ~Direction.LEFT;
	      object.direction = object.direction | Direction.RIGHT;
	      object.x += object.speed * timeframe;
	    }
	
	    // Ограничения по перемещению по полю. Маг не может выйти за пределы поля.
	    if (object.y < 0) {
	      object.y = 0;
	      object.Direction = object.direction & ~Direction.DOWN;
	      object.Direction = object.direction & ~Direction.UP;
	    }
	
	    if (object.y > HEIGHT - object.height) {
	      object.y = HEIGHT - object.height;
	      object.Direction = object.direction & ~Direction.DOWN;
	      object.Direction = object.direction & ~Direction.UP;
	    }
	
	    if (object.x < 0) {
	      object.x = 0;
	    }
	
	    if (object.x > WIDTH - object.width) {
	      object.x = WIDTH - object.width;
	    }
	  };
	
	  /**
	   * Обновление движения файрбола. Файрбол выпускается в определенном направлении
	   * и после этого неуправляемо движется по прямой в заданном направлении. Если
	   * он пролетает весь экран насквозь, он исчезает.
	   * @param {Object} object
	   * @param {Object} state
	   * @param {number} timeframe
	   */
	  ObjectsBehaviour[ObjectType.FIREBALL] = function(object, state, timeframe) {
	    if (object.direction & Direction.LEFT) {
	      object.x -= object.speed * timeframe;
	    }
	
	    if (object.direction & Direction.RIGHT) {
	      object.x += object.speed * timeframe;
	    }
	
	    if (object.x < 0 || object.x > WIDTH) {
	      object.state = ObjectState.DISPOSED;
	    }
	  };
	
	  /**
	   * ID возможных ответов функций, проверяющих успех прохождения уровня.
	   * CONTINUE говорит о том, что раунд не закончен и игру нужно продолжать,
	   * WIN о том, что раунд выигран, FAIL — о поражении. PAUSE о том, что игру
	   * нужно прервать.
	   * @enum {number}
	   */
	  var Verdict = {
	    CONTINUE: 0,
	    WIN: 1,
	    FAIL: 2,
	    PAUSE: 3,
	    INTRO: 4
	  };
	
	  /**
	   * Правила завершения уровня. Ключами служат ID уровней, значениями функции
	   * принимающие на вход состояние уровня и возвращающие true, если раунд
	   * можно завершать или false если нет.
	   * @type {Object.<Level, function(Object):boolean>}
	   */
	  var LevelsRules = {};
	
	  /**
	   * Уровень считается пройденным, если был выпущен файлболл и он улетел
	   * за экран.
	   * @param {Object} state
	   * @return {Verdict}
	   */
	  LevelsRules[Level.INTRO] = function(state) {
	    var fireballs = state.garbage.filter(function(object) {
	      return object.type === ObjectType.FIREBALL;
	    });
	
	    return fireballs.length ? Verdict.WIN : Verdict.CONTINUE;
	  };
	
	  /**
	   * Начальные условия для уровней.
	   * @enum {Object.<Level, function>}
	   */
	  var LevelsInitialize = {};
	
	  /**
	   * Первый уровень.
	   * @param {Object} state
	   * @return {Object}
	   */
	  LevelsInitialize[Level.INTRO] = function(state) {
	    state.objects.push(
	      // Установка персонажа в начальное положение. Он стоит в крайнем левом
	      // углу экрана, глядя вправо. Скорость перемещения персонажа на этом
	      // уровне равна 2px за кадр.
	      {
	        direction: Direction.RIGHT,
	        height: 84,
	        speed: 2,
	        sprite: 'img/wizard.gif',
	        spriteReversed: 'img/wizard-reversed.gif',
	        state: ObjectState.OK,
	        type: ObjectType.ME,
	        width: 61,
	        x: WIDTH / 3,
	        y: HEIGHT - 100
	      }
	    );
	
	    return state;
	  };
	
	  /**
	   * Конструктор объекта Game. Создает canvas, добавляет обработчики событий
	   * и показывает приветственный экран.
	   * @param {Element} container
	   * @constructor
	   */
	  var Game = function(container) {
	    this.container = container;
	    this.canvas = document.createElement('canvas');
	    this.canvas.width = container.clientWidth;
	    this.canvas.height = container.clientHeight;
	    this.container.appendChild(this.canvas);
	
	    this.ctx = this.canvas.getContext('2d');
	
	    this._onKeyDown = this._onKeyDown.bind(this);
	    this._onKeyUp = this._onKeyUp.bind(this);
	    this._pauseListener = this._pauseListener.bind(this);
	
	    this.setDeactivated(false);
	  };
	
	  Game.prototype = {
	    /**
	     * Текущий уровень игры.
	     * @type {Level}
	     */
	    level: INITIAL_LEVEL,
	
	    /** @param {boolean} deactivated */
	    setDeactivated: function(deactivated) {
	      if (this._deactivated === deactivated) {
	        return;
	      }
	
	      this._deactivated = deactivated;
	
	      if (deactivated) {
	        this._removeGameListeners();
	      } else {
	        this._initializeGameListeners();
	      }
	    },
	
	    /**
	     * Состояние игры. Описывает местоположение всех объектов на игровой карте
	     * и время проведенное на уровне и в игре.
	     * @return {Object}
	     */
	    getInitialState: function() {
	      return {
	        // Статус игры. Если CONTINUE, то игра продолжается.
	        currentStatus: Verdict.CONTINUE,
	
	        // Объекты, удаленные на последнем кадре.
	        garbage: [],
	
	        // Время с момента отрисовки предыдущего кадра.
	        lastUpdated: null,
	
	        // Состояние нажатых клавиш.
	        keysPressed: {
	          ESC: false,
	          LEFT: false,
	          RIGHT: false,
	          SPACE: false,
	          UP: false
	        },
	
	        // Время начала прохождения уровня.
	        levelStartTime: null,
	
	        // Все объекты на карте.
	        objects: [],
	
	        // Время начала прохождения игры.
	        startTime: null
	      };
	    },
	
	    /**
	     * Начальные проверки и запуск текущего уровня.
	     * @param {Level=} level
	     * @param {boolean=} restart
	     */
	    initializeLevelAndStart: function(level, restart) {
	      level = typeof level === 'undefined' ? this.level : level;
	      restart = typeof restart === 'undefined' ? true : restart;
	
	      if (restart || !this.state) {
	        // При перезапуске уровня, происходит полная перезапись состояния
	        // игры из изначального состояния.
	        this.state = this.getInitialState();
	        this.state = LevelsInitialize[this.level](this.state);
	      } else {
	        // При продолжении уровня состояние сохраняется, кроме записи о том,
	        // что состояние уровня изменилось с паузы на продолжение игры.
	        this.state.currentStatus = Verdict.CONTINUE;
	      }
	
	      // Запись времени начала игры и времени начала уровня.
	      this.state.levelStartTime = Date.now();
	      if (!this.state.startTime) {
	        this.state.startTime = this.state.levelStartTime;
	      }
	
	      this._preloadImagesForLevel(function() {
	        // Предварительная отрисовка игрового экрана.
	        this.render();
	
	        // Установка обработчиков событий.
	        this._initializeGameListeners();
	
	        // Запуск игрового цикла.
	        this.update();
	      }.bind(this));
	    },
	
	    /**
	     * Временная остановка игры.
	     * @param {Verdict=} verdict
	     */
	    pauseLevel: function(verdict) {
	      if (verdict) {
	        this.state.currentStatus = verdict;
	      }
	
	      this.state.keysPressed.ESC = false;
	      this.state.lastUpdated = null;
	
	      this._removeGameListeners();
	      window.addEventListener('keydown', this._pauseListener);
	
	      this._drawPauseScreen();
	    },
	
	    /**
	     * Обработчик событий клавиатуры во время паузы.
	     * @param {KeyboardsEvent} evt
	     * @private
	     * @private
	     */
	    _pauseListener: function(evt) {
	      if (evt.keyCode === 32 && !this._deactivated) {
	        evt.preventDefault();
	        var needToRestartTheGame = this.state.currentStatus === Verdict.WIN ||
	            this.state.currentStatus === Verdict.FAIL;
	        this.initializeLevelAndStart(this.level, needToRestartTheGame);
	
	        window.removeEventListener('keydown', this._pauseListener);
	      }
	    },
	
	    /**
	     * Отрисовка экрана паузы.
	     */
	    showMessage: function(message, messageWidth) {
	      messageWidth = messageWidth || 200;
	      var words = message.split(' ');
	      var countWords = words.length;
	      var line = '';
	      var lineNumber = '';
	      var lineStorage = {};
	      var countLines = 0;
	      var fontSize = 16;
	      this.ctx.font = fontSize + 'px PT Mono';
	
	      for (var i = 0; i < countWords; i++) {
	        var currentLine = line + words[i];
	        var currentWidth = this.ctx.measureText(currentLine).width;
	        if (currentWidth > messageWidth) {
	          countLines++;
	          lineNumber = 'line' + countLines;
	          lineStorage[lineNumber] = line;
	          line = words[i] + ' ';
	        } else {
	          line = currentLine + ' ';
	        }
	      }
	      countLines++;
	      lineNumber = 'line' + countLines;
	      lineStorage[lineNumber] = line.slice(0, -2);
	
	      var lineSpacing = 1.5;
	      var bGroundPadding = 40;
	      var bGroundWidth = messageWidth + bGroundPadding;
	      var bGroundHeight = fontSize * lineSpacing * countLines + bGroundPadding;
	      var bGroundPosX = WIDTH / 2 - bGroundWidth / 2;
	      var bGroundPosY = HEIGHT / 2 - bGroundHeight / 2;
	      var textPosX = bGroundPosX + bGroundPadding / 2;
	      var textPosY = bGroundPosY + bGroundPadding / 2;
	
	      this.ctx.shadowOffsetX = 7;
	      this.ctx.shadowOffsetY = 7;
	      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
	      this.ctx.fillStyle = '#FFFFFF';
	      this.ctx.fillRect(bGroundPosX, bGroundPosY, bGroundWidth, bGroundHeight);
	
	      var count = 0;
	      for (var j = 1; j <= Object.keys(lineStorage).length; j++) {
	        this.ctx.shadowOffsetX = 0;
	        this.ctx.shadowOffsetY = 0;
	        this.ctx.textBaseline = 'hanging';
	        this.ctx.fillStyle = 'darkblue';
	        this.ctx.fillText(lineStorage['line' + j], textPosX, textPosY + (fontSize * lineSpacing * count));
	        count++;
	      }
	    },
	
	    _drawPauseScreen: function() {
	      switch (this.state.currentStatus) {
	        case Verdict.WIN:
	
	          this.showMessage('You have won!', 150);
	          break;
	        case Verdict.FAIL:
	
	          this.showMessage('You have failed!', 200);
	          break;
	
	        case Verdict.PAUSE:
	          this.showMessage('Game is on pause!', 200);
	          break;
	        case Verdict.INTRO:
	
	          this.showMessage('Welcome to the game! You know what to do in order to start ', 200);
	          break;
	      }
	    },
	
	    /**
	     * Предзагрузка необходимых изображений для уровня.
	     * @param {function} callback
	     * @private
	     */
	    _preloadImagesForLevel: function(callback) {
	      if (typeof this._imagesArePreloaded === 'undefined') {
	        this._imagesArePreloaded = [];
	      }
	
	      if (this._imagesArePreloaded[this.level]) {
	        callback();
	        return;
	      }
	
	      var levelImages = [];
	      this.state.objects.forEach(function(object) {
	        levelImages.push(object.sprite);
	
	        if (object.spriteReversed) {
	          levelImages.push(object.spriteReversed);
	        }
	      });
	
	      var i = levelImages.length;
	      var imagesToGo = levelImages.length;
	
	      while (i-- > 0) {
	        var image = new Image();
	        image.src = levelImages[i];
	        image.onload = function() {
	          if (--imagesToGo === 0) {
	            this._imagesArePreloaded[this.level] = true;
	            callback();
	          }
	        }.bind(this);
	      }
	    },
	
	    /**
	     * Обновление статуса объектов на экране. Добавляет объекты, которые должны
	     * появиться, выполняет проверку поведения всех объектов и удаляет те, которые
	     * должны исчезнуть.
	     * @param {number} delta Время, прошеднее с отрисовки прошлого кадра.
	     */
	    updateObjects: function(delta) {
	      // Персонаж.
	      var me = this.state.objects.filter(function(object) {
	        return object.type === ObjectType.ME;
	      })[0];
	
	      // Добавляет на карту файрбол по нажатию на Shift.
	      if (this.state.keysPressed.SHIFT) {
	        this.state.objects.push({
	          direction: me.direction,
	          height: 24,
	          speed: 5,
	          sprite: 'img/fireball.gif',
	          type: ObjectType.FIREBALL,
	          width: 24,
	          x: me.direction & Direction.RIGHT ? me.x + me.width : me.x - 24,
	          y: me.y + me.height / 2
	        });
	
	        this.state.keysPressed.SHIFT = false;
	      }
	
	      this.state.garbage = [];
	
	      // Убирает в garbage не используемые на карте объекты.
	      var remainingObjects = this.state.objects.filter(function(object) {
	        ObjectsBehaviour[object.type](object, this.state, delta);
	
	        if (object.state === ObjectState.DISPOSED) {
	          this.state.garbage.push(object);
	          return false;
	        }
	
	        return true;
	      }, this);
	
	      this.state.objects = remainingObjects;
	    },
	
	    /**
	     * Проверка статуса текущего уровня.
	     */
	    checkStatus: function() {
	      // Нет нужны запускать проверку, нужно ли останавливать уровень, если
	      // заранее известно, что да.
	      if (this.state.currentStatus !== Verdict.CONTINUE) {
	        return;
	      }
	
	      if (!this.commonRules) {
	        /**
	         * Проверки, не зависящие от уровня, но влияющие на его состояние.
	         * @type {Array.<functions(Object):Verdict>}
	         */
	        this.commonRules = [
	          /**
	           * Если персонаж мертв, игра прекращается.
	           * @param {Object} state
	           * @return {Verdict}
	           */
	          function checkDeath(state) {
	            var me = state.objects.filter(function(object) {
	              return object.type === ObjectType.ME;
	            })[0];
	
	            return me.state === ObjectState.DISPOSED ?
	                Verdict.FAIL :
	                Verdict.CONTINUE;
	          },
	
	          /**
	           * Если нажата клавиша Esc игра ставится на паузу.
	           * @param {Object} state
	           * @return {Verdict}
	           */
	          function checkKeys(state) {
	            return state.keysPressed.ESC ? Verdict.PAUSE : Verdict.CONTINUE;
	          },
	
	          /**
	           * Игра прекращается если игрок продолжает играть в нее два часа подряд.
	           * @param {Object} state
	           * @return {Verdict}
	           */
	          function checkTime(state) {
	            return Date.now() - state.startTime > 3 * 60 * 1000 ?
	                Verdict.FAIL :
	                Verdict.CONTINUE;
	          }
	        ];
	      }
	
	      // Проверка всех правил влияющих на уровень. Запускаем цикл проверок
	      // по всем универсальным проверкам и проверкам конкретного уровня.
	      // Цикл продолжается до тех пор, пока какая-либо из проверок не вернет
	      // любое другое состояние кроме CONTINUE или пока не пройдут все
	      // проверки. После этого состояние сохраняется.
	      var allChecks = this.commonRules.concat(LevelsRules[this.level]);
	      var currentCheck = Verdict.CONTINUE;
	      var currentRule;
	
	      while (currentCheck === Verdict.CONTINUE && allChecks.length) {
	        currentRule = allChecks.shift();
	        currentCheck = currentRule(this.state);
	      }
	
	      this.state.currentStatus = currentCheck;
	    },
	
	    /**
	     * Принудительная установка состояния игры. Используется для изменения
	     * состояния игры от внешних условий, например, когда необходимо остановить
	     * игру, если она находится вне области видимости и установить вводный
	     * экран.
	     * @param {Verdict} status
	     */
	    setGameStatus: function(status) {
	      if (this.state.currentStatus !== status) {
	        this.state.currentStatus = status;
	      }
	    },
	
	    /**
	     * Отрисовка всех объектов на экране.
	     */
	    render: function() {
	      // Удаление всех отрисованных на странице элементов.
	      this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
	
	      // Выставление всех элементов, оставшихся в this.state.objects согласно
	      // их координатам и направлению.
	      this.state.objects.forEach(function(object) {
	        if (object.sprite) {
	          var image = new Image(object.width, object.height);
	          image.src = (object.spriteReversed && object.direction & Direction.LEFT) ?
	              object.spriteReversed :
	              object.sprite;
	          this.ctx.drawImage(image, object.x, object.y, object.width, object.height);
	        }
	      }, this);
	    },
	
	    /**
	     * Основной игровой цикл. Сначала проверяет состояние всех объектов игры
	     * и обновляет их согласно правилам их поведения, а затем запускает
	     * проверку текущего раунда. Рекурсивно продолжается до тех пор, пока
	     * проверка не вернет состояние FAIL, WIN или PAUSE.
	     */
	    update: function() {
	      if (!this.state.lastUpdated) {
	        this.state.lastUpdated = Date.now();
	      }
	
	      var delta = (Date.now() - this.state.lastUpdated) / 10;
	      this.updateObjects(delta);
	      this.checkStatus();
	
	      switch (this.state.currentStatus) {
	        case Verdict.CONTINUE:
	          this.state.lastUpdated = Date.now();
	          this.render();
	          requestAnimationFrame(function() {
	            this.update();
	          }.bind(this));
	          break;
	
	        case Verdict.WIN:
	        case Verdict.FAIL:
	        case Verdict.PAUSE:
	        case Verdict.INTRO:
	          this.pauseLevel();
	          break;
	      }
	    },
	
	    /**
	     * @param {KeyboardEvent} evt [description]
	     * @private
	     */
	    _onKeyDown: function(evt) {
	      switch (evt.keyCode) {
	        case 37:
	          this.state.keysPressed.LEFT = true;
	          break;
	        case 39:
	          this.state.keysPressed.RIGHT = true;
	          break;
	        case 38:
	          this.state.keysPressed.UP = true;
	          break;
	        case 27:
	          this.state.keysPressed.ESC = true;
	          break;
	      }
	
	      if (evt.shiftKey) {
	        this.state.keysPressed.SHIFT = true;
	      }
	    },
	
	    /**
	     * @param {KeyboardEvent} evt [description]
	     * @private
	     */
	    _onKeyUp: function(evt) {
	      switch (evt.keyCode) {
	        case 37:
	          this.state.keysPressed.LEFT = false;
	          break;
	        case 39:
	          this.state.keysPressed.RIGHT = false;
	          break;
	        case 38:
	          this.state.keysPressed.UP = false;
	          break;
	        case 27:
	          this.state.keysPressed.ESC = false;
	          break;
	      }
	
	      if (evt.shiftKey) {
	        this.state.keysPressed.SHIFT = false;
	      }
	    },
	
	    /** @private */
	    _initializeGameListeners: function() {
	      window.addEventListener('keydown', this._onKeyDown);
	      window.addEventListener('keyup', this._onKeyUp);
	    },
	
	    /** @private */
	    _removeGameListeners: function() {
	      window.removeEventListener('keydown', this._onKeyDown);
	      window.removeEventListener('keyup', this._onKeyUp);
	    }
	  };
	
	  Game.Verdict = Verdict;
	
	  return Game;
	})();


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";!function(){function a(a,b,c,d,e,f){for(var g=b.split("\n"),h=0;h<g.length;h++){for(var i="",j=g[h].split(" "),k=0;k<j.length;k++){var l=i+j[k]+" ",m=a.measureText(l),n=m.width;n>e?(a.fillText(i,c,d),i=j[k]+" ",d+=f):i=l}a.fillText(i,c,d),d+=f}}function b(a,b,c){c.moveTo(a+.3*e,b+.3*d),c.lineTo(a+.8*e,b+.3*d-10),c.lineTo(a+.8*e-30,b+.7*d),c.lineTo(a+.3*e-30,b+.7*d+30),c.lineTo(a+.3*e+4,b+.3*d-4),c.fill(),c.stroke()}function c(){return"function"==typeof window.getMessage?window.getMessage.apply(null,arguments):"\u041d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430 \u0444\u0443\u043d\u043a\u0446\u0438\u044f getMessage, \u043a\u043e\u0442\u043e\u0440\u0430\u044f \u0434\u043e\u043b\u0436\u043d\u0430 \u0431\u044b\u0442\u044c \u043e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0430 \u0432 \u0433\u043b\u043e\u0431\u0430\u043b\u044c\u043d\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 \u0432\u0438\u0434\u0438\u043c\u043e\u0441\u0442\u0438 \u0432 \u0444\u0430\u0439\u043b\u0435 check.js"}function s(){var a=q.container.getBoundingClientRect();(a.bottom<.75*d||a.top>window.innerHeight-.5*d)&&q.setGameStatus(p.Verdict.PAUSE)}function w(){var a=r.getBoundingClientRect();a.bottom>0&&(r.style.backgroundPositionX=-document.body.scrollTop/2+"px")}var d=300,e=700,f={INTRO:0},g=[f.INTRO],h=g[0],i={ME:0,FIREBALL:1},j={OK:0,DISPOSED:1},k={NULL:0,LEFT:1,RIGHT:2,UP:4,DOWN:8},l={};l[i.ME]=function(a,b,c){b.keysPressed.UP&&a.y>0&&(a.direction=a.direction&~k.DOWN,a.direction=a.direction|k.UP,a.y-=a.speed*c*2,a.y<0&&(a.y=0)),b.keysPressed.UP||(a.y<d-a.height?(a.direction=a.direction&~k.UP,a.direction=a.direction|k.DOWN,a.y+=a.speed*c/3):a.direction=a.direction&~k.DOWN),b.keysPressed.LEFT&&(a.direction=a.direction&~k.RIGHT,a.direction=a.direction|k.LEFT,a.x-=a.speed*c),b.keysPressed.RIGHT&&(a.direction=a.direction&~k.LEFT,a.direction=a.direction|k.RIGHT,a.x+=a.speed*c),a.y<0&&(a.y=0,a.Direction=a.direction&~k.DOWN,a.Direction=a.direction&~k.UP),a.y>d-a.height&&(a.y=d-a.height,a.Direction=a.direction&~k.DOWN,a.Direction=a.direction&~k.UP),a.x<0&&(a.x=0),a.x>e-a.width&&(a.x=e-a.width)},l[i.FIREBALL]=function(a,b,c){a.direction&k.LEFT&&(a.x-=a.speed*c),a.direction&k.RIGHT&&(a.x+=a.speed*c),(a.x<0||a.x>e)&&(a.state=j.DISPOSED)};var m={CONTINUE:0,WIN:1,FAIL:2,PAUSE:3,INTRO:4},n={};n[f.INTRO]=function(){return m.CONTINUE};var o={};o[f.INTRO]=function(a){return a.objects.push({direction:k.RIGHT,height:84,speed:2,sprite:"img/wizard.gif",spriteReversed:"img/wizard-reversed.gif",state:j.OK,type:i.ME,width:61,x:e/2,y:d-100}),a};var p=function(a){this.container=a,this.canvas=document.createElement("canvas"),this.canvas.width=a.clientWidth,this.canvas.height=a.clientHeight,this.container.appendChild(this.canvas),this.ctx=this.canvas.getContext("2d"),this._onKeyDown=this._onKeyDown.bind(this),this._onKeyUp=this._onKeyUp.bind(this),this._pauseListener=this._pauseListener.bind(this)};p.prototype={level:h,getInitialState:function(){return{currentStatus:m.CONTINUE,garbage:[],lastUpdated:null,keysPressed:{ESC:!1,LEFT:!1,RIGHT:!1,SPACE:!1,UP:!1},levelStartTime:null,objects:[],startTime:null,customMessage:null}},initializeLevelAndStart:function(a,b){a="undefined"==typeof a?this.level:a,b="undefined"==typeof b?!0:b,b||!this.state?this.state=this._getInitialLevelState(this.level):this.state.currentStatus=m.CONTINUE,this.state.levelStartTime=Date.now(),this.state.startTime||(this.state.startTime=this.state.levelStartTime),this._preloadImagesForLevel(function(){this.render(),this._initializeGameListeners(),this.update()}.bind(this))},pauseLevel:function(a){a&&(this.state.currentStatus=a),this.state.keysPressed.ESC=!1,this.state.lastUpdated=null,this._removeGameListeners(),window.addEventListener("keydown",this._pauseListener),this._drawPauseScreen()},_pauseListener:function(a){if(32===a.keyCode){a.preventDefault();var b=this.state.currentStatus===m.WIN||this.state.currentStatus===m.FAIL;this.initializeLevelAndStart(this.level,b),window.removeEventListener("keydown",this._pauseListener)}},_drawMessage:function(c,f){f=!!f,f?this.ctx.strokeStyle="red":this.ctx.strokeStyle="#0066ff",this.ctx.lineWidth=10,this.ctx.fillStyle="white",this.ctx.font="16px PT Mono",b(0,0,this.ctx),this.ctx.fillStyle="black";var g=.3*d+30;f||(g+=30),a(this.ctx,c,.3*e+15,g,.75*e-.3*e-10,20)},_drawPauseScreen:function(){switch(this.state.currentStatus){case m.WIN:this._drawMessage(this.state.customMessage+". \u041f\u0440\u043e\u0431\u0435\u043b \u0434\u043b\u044f \u0440\u0435\u0441\u0442\u0430\u0440\u0442\u0430."||"you have won!");break;case m.FAIL:this._drawMessage(this.state.customMessage+". \u041f\u0440\u043e\u0431\u0435\u043b \u0434\u043b\u044f \u0440\u0435\u0441\u0442\u0430\u0440\u0442\u0430."||"you have failed!",!0);break;case m.PAUSE:this._drawMessage("\u041f\u0430\u0443\u0437\u0430. \u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u043f\u0440\u043e\u0431\u0435\u043b \u0434\u043b\u044f \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0435\u043d\u0438\u044f \u0438\u0433\u0440\u044b");break;case m.INTRO:this._drawMessage("\u0414\u043b\u044f \u043d\u0430\u0447\u0430\u043b\u0430 \u0438\u0433\u0440\u044b \u043d\u0430\u0436\u043c\u0438\u0442\u0435 \u043f\u0440\u043e\u0431\u0435\u043b")}},_preloadImagesForLevel:function(a){if("undefined"==typeof this._imagesArePreloaded&&(this._imagesArePreloaded=[]),this._imagesArePreloaded[this.level])return void a();var b=[];this.state.objects.forEach(function(a){b.push(a.sprite),a.spriteReversed&&b.push(a.spriteReversed)});for(var c=b.length,d=b.length;c-->0;){var e=new Image;e.src=b[c],e.onload=function(){0===--d&&(this._imagesArePreloaded[this.level]=!0,a())}.bind(this)}},updateObjects:function(a){var b=this.state.objects.filter(function(a){return a.type===i.ME})[0];this.state.keysPressed.SHIFT&&(this.state.objects.push({direction:b.direction,height:24,speed:5,sprite:"img/fireball.gif",type:i.FIREBALL,width:24,x:b.direction&k.RIGHT?b.x+b.width:b.x-24,y:b.y+b.height/2}),this.state.keysPressed.SHIFT=!1),this.state.garbage=[];var c=this.state.objects.filter(function(b){return l[b.type](b,this.state,a),b.state===j.DISPOSED?(this.state.garbage.push(b),!1):!0},this);this.state.objects=c},checkStatus:function(){if(this.state.currentStatus===m.CONTINUE){this.commonRules||(this.commonRules=[function(a){var b=this._getInitialLevelState(f.INTRO),d=this._getMe(a),e=this._getMe(b);return d.x-e.x>=200?(a.customMessage=c([1,2,3,4]),"\u042f \u043f\u0440\u043e\u0448\u0451\u043b 10 \u0448\u0430\u0433\u043e\u0432"===a.customMessage?m.WIN:m.FAIL):m.CONTINUE},function(a){var b=this._getInitialLevelState(f.INTRO),d=this._getMe(a),e=this._getMe(b);return d.x-e.x<=-200?(a.customMessage=c([1,2,3,4],[4,3,2,1]),"\u042f \u043f\u0440\u043e\u0448\u0451\u043b 20 \u043c\u0435\u0442\u0440\u043e\u0432"===a.customMessage?m.WIN:m.FAIL):m.CONTINUE},function(a){var b=this._getMe(a);return b.y<=10?(a.customMessage=c(2),"\u042f \u043f\u0440\u044b\u0433\u043d\u0443\u043b \u043d\u0430 200 \u0441\u0430\u043d\u0442\u0438\u043c\u0435\u0442\u0440\u043e\u0432"===a.customMessage?m.WIN:m.FAIL):m.CONTINUE},function(a){function g(a){return!!(a.direction&k.RIGHT)&&a.x>=e-10&&a.y>=b&&a.y<=f}var h,b=.5*d,f=.75*d;if(a.garbage.length){var j=a.garbage.filter(function(a){return a.type===i.FIREBALL});j.length&&(h=j[0])}if(h){var l=g(h);return a.customMessage=c(l,"\u043a\u0440\u043e\u043d\u0443 \u0434\u0435\u0440\u0435\u0432\u0430"),l?"\u042f \u043f\u043e\u043f\u0430\u043b \u0432 \u043a\u0440\u043e\u043d\u0443 \u0434\u0435\u0440\u0435\u0432\u0430"===a.customMessage?m.WIN:m.FAIL:"\u042f \u043d\u0438\u043a\u0443\u0434\u0430 \u043d\u0435 \u043f\u043e\u043f\u0430\u043b"===a.customMessage?m.WIN:m.FAIL}return m.CONTINUE},function(a){return a.keysPressed.ESC?m.PAUSE:m.CONTINUE}]);for(var g,a=this.commonRules.concat(n[this.level]),b=m.CONTINUE;b===m.CONTINUE&&a.length;)g=a.shift(),b=g.call(this,this.state);this.state.currentStatus=b}},setGameStatus:function(a){this.state.currentStatus!==a&&(this.state.currentStatus=a)},render:function(){this.ctx.clearRect(0,0,e,d),this.state.objects.forEach(function(a){if(a.sprite){var b=new Image(a.width,a.height);b.src=a.spriteReversed&&a.direction&k.LEFT?a.spriteReversed:a.sprite,this.ctx.drawImage(b,a.x,a.y,a.width,a.height)}},this)},update:function(){this.state.lastUpdated||(this.state.lastUpdated=Date.now());var a=(Date.now()-this.state.lastUpdated)/10;switch(this.updateObjects(a),this.checkStatus(),this.state.currentStatus){case m.CONTINUE:this.state.lastUpdated=Date.now(),this.render(),requestAnimationFrame(function(){this.update()}.bind(this));break;case m.WIN:case m.FAIL:case m.PAUSE:case m.INTRO:default:this.pauseLevel()}},_onKeyDown:function(a){switch(a.keyCode){case 37:a.preventDefault(),this.state.keysPressed.LEFT=!0;break;case 39:a.preventDefault(),this.state.keysPressed.RIGHT=!0;break;case 38:a.preventDefault(),this.state.keysPressed.UP=!0;break;case 27:a.preventDefault(),this.state.keysPressed.ESC=!0}a.shiftKey&&(this.state.keysPressed.SHIFT=!0)},_onKeyUp:function(a){switch(a.keyCode){case 37:this.state.keysPressed.LEFT=!1;break;case 39:this.state.keysPressed.RIGHT=!1;break;case 38:this.state.keysPressed.UP=!1;break;case 27:this.state.keysPressed.ESC=!1}a.shiftKey&&(this.state.keysPressed.SHIFT=!1)},_initializeGameListeners:function(){window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp)},_removeGameListeners:function(){window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("keyup",this._onKeyUp)},_getMe:function(a){return a.objects.filter(function(a){return a.type===i.ME})[0]},_getInitialLevelState:function(a){var b=this.getInitialState();return o[a](b)}},window.Game=p,window.Game.Verdict=m;var q=new p(document.querySelector(".demo"));q.initializeLevelAndStart(),q.setGameStatus(p.Verdict.CONTINUE);var t,v,r=document.querySelector(".header-clouds"),u=!1;window.addEventListener("scroll",function(){v||(v=Date.now()),u||(u=!0,requestAnimationFrame(function(){w(),u=!1})),clearTimeout(t),t=setTimeout(s,100),v=Date.now()}),w()}();

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map