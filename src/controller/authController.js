const mysql = require("../db/connection").con;
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const path = require("path")
const fs = require("fs")
const jwt = require("jsonwebtoken");
const { FROM_MAIL, FROM_MAIL_PASS } = require("../config/envConfig");
const JWT_SECRET = 'Ordex Portal EOD Web App........'
const bcrypt = require('bcryptjs');
const { log } = require("console");

const login = ((req, res) => {

    const selQuery = "SELECT * FROM USER AS u, EMPLOYEE AS e, EMPLOYEE_EMPROLE AS ee, EMPROLE AS er WHERE u.user_id=e.user_id AND e.email=? AND e.emp_id=ee.emp_id AND ee.emp_role_id=er.emp_role_id;"
    mysql.query(selQuery, [req.body.Email], async (err, results) => {
        try {
            if (err) {
                res.status(500).json({ "msg": 'Error in Login please Enter Valid Credentials' });
            } else {
                if (results.length > 0) {
                    const passwordcompare = await bcrypt.compare(req.body.Password, results[0].password);
                    console.log(passwordcompare);
                    if (passwordcompare) {

                        if ((req.body.Role == 'employee' || req.body.Role == 'intern') && (results[0].role_name == 'employee' || results[0].role_name == 'intern')) {
                            res.status(200).json({
                                "userId": results[0].user_id, "userName": results[0].username,
                                "pass_expire": results[0].pass_expire, "empId": results[0].emp_id, "empFname": results[0].emp_fname, "empLname": results[0].emp_lname, "email": results[0].email, "empType": results[0].emp_type, "empRoleId": results[0].emp_role_id, "roleName": results[0].role_name, "post": results[0].post
                            });
                        } else if (req.body.Role == 'admin' && results[0].role_name == 'admin') {
                            res.status(200).json({
                                "userId": results[0].user_id, "userName": results[0].username,
                                "pass_expire": results[0].pass_expire, "empId": results[0].emp_id, "empFname": results[0].emp_fname, "empLname": results[0].emp_lname, "email": results[0].email, "empType": results[0].emp_type, "empRoleId": results[0].emp_role_id, "roleName": results[0].role_name, "post": results[0].post
                            });
                        }
                        else if (req.body.Role == 'admin' && results[0].role_name == 'admin') {
                            res.status(200).json({
                                "userId": results[0].user_id, "userName": results[0].username, "empId": results[0].emp_id, "empFname": results[0].emp_fname, "empLname": results[0].emp_lname, "email": results[0].email, "empType": results[0].emp_type, "empRoleId": results[0].emp_role_id, "roleName": results[0].role_name, "post": results
                            })
                        }
                        else {
                            res.status(401).json({ msg: "Unauthorized User" });
                        }
                    }
                    else {
                        res.status(401).json({
                            msg: "Invalid credentials"
                        });
                    }
                } else {
                    console.log("No results found");
                    res.status(204).json({ "msg": "user not found!" });
                }
            }
        }
        catch (err) {
            console.log(err.message);
            res.status(400).send({ Error: err })
        }
    })
})


let secret, payload, token;

let user_id, email, password;

