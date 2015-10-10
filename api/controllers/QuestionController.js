/**
 * StyleController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var utils = require('../services/utils');

const fields = [
  ['OG', 'FG', 'SRM', 'IBU', 'ABV'],
  ['appearance'], ['flavor'], ['aroma'], ['mouthfeel']
];

module.exports = {

  checkstyle: function(req, res, next){

    Style.find( {}, {fields: ["style_id", "name"]} ).populate('category', {exam: true}).exec(function stylesFound(err, styles) {
      if (err) {
        req.flash('error', err.message);
        // If error redirect back to sign-up page
        return next(err);
      }

      res.view({style: utils.randomFromArray(styles)});

    });
  },

  // Questions for checking the style
  styleanswer: function(req, res, next){

    var ans = 0, q = 0, selectors = {};

    Style.findOne( {style_id: req.param('style_id') } ).populate('category', {exam: true}).exec(function stylesFound(err, style) {
      if (err) {
        req.flash('error', err.message);
        // If error redirect back to sign-up page
        return res.json(err);
      }

      utils.between(+req.param('og'),  style.OG.from,  style.OG.to  ) && ans++;  q++;
      selectors.styleOG = utils.between(+req.param('og'),  style.OG.from,  style.OG.to  );


      utils.between(+req.param('fg'),  style.FG.from,  style.FG.to  ) && ans++;  q++;
      selectors.styleFG = utils.between(+req.param('fg'),  style.FG.from,  style.FG.to  );


      utils.between(+req.param('srm'), style.SRM.from, style.SRM.to ) && ans++;  q++;
      selectors.styleSRM = utils.between(+req.param('srm'),  style.SRM.from,  style.SRM.to  );


      utils.between(+req.param('ibu'), style.IBU.from, style.IBU.to ) && ans++;  q++;
      selectors.styleIBU = utils.between(+req.param('ibu'),  style.IBU.from,  style.IBU.to  );


      utils.between(+req.param('abv'), style.ABV.from, style.ABV.to ) && ans++;  q++;
      selectors.styleABV = utils.between(+req.param('abv'),  style.ABV.from,  style.ABV.to  );


      res.json({
        style: {
          style_id: style.style_id,
          name: style.name,
          OG: style.OG,
          FG: style.FG,
          SRM: style.SRM,
          IBU: style.IBU,
          ABV: style.ABV
        },
        ans: ans,
        score: ans / q *  100,
        pass:  ans / q >= 0.8,
        selectors: selectors
      });

    });
  },

  reversemchoice: function(req, res, next){
    var fields = [
        ['OG', 'FG', 'SRM', 'IBU', 'ABV'],
        ['appearance'], ['flavor'], ['aroma'], ['mouthfeel']
      ]
      , fieldNumber = Math.floor(Math.random() * fields.length);


    var fieldsArray = fields[fieldNumber];

    fieldsArray.push('style_id');
    fieldsArray.push('similars');


    Style.find( {}, {fields: fieldsArray} ).populate('category', {exam: true}).exec(function stylesFound(err, styles) {
      if (err) {
        req.flash('error', err.message);
        // If error redirect back to sign-up page
        return next(err);
      }

      var targetStyle = utils.randomFromArray(styles);

      //console.log('Style', targetStyle);

      var randomArray = utils.getRandom(targetStyle.similars, 3);
      randomArray.push(targetStyle.style_id);


      Style.find( {style_id: randomArray }, {fields: ['style_id', 'name']} ).exec(function stylesFound(err, styles){
        if (err) {
          req.flash('error', err.message);
          // If error redirect back to sign-up page
          return next(err);
        }
        res.view({styles: styles, question: targetStyle, fields: fieldsArray});


      });
    });
  },

  multiplechoice: function(req, res, next){

    var fieldNumber = Math.floor(Math.random() * fields.length);


    Style.find( {}, {fields: ["style_id", "name", "similars"]} ).populate('category', {exam: true}).exec(function stylesFound(err, styles) {
      if (err) {
        req.flash('error', err.message);
        // If error redirect back to sign-up page
        return next(err);
      }

      var targetStyle = utils.randomFromArray(styles);

      //console.log('Style', targetStyle);

      var randomArray = utils.getRandom(targetStyle.similars, 3);
      randomArray.push(targetStyle.style_id);
      var fieldsArray = fields[fieldNumber];

      fieldsArray.push('style_id');

      //console.log('Similar Styles', randomArray);

      Style.find( {style_id: randomArray }, {fields: fieldsArray} ).exec(function stylesFound(err, styles){
        if (err) {
          req.flash('error', err.message);
          // If error redirect back to sign-up page
          return next(err);
        }
        res.view({styles: styles, question: targetStyle, fields: fieldsArray});
      });
    });
  },



  getquestion: function(req, res, next){

    Question.count().exec(function countCB(error, max) {
      if(error)
        return next(error);

      var random = Math.floor(Math.random() * (max - 1)) + 1;

      Question.findOne({question_id: random }).exec(function(err, question){
        if(err)
          return next(err);

        question.options.length === 2 && (question.class = 'text-center');

        res.view({question: question});
      });
    });
  },


  truefalse: function(req, res, next){
    var trueAnswer = !!Math.floor(Math.random() * 2);

    Style.find( {}, {} ).populate('category', {exam: true}).exec(function gotAllStyle(err, styles){
      if(err)
        return next(err);

      var stylesLength = styles.length
        , random = Math.floor(Math.random() * stylesLength)
        , randomElement = utils.randomFromArray(styles)

        , field = utils.randomFromArray(utils.randomFromArray(fields))
        , fakeAnswer, textQuestion, attribute;


      textQuestion = 'One of the ' + randomElement['name'] + ' (' + randomElement['style_id'] + ') ' + field + ' characteristics: ';

      if(!trueAnswer) {
        fakeAnswer = utils.randomFromArray(styles);
        if( ['OG', 'FG', 'SRM', 'IBU', 'ABV'].indexOf(field) >= 0  )
          textQuestion += JSON.stringify(fakeAnswer[field]);
        else
          textQuestion += utils.randomFromArray(fakeAnswer[field]);
      } else {
        if( ['OG', 'FG', 'SRM', 'IBU', 'ABV'].indexOf(field) >= 0  )
          textQuestion += JSON.stringify(randomElement[field]);
        else
          textQuestion += utils.randomFromArray(randomElement[field]);
      }



      res.view({
        question: {
          question: textQuestion,
          options: ['true', 'false'],
          answer: trueAnswer.toString()
        }
      });
    });

  }




}
