module.exports = {
  bind: function (app) {

    app.get('/', function (req, res) {
      res.render('index')
    })

    app.get('/headers', function (req, res) {
      res.render('headers')
    })

    app.get('/map', function (req, res) {
      res.render('map')
    })

    app.get('/apprentice', function (req, res) {
      res.render('apprentice')
    })

    app.get('/local/:page', function (req, res) {
      res.render('local/' + req.params.page)
    })

  }
}
