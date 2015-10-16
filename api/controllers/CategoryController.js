/**
 * CategoryController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  new: function (req, res) {
    res.view({})
  },

  create: function (req, res, next) {

    var categoryObj = {
      category_id: req.param('id'),
      name: req.param('name'),
      official: req.param('official') == 'on' ? true : false,
      exam: req.param('exam') == 'on' ? true : false,
      type: req.param('type'),
      comments: req.param('comments')
    }

    // Create a Category with the params sent from
    // the category form --> new.jade
    Category.create(categoryObj, function categoryCreated(err, category) {
      // If there's an error
      if (err) {
        req.flash('error', err.message);

        // If error redirect back to sign-up page
        return res.redirect('/category/new');
      }

      category.save(function(err, category) {

        if (err) return next(err);

        res.redirect('/category/show/' + category.category_id);
      });
    });
  },

  show: function(req, res, next){
    Category.findOne({category_id: req.param('id')}).populate('style').exec(function(err, category){
      if (err) {
        req.flash('error', err.message);
        // If error redirect back to sign-up page
        return res.redirect('/error');
      }

      res.view(category);
    });
  },

  index: function(req, res, next){
    Category.find({}, {fields: [ 'category_id', 'name', 'styles.style_id', 'styles.name' ] })
      .sort('createdAt')
      .populate('styles', {sort: 'style_id'})
      .exec(function(err, categories){
        if (err) {
          req.flash('error', err.message);
          // If error redirect back to sign-up page
          return res.redirect('/error');
        }

        //console.log(categories);
        res.view({categories: categories});
      }
    );
  }
}


