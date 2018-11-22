module.exports = {
  bind: function (app) {
    app.get('/', function (req, res) {
      res.render('index')
    })
    app.get('/components/:compName', function (req, res) {
      var compName = req.params.compName;
      res.render('components/' + compName , {action: req.query.action, type: req.query.type})
    })
    app.get('/campaign/:pageName', function (req, res) {
      var pageName = req.params.pageName;
      res.render('campaign/' + pageName , {action: req.query.action, type: req.query.type})
    })
    app.get('/campaign/components/:compName', function (req, res) {
      var compName = req.params.compName;
      res.render('campaign/components/' + compName +'/' + compName , {action: req.query.action, type: req.query.type})
    })
    app.get('/services/:journey/:stepId', function (req, res) {
      var stepId = req.params.stepId;
      var journey = req.params.journey;
      res.render('services/' + journey + '/' + stepId, {action: req.query.action, type: req.query.type})
    })
    app.get('/services/:journey/:subFolder/:stepId', function (req, res) {
      var stepId = req.params.stepId;
      var subFolder = req.params.subFolder;
      var journey = req.params.journey;
      res.render('services/' + journey + '/' + subFolder + '/' + stepId, {action: req.query.action, type: req.query.type})
    })
    app.get('/legacy/:journey/:stepId', function (req, res) {
      var stepId = req.params.stepId;
      var journey = req.params.journey;
      res.render('legacy/' + journey + '/' + stepId, {action: req.query.action, type: req.query.type})
    })
  }
}