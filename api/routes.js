'use strict';
const { body, validationResult} = require('express-validator');
//const jwt = require('jsonwebtoken')
const ensureAuthenticated = require('./modules/ensureAuthenticated')

module.exports = function(app) {
  let productsCtrl = require('./controllers/ProductsController');
  let variants = require('./controllers/VariantsController');
  let users = require('./controllers/UsersController');
  // todoList Routes
  app.route('/products')
    .get(productsCtrl.get)
    .post(productsCtrl.store);

  app.route('/products/:productId')
    .get(productsCtrl.detail)
    .put(productsCtrl.update)
    .delete(productsCtrl.delete);
  
   app.route('/departments')
    .get(productsCtrl.detail)
    .put(productsCtrl.update)
    .delete(productsCtrl.delete);

  //GET /variants
  app.route('/variants')
    .get(variants.get)
    .put(variants.update)
    .delete(variants.delete);

  //GET /login
  app.route('/users/login')
  .post(users.get);

  app.route('/users/signin',validationBodyRules, checkRules)
    .post(users.signin);

  app.route('/users/:userId/cart', ensureAuthenticated)
    .get(users.cartsdetail)
    //.put(users.cartsupdate)
    .post(users.cartsInsert);
  app.route('/users/:userId/cartdetail', ensureAuthenticated)
  .get(users.getcartsdetail);
  app.route('/users/:userId/cartcheckoutdetail', ensureAuthenticated)
  .get(users.cartcheckoutdetail);
  app.route('/users/:userId/cartupdate', ensureAuthenticated)
  .post(users.cartupdate);

  app.route('/users')
  .get(users.returnjson)

};

const validationBodyRules = [
  // check noi dung gui toi
  // TODO test thu may cai loi nay xem sao dung tool de test
  body('fullname', 'fullname is required').notEmpty(),
  body('email', 'Email is required').notEmpty(),
  body('password', 'Password is required').notEmpty(),
  body('verifyPassword', 'verifyPassword is required').notEmpty(),
  body('email', 'Email is not valid').isEmail(),
  //body('password', 'Passwords have to match').equals(req.body.verifyPassword)
];

const checkRules = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  next();
};
