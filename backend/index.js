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


const mysql = require('mysql2');

// get the promise implementation, we will use bluebird
//const bluebird = require('bluebird');

const connection = mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
// var student  = require("./routes/student");
// app.use('/',student)
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
            if (table === "students") {
                req.session.user = results[0].sid;
                req.session.type = "student";
            }
            else {
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
app.post('/studentData', (req, res) => {
    async function getStudent() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, fields] = await conn.execute('SELECT * FROM `students` WHERE sid = "1"');
        await conn.end();
        return rows;
    }

    data = getStudent()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post('/studentSkills', (req, res) => {
    async function getSkills() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, f1] = await conn.execute('SELECT `skills`.`name` FROM `skills` INNER JOIN `skillset` ON (skills.skid = skillset.skid AND skillset.sid = "1" )');
        await conn.end();
        return rows;
    }

    data = getSkills()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post('/studentEducation', (req, res) => {
    async function getEducation() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, f2] = await conn.execute('SELECT * FROM `education` WHERE sid = "1"');
        await conn.end();
        //return Object.assign({}, rows);
        return rows;
    }

    data = getEducation()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post('/studentExperience', (req, res) => {
    async function getExperience() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, f3] = await conn.execute('SELECT * FROM `experience` WHERE sid = "1"');
        await conn.end();
        // return Object.assign({}, rows);
        return rows;
    }

    data = getExperience()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post('/insertExperience', (req, res) => {
    console.log(req.body);
    async function getExperience() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('INSERT INTO `experience` (sid, job_title, employer, start, end, current_position, location, Description) VALUES (?,?,?,?,?,?,?,?)', [req.body.sid, req.body.job_title, req.body.employer, req.body.start, req.body.end, req.body.current_position, req.body.location, req.body.description]);
        await conn.end();
        // return Object.assign({}, rows);
        if (error) return res.send(error);
        else {
            return "Inserted";
        }
    }

    data = getExperience()
    data.then((r) => {
        res.send(r.data);
        // console.log(r);
    })
})
app.post('/updateExperience', (req,res) =>{
    console.log(req.body);
    async function updateExperience() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('UPDATE `experience` SET job_title = ?, employer = ?, start = ?, end = ?, current_position = ? ,location = ? ,Description = ? WHERE id = ?' , [req.body.job_title, req.body.employer, req.body.start, req.body.end, req.body.current_position, req.body.location, req.body.description, Number(req.body.id)]);
        
        await conn.end();
        // return Object.assign({}, rows);
        if (error){ 
            console.log(error);
            return res.send(error)
        }
        else {
            console.log(results)
            return "Inserted";
        }
    }

    data = updateExperience()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post('/deleteExperience', (req,res) =>{
    console.log(req.body);
    async function updateExperience() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('DELETE FROM `experience`  WHERE id = ?;' , [Number(req.body.id)]);
        
        await conn.end();
        // return Object.assign({}, rows);
        if (error){ 
            
            return res.send(error)
        }
        else {
            console.log(results)
            return "Deleted";
        }
    }

    data = updateExperience()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post('/insertEducation', (req, res) => {
    console.log(req.body);
    async function getExperience() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('INSERT INTO `education` (sid,school_name,edu_level,start,end,major,minor,gpa,cgpa,hide_gpa,hide_cgpa)  VALUES (?,?,?,?,?,?,?,?,?,?,?)', [req.body.sid, req.body.school_name, req.body.edu_level, req.body.start, req.body.end, req.body.major, req.body.minor, req.body.gpa,req.body.cgpa,req.body.hide_gpa,req.body.hide_cgpa]);
        await conn.end();
        // return Object.assign({}, rows);
        if (error) return res.send(error);
        else {
            return "Inserted";
        }
    }

    data = getExperience()
    data.then((r) => {
        res.send(r.data);
        // console.log(r);
    })
})
app.post('/updateEducation', (req,res) =>{
    // console.log(req.body);
    async function updateEducation() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.execute('UPDATE `education` SET school_name = ?, edu_level = ?, start = ?, end = ?, major = ? ,minor = ? ,gpa = ?, cgpa = ? , hide_gpa = ?, hide_cgpa = ? WHERE id = ?' , [req.body.school_name, req.body.edu_level, req.body.start, req.body.end, req.body.major, req.body.minor, req.body.gpa,req.body.cgpa,req.body.hide_gpa,req.body.hide_cgpa, Number(req.body.id)]);
        
        await conn.end();
        // return Object.assign({}, rows);
        if (error){ 
            return res.send(error)
        }
        else {
            // console.log(results)
            return "Updated";
        }
    }

    data = updateEducation()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post('/deleteEducation', (req,res) =>{
    console.log(req.body);
    async function deleteEducation() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('DELETE FROM `education`  WHERE id = ?;' , [Number(req.body.id)]);
        
        await conn.end();
        // return Object.assign({}, rows);
        if (error){ 
            console.log(error);
            return res.send(error)
        }
        else {
            console.log(results)
            return "Deleted";
        }
    }

    data = deleteEducation()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001"); 