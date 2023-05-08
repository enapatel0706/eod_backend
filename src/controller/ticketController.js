const mysql = require("../db/connection").con;
const fs = require("fs");
const path = require('path')
const mime = require('mime');

//GET API for Category (General) 
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
    // finally {
    //     mysql.destroy()
    // }
};

//GET API for Sub-Category (According to the selected Category)
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
                    res.status(200).json({ "msg": "Data not found!" });
                }
            }
        })
    } catch (err) {
        res.status(500).json({ err: "Error When Fetching Data" });
    }
    // finally {
    //     mysql.destroy()
    // }
})

//POST API for 'raise ticket' feature
const addTicket = ((req, res) => {
    try {
        const insertQuery = "INSERT INTO REQUEST(req_date, title, description, status, hr_resolution, hr_resolution_date, emp_id, cat_id, sub_cat_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        mysql.query(insertQuery, [req.body.req_date, req.body.title, req.body.description, req.body.status, req.body.hr_resolution, req.body.hr_resolution_date, req.body.emp_id, req.body.cat_id, req.body.sub_cat_id], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ err: "Error When Fetching Data" });
            } else {
                const ticketId = results.insertId;
                const attachments = req.files;
                if (attachments && attachments.length > 0) {
                    const attachmentInsertQuery = "INSERT INTO ATTACHEMENT(file_name, req_id, file_type,file) VALUES (?, ?, ?, ?)";
                    attachments.forEach((attachment) => {
                        const imagePath = attachment.path;
                        const blob = fs.readFileSync(imagePath)
                        const fileType = path.extname(imagePath).substring(1);
                        const file = attachment.originalname
                        mysql.query(attachmentInsertQuery, [blob, ticketId, fileType, file], (err, results) => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({ err: "Error When Inserting Attachment Data" });
                                return;
                            } else {
                                console.log("Data Inserted Successfully");
                            }
                        })
                    });
                }
                res.status(200).json({ msg: "Data inserted Successfully" });
            }
        })
    } catch (err) {
        res.status(500).json({ err: "Error When Fetching in Catch Data" });
    }
})


//GET API for showing all the tickets raised by an Employee (date)
const getTicketByEmp = ((req, res) => {
    try {
        const selQuery = `SELECT E.emp_code,E.emp_fname,E.emp_lname, R.req_id,R.req_date, R.title, R.status, C.category_name, S.sub_cat_name
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
                    res.status(200).json({ "msg": "Data not found!" });
                }
            }
        })
    } catch (err) {
        res.status(500).json({ err: "Error When Fetching in Catch Data" });
    }
})
//GET API for showing all the tickets raised by an Employee (date-range)
const getTicketEmpDateRange = ((req, res) => {
    try {
        const selQuery = `SELECT E.emp_code,E.emp_fname,E.emp_lname,R.req_id,R.req_date, R.title, R.status, C.category_name, S.sub_cat_name
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
                    res.status(200).json({ "msg": "Data not found!" });
                }
            }
        })
    } catch (err) {
        res.status(500).json({ err: "Error When Fetching in Catch Data" });
    }
})
// GET API for showing all Tickets date wise.
const getTicketByDate = ((req, res) => {
    try {
        const selQuery = `SELECT E.emp_code,E.emp_fname,E.emp_lname, R.req_id,R.req_date, R.title, R.status,R.emp_id ,C.category_name, S.sub_cat_name
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
                    res.status(200).json({ "msg": "Data not found!" });
                }
            }
        })
    } catch (err) {
        res.status(500).json({ err: "Error When Fetching in Catch Data" });
    }
})

//GET API for showing all Tickets date-range wise.
const getTicketByDateRange = ((req, res) => {
    try {
        const selQuery = `SELECT E.emp_code,E.emp_fname,E.emp_lname, R.req_id,R.req_date, R.title, R.status,R.emp_id, C.category_name, S.sub_cat_name
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
                    res.status(200).json({ "msg": "Data not found!" });
                }
            }
        })
    } catch (err) {
        res.status(500).json({ err: "Error When Fetching in Catch Data" });
    }
})


