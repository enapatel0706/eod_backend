const mysql = require("../db/connection").con;


const getProjectEmp = ((req, res) => {
    const selQuery = "select P.Project_name from `ORDEX-PORTAL`.EMPLOYEE_PROJECT EP, `ORDEX-PORTAL`.PROJECT P, `ORDEX-PORTAL`.EMPLOYEE E WHERE E.Emp_id=? AND E.Emp_id = EP.EMP_ID AND EP.PROJECT_ID = P.Project_id;";
    mysql.query(selQuery, [req.body.empid], (err, results) => {
        if (err) {
            console.log(`Error fetching data`);
        } else {
            if (results != "") {
                res.status(200).json(results)
            } else {
                res.status(404).json({ "msg": "Data not found!" });
            }
        }
    })
})

const setTask = ((req, res) => {

    const insQuery = "insert into EOD_TASK(Emp_id,Project_id,Task_title,Task_desc,Status,WorkTime,Created_At,Eod_date) values(?,?,?,?,?,?,?,?)";
    mysql.query(insQuery, [req.body.empId, req.body.projectId, req.body.taskTitle, req.body.taskDesc, req.body.status, req.body.workTime, req.body.createdAt,req.body.eodDate], (err, results) => {
        if (err) {
            console.log("EOD Task insertion failed");
            res.status(500).json({ "msg": "Insertion Failed" });
        } else {
            res.status(200).json({ "msg": "Data inserted Successfully" });
        }
    })
})

const getTaskEmp = ((req, res) => {
    const selQuery = "SELECT * FROM `ORDEX-PORTAL`.EOD_TASK WHERE Emp_id=? AND Eod_date=?;";
    mysql.query(selQuery, [req.body.empid, req.body.eoddate], (err, results) => {
        if (err) {
            console.log(`Error fetching data`);
        } else {
            if (results != "") {
                res.status(200).json(results)
            } else {
                res.status(404).json({ "msg": "Data not found!" });
            }
        }
    })
})

const setEod = ((req, res) => {
    const selQuery = "SELECT * FROM `ORDEX-PORTAL`.EOD_TASK WHERE Emp_id=? AND Eod_date=?;";
    mysql.query(selQuery, [req.body.empId, req.body.eoddate], (err, results) => {
        if (err) {
            console.log(`Error fetching data`);
        } else {
            if (results != "") {
                function sumUp(sum, time) {
                    var times = time.split(":");
                    sum.h += +times[0];
                    sum.m += +times[1];
                    sum.s += +times[2];
                    return sum;
                }
                function parseSum(sum) {
                    var totSec = sum.s;
                    var s = totSec % 60;
                    var totMin = sum.m + parseInt(totSec / 60);
                    var m = totMin % 60;
                    var totHour = sum.h + parseInt(totMin / 60);
                    var h = totHour;
                    return `${h}:${m}:${s}`;
                }
                var sum = { h: 0, m: 0, s: 0 };
                results.map((data, index) => {
                    sum = sumUp(sum, data.WorkTime)
                })
                let timeSum = parseSum(sum)

                const insQuery = "INSERT INTO `ORDEX-PORTAL`.EOD(Emp_id, Total_Work_time, Created_At,Eod_date) VALUES (?,?,?,?)";
                mysql.query(insQuery, [req.body.empId, timeSum, req.body.createdAt, req.body.eoddate], (err, results) => {
                    if (err) {
                        res.status(500).json({ "msg": "Insertion failed" });
                    } else {
                        res.status(200).json({ "msg": "Data inserted successfully" });
                    }
                })
            } else {
                res.status(404).json({ "msg": "Data not found!" });
            }
        }
    })
})



module.exports = { getProjectEmp, getTaskEmp, setEod, setTask };
