module.exports = {
  bind: function (app) {
    app.get('/', function (req, res) {
      res.render('index')
    })
    app.get('/help/:compName', function (req, res) {
      var compName = req.params.compName;
      res.render('help/' + compName, {action: req.query.action, type: req.query.type})
    })
    app.get('/ma/:compName', function (req, res) {
      var compName = req.params.compName;
      res.render('ma/' + compName, {action: req.query.action, type: req.query.type})
    })
    app.get('/local/:compName', function (req, res) {
      var compName = req.params.compName;
      res.render('local/' + compName, {action: req.query.action, type: req.query.type})
    })
    app.get('/favourites/:compName', function (req, res) {
      var compName = req.params.compName;
      res.render('favourites/' + compName, {action: req.query.action, type: req.query.type})
    })
    app.get('/provider/:compName', function (req, res) {
      var compName = req.params.compName;
      res.render('provider/' + compName, {action: req.query.action, type: req.query.type})
    })
    app.get('/fat/:compName', function (req, res) {
      var compName = req.params.compName;
      res.render('fat/' + compName, {action: req.query.action, type: req.query.type})
    })
    app.get('/example/:compName', function (req, res) {
      var compName = req.params.compName;
      res.render('example/' + compName, {action: req.query.action, type: req.query.type})
    })
    app.get('/components/:compName', function (req, res) {
      var compName = req.params.compName;
      res.render('components/' + compName, {action: req.query.action, type: req.query.type})
    })
    app.get('/components/:compFolder/:compName', function (req, res) {
      var compFolder = req.params.compFolder;
      var compName = req.params.compName;
      res.render('components/' + compFolder + '/' + compName, {action: req.query.action, type: req.query.type})
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

    app.get('/campaign/json/:fileId', function (req, res) {
      var fileId = req.params.fileId;
      res.render('campaign/json/' + fileId + '.json')
    })

    app.get('/cdn-documentation/:compName', function (req, res) {
      var compName = req.params.compName;
      res.render('cdn-documentation/' + compName, {action: req.query.action, type: req.query.type})
    })
  }
}