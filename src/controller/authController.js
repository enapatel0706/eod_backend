const mysql = require("../db/connection").con;
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const path = require("path")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const JWT_SECRET = 'Ordex Portal EOD Web App........'

const login = ((req, res) => {

    const selQuery = "select * from USER as u, EMPLOYEE as e,EMPLOYEE_EMPROLE as ee, EMPROLE as er where u.user_id=e.user_id and e.email=? and e.emp_id=ee.emp_id and ee.emp_role_id=er.emp_role_id;";
    // console.log(req.body.Username);
    mysql.query(selQuery, [req.body.Email], (err, results) => {
        console.log(results);
        if (err) {
            console.log(`Error In Login ${err}`);
        } else {
            if (results != "") {

                if (results[0].password == req.body.Password) {
                    if ((req.body.Role == 'employee' || req.body.Role == 'intern') && (results[0].role_name == 'employee' || results[0].role_name == 'intern')) {
                        res.status(200).json({ "userId": results[0].user_id, "userName": results[0].username, "empId": results[0].emp_id, "empFname": results[0].emp_fname, "empLname": results[0].emp_lname, "email": results[0].email, "empType": results[0].emp_type, "empRoleId": results[0].emp_role_id, "roleName": results[0].role_name, "post": results[0].post });
                    }
                    else if (req.body.Role == 'admin' && results[0].role_name == 'admin') {
                        res.status(200).json({ "userId": results[0].user_id, "userName": results[0].username, "empId": results[0].emp_id, "empFname": results[0].emp_fname, "empLname": results[0].emp_lname, "email": results[0].email, "empType": results[0].emp_type, "empRoleId": results[0].emp_role_id, "roleName": results[0].role_name, "post": results[0].post });
                    }
                    else {
                        res.status(401).json({ msg: "Unauthorized User" });
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

let secret, payload, token;

let user_id, email, password;

const sendEmailForgot = ((req, res) => {

    const selQuery = "SELECT * FROM `ORDEX-PORTAL`.EMPLOYEE WHERE Email=?";
    mysql.query(selQuery, [req.body.Email], (err, results) => {
        if (err) {
            console.log(`Error - ${err}`);
        } else {
            if (results != "") {
                const selQuery = "select u.user_id, e.email, u.password from EMPLOYEE e, USER u where u.user_id= e.user_id and e.email=?";
                mysql.query(selQuery, [req.body.Email], (err, results) => {
                    if (err) {
                        console.log(`Error- ${err}`);
                    }
                    else {
                        user_id = results[0].user_id
                        email = results[0].email
                        password = results[0].password

                        secret = JWT_SECRET + password

                        payload = {
                            email: email,
                            id: user_id
                        }

                        token = jwt.sign(payload, secret, { expiresIn: '15m' })

                        var transporter = nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                                user: 'ordextechnology@gmail.com',
                                pass: 'dzjilbhtlkxoeknl'
                            }
                        });
                        const filePath = path.join(__dirname, '../emailTemplate/forgotEmail.html');
                        const source = fs.readFileSync(filePath, 'utf-8').toString();
                        const template = handlebars.compile(source);
                        const replacements = {
                            email: req.body.Email,
                            link: `http://localhost:3000/resetpassword?user_id=${user_id}&token=${token}`
                        };
                        const htmlToSend = template(replacements);

                        var mailOptions = {
                            from: 'ordextechnology@gmail.com',
                            to: req.body.Email,
                            subject: 'Forget Password Instructions',
                            html: htmlToSend
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                                res.status(200).json({ "msg": 'Please check your email for forget your password' });
                            }
                        });
                    }
                })
            } else {
                res.status(404).json({ "msg": "user not found!" });
            }
        }
    })
})

const forgotPassword = ((req, res) => {
    const selQuery = `SELECT * FROM USER WHERE user_id=?`;
    mysql.query(selQuery, [req.body.user_idF], (err, results) => {
        if (err) {
            res.status(500).json({ "msg": "Error" })
        } else {
            if (results != "") {
                if (req.body.user_idF == user_id) {
                    if (req.body.password == req.body.password2) {
                        const secretA = JWT_SECRET + results[0].password
                        const payloadA = jwt.verify(req.body.tokenF, secretA)
                        const updateQuery = `UPDATE USER SET Password = ?  WHERE User_ID =?`;
                        mysql.query(updateQuery, [req.body.password, req.body.user_idF], (err, results) => {
                            if (err) {
                                res.status(500).json({ "msg": "Updation Failed" });
                            } else {
                                res.status(200).json({ "msg": "Password updated Successfully" });
                            }
                        })
                    }
                    else {
                        res.status(500).json({ "msg": "Password and Confirm Password are not matched" })
                    }
                }
                else {
                    res.status(500).json({ "msg": "Invalid ID........" })
                }
            }
        }
    })
})

module.exports = { login, sendEmailForgot, forgotPassword };