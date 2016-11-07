const session = require('express-session');
const redis = require('connect-redis');

module.exports = (app) => {

  const RedisStore = redis(session);

  const redisOptions = {
    tll: 14400, // 4 hours
  };

  let sess = {
    store: new RedisStore(redisOptions),
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
      expires: new Date(Date.now() + 3600000), // expires in one hour
      maxAge: 3600000
    },
    saveUninitialized: true
  };

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies, only works with https
  }

  app.use(session(sess));
  app.use((req, res, next) => {
    if (!req.session) {
      return next(new Error('connection to redis lost')); // handle error
    }
    next(); // otherwise continue 
  });
  
}