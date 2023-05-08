const mysql = require("mysql2");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = require("../config/envConfig");
const con = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT
});


con.getConnection((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connection Established!");
    }
})

// con.connect((err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Connection Established!");

//         // con.query("SET GLOBAL wait_timeout=28800");

//     }
// });

module.exports.con = con;

