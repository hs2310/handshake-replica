module.exports = (function () {
    var express = require('express');
    var app = express();
    app.post('/student', (req, res) => {
        async function getStudent() {
            const mysql = require('mysql2/promise');
            const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'handshake' });
            const [rows, fields] = await conn.execute('SELECT * FROM `students` WHERE sid = "1"');
            const [r, f] = await conn.execute('SELECT `skills`.`name` FROM `skills` INNER JOIN `skillset` ON (skills.skid = skillset.skid AND skillset.sid = "1" )');
            rows.push(r);
            await conn.end();
            return rows;
        }

        data = getStudent()
        data.then((r) => {
            res.send(r);
            // console.log(r);
        })
    })
    return app;
})
