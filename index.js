let config = require('./config/config.js'),
    db = new (require('./lib/db-mgr.js')),
    express = require('express'),
    bodyparser = require('body-parser');

let app = express();
app.use(bodyparser.json());

/**
 * Start processing Scheduled Jobs
 */
let jobRunner = new (require('./lib/job-runner.js'));
jobRunner.start(db, config.db.rescan_interval);


/**
 * display API info at root URL
 */
app.get('/', function (req, res) {
    res.type('html');
    res.send(require('./lib/express-list-routes')(app._router.stack));
})

/**
 * loads broken out routes
 */
require('./routes')(app, db);

/**
 * Start HTTP Server
 * port config can be overridden using environment var
 */
let port = process.env.PORT || config.server.default.port;
app.listen(port, function () {
    console.log('Express app listening on port '+port)
})