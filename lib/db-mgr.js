let config = require('../config/config');

module.exports = class DbMgr {
    constructor() {
        let Datastore = require('nedb');

        /**
         * Filesystem locations for the Data
         */
        this.files = {
            jobs: (config.db.filename_prefix || '') + 'jobs.data.nedb',
            log: (config.db.filename_prefix || '') + 'log.data.nedb'
        }

        /**
         * NEDB database instances, can be changed to any mongo API compliant DB
         */
        this.db = {
            jobs: new Datastore({ filename: this.files.jobs, autoload: true, timestampData: true }),
            log: new Datastore({ filename: this.files.log, autoload: true })
        };

        /**
         * Holds timer id if autoclean is enabled
         */
        if(config.db.autoclean===true) {
            this.autoclean_timer = setInterval(function(){
                let timestamp = (new Date()).getTime();
                this.jobs_clean();
                console.log('cleaned - ms elapsed:' + ((new Date()).getTime() - timestamp));
            }.bind(this), config.db.autoclean_interval*1000);
        }
        
        /**
         * apply indexes from config file
         */
        for(let i in config.db.indexes.jobs) {
            this.db.jobs.ensureIndex(config.db.indexes.jobs[i], function (err) {
                if (err) console.log('indexing failed. data may be corrupt');
            });
        }

        for(let i in config.db.indexes.log) {
            this.db.log.ensureIndex(config.db.indexes.jobs[i], function (err) {
                if (err) console.log('indexing failed. data may be corrupt');
            });
        }

    }

    /**
     * this will cause nedb to compact the db
     */
    jobs_clean() {
        this.db.jobs.loadDatabase();
    }

    /**
     * schedule or update a single job
     * update occurs if _id attribute is present
     * @param {Object} doc - json from Job model 
     * @param {Object} cb 
     */
    jobs_write(doc, cb) {
        if (! doc)
            cb("no data provided", null);
        
        // do update if id exists
        if (doc._id) {
            this.db.jobs.update({_id: doc._id}, doc, function (err, newDoc) {
                if(cb && typeof cb == "function") {
                    cb(err, newDoc);
                }
            });
        }
        // or do insert 
        else {
            this.db.jobs.insert(doc, function (err, newDoc) {
                if(cb && typeof cb == "function") {
                    cb(err, newDoc);
                }
            });
        }
    }

    /**
     * get job documents
     * @param {Object} query - json object containing filters
     * @param {Object} sort 
     * @param {Number} limit 
     * @param {Object} cb 
     */
    jobs_read(query, sort, limit, cb) {
        sort = sort || {createdAt: -1}; // default to reverse chronological order
        
        this.db.jobs.find(query).sort(sort).limit(limit).exec(function(err, docs) {
            if(cb && typeof cb == "function")
                cb(err, docs);
        });
    }

    /**
     * remove one job
     * @param {String} doc_id 
     * @param {Object} cb 
     */
    jobs_remove(doc_id, cb) {
        if (! doc_id)
            cb("no data provided", null);

        this.db.jobs.remove({ _id: doc_id }, {}, function (err, numRemoved) {
            cb(err, numRemoved);
        });
    }

    /**
     * get log documents
     * @param {Object} query - json object containing filters
     * @param {Object} sort 
     * @param {Number} limit 
     * @param {Object} cb 
     */
    log_read(query, sort, limit, cb) {
        sort = sort || {createdAt: -1}; // default to reverse chronological order
        
        this.db.log.find(query).sort(sort).limit(limit).exec(function(err, docs) {
            if(cb && typeof cb == "function")
                cb(err, docs);
        });
    }

    /**
     * 
     * @param {Object} doc 
     * @param {Object} cb 
     */
    log_write(doc, cb) {
        if (! doc)
            cb("no data provided", null);
        
        this.db.log.insert(doc, function (err, newDoc) {
            if(cb && typeof cb == "function") {
                cb(err, newDoc);
            }
        });
    }

}
