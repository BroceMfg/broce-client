const express = require('express');
const exphbs = require('express-handlebars');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

require('dotenv').config();
const app = express();

// configure redis and express-session
require('./middleware/session-config')(app);

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
if (process.env.NODE_ENV === 'production') {
  app.enable('view cache');
}

app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    res.redirect('/home');
  } else {
    res.render('index');
  }
});

app.post('/', (req, res) => {
  const body = {
    email: req.body.email,
    password: req.body.password
  };
  fetch(`${process.env.BROCE_API_URL}/users/login`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  })
  .then((res) => {
    req.userCookie = res.headers._headers['set-cookie'][0].split(';')[0];
    return res.json();
  })
  .then((data) => {
    if (!data.success || !data.user) {
      res.status(500).json({
        success: false,
        error: `${data.message ? data.message : 'an unknown error occurred'}`
      });
    }
    req.session.user = data.user;
    const path = req.session.desiredPath || '/home';
    res.status(302).redirect(path);
  });
});

app.get('/home', (req, res, next) => {
  if (!req.session || !req.session.user) {
    next();
  } else {
    res.render('home', {
      user: req.session.user
    });
  }
});

app.get('/forgot', (req, res) => {
  if (req.session && req.session.user) {
    res.redirect('/home');
  }
  res.render('forgot');
});

app.get('/logout', (req, res) => {
  if (req.session && req.session.user) {
    req.session.destroy();
  }
  res.redirect('/');
})

// if not logged in, don't allow them to see anything
app.get('/*', (req, res, next) => {
  if (!req.session || !req.session.user) {
    if (req.session) {
      req.session.desiredPath = req.url;
    }
    res.redirect('/');
  } else {
    next();
  }
});

// error handling
app.use(require('./middleware/404'));
app.use(require('./middleware/500'));

app.listen(3000, () => console.log('listening on 3000'));
