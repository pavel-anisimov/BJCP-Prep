/**
 * StyleController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

"use strict";
var utils = require('../services/utils');

const fields = [
  ['OG', 'FG', 'SRM', 'IBU', 'ABV'],
  ['appearance'], ['flavor'], ['aroma'], ['mouthfeel']
];



module.exports = {

  all: function(req, res, next){
    this.getQuizeQuestions({min: 0, max: 3}, function(err, question){
      if(err) return next(err);
      res.view(question);
    });
  },

  mchoice: function(req, res, next){
    let {firstStyle, secondStyle} = req.params.all();
    firstStyle || (firstStyle = '1A');
    secondStyle || (secondStyle = '26D');

    Style.find({style_id: [firstStyle, secondStyle]}, {fields: ["style_id", "name", "createdAt"]}).sort('createdAt').exec( (err, styles) => {
      if(err) return next(err);

      let {firstStyle, secondStyle} = utils.inOrder(styles[0].createdAt, styles[1].createdAt);

      this.getQuizeQuestions({min: 0, max: 1, firstStyle: firstStyle, secondStyle: secondStyle}, function(err, question){
        if(err) return next(err);
        res.view(question);
      });

    });

  },

  guide: function(req, res, next){
    this.getQuizeQuestions({min: 2, max: 2, type: req.param('type')}, function(err, question){
      if(err) return next(err);
      res.view(question);
    });
  },

  checkstyles: function(req, res, next){
    let {firstStyle, secondStyle} = req.params.all();
    firstStyle || (firstStyle = '1A');
    secondStyle || (secondStyle = '26D');

    Style.find({style_id: [firstStyle, secondStyle]}, {fields: ["style_id", "name", "createdAt"]}).sort('createdAt').exec( (err, styles) => {
      if(err) return next(err);

      let {firstStyle, secondStyle} = utils.inOrder(styles[0].createdAt, styles[1].createdAt);

      this.getQuizeQuestions({min: 3, max: 3, firstStyle: firstStyle, secondStyle: secondStyle}, function(err, question){
        if(err) return next(err);
        res.view(question);
      });

    });
  },

  getQuizeQuestions: function(opt, cb){

    switch (utils.randomNumber(opt.min, opt.max)){
      case 0:
        this.getStraightQuestion(opt, (err, question) => cb(err, question));
        break;
      case 1:
        this.getReverseQuestion(opt, (err, question) => cb(err, question));
        break;
      case 2:
        this.getTrueFalseQuestion(opt.type, (err, question) => cb(err, question));
        break;
      case 3:
        this.getStyleStatsQuestion(opt, (err, question) => cb(err, question));
        break;
      default:
        cb(new Error('Random number outside of the range.'));

    }
  },


  getTrueFalseQuestion: function(topic, cb){

    let options = {};

    topic && (options.topic = topic);

    Question.find(options).exec( (err, questions) => {
      if(err) return cb(err);

      utils.randomFromArrayAsync(questions, respond => {
        respond.type = "true_false";
        respond.question = {
          body: respond.question,
          topic: respond.topic
        };

        delete respond.question_id;
        delete respond.topic;
        delete respond.id;

        return cb(null, respond);
      });
    });
  },



  getStyleStatsQuestion: function(opt, cb){

    Style.find( { test: 'beer', createdAt: {">=": opt.firstStyle, "<=": opt.secondStyle}}, {fields: ["style_id", "name", "OG", "FG", "SRM", "IBU", "ABV"]} ).populate('category', {exam: true}).exec((err, styles) => {
      if (err) return cb(err);

      var respond, style;

      style = utils.randomFromArray(styles);

      respond = {
        question: {
          body: `Define the vital statistics for (${style.style_id}) ${style.name}:`
        },
        options: {
          OG: style.OG,
          FG: style.FG,
          SRM: style.SRM,
          IBU: style.IBU,
          ABV: style.ABV
        },
        type: "check_style"

      };

      return cb(null, respond);

    });
  },

  getStraightQuestion: function(opt, cb){

    Style.find( { test: 'beer', createdAt: {">=": opt.firstStyle, "<=": opt.secondStyle}}, {fields: ["style_id", "name", "similars"]} ).populate('category', {exam: true}).exec((err, styles) => {
      if (err) return cb(err);

      let targetStyle, randomArray, fieldsArray, fieldNumber, question;

      targetStyle = utils.randomFromArray(styles);
      randomArray = utils.getRandom(targetStyle.similars, 3);
      randomArray.push(targetStyle.style_id);

      fieldNumber = utils.randomNumber(0, fields.length - 1)
      fieldsArray = fields[fieldNumber].slice();

      question =  `Which ${fieldsArray[0] == 'OG' ? 'vital statistics' : fieldsArray[0] + ' characteristics'} are better assosiated with (${targetStyle.style_id}) ${targetStyle.name} style?`

      fieldsArray.push('style_id');


      Style.find( {style_id: randomArray }, {fields: fieldsArray} ).exec((err, styles) => {
        if (err) return cb(err);

        let respond = {}, correct = 0

        styles = styles.map(function(val, index){

          (val.style_id == targetStyle.style_id) && (correct = index);
          delete val.id;
          return val;

        });

        respond = {
          options: styles ,
          question: {body: question, style_id: targetStyle.style_id, field: fieldsArray[0]},
          answer: correct,
          type: "m_choice_normal"
        };

        return cb(null, respond);
      });
    });
  },

  getReverseQuestion: function(opt, cb){

    let fieldNumber, fieldsArray, question;

    fieldNumber = utils.randomNumber(0, fields.length-1);
    fieldsArray = fields[fieldNumber].slice();

    question = `Which style is better assosiated with following ${fieldsArray[0] == 'OG' ? 'vital statistics ' : fieldsArray[0] + ' characteristics'}: `

    fieldsArray.push('style_id');
    fieldsArray.push('similars');


    Style.find( { test: "beer", createdAt: {">=": opt.firstStyle, "<=": opt.secondStyle}}, {fields: fieldsArray} ).populate('category', {exam: true}).exec((err, styles) => {
      if (err)  return cb(err);

      let  targetStyle, randomArray;

      targetStyle = utils.randomFromArray(styles);
      randomArray = utils.getRandom(targetStyle.similars, 3);
      randomArray.splice(utils.randomNumber(0, 3), 0, targetStyle.style_id);

      Style.find( {style_id: randomArray }, {fields: ['style_id', 'name']} ).exec((err, styles) => {
        if (err)  return cb(err);

        let correct = 0, respond = {}, style_id;

        styles = styles.map( (val, i) => {
          (val.style_id == targetStyle.style_id) && (correct = i);
          return `(${val.style_id}) ${val.name}`;
        });

        style_id = targetStyle.style_id
        delete targetStyle.similars;
        delete targetStyle.id;
        delete targetStyle.style_id;

        respond = {
          options: styles ,
          question: {body: question, characteristics: targetStyle, style: style_id},
          answer: correct,
          type: "m_choice_reverse"
        };

        return cb(null, respond);
      });
    });
  }
}
