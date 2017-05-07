
module.exports = class JobRunner {
    static get types() {
        return {
            'COMMUNICATION_SMS':'COMMUNICATION_SMS',
            'COMMUNICATION_MMS':'COMMUNICATION_MMS',
            'COMMUNICATION_EMAIL':'COMMUNICATION_EMAIL'
        }
    }

    /**
     * this is where you write job execution code
     * @param {Object} jobsDoc - array of job jsons 
     */
     run(jobsDoc) {
        for(let i=0; i < jobsDoc.length; ++i) {
            let job = jobsDoc[i];
            let success = false;
            let currentEpoch = (new Date()).getTime() / 1000;

            //do stuff
            success=true;

            if (success) {
                job.status = "completed";
                job.status_time = currentEpoch;
                this.db.log_write(job, function(err, doc){
                    if(!err) {
                        this.db.jobs_remove(doc._id, function(err, count){
                            if(err) {
                                console.log('could not delete completed job')
                            }
                        }.bind(this));
                    } else {
                        console.log('error moving job to log');
                    }
                }.bind(this));
            }
        }

    }

    constructor() {
        this.db = new Object();
        this.timer = new Object();
    }

    /**
     * starts running tasks and regularly checks the db for jobs to run
     * @param {number} interval - how often to check the db in seconds
     */
    start(db, interval) {
        this.db = db;

        this.timer = setInterval(function(){

            let currentEpoch = ((new Date).getTime() / 1000);
            
            this.db.jobs_read({ "when": { $lt: currentEpoch } }, null, null, function(err, jobs){
                if (jobs && jobs.length > 0) {
                    this.run(jobs);
                }
            }.bind(this));
        }.bind(this), interval * 1000);
    }

    /**
     * stops running tasks
     */
    stop() {
        clearInterval(this.timer);
    }
}