(function ($) {
  $.fn.serializeFormJSON = function () {

    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };
})(jQuery);

function between(x, min, max) {
  return x >= min && x <= max
}


var srmColors = [
  '#FFFFFF', '#FFE699', '#FFD878', '#FFCA5A', '#FFBF42', '#FBB123', '#F8A600',
  '#F39C00', '#EA8F00', '#E58500', '#DE7C00', '#D77200', '#CF6900', '#CB6200',
  '#C35900', '#BB5100', '#B54C00', '#B04500', '#A63E00', '#A13700', '#9B3200',
  '#952D00', '#8E2900', '#882300', '#821E00', '#7B1A00', '#771900', '#701400',
  '#6A0E00', '#660D00', '#5E0B00', '#5A0A02', '#600903', '#520907', '#4C0505',
  '#470606', '#440607', '#3F0708', '#3B0607', '#3A070B', '#36080A', '#160104'];


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

}

String.prototype.toTitleCase = function() {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}




$(function(){
  var $styleAroma = $('#styleAroma')
    , $styleAppearance = $('#styleAppearance')
    , $styleFlavor = $('#styleFlavor')
    , $styleMouthfeel = $('#styleMouthfeel')
    , $results = $('#results')
    , aromaLength = 0
    , appearanceLength = 0
    , flavorLength = 0
    , mouthfeelLength = 0
    , jStorage = $.jStorage
    , testOn = false
    , $nextQ = $('#nextQ')
    , $reloadQ = $('#reloadQ')
    , index, scores, questions, $totalScore, $nextBtn
    , $startBtn = $('#testBtn')
    , $restartBtn = $('#restartBtn');




  /////////////////////// QUESTION LOGIC STARTS ///////////////////////////////////

  var $window = $(window)
    , windowWidth = $window.width()
    , $respondBlock = $('.respond-row')
    , $reloadBtn = $respondBlock.find('#btn-reload')
    , $question = $('#question')
    , $answerOptions = $('.answer-option')
    , correctAnswer = $question.data('answer')
    , optionsNumber = $answerOptions.length
    , $helperBlock = $('.helper-row')
    , $btnFiftyFifty = $helperBlock.find('#btn-fifty-fifty')
    , $correctOption = $('.answer-option[data-answer="' + correctAnswer + '"]')
    , fiftyFiftyFlag = false
    , mobileMode = windowWidth < 768
    ;

  var respondsMessages = [
    "Nice job, you nailed this one right out of the park!",
    "It's okay, I'll give you a half of the point.",
    "Awe... Don't worry, you'll get it right the next time.",
    "Only 4 out of 5... All right, I'll give you a half of the point.",
  ];


  $answerOptions.on('click', function(){
    var $this = $(this)
    , thisAnswer = $this.data('answer')
    , respondMessage = '' ;

    if(thisAnswer === correctAnswer) {
      $this.addClass('correct-answer');
      respondMessage = respondsMessages[ fiftyFiftyFlag ? 1 : 0 ];
    }
    else {
      $this.addClass('wrong-answer');
      $correctOption.addClass('correct-answer');
      respondMessage = respondsMessages[2];
    }

    $helperBlock.addClass('hidden');
    $answerOptions.css({"pointer-events": "none"});

    $respondBlock.removeClass('hidden').find('.respond-message').text(respondMessage);

  });

  function removeFromArray(array, element) {
    for(var i = array.length - 1; i >= 0; i--) {
      if(array[i] === element) {
        array.splice(i, 1);
      }
    }
    return array;
  }

  function getRandom(arr, n) {

    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len;
    }
    return result;
  }

  function fiftyFifty(){

    if(optionsNumber > 2) {
      // Removing at most half of the options.
      // For 6 options, removing 3; for 5 options removing 2.
      var removeNumber = Math.ceil(optionsNumber / 2);

      var arr = [];
      for (var i = 0; i < optionsNumber; i++)
        arr.push(i);

      arr = removeFromArray(arr, correctAnswer);

      if(removeNumber > 1 ) {
        arr = getRandom(arr, arr.length + 1 - removeNumber)
      }

      arr.forEach(function(selector){
        $('.answer-option[data-answer="' + selector + '"]').addClass('removed-option');
      });

      $helperBlock.addClass('hidden');

      fiftyFiftyFlag = true;

    }

  }

  $btnFiftyFifty.on('click', fiftyFifty);

  function resizeOptions(){
    var height = 0;
    $answerOptions.each(function(el, val){
      ($(val).height() >  height) && (height = $(val).height() );
    });
    $answerOptions.height(height);
  }

  $window.on('resize', resizeOptions);

  if(!mobileMode)
    resizeOptions();


  $('#check-style-form').on('submit', function(e){
    e.preventDefault();

    var $this = $(this);

    var styleData = $this.find('.style-data');

    styleData.each(function(i, obj){
      $(obj).val(  $(obj).data('value') );
    });

    var data = $this.serializeFormJSON();
    var score = 0, answerClass, respondMessage;


    if(between(data.og, data.og_from, data.og_to)){
      score++;
      answerClass = 'correct';
    } else
      answerClass = 'wrong';
    $('#style-og').addClass(answerClass);

    if(between(data.fg, data.fg_from, data.fg_to)){
      score++;
      answerClass = 'correct';
    } else
      answerClass = 'wrong';
    $('#style-fg').addClass(answerClass);

    if(between(data.ibu, data.ibu_from, data.ibu_to)){
      score++;
      answerClass = 'correct';
    } else
      answerClass = 'wrong';
    $('#style-ibu').addClass(answerClass);

    if(between(data.abv, data.abv_from, data.abv_to)){
      score++;
      answerClass = 'correct';
    } else
      answerClass = 'wrong';
    $('#style-abv').addClass(answerClass);

    if(between(data.srm, data.srm_from, data.srm_to)){
      score++;
      answerClass = 'correct';
    } else
      answerClass = 'wrong';
    $('#style-srm').addClass(answerClass);


    if(score === 5)
      respondMessage = respondsMessages[ 0 ];
    else if(score === 4)
      respondMessage = respondsMessages[ 3 ];
    else
      respondMessage = respondsMessages[ 2 ];

    $respondBlock.removeClass('hidden').find('.respond-message').text(respondMessage);


  });

  /////////////////////// QUESTION LOGIC ENDS ///////////////////////////////////



  if(jStorage.get('testOn')) {
    var q =jStorage.get('questions').length
      , s = jStorage.get('testScore');
    $results.val(s + ' points. ' + (q+1) + ' left.');
    $restartBtn.parents('li').removeClass('hidden');
    $startBtn.parents('li').addClass('hidden');
  }


  $('#styleSRM_from, #styleSRM_to, #styleSRM, #SRM_FROM, #SRM_TO').on('change', function(){
    var $this = $(this)
      , srm = +$this.val()
      , color = srmColors[srm];

    if(srm < 9)
      $this.css({ 'background-color': color, 'color': '#000000' });
    else
      $this.css({ 'background-color': color, 'color': '#FFFFFF' });

  });

  $styleAroma.on('click', '#styleAroma_x', function(){
    var $this = $(this);

    index = +$this.data('index');

    $this.attr('id', 'styleAroma_' + index);
    $this.parent().siblings('label').attr('for', 'styleAroma_' + index);

    $this.parent().parent().append('<div class="col-md-1 col sm-1 fa-icon"><i class="fa fa-minus-circle"></i></div>');
    $this.data('index', index);

    $styleAroma.append(''
    + '<div>'
    +   '<label for="styleAroma_x" class="col-sm-3 control-label">Aroma</label>'
    +   '<div class="col-sm-8">'
    +     '<input id="styleAroma_x" data-index="' + ++index + '" type="text" placeholder="Low to moderate malt..." name="aroma" class="form-control characteristics" />'
    +   '</div>'
    + '</div>');

  }).on('click', '.fa-minus-circle', function () {
    $(this).parent().parent().remove();
  }).on('blur', '.characteristics', function(){

    var $this = $(this);

    if($this.val().trim() === '' && $this.attr('id') !== 'styleAroma_x')
      $this.parent().parent().remove();
  });


  $styleAppearance.on('click', '#styleAppearance_x', function(){
    var $this = $(this);

    index = +$this.data('index');

    $this.attr('id', 'styleAppearance_' + index);
    $this.parent().siblings('label').attr('for', 'styleAppearance_' + index);


    $this.parent().parent().append('<div class="col-sm-1 fa-icon"><i class="fa fa-minus-circle"></i></div>');

    $styleAppearance.append(''
    + '<div>'
    +   '<label for="styleAppearance_x" class="col-sm-3 control-label">Appearance</label>'
    +   '<div class="col-sm-8">'
    +     '<input id="styleAppearance_x" data-index="' + ++index + '"  type="text" placeholder="Medium to very dark brown in color..." name="appearance" class="form-control characteristics" />'
    +   '</div>'
    + '</div>');

  }).on('click', '.fa-minus-circle', function () {
    $(this).parent().parent().remove();
  }).on('blur', '.characteristics', function(){

    var $this = $(this);

    if($this.val().trim() === '' && $this.attr('id') !== 'styleAppearance_x')
      $this.parent().parent().remove();
  });

  $styleFlavor.on('click', '#styleFlavor_x', function(){
    var $this = $(this);

    index = +$this.data('index');

    $this.attr('id', 'styleFlavor_' + index);
    $this.parent().siblings('label').attr('for', 'styleFlavor_' + index);

    $this.parent().parent().append('<div class="col-sm-1 fa-icon"><i class="fa fa-minus-circle"></i></div>');

    $styleFlavor.append(''
    + '<div>'
    +   '<label for="styleFlavor_x" class="col-sm-3 control-label">Flavor</label>'
    +   '<div class="col-sm-8">'
    +     '<input id="styleFlavor_x" data-index="' + ++index + '"  type="text" placeholder="Medium-low to medium bitterness..." name="flavor" class="form-control characteristics" />'
    +   '</div>'
    + '</div>');

    $this.data('index', index);

  }).on('click', '.fa-minus-circle', function () {
    $(this).parent().parent().remove();
  }).on('blur', '.characteristics', function(){

    var $this = $(this);

    if($this.val().trim() === '' && $this.attr('id') !== 'styleFlavor_x')
      $this.parent().parent().remove();
  });

  $styleMouthfeel.on('click', '#styleMouthfeel_x', function(){
    var $this = $(this);

    index = +$this.data('index');

    $this.attr('id', 'styleMouthfeel_' + index);
    $this.parent().siblings('label').attr('for', 'styleMouthfeel_' + index);

    $this.parent().parent().append('<div class="col-sm-1 fa-icon"><i class="fa fa-minus-circle"></i></div>');

    $styleMouthfeel.append(''
    + '<div>'
    +   '<label for="styleMouthfeel_x" class="col-sm-3 control-label">Mouthfeel</label>'
    +   '<div class="col-sm-8">'
    +     '<input id="styleMouthfeel_x" data-index="' + ++index + '"  type="text" placeholder="Medium-light to medium body..." name="mouthfeel" class="form-control characteristics" />'
    +   '</div>'
    + '</div>');

    $this.data('index', index);

  }).on('click', '.fa-minus-circle', function () {
    $(this).parent().parent().remove();
  }).on('blur', '.characteristics', function(){

    var $this = $(this);

    if($this.val().trim() === '' && $this.attr('id') !== 'styleMouthfeel_x')
      $this.parent().parent().remove();
  });

  var $colorRange = $('.colorRange');

  if($colorRange.length === 1) {
    var SRM = $colorRange.data('srm')
      , colorFrom = srmColors[SRM.from]
      , colorTo = srmColors[SRM.to];

    $colorRange.css({
      "background": "-webkit-linear-gradient(left, " + colorFrom + " 20%, " + colorTo + " 80% )",
      "background": "-o-linear-gradient(right, " + colorFrom + " 20%, " + colorTo + " 80% )",
      "background": "-moz-linear-gradient(right, " + colorFrom + " 20%, " + colorTo + " 80% )",
      "background": "linear-gradient(to right, " + colorFrom + " 20%, " + colorTo + " 80% )"
    });
  }


  $nextBtn = $('#nextBtn');

  scores = $.jStorage.get('scores', 0);
  questions = $.jStorage.get('questions', 0);

  $totalScore = $('#totalScore');

   if(scores && questions)
    $totalScore.text( 'Total ' + (scores / questions).toFixed(2) + '% out of ' + questions + ' questions.'  )
  else {
     scores = 0;
     questions = 0;
     $totalScore.text('No questions');
   }

  $('#checkStyleForm').on('submit', function(e, a){
    e.preventDefault();

    var $this = $(this);


    $.post($this.attr('action'), $this.serialize()).done().success(function (res) {


      $('#OG_FROM').val(res.style.OG.from);
      $('#OG_TO').val(res.style.OG.to);
      $('#FG_FROM').val(res.style.FG.from);
      $('#FG_TO').val(res.style.FG.to);
      $('#SRM_FROM').val(res.style.SRM.from).css({'background-color': srmColors[res.style.SRM.from], 'color': res.style.SRM.from < 9 ? '#000' : '#fff'})
      $('#SRM_TO').val(res.style.SRM.to).css({'background-color': srmColors[res.style.SRM.to], 'color': res.style.SRM.to < 9 ? '#000' : '#fff'})
      $('#IBU_FROM').val(res.style.IBU.from);
      $('#IBU_TO').val(res.style.IBU.to);
      $('#ABV_FROM').val(res.style.ABV.from);
      $('#ABV_TO').val(res.style.ABV.to);

      $('#styleOG').addClass(res.selectors.styleOG ? 'pass' : 'fail');
      $('#styleFG').addClass(res.selectors.styleFG ? 'pass' : 'fail');
      $('#styleSRM').addClass(res.selectors.styleSRM ? 'pass' : 'fail');
      $('#styleIBU').addClass(res.selectors.styleIBU ? 'pass' : 'fail');
      $('#styleABV').addClass(res.selectors.styleABV ? 'pass' : 'fail');

      $('#answer').text(res.score + '%. ' + (res.score >= 80 ? 'Pass.' : 'Fail.') )
        .addClass(res.score >= 80 ? 'passScore' : 'badScore');

      $('#checkBtn').addClass('hidden');

      //$nextBtn.removeClass('hidden');


      var testScore = jStorage.get('testScore')
        , qList = jStorage.get('questions')
        , nextQuestion = qList.shift();


      if (res.score >= 80)
        testScore++;
      jStorage.set('testScore', testScore );
      jStorage.set('questions', qList);
      //window.location = "/style/" + nextQuestion;

      $nextQ.removeClass('hidden').data('href', "/style/" + nextQuestion);
      $reloadQ.removeClass('hidden');



    }).error(function (err) {
      console.log('err', err)
    });

    $nextBtn.on('click', function(){
      location.reload();
    });

  });



  $nextQ.on('click', function(){
    window.location = $(this).data('href');
  });

  $reloadQ.on('click', function(){
    location.reload();
  });


  /*
  $('#checkStyleForm').ajaxForm(function(res) {

    $(this).ajaxSubmit({
      beforeSubmit: function showRequest(formData, jqForm, options) {
        // formData is an array; here we use $.param to convert it to a string to display it
        // but the form plugin does this for you automatically when it submits the data
        var queryString = $.param(formData);

        console.log('formData', formData);
        console.log('queryString', queryString);
        console.log('jqForm', jqForm);
        console.log('options', options);

        // here we could return false to prevent the form from being submitted;
        // returning anything other than false will allow the form submit to continue
        return true;
      },
      success: function(responseText, statusText, xhr, $form)  {

        console.log('responseText', responseText);
        console.log('statusText', statusText)
        console.log('xhr', xhr)
        console.log('$form', $form)

      }
    });



    // return false to prevent normal browser submit and page navigation
    return false;

  }); */


  var questions = [
    'checkstyle','checkstyle','checkstyle','checkstyle','checkstyle',
    'multiplechoice','multiplechoice','multiplechoice','multiplechoice','multiplechoice',
    'multiplechoice','multiplechoice','multiplechoice','multiplechoice','multiplechoice',
    'reversemchoice','reversemchoice','reversemchoice','reversemchoice','reversemchoice',
    'reversemchoice','reversemchoice','reversemchoice','reversemchoice','reversemchoice',
  ];


  $startBtn.on('click', function(e){
    e.preventDefault();

    jStorage.set('testOn', true);
    jStorage.set('testScore', 0);
    jStorage.set('questions', shuffle(questions));

    $restartBtn.parents('li').removeClass('hidden');
    $(this).parents('li').addClass('hidden');


    var qList = jStorage.get('questions')
    var nextQuestion = qList.shift();
    jStorage.set('questions', qList);

    window.location = "/style/" + nextQuestion;

  });
  $restartBtn.on('click', function(e){
    e.preventDefault();

    jStorage.set('testOn', true);
    jStorage.set('testScore', 0);
    jStorage.set('questions', shuffle(questions));

    $results.val('0 / 0 Questions. ' + questions.length + ' left.');

    var qList = jStorage.get('questions')
    var nextQuestion = qList.shift();
    jStorage.set('questions', qList);

    window.location = "/style/" + nextQuestion;
  });

});




