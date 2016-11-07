// 500 catch-all
module.exports = (err, req, res, next) => {
  res.status(500).render('500', {
    message: (process.env != 'production') ? err.message : 'Internal Server Error'
  });
}