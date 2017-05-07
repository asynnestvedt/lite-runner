module.exports = function(app, db) {
    require('./jobs.js')(app, db);
    require('./log.js')(app, db);
};
