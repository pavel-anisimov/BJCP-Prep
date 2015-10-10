/**
 * Style.js
 *
 * @description :: Data Schema for the Beer Styles
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {
    style_id: {
      type: 'string',
      primaryKey: true,
      required: true,
      unique: true
    },

    category: {
      model: 'category',
      required: true
    },

    name: {
      type: 'string',
      required: true
    },

    OG: {
      type: 'json'
    },

    FG: {
      type: 'json'
    },

    SRM: {
      type: 'json'
    },

    IBU: {
      type: 'json'
    },

    ABV: {
      type: 'json'
    },

    aroma: {
      type: 'array',
      required: true,
      defaultsTo: []
    },

    appearance: {
      type: 'array',
      required: true,
      defaultsTo: []
    },

    flavor: {
      type: 'array',
      required: true,
      defaultsTo: []
    },

    mouthfeel: {
      type: 'array',
      required: true,
      defaultsTo: []
    },

    about: {
      type: 'text'
    },

    overall: {
      type: 'text'
    },

    ingredients: {
      type: 'text'
    },

    history: {
      type: 'text'
    },

    comparison: {
      type: 'text'
    },

    instructions: {
      type: 'text'
    },

    varieties: {
      type: 'text'
    },

    comments: {
      type: 'text'
    },

    examples: {
      type: 'array',
      defaultsTo: []
    },

    similars: {
      type: 'array',
      defaultsTo: []
    },

    tags: {
      type: 'array',
      defaultsTo: []
    }
  }
};
