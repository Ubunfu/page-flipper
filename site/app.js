'use strict';

// eslint-disable-next-line import/no-unresolved
require('dotenv').config()
const express = require('express');
const path = require('path')
const hbs = require('hbs')
const session = require('express-session')
const routers = require('./routers')

const staticsPath = path.join(__dirname, './public')
const partialsPath = path.join(__dirname, './views/partials')

const app = express();
app.set('view engine', 'hbs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
hbs.registerPartials(partialsPath)
app.use(express.static(staticsPath))
// Enable CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('x-powered-by', 'serverless-express')
  next()
})
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(routers.main)
app.use(routers.auth)

if (process.env.LISTEN == 'true') {
  app.listen(process.env.LISTEN_PORT, () => {
      console.log('Page Flipper is up!');
  })
}

module.exports = app;
