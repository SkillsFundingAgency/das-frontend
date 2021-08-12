module.exports = {
  bind: function (app) {

    app.get('/', function (req, res) {
      res.render('index')
    })

    app.get('/local/:page', function (req, res) {
      res.render('local/' + req.params.page)
    })

    app.get('/jsontest', function (req, res) {
      var jsonObj = {amount: '871623', hasEnoughFunding: true}
      res.json(jsonObj);
    })

  }
}