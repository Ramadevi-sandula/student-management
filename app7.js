
const express = require("express");
const mysql = require("mysql8");
const app = express();

app.use(express.json());

// Read HTML files from public folder
app.use(express.static("public"));

// Connect to school database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "school"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

// Get all students
app.get("/students", (req, res) => {
    db.query("SELECT * FROM student", (err, result) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(result);
    });
});

// Get one student
app.get("/students/:sno", (req, res) => {
    db.query(
        "SELECT * FROM student WHERE student_id=?",
        [req.params.sno],
        (err, result) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            res.json(result);
        }
    );
});

// Insert student
app.post("/students", (req, res) => {
    const { sno, name, total } = req.body;

    db.query(
        "INSERT INTO student(student_id, student_name, total) VALUES(?,?,?)",
        [sno, name, total],
        (err) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            res.send("Student Inserted");
        }
    );
});

// Update student
app.put("/students/:sno", (req, res) => {
    const { name, total } = req.body;

    db.query(
        "UPDATE student SET student_name=?, total=? WHERE student_id=?",
        [name, total, req.params.sno],
        (err, result) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }

            if (result.affectedRows == 0) {
                res.status(404).send("Student NOT found");
            } else {
                res.send("Student Updated");
            }
        }
    );
});

// Delete student
app.delete("/students/:sno", (req, res) => {
    db.query(
        "DELETE FROM student WHERE student_id=?",
        [req.params.sno],
        (err, result) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }

            if (result.affectedRows == 0) {
                res.status(404).send("Student NOT found to delete");
            } else {
                res.send("Student Deleted");
            }
        }
    );
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});