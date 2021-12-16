const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const db = mongoose.connection;
require('dotenv').config();

const indexRouter = require('./routes/index');
const { protect } = require('./middleware/auth')

const app = express();

global.__basedir = __dirname;

mongoose.connect(
  process.env.DB_PROD, 
  {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}
);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('db connected.'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use( express.json({ limit: '50mb' }) );
app.use( express.urlencoded({ limit: "50mb", extended: true, parameterLimit:50000 }) );
app.use(cookieParser('secret-shhhhhhhh'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'react/build')));

// routes
app.use('/', indexRouter);
app.use('/storage', express.static(path.join(__dirname, '/storage')));
app.post('/token', protect, require('./controllers/userController').authToken);
app.use('/api/user', require('./routes/users'));
app.use('/api/plan', require('./routes/planRouter'));
app.use('/api/student', require('./routes/studentRouter'));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'react/build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
