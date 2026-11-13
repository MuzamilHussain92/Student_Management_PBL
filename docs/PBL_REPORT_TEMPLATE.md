# PBL PROJECT REPORT

**Title:** Design, Implementation, and Testing of a Student Management CRUD REST API  
**Course:** [Course name]  
**Student:** [Your name]  
**Roll number:** [Your roll number]  
**Department / Semester:** [Fill in]  
**Instructor:** [Fill in]  
**Submission date:** [Fill in]

## 1. Abstract
This project implements a Student Management REST API using Node.js, Express.js, and SQLite. It supports CRUD operations over JSON, validates inputs, handles errors with appropriate HTTP status codes, and provides a Postman collection for functional testing. An optional browser interface is included.

## 2. Problem Statement and Objectives
The objective is to create a database-connected API for student records that supports POST, GET, PUT, and DELETE, preserves data, and can be verified with Postman.

## 3. Tools and Technologies
Node.js, Express.js, SQLite (`better-sqlite3`), Postman, VS Code, Git/GitHub, Node test runner, Supertest.

## 4. System Design
**Architecture:** Client (Postman / browser) → Express routes → validation → SQLite database → JSON response.  
**Table:** `students(id INTEGER PRIMARY KEY, name TEXT, rollNo TEXT UNIQUE, department TEXT, semester INTEGER, createdAt TEXT, updatedAt TEXT)`.

**Insert your own architecture diagram and screenshot here.**

## 5. Implementation
Explain `src/server.js` (startup), `src/app.js` (endpoints and validation), `src/db.js` (database schema), `public/index.html` (optional interface), and `tests/api.test.js` (automated tests). Include relevant code snippets and actual screenshots.

## 6. API Endpoints

| HTTP Method | URL | Expected success status | Purpose |
|---|---|---|---|
| POST | `/api/students` | 201 | Create |
| GET | `/api/students` | 200 | Read all |
| GET | `/api/students/:id` | 200 | Read one |
| PUT | `/api/students/:id` | 200 | Update |
| DELETE | `/api/students/:id` | 200 | Delete |

## 7. Postman Test Cases

**Fill actual results and Pass/Fail only after running Postman.**

| ID | Test | Expected status | Expected result | Actual result | Pass/Fail |
|---|---|---|---|---|---|
| TC01 | Create valid student | 201 | JSON contains new ID | [Record result] | [ ] |
| TC02 | Get all students | 200 | JSON array includes student | [Record result] | [ ] |
| TC03 | Get student by ID | 200 | Correct student fields | [Record result] | [ ] |
| TC04 | Update semester | 200 | Semester changed to 2 | [Record result] | [ ] |
| TC05 | Submit missing fields | 400 | Validation error | [Record result] | [ ] |
| TC06 | Duplicate roll number | 409 | Duplicate error | [Record result] | [ ] |
| TC07 | Get nonexistent ID | 404 | Not found | [Record result] | [ ] |
| TC08 | Get invalid ID | 400 | Invalid ID | [Record result] | [ ] |
| TC09 | Delete student | 200 | Deletion confirmed | [Record result] | [ ] |
| TC10 | Get deleted student | 404 | Not found | [Record result] | [ ] |

**Screenshots:** Insert screenshots for POST, GET all, GET by ID, PUT, DELETE, validation errors, 404 after deletion, and Postman Collection Runner results. Include method, URL, status, and response in each screenshot.

## 8. Automated Tests
Command: `npm.cmd test`  
Observed results: [Run and enter actual passed/failed totals]  
Screenshot: [Insert]

## 9. Database Verification
Create a student, restart the server, and retrieve the record. Describe the observed persistence. Confirm the record disappears after DELETE. Screenshot or query evidence: [Insert].

## 10. Challenges and Solutions
[Describe any real installation, database, API, or Postman issues and how you solved them.]

## 11. Conclusion
The completed system demonstrates RESTful CRUD operations, SQLite persistence, JSON responses, and validation. Summarize your actual testing outcomes and lessons learned.

## 12. Submission Links
**GitHub repository:** [PASTE YOUR REAL GITHUB URL]  
**Presentation video:** [PASTE YOUR REAL VIDEO URL]  
**Google Classroom submission:** [Submit the completed report according to instructor instructions]
