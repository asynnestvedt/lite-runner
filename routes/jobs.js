let Job = require('../lib/job.js');

module.exports = function(app, db) {

    app.post('/jobs', function (req, res) {
        res.type('json');
        let job = new Job(req.body.payload, req.body.metadata, req.body.when, req.body.archive || null);

        if(job.isValid()) {
            db.jobs_write(job.unified(), function(err, jobdoc) {
                if (!err) {
                    res.status(201).send(JSON.stringify( {_id: jobdoc._id} ));
                } else {
                    res.type('text/plain');
                    res.status(400).send("duplicate entry");
                }
            });
        } else {
            res.type('text/plain');
            res.status(400).send("jobs require 'payload' and 'when' attributes");
        }
    });

    app.get('/jobs/:filter?', function (req, res, next) {
        res.type('json');
        let filter = {};
        
        try {
            filter = JSON.parse(req.params.filter || "{}");
        } catch (e){
            res.status(400).send(e); 
            return next(new Error(e.message));
        }
        
        db.jobs_read(filter, null, null, function(err, jobdocs) {
            if(!err) {
                res.status(200).send(JSON.stringify(jobdocs));
            } else {
                res.status(400).send("no records found");
            }
        });
    });

    app.delete('/jobs/:_ids', function (req, res, next) {
        let ids = [];
        try {
            ids = JSON.parse(req.params._ids) || [];
        } catch (e) {
            res.status(400).send(e);
            return next(new Error[e.message]);
        }
        
        for(let i=0; i < ids.length; ++i) {
            let filter = {_id: ids[i]};
            db.jobs_read(filter, null, null, function(err, jsonDoc){
                if(!err) {
                    jsonDoc.status = "cancelled";
                    db.log_write(jsonDoc);
                }
            });
            db.jobs_remove(filter, function(err, jobdocs) {
                if(!err) {
                    res.status(200).send(JSON.stringify("success"));
                } else {
                    res.status(400).send("no records found");
                }
            });
        }
    });

}
