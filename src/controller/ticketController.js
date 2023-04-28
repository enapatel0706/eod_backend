const mysql = require("../db/connection").con;
const fs = require("fs");
const path = require('path')

const getCategory = (req, res) => {
    try {
        const selQuery = "select cat_id,category_name from CATEGORIES ";
        mysql.query(selQuery, [req.query.cat_id], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ err: "Error When Fetching Data" });
            } else {
                if (results.length > 0) {
                    res.status(200).json(results);

                } else {
                    res.status(200).json({ "msg": "Data not found!" });
                }
            }
        });
    } catch (err) {
        res.status(500).json({ err: "Error When Fetching Data" });
    }
};


const getSubCategory = ((req, res) => {
    try {
        const selQuery = "SELECT S.sub_cat_id,S.sub_cat_name FROM SUBCATEGORIES S WHERE S.cat_id = ?";
        mysql.query(selQuery, [req.query.cat_id], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ err: "Error When Fetching Data" })
            } else {
                if (results.length > 0) {
                    res.status(200).json(results);
                } else {
                    res.status(204).json({ "msg": "Data not found!" });
                }
            }
        })
    } catch (err) {
        res.status(500).json({ err: "Error When Fetching Data" });
    }
})

const addTicket = ((req, res) => {

    try {
        const insertQuery = "insert into REQUEST(req_date,title,description,status,hr_resolution,hr_resolution_date,emp_id,cat_id,sub_cat_id) values(?,?,?,?,?,?,?,?,?)";
        mysql.query(insertQuery, [req.body.req_date, req.body.title, req.body.description, req.body.status, req.body.hr_resolution, req.body.hr_resolution_date, req.body.emp_id, req.body.cat_id, req.body.sub_cat_id], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ err: "Error When Fetching Data" })
            } else {
                const ticketId = results.insertId;
                const attachments = req.files;
                const imagePath = req.files[0].path;
                const blob = fs.readFileSync(imagePath)
                console.log(imagePath);
                const attachmentInsertQuery = "INSERT INTO ATTACHEMENT(file_name,req_id) VALUES (?,?)";
                attachments.forEach((attachment) => {
                    mysql.query(attachmentInsertQuery, [blob, ticketId], (err, results) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ err: "Error When Inserting Attachment Data" });
                            return;
                        } else {
                            res.status(200).json({ msg: "Data inserted Successfully" });
                        }
                    })
                });



            }
        })
    } catch (err) {
        res.status(500).json({ err: "Error When Fetching in Catch Data" });
    }
})

const getTicketByEmp = ((req, res) => {
    try {
        const selQuery = `SELECT R.req_id,R.req_date, R.title, R.status, C.category_name, S.sub_cat_name
    FROM REQUEST R, CATEGORIES C, SUBCATEGORIES S, EMPLOYEE E
    WHERE R.emp_id = ? AND R.req_date = ? AND R.cat_id = C.cat_id AND R.sub_cat_id = S.sub_cat_id AND R.emp_id = E.emp_id;`;
        mysql.query(selQuery, [req.query.emp_id, req.query.req_date], (err, results) => {
            if (err) {
                console.log(`Error fetching data`);
                res.status(500).json({ "error": "Error When Fetching Data" })
            } else {
                if (results.length > 0) {
                    res.status(200).json(results)
                } else {
                    res.status(204).json({ "msg": "Data not found!" });
                }
            }
        })
    } catch (err) {
        res.status(500).json({ err: "Error When Fetching in Catch Data" });
    }
})

const getTicketEmpDateRange = ((req, res) => {
    try {
        const selQuery = `SELECT R.req_id,R.req_date, R.title, R.status, C.category_name, S.sub_cat_name
    FROM REQUEST R, CATEGORIES C, SUBCATEGORIES S, EMPLOYEE E
    WHERE R.emp_id=? AND R.req_date>=? AND R.req_date<=? AND R.cat_id = C.cat_id AND R.sub_cat_id = S.sub_cat_id AND R.emp_id = E.emp_id
    ORDER BY R.req_date DESC;`
        mysql.query(selQuery, [req.query.emp_id, req.query.start_date, req.query.end_date], (err, results) => {
            if (err) {
                console.log(`Error fetching data`);
                res.status(500).json({ error: "Error When Fetching Data" })
            } else {
                if (results.length > 0) {
                    res.status(200).json(results)
                } else {
                    res.status(204).json({ "msg": "Data not found!" });
                }
            }
        })
    } catch (err) {
        res.status(500).json({ err: "Error When Fetching in Catch Data" });
    }
})

