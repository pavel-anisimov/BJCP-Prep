/**
 * Question.js
 *
 * @description :: Data Schema for the Beer Styles
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,


  attributes: {
    question_id: {
      type: 'integer',
      primaryKey: true,
      required: true,
      unique: true
    },


    question: {
      type: 'string',
      required: true
    },

    options: {
      type: 'array',
      required: true
    },

    answer: {
      type: 'string',
      required: true
    }
  }
};
