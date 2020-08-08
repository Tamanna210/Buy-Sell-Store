const express = require('express');

const { check, body } = require('express-validator/check');

const User = require('../models/user');

const authController = require('../controllers/auth');
const { promiseImpl } = require('ejs');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup',[
  check('email')
  .isEmail()
  .withMessage('Plz enter a valid email')
  .custom( (value, { req }) => {
    return  User.findOne({ email: value }).then(userDoc => {
              if (userDoc) {
                  return Promise.reject(
                    'Email exists already, plx pick a different one!'
                    );
              }
              });
    }),
  body('password')
  .isLength({min: 8})
  .withMessage('Plz enter a psswrd with minimum length 5'),
  body('confirmPassword')
  .custom( (value, {req} ) =>{
    if(value !== req.body.password){
      throw new Error('Passwords have to match!');
    }
    return true;
  })
  
  ], authController.postSignup);

router.post('/logout', authController.postLogout);

module.exports = router;