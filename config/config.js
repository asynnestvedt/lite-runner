module.exports = {
    app: {
        secret: ""
    },
    server: {
        default:  {
            port: 3333
        }
    },
    db: {
        filename_prefix: "./data/", // set path and unique prefixes to prevent filename collisions
        autoclean: true, // rewrites and compacts the database
        autoclean_interval: 86400, // 24 hours
        rescan_interval: 10, // how often to check for jobs to run, in seconds
        archive_completed_jobs: true, // moves completed jobs to a seperate log file
        indexes: {
            jobs: [
                { fieldName: 'when', unique: false },
                { fieldName: 'status', unique: false, sparse: true },
                { fieldName: 'metadata.hash', unique: true },
                { fieldName: 'metadata.patientId', unique: false, sparse: true }
            ],
            log: [
                { fieldName: 'status', unique: false, sparse: true }
            ]
        } 
    }
}