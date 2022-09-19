const mysql = require("../db/connection").con;

const getEmployees = ((req, res) => {
    const selQuery = "SELECT * FROM `ORDEX-PORTAL`.EMPLOYEE;";
    mysql.query(selQuery, (err, results) => {
        if (err) {
            console.log(e);
        } else {
            if (results != "") {
                res.status(200).json(results)
            } else {
                res.status(404).json({ "msg": "Data not found!" });
            }
        }
    })
})


const getEmployeeById = ((req, res) => {
    const selQuery = `select e.*,es.skill_name,es.emp_skill_id from EMPLOYEE e 
    join EMPLOYEE_EMPSKILL ees on e.emp_id=ees.emp_id
    join EMPSKILL es on es.emp_skill_id=ees.emp_skill_id
    where e.emp_id=?;`;
    mysql.query(selQuery, [req.query.emp_id], (err, results) => {
        if (err) {
            console.log(e);
        } else {
            if (results != "") {
                res.status(200).json(results)
            } else {
                res.status(404).json({ "msg": "Data not found!" });
            }
        }
    })
})


const updateEmployee = ((req, res) => {
    const updateQuery = `UPDATE EMPLOYEE E 
    JOIN EMPLOYEE_EMPSKILL EES ON EES.emp_id=E.emp_id 
    JOIN EMPLOYEE_PROJECT EP ON EP.emp_id=E.emp_id
    set E.emp_fname=?, E.emp_midname=?, E.emp_lname=?, E.email=?, E.phoneno=?,
    E.post=?,E.emp_type=?, E.status=?, E.updated_at=?, EES.emp_skill_id=?, EP.project_id=?
    where E.emp_id=?`;
    mysql.query(updateQuery, [req.body.fname, req.body.mname, req.body.lname, req.body.email, req.body.phoneno,
    req.body.post, req.body.type, req.body.status, req.body.update_at, req.body.skill_id, req.body.project_id, req.body.emp_id], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            if (results != "") {
                res.status(200).json(results)
            } else {
                res.status(404).json({ "msg": "Data not found!" });
            }
        }
    })
})


const getEmpAttendance = ((req, res) => {
    const selQuery = `eo.eod_date,eo.created_at,emp_code,emp.emp_fname,emp.emp_midname,emp.emp_lname,emp.email,emp.emp_type,eo.total_work_time, emp.status
    FROM EMPLOYEE emp
    LEFT JOIN EOD eo
    ON emp.emp_id=eo.emp_id AND eo.eod_date=?
    WHERE emp.status="ACTIVE" AND emp.emp_type<>'admin' ;`;
    mysql.query(selQuery, [req.query.eod_date], (err, results) => {
        if (err) {
            console.log(e);
        } else {
            if (results != "") {
                res.status(200).json(results)
            } else {
                res.status(404).json({ "msg": "Data not found!" });
            }
        }
    })
})


const getEmpAttendancePresent = ((req, res) => {
    const selQuery = `SELECT eo.eod_date,emp.emp_code,emp.emp_fname,emp.email,emp.post,eo.total_work_time, IF(eo.eod_Date=eo.created_at,"Present","Absent") AS 'attendance'
    FROM EMPLOYEE emp, EOD eo 
    WHERE emp.status='ACTIVE' AND eo.emp_id=emp.emp_id AND eo.eod_date=? AND eo.eod_date=eo.created_at;`;
    mysql.query(selQuery, [req.query.eod_date], (err, results) => {
        if (err) {
            console.log(e);
        } else {
            if (results != "") {
                res.status(200).json(results)
            } else {
                res.status(404).json({ "msg": "Data not found!" });
            }
        }
    })
})

const getEmpAttendanceAbsent = ((req, res) => {
    const selQuery = `SELECT emp.emp_id,emp.emp_code,emp.emp_fname,emp.email,emp.post, "Absent" As 'attendance'
    FROM EMPLOYEE emp
    WHERE emp.status='ACTIVE' AND emp.emp_type!='admin' AND NOT EXISTS (SELECT * FROM EOD eo WHERE emp.emp_id=eo.emp_id AND eo.eod_date<>eo.created_at AND eo.eod_date=?);`;
    mysql.query(selQuery, [req.query.eod_date], (err, results) => {
        if (err) {
            console.log(e);
        } else {
            if (results != "") {
                res.status(200).json(results)
            } else {
                res.status(404).json({ "msg": "Data not found!" });
            }
        }
    })
})

module.exports = { getEmployees, getEmployeeById, updateEmployee, getEmpAttendance, getEmpAttendancePresent, getEmpAttendanceAbsent };