// GET API for showing single ticket data 
const getTicketById = ((req, res) => {
    try {
        const selQuery = `SELECT R.*,A.*
        FROM REQUEST R
        LEFT JOIN ATTACHEMENT A ON R.req_id = A.req_id
        WHERE R.req_id = ?;`;
        mysql.query(selQuery, [req.query.req_id], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ msg: "Error To Fetching Data" });
            } else {
                if (results.length > 0) {
                    const data = {
                        images: [],
                        files: [],
                    };
                    const groups = {};
                    results.forEach((result) => {
                        if (!groups[result.req_id]) {
                            groups[result.req_id] = {
                                finalres: { results: result },
                                images: [],
                                files: [],
                            };
                        }
                        if (result.file_name) {
                            const buf = Buffer.from(result.file_name).toString('base64');
                            if (
                                result.file_type === "png" ||
                                result.file_type === "jpg" ||
                                result.file_type === "jpeg" ||
                                result.file_type === "pdf"
                            ) {
                                if (result.file_type === "pdf") {
                                    groups[result.req_id].files.push({
                                        file_id: result.id,
                                        filename: result.file,
                                        data: "data:application/pdf;base64," + buf,
                                    });
                                } else {
                                    groups[result.req_id].images.push({
                                        image_id: result.id,
                                        imagename: result.file,
                                        image: "data:image/" + result.file_type + ";base64," + buf,
                                    });
                                }
                            }
                        }
                    });
                    Object.values(groups).forEach((group) => {
                        const finalRow = group.finalres.results;
                        delete finalRow.file_name;
                        delete finalRow.file_type;
                        data.images.push(...group.images);
                        data.files.push(...group.files);
                        res.json({ finalres: finalRow, images: group.images, files: group.files });

                    });
                } else {
                    res.status(200).json({ msg: "Data not found!" });
                }
            }
        })
    } catch (err) {
        res.status(500).json({ err: "Error When Fetching in Catch Data" });
    }
})

//PATCH API for ticket update (different API for Attachment might be required.)
const updateTickets = ((req, res) => {
    try {
        const updateQuery = `UPDATE REQUEST R 
                             SET R.req_date = ?, R.title = ?, R.description = ?, R.emp_id = ?, R.cat_id = ?, R.sub_cat_id = ? 
                             WHERE R.req_id = ?`;

        mysql.query(updateQuery, [req.body.req_date, req.body.title, req.body.description, req.body.emp_id, req.body.cat_id, req.body.sub_cat_id, req.body.req_id, req.body.id], (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ "msg": "Updation Failed" });
                return;
            } else {
                const attachments = req.files;
                if (attachments.length === 0) {
                    // If no attachments were added, return success message
                    res.status(200).json({ "msg": "Data updated successfully" });
                    return;
                }
                const updateAttachmentQuery = `UPDATE ATTACHEMENT A 
                                               SET A.file_name = ?, A.file_type = ? , A.file=?
                                               WHERE A.req_id = ? AND A.id = ?`;
                const ticketId = req.body.req_id;
                attachments.forEach((attachment) => {
                    const imagePath = attachment.path;
                    const blob = fs.readFileSync(imagePath);
                    const fileType = path.extname(imagePath).substring(1);
                    const file = attachment.originalname
                    mysql.query(updateAttachmentQuery, [blob, fileType, file, ticketId, req.body.id], (err, results) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ "msg": "Updation Failed" });
                            return;
                        }
                    });
                });
                res.status(200).json({ "msg": "Data updated successfully" });
            }
        });
    } catch (err) {
        res.status(500).json({ err: "Error When Fetching Data" });
    }
});



// PATCH API for submitting HR Resolution.
const updateHRTickets = ((req, res) => {
    try {
        const updateQuery = `UPDATE REQUEST R 
    set  R.status=?, R.hr_resolution=?,
    R.hr_resolution_date=? where R.req_id=?`;
        mysql.query(updateQuery, [req.body.status, req.body.hr_resolution, req.body.hr_resolution_date, req.body.req_id], (err, results) => {
            if (err) {
                console.log("//////", err);
                res.status(500).json({ "msg": "Updation Failed" });
            } else {
                res.status(200).json({ "msg": "Data updated successfully" });
            }
        })
    } catch (err) {
        res.status(500).json({ err: "Error When Fetching Data" });
    }
})

process.on('SIGINT', () => {
    mysql.end((err) => {
        if (err) {
            console.log(err);
        }
        process.exit();
    });
});
module.exports = {
    getCategory, getSubCategory, addTicket, getTicketById, updateTickets, updateHRTickets, getTicketByEmp, getTicketEmpDateRange, getTicketByDate, getTicketByDateRange
};