module.exports = function(app) {
    app.get('/log/:filter?', function (req, res) {
        let filter = {};
        try {
            filter = JSON.parse(req.params.filter || "{}");
        } catch (e){
            res.status(400).send(e); 
            return next(new Error(e.message));
        }
        
        db.jobs_read(filter, null, null, function(err, jobdocs) {
            if(!err) {
                res.type('json').status(200).send(JSON.stringify(jobdocs));
            } else {
                res.type('text/plain');
                res.status(400).send('no records found');
            }
        });
    });
}
