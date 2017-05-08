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
    GET     /
    POST    /jobs
    GET     /jobs/:filter?
    DELETE  /jobs/:_ids
    GET     /log/:filter?
    
**filter** parameter is an optional json that maps to a mongo query and must use strings for attribute names such as ` /jobs/{"type":"emailer"} `

**_id** parameter is a json array of job ids e.g. ` /jobs/["2ijYWJ7LiA1BrqlS","WNxlBzgW36gczRBV"] `


### Performance Notes ###
in testing a 200 MB log with > 600,000 documents an unindexed log query for 30,000 documants returned in 2.003 seconds on a HP Spectre x360.

node crashed due to lack of memory when loading the databases (at > 600k docs) and simulatneously queuing 100,000 inserts.
