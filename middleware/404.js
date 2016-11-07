// 404 catch-all
module.exports = (req, res, next) => {
  res.status(404).render('404');
}