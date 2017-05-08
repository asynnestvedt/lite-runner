let config = require('../config/config.js');
let DbMgr = require('../lib/db-mgr.js');
let Job = require('../lib/job.js');
let express = require('express');
let app = express();

let db = new DbMgr();



let plus10min = Math.round(((new Date()).getTime() / 1000)) + 600;


let timestamp = (new Date()).getTime();
for (let i=100000; i>0; --i) {
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
    let aJob = newJob.unified();
    aJob.status = 'completed';
    db.log_write(aJob,function() {
        if(i <= 1) {
            console.log('done inserts - seconds elapsed:' + (((new Date()).getTime() - timestamp)) / 1000);
        }
    }.bind(i, timestamp));
}


/**
 * DB TESTS
 */


// db.schedule();