const mysql = require("../db/connection").con;

const login = ((req, res) => {

    console.log("Login Called");
    const selQuery = "select * from USER as u, EMPLOYEE as e,EMPLOYEE_EMPROLE as ee, EMPROLE as er where u.User_ID=e.User_ID and e.Email=? and e.Emp_id=ee.Emp_id and ee.Emp_role_id=er.Emp_role_id;";
    // console.log(req.body.Username);
    mysql.query(selQuery, [req.body.Email], (err, results) => {
        console.log(results);
        if (err) {
            console.log(`Error In Login ${err}`);
        } else {
            if (results != "") {

                if (results[0].Password == req.body.Password) {
                    if (req.body.Role == 'employee' || req.body.Role == 'intern') {
                        res.status(200).json({ "msg": `${req.body.Role} Login Successful` });
                    }
                    if (req.body.Role == 'admin') {
                        res.status(200).json({ "msg": `${req.body.Role} Login Successful` });
                    }
                }
                else {
                    res.status(401).json({ msg: "Unauthorized User" })
                }
            } else {
                console.log("No results found");
                res.status(404).json({ "msg": "user not found!" });
            }
        }
    })
})

module.exports = login;