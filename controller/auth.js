const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// DB Schema
const Leave = require('../models/leaveSchema');
const User = require('../models/userSchema');

exports.getLogin = (req, res) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('login', {
      pageTitle: 'login',
      path: '/login',
      errorMessage: message,
      oldInput: {
        email: '',
        password: '',
      },
      validationError: [],
    });
  }
};

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: '',
      },
      validationError: errors.array(),
    });
  }

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(422).render('login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: 'No user found with this email',
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: [],
      });
    }

    bcrypt.compare(password, user.password).then((doMatch) => {
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;

        return req.session.save((err) => {
          return res.redirect('/');
        });
      }
      return res.status(422).render('login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: 'Invalid email or password',
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: [],
      });
    });
  });
};

exports.getRegister = (req, res) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('register', {
      pageTitle: 'Register',
      path: '/register',
      errorMessage: message,
      oldInput: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      validationError: [],
    });
  }
};

exports.postRegister = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('register', {
      pageTitle: 'Register',
      path: '/register',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        name: name,
        email: email,
        password: '',
        confirmPassword: '',
      },
      validationError: errors.array(),
    });
  }

  User.findOne({ email: email }).then((userExist) => {
    if (userExist) {
      req.flash('error', 'E-Mail exists already, please pick a different one.');
      return res.redirect('/register');
    }

    return bcrypt
      .hash(password, 12)
      .then((hashPassword) => {
        const user = new User({
          name: name,
          email: email,
          role: 'basic',
          password: hashPassword,
        });

        return user.save();
      })
      .then((result) => {
        req.flash('success', 'You are now registered');
        res.redirect('/');
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

// LogOut
exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
};