const getTicketByDate = ((req, res) => {
    try {
        const selQuery = `SELECT R.req_id,R.req_date, R.title, R.status,R.emp_id ,C.category_name, S.sub_cat_name
    FROM REQUEST R, CATEGORIES C, SUBCATEGORIES S, EMPLOYEE E
    WHERE R.req_date = ? AND R.cat_id = C.cat_id AND R.sub_cat_id = S.sub_cat_id AND R.emp_id = E.emp_id;`;
        mysql.query(selQuery, [req.query.req_date], (err, results) => {
            if (err) {
                console.log(`Error fetching data`);
                res.status(500).json({ "error": "Error When Fetching Data" })
            } else {
                if (results.length > 0) {
                    res.status(200).json(results)
                } else {
                    res.status(204).json({ "msg": "Data not found!" });
                }
            }
        })
    } catch (err) {
        res.status(500).json({ err: "Error When Fetching in Catch Data" });
    }
})


const getTicketByDateRange = ((req, res) => {
    try {
        const selQuery = `SELECT R.req_id,R.req_date, R.title, R.status,R.emp_id, C.category_name, S.sub_cat_name
    FROM REQUEST R, CATEGORIES C, SUBCATEGORIES S, EMPLOYEE E
    WHERE R.req_date>=? AND R.req_date<=? AND R.cat_id = C.cat_id AND R.sub_cat_id = S.sub_cat_id AND R.emp_id = E.emp_id
    ORDER BY R.req_date DESC;`
        mysql.query(selQuery, [req.query.start_date, req.query.end_date], (err, results) => {
            if (err) {
                console.log(`Error fetching data`);
                res.status(500).json({ error: "Error When Fetching Data" })
            } else {
                if (results.length > 0) {
                    res.status(200).json(results)
                } else {
                    res.status(204).json({ "msg": "Data not found!" });
                }
            }
        })
    } catch (err) {
        res.status(500).json({ err: "Error When Fetching in Catch Data" });
    }
})



// const getTicketById = ((req, res) => {
//     try {
//         console.log('======////', req);
//         const selQuery = `SELECT R.*,A.file_name
//     FROM REQUEST R 
//     LEFT JOIN ATTACHEMENT A ON R.req_id = A.req_id
//     WHERE R.req_id = ?;`;
//         mysql.query(selQuery, [req.query.req_id], (err, results) => {
//             if (err) {
//                 console.log(err);
//                 res.status(500).json({ "msg": 'Error To Fetching Data' });

//             } else {
//                 if (results.length > 0) {

//                     let buffers = [];
//                     results.map(result => {

//                         console.log("===========125==============", result.file_name);
//                         const attachmentBuffer = Buffer.from(result.file_name, 'binary');
//                         // .toString('base64');
//                         console.log(attachmentBuffer);
//                         buffers.push(attachmentBuffer);

//                         // res.write(attachmentBuffer);


//                     });
//                     res.send(buffers[0]);
//                     // res.status(200).json({ buffers });
//                     // res.send(Buffer.concat(buffers));
//                 } else {
//                     res.status(204).json({ "msg": "Data not found!" });
//                 }
//             }
//         })
//     } catch (err) {
//         res.status(500).json({ err: "Error When Fetching in Catch Data" });
//     }
// })
// const getTicketById = ((req, res) => {
//     try {
//         console.log('======////', req);
//         const selQuery = `SELECT R.*,A.file_name
//     FROM REQUEST R 
//     LEFT JOIN ATTACHEMENT A ON R.req_id = A.req_id
//     WHERE R.req_id = ?;`;
//         mysql.query(selQuery, [req.query.req_id], (err, results) => {
//             if (err) {
//                 console.log(err);
//                 res.status(500).json({ "msg": 'Error To Fetching Data' });

//             } else {
//                 if (results.length > 0) {
//                     console.log("***********************", results);

//                     const imageBuffer = Buffer.from(results[0].file_name);
//                     console.log("///////////////////////", imageBuffer);
//                     const extname = path.extname(results[0].file_name.toString('utf8'));
//                     const contentType = getContentType(extname);
//                     const filename = results[0].file_name.toString().replace(/[^\w.]/g, '_');
//                     res.writeHead(200, {
//                         'Content-Type': contentType,
//                         'Content-Disposition': `attachment; filename=${filename}`
//                     });
//                     res.end(imageBuffer);

//                 } else {
//                     res.status(204).json({ "msg": "Data not found!" });
//                 }
//             }
//         })
//     } catch (err) {
//         res.status(500).json({ err: "Error When Fetching in Catch Data" });
//     }
// })

// function getContentType(extname) {
//     switch (extname) {
//         case '.jpg':
//         case '.jpeg':
//             return 'image/jpeg';
//         case '.png':
//             return 'image/png';
//         case '.gif':
//             return 'image/gif';
//         case '.pdf':
//             return 'application/pdf';
//         // add more cases for other file types
//         default:
//             return 'application/octet-stream';
//     }
// }





module.exports = {
    getCategory, getSubCategory, addTicket, getTicketByEmp, getTicketEmpDateRange, getTicketByDate, getTicketByDateRange
};