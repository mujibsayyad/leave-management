require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const mongoDBSession = require('connect-mongodb-session')(session);

const User = require('./models/userSchema');

const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const mongoDB = process.env.db_url;

const app = express();

const mongoStoreSession = new mongoDBSession({
  uri: mongoDB,
  collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'you should not read it',
    resave: true,
    saveUninitialized: false,
    store: mongoStoreSession,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })

    .catch((err) => {
      next(new Error(err));
    });
});

app.use(authRoutes);
app.use(userRoutes);
app.use(adminRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/*',
  });
});

mongoose
  .connect(mongoDB)
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });

// const db = mongoose.connection;
// db.once('open', (_) => {
//   console.log('Database connected:', mongoDB);
// });

// db.on('error', (err) => {
//   console.error('connection error:', err);
// });
