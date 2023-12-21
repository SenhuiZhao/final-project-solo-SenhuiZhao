// Application server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = require('./router');
// const MongoStore = require('connect-mongodb-session')(session);


const mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
const app = express();
const port = 8000;

mongoose.connect(mongoDB, { useNewUrlParser: true }).then(() => {
    app.use(session({
        secret: 'fakestackoverflowsecret', cookie: {
            maxAge: 36000000
        }, resave: false, saveUninitialized: true,
        // store: new MongoStore({ uri: `${mongoDB}` })
    }));

    app.listen(port, () => {
        console.log('Server start');

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        process.on("SIGINT", () => {
            if (db) {
                db.close()
                    .catch((err) => console.log(err));
            }
            console.log("Server closed. Database instance disconnected");
        });
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    var corsOptions = {
        origin: 'http://localhost:3000',
        credentials: true
    };

    app.use(cors(corsOptions));
    app.use('/', router);

});



