const dotenv = require('dotenv').config();

import express from 'express';
import route from './src/routes'
import cors from 'cors'
import https from 'https';
const app = express();
var bodyParser = require('body-parser')
app.use(express.json());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb',extended: true }));
app.use(express.static(__dirname + '/src/uploads'));
app.use(cors())
route(app);

let port = process.env.PORT || 3000;
console.log("process.env.PORT",process.env.PORT);
console.log("port",port);
if (process.env.NODE_ENV == 'local') {
    app.listen(port, () => console.log('Server running on http://localhost:' + port + '/'));
} else {
    const fs = require('fs');

    const options = {
        key: fs.readFileSync('./src/keypair/privkey.pem'),
        cert: fs.readFileSync('./src/keypair/fullchain.pem')
    };
    https.createServer(options, app).listen(port)
}
