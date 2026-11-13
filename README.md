# Student Management CRUD REST API — PBL Project

**Stack:** Node.js 20+, Express 4, SQLite (better-sqlite3), Postman, optional browser interface.

## Windows setup

1. Install **Node.js 22 LTS** (recommended), VS Code, Postman, and Git.
2. Extract this project, then open its folder in VS Code.
3. In PowerShell or Command Prompt run:

   ```powershell
   node --version
   npm.cmd install
   npm.cmd start
   ```

   `npm.cmd` avoids Windows PowerShell execution-policy restrictions that may block `npm.ps1`. `npm install` also works in Command Prompt.
4. Visit `http://localhost:3000` for the optional frontend; API base URL is `http://localhost:3000/api/students`.
5. Stop with Ctrl+C. Data persists in `data/students.db` between restarts.

**If SQLite native-module installation fails:** use a supported Node.js LTS version, delete `node_modules` and `package-lock.json`, then rerun `npm.cmd install` with internet access. Windows may require build tools if no compatible prebuilt binary is available.

## API contract

| Method | Endpoint | Expected | Description |
|---|---|---|---|
| POST | `/api/students` | 201 | Create student |
| GET | `/api/students` | 200 | List all students |
| GET | `/api/students/:id` | 200 / 404 / 400 | Find student |
| PUT | `/api/students/:id` | 200 / 404 / 400 / 409 | Replace student |
| DELETE | `/api/students/:id` | 200 / 404 / 400 | Delete student |
| GET | `/api/health` | 200 | Health check |

POST and PUT require **all four** fields:

```json
{"name":"Ali Ahmed","rollNo":"K26SW001","department":"Software Engineering","semester":1}
```

`rollNo` is unique (case-insensitive for API input because values are normalized to uppercase); `semester` must be an integer from 1 to 12. Unknown fields are rejected. Invalid bodies return 400, duplicate roll numbers return 409, nonexistent IDs return 404. `PUT` performs a full replacement of editable fields, not a partial update.

## Automated tests

```powershell
npm.cmd test
```

The test suite uses an **in-memory SQLite database** and Supertest; it does not modify your real `data/students.db` file. Tests cover CRUD, database state, validation, duplicate roll numbers, nonexistent and invalid IDs, malformed JSON, and unknown routes.

## Postman

Import `postman/Student_Management_PBL.postman_collection.json` into Postman. Set collection variable `baseUrl` to `http://localhost:3000`. Run the requests **in listed order** or use Collection Runner. The Create request saves the returned `id` to the collection variable `studentId`. The collection uses a distinct roll number for each run so you can repeat tests. Inspect the Postman Tests tab and save screenshots for your report. See `docs/POSTMAN_GUIDE.md`.

## Submission checklist

- [ ] Run API and confirm all five CRUD endpoints work.
- [ ] Run `npm.cmd test` and record actual results.
- [ ] Run Postman collection and capture response screenshots.
- [ ] Verify database persistence after server restart.
- [ ] Add screenshots and actual test evidence to report.
- [ ] Push source code to GitHub (exclude `node_modules`, `.env`, and `data/`).
- [ ] Record demonstration, upload video, paste shareable video URL into report.
- [ ] Submit report through Google Classroom.

See `docs/PBL_REPORT_TEMPLATE.md` for a report structure and `docs/DEMO_SCRIPT.md` for a presentation outline.
