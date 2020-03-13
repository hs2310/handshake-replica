//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
const multer = require('multer');
var path = require('path');
var bcrypt = require('bcrypt');
// app.use(bodyParser.urlencoded({extended: true}))
var salt = bcrypt.genSaltSync(10)
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
})
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
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

    connection.query('SELECT * FROM `students` WHERE email = ?', [email], function (error, results, fields) {
        if (results.length > 0) {
            res.send("User Already Exists !!");
        }
        else {
            var hash = bcrypt.hashSync(password, salt);
            connection.query('INSERT INTO students (name, email, password, college) VALUES (?,?,?,?)', [name, email, hash, college], (error, results) => {
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
            var hash = bcrypt.hashSync(password, salt);
            connection.query('INSERT INTO `company` (name, email, password, location) VALUES (?,?,?,?)', [name, email, hash, location], (error, results) => {
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
    console.log("Inside Login Post Request" , req.body);

    console.log("Req Body : ", req.body.email);
    if (req.body.company === false)
        table = "students";
    else
        table = "company";
    connection.query('SELECT * FROM `' + table + '` WHERE email = ? ', [req.body.email], (error, results, fields) => {
        console.log(results);
        if (results.length > 0) {
            // if (user.username === req.body.username && user.password === req.body.password) {
            // var hash = bcrypt.hashSync(req.body.password, salt);
            if(bcrypt.compareSync(req.body.password, results[0].password)){
            res.cookie('cookie', req.session.id, { maxAge: 900000, httpOnly: false, path: '/' });
            let id = null;
            if (table === "students") {
                req.session.user = results[0].sid;
                req.session.type = "student";
                id = results[0].sid;

            }
            else {
                req.session.user = results[0].cid;
                req.session.type = "company";
                id = results[0].cid;

            }
            console.log(results[0].sid)
            // res.writeHead(200, {
            //     'Content-Type': 'text/plain'
            // })
            res.status(200).send(String(id));
            // res.sendStatus(200);
            // res.setHeader({'Content-Type': 'text/plain'})
            // res.end(results[0].sid);
        }
        else {
            res.statusCode = 401;
            res.end("Error");
        }
    }
        else {
            res.statusCode = 401;
            res.end("Error");
        }
    });

});
app.post('/studentData', (req, res) => {
    console.log(req.body)
    async function getStudent() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, fields] = await conn.execute('SELECT * FROM `students` WHERE sid = ?', [req.body.sid]);
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
    console.log(req.body.sid)
    async function getSkills() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, f1] = await conn.execute('SELECT `skills`.*,`skillset`.* FROM `skills` INNER JOIN `skillset` ON (skills.skid = skillset.skid AND skillset.sid = ? )', [req.body.sid]);
        await conn.end();
        return rows;
    }

    data = getSkills()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post('/getSkills', (req, res) => {
    async function getSkills() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, f1] = await conn.execute('SELECT * FROM `skills` ');
        await conn.end();
        return rows;
    }

    data = getSkills()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post('/DeleteSkill', (req, res) => {
    async function getSkills() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('DELETE FROM `skillset`  WHERE id = ?;', [Number(req.body.id)]);
        await conn.end();
    }

    data = getSkills()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})

app.post('/UpdateSkill', (req, res) => {
    async function getSkills() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, fields] = await conn.query('INSERT INTO `skillset` (sid,skid) VALUES (?,?)', [req.body.sid, req.body.selectSkill]);
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
        const [rows, f2] = await conn.execute('SELECT * FROM `education` WHERE sid = ?', [req.body.sid]);
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
        const [rows, f3] = await conn.execute('SELECT * FROM `experience` WHERE sid = ?', [Number(req.body.sid)]);
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
        if (error) return error;
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
app.put('/updateExperience', (req, res) => {
    console.log(req.body);
    async function updateExperience() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('UPDATE `experience` SET job_title = ?, employer = ?, start = ?, end = ?, current_position = ? ,location = ? ,Description = ? WHERE id = ?', [req.body.job_title, req.body.employer, req.body.start, req.body.end, req.body.current_position, req.body.location, req.body.description, Number(req.body.id)]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            console.log(error);
            return error
        }
        else {
            console.log(results)
            return "Inserted";
        }
    }

    data = updateExperience()
    data.then((r) => {
        res.send(JSO.stringify(r.data));
        // console.log(r);
    })
})
app.post('/deleteExperience', (req, res) => {
    console.log(req.body);
    async function updateExperience() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('DELETE FROM `experience`  WHERE id = ?;', [Number(req.body.id)]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {

            return error
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
        const [error, results] = await conn.query('INSERT INTO `education` (sid,school_name,edu_level,start,end,major,minor,gpa,cgpa,hide_gpa,hide_cgpa)  VALUES (?,?,?,?,?,?,?,?,?,?,?)', [req.body.sid, req.body.school_name, req.body.edu_level, req.body.start, req.body.end, req.body.major, req.body.minor, req.body.gpa, req.body.cgpa, req.body.hide_gpa, req.body.hide_cgpa]);
        await conn.end();
        // return Object.assign({}, rows);
        if (error) return error;
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
app.post('/updateEducation', (req, res) => {
    // console.log(req.body);
    async function updateEducation() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.execute('UPDATE `education` SET school_name = ?, edu_level = ?, start = ?, end = ?, major = ? ,minor = ? ,gpa = ?, cgpa = ? , hide_gpa = ?, hide_cgpa = ? WHERE id = ?', [req.body.school_name, req.body.edu_level, req.body.start, req.body.end, req.body.major, req.body.minor, req.body.gpa, req.body.cgpa, req.body.hide_gpa, req.body.hide_cgpa, Number(req.body.id)]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            return error
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
app.post('/deleteEducation', (req, res) => {
    console.log(req.body);
    async function deleteEducation() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('DELETE FROM `education`  WHERE id = ?;', [Number(req.body.id)]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            console.log(error);
            return error
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
app.post('/UpdateInfo', (req, res) => {
    console.log(req.body);
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('UPDATE `students` SET name = ? , college = ?, dob = ? WHERE sid = ?;', [req.body.name, req.body.college, req.body.dob, Number(req.body.sid)]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            return error
        }
        else {
            // console.log(results)
            return "Updated";
        }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post('/UpdateContactInfo', (req, res) => {
    console.log(req.body);
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.execute('UPDATE `students` SET mob = ? , email = ? WHERE sid = ?;', [req.body.mob, req.body.email, Number(req.body.sid)]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            return error
        }
        else {
            // console.log(results)
            return "Updated";
        }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post('/UpdateJourney', (req, res) => {
    console.log(req.body);
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('UPDATE `students` SET objective = ? WHERE sid = ?;', [req.body.objective, Number(req.body.sid)]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            return error
        }
        else {
            // console.log(results)
            return "Updated";
        }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r.data);
        // console.log(r);
    })
})

app.get('/getJobs', (req, res) => {
    // console.log(req.body);
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.execute('SELECT `job_List`.* , `company`.* FROM `job_List` INNER JOIN  `company` ON (`job_List`.cid = `company`.cid )');

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            return error;
        }
        else {
            // console.log(results)
            return results;
        }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.get('/getCompany', (req, res) => {
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, fields] = await conn.execute('SELECT `job_List`.* , `company`.* FROM `job_List` INNER JOIN  `company` ON (`job_List`.cid = `company`.cid )');

        await conn.end();
        // return Object.assign({}, rows);
        // if (error){ 
        //     return error
        // }
        // else {
        //     // console.log(results)
        //     return "Updated";
        // }
        return rows;
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r.data);
        // console.log(r);
    })
})
app.post("/getCompanyDetails", (req, res) => {
    console.log(req.body)
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, fields] = await conn.query('SELECT * FROM `company` WHERE cid = ?', [req.body.cid]);

        await conn.end();
        // return Object.assign({}, rows);
        // if (error){ 
        //     return error
        // }
        // else {
        // console.log(results)
        return rows;
        // }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        console.log(r);
    })
})
//start your server on port 3001
app.post("/checkapplied", (req, res) => {
    async function updateInfo() {
        console.log(req.body)
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, field] = await conn.query('SELECT * FROM job_applied WHERE jid = ? AND sid = ?', [req.body.jid, req.body.sid])
        await conn.end();
        if (rows.length > 0)
            return false
        else
            return true
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        console.log(r);
    })
})
app.post('/applyJobs', upload.single('file'), function (req, res) {
    // console.log(req)
    async function updateInfo() {
        var host = req.hostname;
        console.log("Hostname", host)
        console.log("File", req.file)
        // req.body.studentId = 1
        var imagepath = req.protocol + "://" + host + ':3001/' + req.file.destination + req.file.filename;
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });

        // upload.single('file');
        const [error, results] = await conn.query('INSERT INTO `job_applied` (`jid`,`sid`,`status`,`resume_url`) VALUES(?,?,?,?)', [req.body.jid, req.body.sid, "PENDING", imagepath]);
        await conn.end();
        if (error) {
            return error
        }
        else {
            // console.log(results)
            return "Applied";
        }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        console.log(r);
    })
});
app.post("/getApplicaion", (req, res) => {
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, fields] = await conn.query('SELECT job_applied.*, job_list.title, company.name FROM `job_applied` INNER JOIN `job_list` ON (`job_applied`.`jid` = `job_list`.`jid`) INNER JOIN `company` ON (`job_list`.cid = `company`.cid) WHERE `job_applied`.sid = ?', [req.body.sid]);

        await conn.end();
        // return Object.assign({}, rows);
        // if (error){ 
        //     return error
        // }
        // else {
        // console.log(results)
        return rows;
        // }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        console.log(r);
    })
})
app.get('/getAllStudents', (req, res) => {
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, fields] = await conn.execute('SELECT * FROM `students`');

        await conn.end();
        // return Object.assign({}, rows);
        // if (error){ 
        //     return error
        // }
        // else {
        //     // console.log(results)
        //     return "Updated";
        // }
        return rows;
    }

    data = updateInfo()
    data.then((r) => {

        res.send(r);
    })
})
app.post('/UpdateCompanyContactInfo', (req, res) => {
    console.log(req.body);
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.execute('UPDATE `company` SET mob = ? , email = ? WHERE cid = ?;', [req.body.mob, req.body.email, Number(req.body.cid)]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            return error
        }
        else {
            // console.log(results)
            return "Updated";
        }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post('/UpdateCompanyJourney', (req, res) => {
    console.log(req.body);
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.execute('UPDATE `company` SET description = ? WHERE cid = ?;', [req.body.objective, Number(req.body.cid)]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            return error
        }
        else {
            // console.log(results)
            return results;
        }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        console.log(r);
    })
})
app.post('/UpdateCompanyInfo', (req, res) => {
    console.log(req.body);
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('UPDATE `company` SET name = ? , location = ? WHERE cid = ?;', [req.body.name, req.body.college, req.body.dob, Number(req.body.cid)]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            return error
        }
        else {
            // console.log(results)
            return "Updated";
        }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post("/getPostedJobs", (req, res) => {
    console.log(req.body)
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('SELECT * FROM `job_list` WHERE cid = ?;', [Number(req.body.cid)]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            return error
        }
        else {
            // console.log(results)
            return "Updated";
        }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post("/postJob", (req, res) => {
    console.log(req.body)
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('INSERT INTO `job_list` (`title`, `posting_date`, `deadline`, `location`, `salary`, `job_description`, `job_category`, `cid`) VALUES (?,?,?,?,?,?,?,?);', [req.body.title, req.body.posting_date, req.body.deadline, req.body.location, req.body.salary, req.body.job_description, req.body.job_category, Number(req.body.cid)]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            return error
        }
        else {
            // console.log(results)
            return "Updated";
        }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post("/getAllApplications", (req, res) => {
    console.log(req.body)
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('SELECT `students`.* , `job_applied`.`jid`,`job_applied`.`status`,`job_applied`.`resume_url` FROM `students` INNER JOIN `job_applied` ON (`students`.`sid` = `job_applied`.`sid` AND `job_applied`.`jid` = ?)', [Number(req.body.jid)]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            return error
        }
        else {
            // console.log(results)
            return rows;
        }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post("/updateStatus", (req, res) => {
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('UPDATE `job_applied` SET status = ? WHERE jid = ? AND sid = ?;', [req.body.status, req.body.jid, req.body.sid]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            return error
        }
        else {
            // console.log(results)
            return results;
        }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post('/getPostedEvents', (req, res) => {
    console.log(req.body)
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('SELECT * FROM `event_list` WHERE cid = ?;', [Number(req.body.cid)]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            return error
        }
        else {
            // console.log(results)
            return "Updated";
        }
    }
    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post("/postEvent", (req, res) => {
    console.log(req.body)
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('INSERT INTO `event_list` (`cid`, `name`, `description`, `time`, `date`, `location`, `eligibility`) VALUES (?,?,?,?,?,?,?);', [req.body.cid, req.body.name, req.body.description, req.body.time, req.body.date, req.body.location, req.body.eligibility]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            return error
        }
        else {
            // console.log(results)
            return "Updated";
        }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post('/getEvents', (req, res) => {
    console.log(req.body)
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [error, results] = await conn.query('SELECT * FROM `event_list`;', [Number(req.body.cid)]);

        await conn.end();
        // return Object.assign({}, rows);
        if (error) {
            return error
        }
        else {
            // console.log(results)
            return "Updated";
        }
    }
    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post("/registerEvent", (req, res) => {
    console.log(req.body)
    async function updateInfo() {
        let exist = null;
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, fields] = await conn.query('SELECT * FROM `event_applied` WHERE sid = ? AND eid = ?;', [Number(req.body.sid), Number(req.body.eid)]);
        if (rows.length > 0) {
            console.log(rows)
            exist = "Applied Already !!!!"
        }
        else {
            const [err, result] = await conn.query('INSERT INTO `event_applied` (`eid`, `sid`) VALUES (?,?);', [Number(req.body.eid), Number(req.body.sid)]);
            exist = "Applied !!!!"
        }
        await conn.end();
        return exist
        // return Object.assign({}, rows);
        // if (error) {
        //     return error
        // }
        // else {
        //     // console.log(results)
        //     return "Updated";
        // }
    }
    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post("/getAppliedEvents", (req, res) => {
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, fields] = await conn.query('SELECT `event_list`.* FROM `event_list` INNER JOIN `event_applied` ON (`event_list`.`eid` = `event_applied`.`eid` AND `event_applied`.`sid` = ? );', [Number(req.body.sid)]);

        await conn.end();
        // return Object.assign({}, rows);
        // if (error) {
        //     return error
        // }
        // else {
        // console.log(results)
        return rows;
        // }
    }
    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post("/getEventStudents", (req, res) => {
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, fields] = await conn.query('SELECT `students`.* FROM `students` INNER JOIN `event_applied` ON (`students`.`sid` = `event_applied`.`sid` AND `event_applied`.`eid` = ? );', [Number(req.body.eid)]);

        await conn.end();
        // return Object.assign({}, rows);
        // if (error) {
        //     return error
        // }
        // else {
        // console.log(results)
        return rows;
        // }
    }
    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
// app.post('/company-profile_pic ', upload.single('file') , (req,res) =>{
//     // console.log(req.file)
//     // console.log(req.hostname)

//     // console.log(filepath)

//     // res.send(filepath)
//     console.log("CALLED COMPANy")
//     async function updateInfo() {
//         const mysql = require('mysql2/promise');
//         const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
//         const filepath = "http://" + req.hostname + ":3001/" + req.file.destination +"/"+req.file.filename ;
//         const [error, results] = await conn.query('UPDATE `company` SET profile_pic = ? WHERE cid = ?;', [filepath, req.body.cid]);

//         await conn.end();
//         // return Object.assign({}, rows);
//         if (error) {
//             return error
//         }
//         else {
//             // console.log(results)
//             return filepath;
//         }
//     }

//     data = updateInfo()
//     data.then((r) => {
//         res.send(r);
//         // console.log(r);
//     }) 
// } )

app.post('/student_profile_pic', upload.single('file'), (req, res) => {
    // console.log(req.file)
    // console.log(req.hostname)

    // console.log(filepath)

    // res.send(filepath)
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const filepath = "http://" + req.hostname + ":3001/" + req.file.destination + req.file.filename;
        const [results, error] = await conn.query('UPDATE `students` SET profile_pic = ? WHERE sid = ?;', [filepath, req.body.sid]);

        await conn.end();
        // return Object.assign({}, rows);
        if (results) {
            return filepath
        }
        else {
            // console.log(results)
            return filepath;
        }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})
app.post('/company_profile_pic', upload.single('file'), (req, res) => {
    // console.log(req.file)
    // console.log(req.hostname)

    // console.log(filepath)

    // res.send(filepath)
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const filepath = "http://" + req.hostname + ":3001/" + req.file.destination + req.file.filename;
        const [result, error] = await conn.query('UPDATE `company` SET profile_pic = ? WHERE cid = ?;', [filepath, req.body.cid]);

        await conn.end();
        // return Object.assign({}, rows);
        if (result) {
            return filepath
        }
        else {
            // console.log(results)
            return error;
        }
    }

    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    })
})

app.post("/getMajor", (req, res) => {
    async function updateInfo() {
        const mysql = require('mysql2/promise');
        const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
        const [rows, fields] = await conn.query('SELECT major FROM `education` INNER JOIN `students` ON (`students`.`sid` = `education`.`sid` AND `students`.`college` = `education`.`school_name` AND `students`.`sid` = ? );', [Number(req.body.sid)]);

        await conn.end();
        // return Object.assign({}, rows);
        // if (error) {
        //     return error
        // }
        // else {
        // console.log(results)
        return rows;
        // }
    }
    data = updateInfo()
    data.then((r) => {
        res.send(r);
        // console.log(r);
    }) 
})
app.listen(3001);
console.log("Server Listening on port 3001"); 