let config = require('./config/config.js');
let DbMgr = require('./lib/db-mgr.js');
let Job = require('./lib/job.js');
let express = require('express');
let app = express();

let db = new DbMgr();



let plus10min = ((new Date()).getTime() / 1000) + 600;



for (let i=1000000; i>0; --i) {
    let newJob = new Job(
        {
            noise: Math.random(),
            subject: 'test email',
            body: 'hello',
            htmlbody: '<h1>hellp</h1>'
        },
        {
            type:'COMMUNICATION_EMAIL',
            creator:"alan",
            patientId: "123"
        },
        plus10min
    );
    db.jobs_write(newJob.unified());
}

/**
 * DB TESTS
 */


// db.schedule();