const sendEmailForgot = ((req, res) => {
    const selQuery = "SELECT * FROM EMPLOYEE WHERE Email=?";
    mysql.query(selQuery, [req.body.Email], (err, results) => {
        if (err) {
            console.log(`Error - ${err}`);
            res.status(500).json({ "msg": 'Error To Fetch The Data' });
        } else {
            if (results.length > 0) {
                const selQuery = "select u.user_id, e.email, u.password from EMPLOYEE e, USER u where u.user_id= e.user_id and e.email=?";
                mysql.query(selQuery, [req.body.Email], (err, results) => {
                    if (err) {
                        console.log(`Error- ${err}`);
                        res.status(500).json({ "msg": 'Error in Fetching Data' });

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
                                user: FROM_MAIL,
                                pass: FROM_MAIL_PASS
                            },
                            tls: {
                                rejectUnauthorized: false
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
                            from: FROM_MAIL,
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
                res.status(204).json({ "msg": "user not found!" });
            }
        }
    })
})
const forgotPassword = ((req, res) => {
    const selQuery = `SELECT * FROM USER WHERE user_id=?`;
    mysql.query(selQuery, [req.body.user_idF], async (err, results) => {

        if (err) {
            res.status(500).json({ "msg": "Error" })
        } else {
            if (results.length > 0) {
                if (req.body.user_idF == user_id) {
                    if (req.body.password == req.body.password2) {
                        const secretA = JWT_SECRET + results[0].password
                        const payloadA = jwt.verify(req.body.tokenF, secretA)
                        const updateQuery = `UPDATE USER SET Password = ? WHERE User_ID = ?`;
                        const saltRounds = 10; // number of salt rounds
                        const salt = await bcrypt.genSaltSync(saltRounds);
                        bcrypt.hash(req.body.password, salt, function (err, hash) {
                            const secpass = hash;
                            mysql.query(updateQuery, [secpass, req.body.user_idF], (err, results) => {
                                if (err) {
                                    res.status(500).json({ "msg": "Updation Failed" });
                                } else {
                                    res.status(200).json({ "msg": "Password updated Successfully" });
                                }
                            })
                        });
                        try {
                            if (err) {
                                res.status(500).json({ "msg": "Error" });
                            } else {
                                if (results.length > 0) {
                                    if (req.body.user_idF == user_id) {
                                        if (req.body.password == req.body.password2) {
                                            const secretA = JWT_SECRET + results[0].password
                                            const payloadA = jwt.verify(req.body.tokenF, secretA)
                                            const saltRounds = 10;
                                            const salt = await bcrypt.genSaltSync(saltRounds);
                                            bcrypt.hash(req.body.password, salt, function (err, hash) {
                                                const secpass = hash;
                                                const updateQuery = `UPDATE USER SET Password = ?, pass_expire = ? WHERE User_ID = ?`;
                                                mysql.query(updateQuery, [secpass, 'no', req.body.user_idF], (err, results) => {
                                                    if (err) {
                                                        res.status(500).json({ "msg": "Updation Failed" });
                                                    } else {
                                                        res.status(200).json({ "msg": "Password updated Successfully" });
                                                    }
                                                });
                                            });
                                        } else {
                                            res.status(500).json({ "msg": "Password and Confirm Password are not matched" })
                                        }
                                    } else {
                                        res.status(500).json({ "msg": "Invalid ID........" })

                                    }
                                }
                            }
                        } catch (err) {
                            console.log(err.message);
                            res.status(400).send({ Error: err })
                        }

                    }
                }
            }
        }
    });
});



const getusertoken = ((req, res) => {
    const selQuery = "SELECT * FROM `ORDEX-PORTAL`.EMPLOYEE WHERE Email = ?";
    mysql.query(selQuery, [req.body.Email], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({ "msg": 'Error To Fetching Data' });
        } else {
            if (results.length > 0) {
                const selQuery = "select u.user_id, e.email, u.password from EMPLOYEE e, USER u where u.user_id= e.user_id and e.email=?";

                mysql.query(selQuery, [req.body.Email], (err, results) => {
                    if (err) {
                        console.log(`Error- ${err}`);
                        res.status(500).json({ "msg": 'Error in Fetching Data' });

                    } else {
                        user_id = results[0].user_id
                        const email = results[0].email
                        const password = results[0].password

                        const secret = JWT_SECRET + password

                        const token = jwt.sign({ user_id: user_id, email: email }, secret, { expiresIn: '30m' });
                        res.status(200).json({ "user_id": user_id, "token": token });
                    }
                })
            } else {
                res.status(404).json({ "msg": "User not found!" });
            }
        }
    });
});



module.exports = { login, sendEmailForgot, forgotPassword, getusertoken };