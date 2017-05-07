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
