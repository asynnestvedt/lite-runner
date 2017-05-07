let config = require('../config/config.js');

class Job {
    constructor(payload, metadata, when, archive) {
        if (archive=="undefined") {
            this.archive = config.db.archive_completed_jobs || false;
        }
        this.metadata = metadata || {};
        this.payload = payload || {};
        this.when = when;

        // this makes every entry unique by payload, metadata and delivery time. for preventing dupes.
        this.metadata.hash = require('crypto').createHash('sha256').update(JSON.stringify(payload)+JSON.stringify(metadata)+when.toString()).digest('hex');
    }

    /**
     * builds the db respresentation as unified json
     */
    unified() {
        
        return {
            when: this.when,
            payload: this.payload,
            metadata: this.metadata,
            archive: this.archive
        }
    }

    isValid() {
        if (!this.payload || !this.when) {
            return false; 
        }
        return true;
    }
}

module.exports = Job;