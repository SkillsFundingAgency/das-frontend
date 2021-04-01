module.exports = {
  bind: function (app) {

    app.get('/', function (req, res) {
      res.render('index')
    })

    app.get('/form', function (req, res) {
      res.render('form')
    })

    app.post('/form', function (req, res) {
      // Do something
      res.redirect('/playback')
    })

    app.get('/playback', function (req, res) {
      res.render('playback')
    })

    app.get('/local/:page', function (req, res) {
      res.render('local/' + req.params.page)
    })


  }
}