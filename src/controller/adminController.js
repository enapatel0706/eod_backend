const mysql = require("../db/connection").con;

const getEmployees = ((req, res) => {
    const selQuery = "SELECT * FROM `ORDEX-PORTAL`.EMPLOYEE;";
    mysql.query(selQuery, (err, results) => {
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


const getEmployeeById = ((req, res) => {
    const selQuery = `select e.*,es.skill_name,es.emp_skill_id from EMPLOYEE e 
    join EMPLOYEE_EMPSKILL ees on e.emp_id=ees.emp_id
    join EMPSKILL es on es.emp_skill_id=ees.emp_skill_id
    where e.emp_id=?;`;
    mysql.query(selQuery, [req.query.emp_id], (err, results) => {
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


const getProject = ((req, res) => {
    const selQuery = `select p.project_id,p.project_name from PROJECT p
    where NOT EXISTS (
    select project_id from EMPLOYEE_PROJECT ep 
    join EMPLOYEE e on e.emp_id=ep.emp_id where ep.project_id=p.project_id 
    and ep.emp_id=? ) and p.status='active';`;
    mysql.query(selQuery, [req.query.emp_id], (err, results) => {
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


const getProjectByEmp = ((req, res) => {
    const selQuery = `select p.project_id,p.project_name from PROJECT p
    where EXISTS (
    select project_id from EMPLOYEE_PROJECT ep 
    join EMPLOYEE e on e.emp_id=ep.emp_id where ep.project_id=p.project_id 
    and ep.emp_id=? ) and p.status='active';`;
    mysql.query(selQuery, [req.body.emp_id], (err, results) => {
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

const setEmpProject = ((req, res) => {
    const insertQuery = `INSERT INTO EMPLOYEE_PROJECT(emp_id,project_id,mentor_id,created_at) VALUES (?,?,?,?);`;
    mysql.query(insertQuery, [req.body.emp_id, req.body.project_id, req.body.mentor_id, req.body.created_at], (err, results) => {
        if (err) {
            res.status(500).json({ "msg": "Insertion Failed" });
        } else {
            res.status(200).json({ "msg": "Data inserted successfully" });
        }
    })
})

const updateEmpProject = ((req, res) => {
    const insertQuery = ``;
    mysql.query(insertQuery, [req.body.emp_id, req.body.project_id, req.body.mentor_id, req.body.created_at], (err, results) => {
        if (err) {
            res.status(500).json({ "msg": "Updation Failed" });
        } else {
            res.status(200).json({ "msg": "Data updated successfully" });
        }
    })
})


const updateEmployee = ((req, res) => {
    const updateQuery = `UPDATE EMPLOYEE E 
    set E.emp_fname=?, E.emp_midname=?, E.emp_lname=?, E.email=?, E.phoneno=?,
    E.post=?,E.emp_type=?, E.status=?, E.updated_at=?
    where E.emp_id=?`;
    mysql.query(updateQuery, [req.body.fname, req.body.mname, req.body.lname, req.body.email, req.body.phoneno,
    req.body.post, req.body.type, req.body.status, req.body.update_at, req.body.emp_id], (err, results) => {
        if (err) {
            res.status(500).json({ "msg": "Updation Failed" });
        } else {
            res.status(200).json({ "msg": "Data updated successfully" });
        }
    })
})


const getEmpAttendance = ((req, res) => {
    const selQuery = `SELECT emp.emp_id,eo.eod_date,eo.created_at,emp_code,emp.emp_fname,emp.emp_midname,emp.emp_lname,emp.email,emp.emp_type,eo.total_work_time, emp.status
    FROM EMPLOYEE emp
    LEFT JOIN EOD eo
    ON emp.emp_id=eo.emp_id AND eo.eod_date=?
    WHERE emp.status='ACTIVE' AND emp.emp_type<>'admin' ;`;
    mysql.query(selQuery, [req.query.eod_date], (err, results) => {
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


const getEmpAttendancePresent = ((req, res) => {
    const selQuery = `SELECT emp.emp_id,eo.eod_date,emp.emp_code,emp.emp_fname,emp.email,emp.emp_type,emp.post,eo.total_work_time, IF(eo.eod_Date=eo.created_at,"Present","Absent") AS 'attendance'
    FROM EMPLOYEE emp, EOD eo 
    WHERE emp.status='ACTIVE' AND eo.emp_id=emp.emp_id AND eo.eod_date=? AND eo.eod_date=eo.created_at;`;
    mysql.query(selQuery, [req.query.eod_date], (err, results) => {
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

const getEmpAttendanceAbsent = ((req, res) => {
    const selQuery = `SELECT emp.emp_id,emp.emp_code,emp.emp_fname,emp.email,emp.emp_type,emp.post, "Absent" As 'attendance'
    FROM EMPLOYEE emp
    WHERE emp.status='ACTIVE' AND emp.emp_type!='admin' AND NOT EXISTS (SELECT * FROM EOD eo WHERE emp.emp_id=eo.emp_id AND eo.eod_date=eo.created_at AND eo.eod_date=?);`;
    mysql.query(selQuery, [req.query.eod_date], (err, results) => {
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

const getEODReport = ((req, res) => {
    const selQuery = `select et.eod_date,e.emp_fname,e.emp_midname,e.emp_lname,e.phoneno,e.email,et.eod_date, p.project_name, et.task_title, et.task_desc, et.status, et.worktime 
    from EMPLOYEE e, EOD_TASK et, PROJECT p 
    WHERE et.project_id=p.project_id AND et.emp_id=e.emp_id AND e.emp_id=? AND et.eod_date=?`;
    mysql.query(selQuery, [req.query.emp_id, req.query.eod_date], (err, results) => {
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


const getEODReportDateRange = ((req, res) => {
    const selQuery = `SELECT et.eod_date,e.emp_fname,e.emp_midname,e.emp_lname,e.phoneno,e.email,p.project_name,et.task_title, et.task_desc,et.status,et.worktime 
    FROM EMPLOYEE e,EOD_TASK et, PROJECT p 
    WHERE e.emp_id=? AND et.eod_date>=? AND et.eod_date<=? AND et.project_id=p.project_id AND et.emp_id=e.emp_id ORDER BY et.eod_date DESC`;
    mysql.query(selQuery, [req.query.emp_id, req.query.start_date, req.query.end_date], (err, results) => {
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

const getEODCompliance = ((req, res) => {
    const selQuery = `SELECT et.eod_date,et.created_at, e.emp_code, e.emp_fname,e.emp_midname,e.emp_lname,e.email,e.emp_type 
    FROM EMPLOYEE e, EOD_TASK et
    WHERE e.emp_id=et.emp_id AND et.eod_date!=et.created_at AND et.eod_date=?;`;
    mysql.query(selQuery, [req.query.eod_date], (err, results) => {
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


const getEODComplianceDateRange = ((req, res) => {
    const selQuery = `SELECT et.eod_date,et.created_at, e.emp_code, e.emp_fname,e.emp_midname,e.emp_lname,e.email,e.emp_type 
    FROM EMPLOYEE e, EOD_TASK et
    WHERE e.emp_id=et.emp_id AND et.eod_date!=et.created_at AND et.eod_date>=? AND et.eod_date<=? ORDER BY et.eod_date DESC;`;
    mysql.query(selQuery, [req.query.start_date, req.query.end_date], (err, results) => {
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



module.exports = { getEmployees, getEmployeeById, getProject, getProjectByEmp, setEmpProject, updateEmpProject, updateEmployee, getEmpAttendance, getEmpAttendancePresent, getEmpAttendanceAbsent, getEODReport, getEODReportDateRange, getEODCompliance, getEODComplianceDateRange };