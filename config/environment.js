const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'blahsomething',
    db: 'faceloop_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'khalidlad888',
            pass: 'waisjttnkdgwmvqz'
        }
    },
    google_client_id: '142639869744-ncbga3pb9vuauka1qvuf99nbvbdgcnsu.apps.googleusercontent.com',
    google_client_secret: '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',
    google_call_back_url: 'http://localhost:8000/users/auth/google/callback',
    jwt_secret: 'connectin',
    morgan: {
        mode: 'dev',
        options: {stream:accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path: process.env.CONNECTIN_ASSET_PATH,
    session_cookie_key: process.env.CONNECTIN_SESSION_COOKIE_KEY,
    db: process.env.CONNECTIN_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CONNECTIN_GMAIL_USERNAME,
            pass: process.env.CONNECTIN_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CONNECTIN_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CONNECTIN_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CONNECTIN_GOOGLE_CALL_BACK_URL,
    jwt_secret: process.env.CONNECTIN_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream:accessLogStream}
    }
}

module.exports = eval(process.env.CONNECTIN_ENVIRONMENT) == undefined ? development: eval(process.env.CONNECTIN_ENVIRONMENT);