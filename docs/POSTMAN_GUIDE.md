# Postman Testing Guide

1. Start server: `npm.cmd start`.
2. Postman → Import → choose `postman/Student_Management_PBL.postman_collection.json`.
3. Open collection variables and confirm `baseUrl = http://localhost:3000`.
4. Run each request from top to bottom. **Create** saves the new `studentId` for later requests.
5. For each request record method, URL, JSON body (if any), status, JSON response, actual result, and Pass/Fail. Capture screenshots.
6. Open the Collection Runner to run all requests in sequence and inspect assertions.
7. Confirm SQLite persistence: create a record, stop and restart the server, then GET all records. The created record should still exist.
8. A repeated run creates another record with a new unique roll number; previously created records remain unless deleted.

Expected test cases: health 200; create 201; get all 200; get by ID 200; update 200; invalid body 400; duplicate roll number 409; missing ID 404; invalid ID 400; delete 200; GET deleted 404. The included collection checks these statuses and response values.

**Important:** Report actual test results only after executing the requests. The template contains expected results, not fabricated observed results.
