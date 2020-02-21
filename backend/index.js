//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret: 'cmpe273_kafka_passport_mongo',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
}));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'handshake'
});


let isLoggedIn = () => {
    return true;
}
app.post('/student-signup', function (req, res) {

    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;
    var college = req.body.college;

    connection.query('SELECT * FROM `students` WHERE email = ? AND password = ?', [email, password], function (error, results, fields) {
        if (results.length > 0) {
            res.send("User Already Exists !!");
        }
        else {
            connection.query('INSERT INTO students (name, email, password, college) VALUES (?,?,?,?)', [name, email, password, college], (error, results) => {
                if (error) return res.json({ error: error });
                else {
                    res.send("Inserted");
                }
            });
        }
    });
});

app.post('/company-signup', function (req, res) {

    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;
    var location = req.body.location;

    connection.query('SELECT * FROM `company` WHERE email = ? AND password = ?', [email, password], function (error, results, fields) {
        console.log(typeof results);
        if (results.length > 0) {
            res.send("User Already Exists !!");
        }
        else {
            connection.query('INSERT INTO `company` (name, email, password, location) VALUES (?,?,?,?)', [name, email, password, location], (error, results) => {
                if (error) return res.json({ error: error });
                else {
                    res.send("Inserted");
                }
            });
        }
    });
});

app.post('/login', function (req, res) {
    let table = null;
    console.log("Inside Login Post Request");

    console.log("Req Body : ", req.body);
    if (req.body.company === false)
        table = "students";
    else
        table = "company";
    connection.query('SELECT * FROM `' + table + '` WHERE email = ? AND password = ?', [req.body.email, req.body.password], (error, results, fields) => {
        if (results.length > 0) {
            // if (user.username === req.body.username && user.password === req.body.password) {
            res.cookie('cookie', req.session.id, { maxAge: 900000, httpOnly: false, path: '/' });
            if (table === "students")
            {
                req.session.user = results[0].sid;
                req.session.type = "student";
            }
            else
            {
                req.session.user = results[0].cid;
                req.session.type = "company";
            }
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end("Successful Login");
        }
        else {
            res.statusCode = 401;
            res.end("Error");
        }
    });

});
app.post('/student', (req, res) => {
    connection.query(
        'SELECT * FROM `students` WHERE sid = req.body.sid',
        function (err, results, fields) {
            res.send(results); // results contains rows returned by server
            //console.log(fields); // fields contains extra meta data about results, if available
        }
    );
})
//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001"); 