const mysql = require("mysql2");
const con = mysql.createConnection({
    host: "kyobeeproddb.cvclroatvi7x.us-west-2.rds.amazonaws.com",
    user: "root",
    password: "KyobeeOrdex1234",
    database: "ORDEX-PORTAL",
    port: 3306
});

con.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connection Established!");
    }
});

module.exports.con = con;

