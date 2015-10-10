/**
 * Category.js
 *
 * @description :: Data Schema for the Beer Category
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true,

  attributes: {
    category_id: {
      type: 'string',
      primaryKey: true,
      required: true,
      unique: true
    },

    styles: {
      collection: 'style',
      via: 'category'
    },

    name: {
      type: 'string',
      required: true
    },

    type: {
      type: 'string',
      required: true
    },

    official: {
      type: 'boolean',
      defaultsTo: true
    },

    exam: {
      type: 'boolean',
      defaultsTo: true
    },

    comments: {
      type: 'text',
      required: false
    }
  }
};
