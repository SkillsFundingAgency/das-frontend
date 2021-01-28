module.exports = {
  bind: function (app) {

    app.get('/', function (req, res) {
      res.render('index')
    })

    app.get('/local/:page', function (req, res) {
      res.render('local/' + req.params.page)
    })

  }
}