import express from "express";
import fs from "fs";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3000;

const criteria = {
  attendance: 0.75,
  assignment: 0.5,
  contact: 2,
};

const riskLevelConfig = {
  0: "LOW",
  1: "LOW",
  2: "MEDIUM",
  3: "HIGH",
};

const obj = JSON.parse(fs.readFileSync("./student.json", "utf-8"));

function calculate(student) {
  let score = 0;
  const totalAtt = student.attendance.length;
  const passAtt = student.attendance.filter(
    (a) => a.status === "ATTEND"
  ).length;
  if (passAtt / totalAtt < criteria.attendance) {
    score++;
  }

  const totalAssi = student.assignments.length;
  const passAssi = student.assignments.filter(
    (a) => a.submitted === true
  ).length;
  if (passAssi / totalAssi < criteria.assignment) {
    score++;
  }

  const totalCont = student.contacts.length;
  const passCont = student.contacts.filter((a) => a.status === "FAILED").length;
  if (totalCont === 0) {
    score = score;
  } else if (passCont >= criteria.contact) {
    score++;
  }

  const riskLevel = riskLevelConfig[score];

  return {
    studentId: student.student_id,
    studentName: student.student_name,
    score,
    riskLevel,
  };
}

const a = obj.map(calculate);
// console.log(obj);
console.log(a);

function readAllStudents() {
  return JSON.parse(fs.readFileSync("./student.json", "utf-8"));
}
function writeStudent(data) {
  fs.writeFileSync("./student.json", JSON.stringify(data, null, 2));
}

app.get("/students", (req, res) => {
  const students = readAllStudents();
  res.json(students);
});

app.get("/students/:id", (req, res) => {
  const students = readAllStudents();
  const student = students.find((s) => s.student_id === req.params.id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.json(student);
});

app.get("/students/:id/pre", (req, res) => {
  const students = readAllStudents();
  const studentIndex = students.findIndex((s) => s.student_id === req.params.id);
  const calculatedStudentRisk = calculate(students[studentIndex]);
  
  students[studentIndex].risk_level = calculatedStudentRisk.riskLevel;
  writeStudent(students);
  res.json(calculatedStudentRisk);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});


