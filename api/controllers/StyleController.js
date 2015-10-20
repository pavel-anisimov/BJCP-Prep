/**
 * StyleController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var utils = require('../services/utils');

module.exports = {
  new: function (req, res, next) {
    Category.find({}, {fields: ["category_id", "name"]}).sort('createdAt').exec(function foundCategories(err, categories){
      if(err)
        return next(err);
      res.view({categories: categories})
    });
  },

  create: function (req, res, next) {

    var styleObj = {
      style_id: req.param('id'),
      category: req.param('category'),
      name: req.param('name'),
      OG: {
        from: +req.param('og_from') > 0 ? +req.param('og_from') : undefined,
        to:  +req.param('og_to') > 0 ? +req.param('og_to') : undefined
      },
      FG: {
        from:  +req.param('fg_from') > 0 ? +req.param('fg_from') : undefined,
        to:  +req.param('fg_to') > 0 ? +req.param('fg_to') : undefined
      },
      SRM: {
        from:  +req.param('srm_from') > 0 ? +req.param('srm_from') : undefined,
        to:  +req.param('srm_to') > 0 ? +req.param('srm_to') : undefined
      },
      IBU: {
        from:  +req.param('ibu_from') > 0 ? +req.param('ibu_from') : undefined,
        to:  +req.param('ibu_to') > 0 ? +req.param('ibu_to') : undefined
      },
      ABV: {
        from:  +req.param('abv_from') > 0 ? +req.param('abv_from') : undefined,
        to:  +req.param('abv_to') > 0 ? +req.param('abv_to') : undefined
      },
      aroma: _.compact(req.param('aroma')),
      appearance: _.compact(req.param('appearance')),
      flavor: _.compact(req.param('flavor')),
      mouthfeel: _.compact(req.param('mouthfeel')),
      about: req.param('about'),
      instructions: req.param('instructions'),
      overall: req.param('overall'),
      ingredients: req.param('ingredients'),
      history: req.param('history'),
      comments: req.param('comments'),
      comparison: req.param('comparison'),
      similars: req.param('similars') ? req.param('similars').split(', ') : undefined,
      varieties: req.param('varieties') ? req.param('varieties').split(', ') : undefined,
      examples: req.param('examples') ? req.param('examples').split(', ') : undefined,
      tags: req.param('tags') ? req.param('tags').split(', ') : undefined
    }


    // Create a Style with the params sent from
    // the style form --> new.jade
    Style.create(styleObj, function styleCreated(err, style) {
      console.log('err', err)

      // If there's an error
      if (err) {
        req.flash('error', err.message);

        // If error redirect back to sign-up page
        return res.redirect('/style/new');
      }

      style.save(function(err, savedStyle) {
        console.log('err', err)
        if (err) return next(err);

        res.redirect('/style/show/' + savedStyle.style_id);

       });
    });
  },

  update: function(req, res, next){

    Style.findOne({style_id: req.param("id")}, function foundStyle(err, style){
      if(err)
        return next(err);

      if(style.name !== req.param('name'))
        style.name = req.param('name');

      if(style.category !== req.param('category'))
        style.category = req.param('category');

      if(style.OG.from !== +req.param('og_from'))
        style.OG.from = +req.param('og_from');

      if(style.OG.to !== +req.param('og_to'))
        style.OG.to = +req.param('og_to');

      if(style.FG.from !== +req.param('fg_from'))
        style.FG.from = +req.param('fg_from');

      if(style.FG.to !== +req.param('fg_to'))
        style.FG.to = +req.param('fg_to');

      if(style.SRM.from !== +req.param('srm_from'))
        style.SRM.from = +req.param('srm_from');

      if(style.SRM.to !== +req.param('srm_to'))
        style.SRM.to = +req.param('srm_to');

      if(style.IBU.from !== +req.param('ibu_from'))
        style.IBU.from = +req.param('ibu_from');

      if(style.IBU.to !== +req.param('ibu_to'))
        style.IBU.to = +req.param('ibu_to');

      if(style.ABV.from !== +req.param('abv_from'))
        style.ABV.from = +req.param('abv_from');

      if(style.ABV.to !== +req.param('abv_to'))
        style.ABV.to = +req.param('abv_to');

      /////////////////
      if(style.aroma.join(',') !== _.compact(req.param('aroma')).join(','))
        style.aroma = _.compact(req.param('aroma'));

      if(style.appearance.join(',') !== _.compact(req.param('appearance')).join(','))
        style.appearance = _.compact(req.param('appearance'));

      if(style.flavor.join(',') !== _.compact(req.param('flavor')).join(','))
        style.flavor = _.compact(req.param('flavor'));

      if(style.mouthfeel.join(',') !== _.compact(req.param('mouthfeel')).join(','))
        style.mouthfeel = _.compact(req.param('mouthfeel'));
      /////////////////

      if(style.about !== req.param('about'))
        style.about = req.param('about');

      if(style.overall !== req.param('overall'))
        style.overall = req.param('overall');

      if(style.ingredients !== req.param('ingredients'))
        style.ingredients = req.param('ingredients');

      if(style.comparison !== req.param('comparison'))
        style.comparison = req.param('comparison');

      if(style.history !== req.param('history'))
        style.history = req.param('history');

      if(style.comments !== req.param('comments'))
        style.comments = req.param('comments');

      if(style.instructions !== req.param('instructions'))
        style.instructions = req.param('instructions');

      if(req.param('similars') !== _.compact(req.param('similars')).join(',')) {
        style.similars = req.param('similars').split(', ');
      }

      if(req.param('varieties') && style.varieties.join(',') !== _.compact(req.param('varieties')).join(',')) {
        style.varieties = req.param('varieties').split(', ');
      }

      if(req.param('examples') && style.examples.join(',') !== _.compact(req.param('examples')).join(',')) {
        style.examples = req.param('examples').split(', ');
       }

      if(req.param('tags') && style.tags.join(',') !== _.compact(req.param('tags')).join(',')) {
        style.tags = req.param('tags').split(', ');
      }

      style.save(function savingStyle(err, savedStyle) {
        if (err) return next(err);
        res.redirect('/style/show/' + savedStyle.style_id);
      });
    });
  },

  edit: function(req, res, next){

    Style.find({}, {fields: ["style_id", "name"]}).sort('createdAt').exec(function getAllStyles(err, allStyles){
      if(err)
        return next(err);

      Category.find({}, {fields: ["category_id", "name"]}).sort('createdAt').exec(function foundCategories(err, categories){
        if(err)
          return next(err);
        Style.findOne({style_id: req.param('id')}).populate('category').exec(function foundStyle(err, style){
          if(err)
            return next(err);
          res.view({style: style, categories: categories, allStyles: allStyles})
        });
      });
    });

  },

  show: function(req, res, next){
    Style.findOne({style_id: req.param('id')}).populate('category').exec(function styleFound(err, style){
      if (err) {
        req.flash('error', err.message);
        // If error redirect back to sign-up page
        return res.redirect('/error');
      }
      res.view({style: style});
    });
  },

  index: function(req, res, next){
    Style.find().sort('createdAt').populate('category').exec(function stylesFound(err, styles){
      if (err) {
        req.flash('error', err.message);
        // If error redirect back to sign-up page
        return res.redirect('/error');
      }

      res.view({styles: styles});
    });
  },


  tags: function(req, res, next){

    Style
      .find({tags: req.param('id').split(',')})
      .sort('createdAt').populate('category')
      .exec(function findByTags(err, styles){

        if (err) {
          req.flash('error', err.message);
          // If error redirect back to sign-up page
          return res.redirect('/error');
        }
        res.view(styles);

      });
  },

  compare: function(req, res, next){

    Style.find({style_id: { '!': null} }, { fields: [ 'style_id', 'name' ] }).sort('createdAt').exec((err, styles) => {
      if (err) return res.redirect('/error');


      let { firstStyle, secondStyle } = req.params.all();

      Style.find({ style_id: [firstStyle, secondStyle]}).exec( (err, comparedStyles) => {
        if (err) return res.redirect('/error');

        res.view({styles: styles, firstStyle: comparedStyles[0], secondStyle: comparedStyles[1]});
      });
    });


  }




}
