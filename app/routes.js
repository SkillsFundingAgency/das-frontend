module.exports = {
  bind: function (app) {
    app.get('/', function (req, res) {
      res.render('index');
    });

    app.get('/headers', function (req, res) {
      res.render('headers');
    });
    app.get('/headers-new', function (req, res) {
      res.render('headers-new');
    });

    app.get('/employers', function (req, res) {
      res.render('employer-logged-in-page');
    });

    app.get('/employers-existing', function (req, res) {
      res.render('old-employer-logged-in-page');
    });

    app.get('/providers', function (req, res) {
      res.render('provider-logged-in-page');
    });

    app.get('/providers-existing', function (req, res) {
      res.render('old-provider-logged-in-page');
    });

    app.get('/map', function (req, res) {
      res.render('map');
    });

    app.get('/apprentice', function (req, res) {
      res.render('apprentice');
    });

    app.get('/local/:page', function (req, res) {
      res.render('local/' + req.params.page);
    });
  },
};
