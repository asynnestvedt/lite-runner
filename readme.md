### Job Scheduler Microservice ###

## Features ##
1. logging (for when an audit trail is necessary)
2. configurable indexing on job metadata
3. an HTTP RESTlike interface
4. embedded database compliant to mongo API

### Configuration ###
edit `config/config.js` to set custom port, indexes, filenames and running intervals.

### Running ###
    npm install
    npm start
    
API info

> http://localhost:3333

    Method	Path
    GET	    /
    POST	/jobs
    GET	    /jobs/:filter?
    DELETE	/jobs/:_ids
    GET	    /log/:filter?
    
filter is an optional json that maps to a mongo query and must use strings for attribute names such as ` /jobs/{"type":"emailer"} `
    
