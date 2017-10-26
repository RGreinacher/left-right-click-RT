var InputProcessor;

InputProcessor = (function() {
  var _this, base, repetitions, timeBetweenTrials, timeStimulusVisible;

  _this = void 0;

  timeStimulusVisible = 100;

  timeBetweenTrials = 1700;

  repetitions = 200;

  function InputProcessor() {
    var lefts, rights;
    _this = this;
    this.trialRunning = false;
    this.testRunning = false;
    this.trialNumber = -1;
    this.startTime = 0;
    this.target = 0;
    this.responses = "RT;target;correct_response\n";
    lefts = (function() {
      var k, ref, results;
      results = [];
      for (k = 1, ref = repetitions / 2; 1 <= ref ? k <= ref : k >= ref; 1 <= ref ? k++ : k--) {
        results.push(0);
      }
      return results;
    })();
    rights = (function() {
      var k, ref, results;
      results = [];
      for (k = 1, ref = repetitions / 2; 1 <= ref ? k <= ref : k >= ref; 1 <= ref ? k++ : k--) {
        results.push(1);
      }
      return results;
    })();
    this.nextTargets = lefts.concat(rights).shuffle();
    $('.stimulus').hide();
    this.initEventHandler();
  }

  InputProcessor.prototype.initEventHandler = function() {
    $('.start-button').on('click', function(e) {
      _this.testRunning = true;
      $('.start-button').remove();
      $('.non-test-information').addClass('hiddenForTest');
      $('.content-container').addClass('no-cursor');
      return _this.nextTrial();
    });
    $('body').keypress(function(e) {
      if (!(_this.testRunning && e.which === 27)) {
        return _this.endTest();
      }
    });
    return $('.content-container').on('mousedown', function(e) {
      var button, correctResponse, duration;
      if (!_this.trialRunning) {
        return;
      }
      duration = Math.round(performance.now() - _this.startTime, 2);
      button = e.button === 0 ? 0 : 1;
      correctResponse = button === _this.target;
      return _this.endTrial(duration, correctResponse);
    });
  };

  InputProcessor.prototype.nextTrial = function() {
    var startTest;
    this.trialNumber += 1;
    startTest = function() {
      if (_this.trialRunning) {
        _this.endTrial("NA", "NA");
      }
      _this.startTrial();
      return _this.nextTrial();
    };
    return setTimeout(startTest, timeBetweenTrials);
  };

  InputProcessor.prototype.startTrial = function() {
    var hideStimulus;
    if (!this.testRunning) {
      return;
    }
    this.target = this.nextTargets.pop();
    $(".stimulus-" + this.target).show();
    this.startTime = performance.now();
    this.trialRunning = true;
    hideStimulus = function() {
      return $(".stimulus").hide();
    };
    return setTimeout(hideStimulus, timeStimulusVisible);
  };

  InputProcessor.prototype.endTrial = function(duration, correctResponse) {
    var targetSide;
    this.trialRunning = false;
    targetSide = this.target === 0 ? 'left' : 'right';
    this.responses += duration + ";" + targetSide + ";" + correctResponse + "\n";
    if (this.nextTargets.length === 0) {
      return this.endTest();
    }
  };

  InputProcessor.prototype.endTest = function() {
    this.testRunning = false;
    $('.stimuli-container').hide();
    $('.non-test-information').removeClass('hiddenForTest');
    $('.content-container').removeClass('no-cursor');
    $('.end-screen').show();
    return $('.response-values').val(this.responses);
  };

  if ((base = Array.prototype).shuffle == null) {
    base.shuffle = function() {
      var i, j, k, ref, ref1;
      if (this.length > 1) {
        for (i = k = ref = this.length - 1; ref <= 1 ? k <= 1 : k >= 1; i = ref <= 1 ? ++k : --k) {
          j = Math.floor(Math.random() * (i + 1));
          ref1 = [this[j], this[i]], this[i] = ref1[0], this[j] = ref1[1];
        }
      }
      return this;
    };
  }

  return InputProcessor;

})();

window.inputProcessor = new InputProcessor();
