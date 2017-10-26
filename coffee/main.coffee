class InputProcessor

  _this = undefined
  timeStimulusVisible = 100
  timeBetweenTrials = 1700
  repetitions = 200



  constructor: ->
    _this = this
    this.trialRunning = false
    this.testRunning = false
    this.trialNumber = -1
    this.startTime = 0
    this.target = 0
    this.responses = "RT;target;correct_response\n"

    lefts = (0 for [1..(repetitions / 2)])
    rights = (1 for [1..(repetitions / 2)])
    this.nextTargets = lefts.concat(rights).shuffle()

    $('.stimulus').hide()
    this.initEventHandler()



  initEventHandler: ->
    $('.start-button').on 'click', (e) ->
      _this.testRunning = true
      $('.start-button').remove()
      $('.non-test-information').addClass('hiddenForTest')
      $('.content-container').addClass('no-cursor')
      _this.nextTrial()

    $('body').keypress (e) ->
      return unless _this.testRunning && e.which == 27 # esc
        _this.endTest()

    $('.content-container').on 'mousedown', (e) ->
      return unless _this.trialRunning
      duration = Math.round(performance.now() - _this.startTime, 2)

      button = if e.button == 0 then 0 else 1
      correctResponse = button == _this.target
      _this.endTrial(duration, correctResponse)

  nextTrial: ->
    this.trialNumber += 1
    startTest = () ->
      _this.endTrial("NA", "NA") if _this.trialRunning
      _this.startTrial()
      _this.nextTrial()
    setTimeout(startTest, timeBetweenTrials)

  startTrial: ->
    return unless this.testRunning
    this.target = this.nextTargets.pop()

    $(".stimulus-#{this.target}").show()
    this.startTime = performance.now()
    this.trialRunning = true

    hideStimulus = () ->
      $(".stimulus").hide()
    setTimeout(hideStimulus, timeStimulusVisible)

  endTrial: (duration, correctResponse) ->
    this.trialRunning = false
    targetSide = if this.target == 0 then 'left' else 'right'
    this.responses += "#{duration};#{targetSide};#{correctResponse}\n"

    this.endTest() if this.nextTargets.length == 0

  endTest: ->
    this.testRunning = false
    $('.stimuli-container').hide()
    $('.non-test-information').removeClass('hiddenForTest')
    $('.content-container').removeClass('no-cursor')
    $('.end-screen').show()
    $('.response-values').val(this.responses)

  Array::shuffle ?= ->
    if @length > 1 then for i in [@length-1..1]
      j = Math.floor Math.random() * (i + 1)
      [@[i], @[j]] = [@[j], @[i]]
    this



window.inputProcessor = new InputProcessor()
