import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fields = ['name', 'rollNo', 'department', 'semester'];

function validateStudent(body) {
  const errors = [];
  if (!body || typeof body !== 'object' || Array.isArray(body)) return ['A JSON object is required.'];
  for (const key of Object.keys(body)) if (!fields.includes(key)) errors.push(`Unknown field: ${key}`);
  for (const key of ['name', 'rollNo', 'department']) {
    if (typeof body[key] !== 'string' || !body[key].trim()) errors.push(`${key} is required and must be a nonempty string.`);
    else if (body[key].trim().length > (key === 'rollNo' ? 30 : 100)) errors.push(`${key} is too long.`);
  }
  if (!Number.isInteger(body.semester) || body.semester < 1 || body.semester > 12) errors.push('semester must be an integer from 1 to 12.');
  return errors;
}
function normalized(body) {
  return { name: body.name.trim(), rollNo: body.rollNo.trim().toUpperCase(), department: body.department.trim(), semester: body.semester };
}
function idFrom(req, res) {
  if (!/^[1-9]\d*$/.test(req.params.id) || !Number.isSafeInteger(Number(req.params.id))) {
    res.status(400).json({ error: 'Invalid student ID. Use a positive integer.' }); return null;
  }
  return Number(req.params.id);
}
export function createApp(db) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '20kb' }));
  app.use(express.static(path.join(root, 'public')));
  const get = db.prepare('SELECT * FROM students WHERE id = ?');
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: 'sqlite' }));
  app.post('/api/students', (req, res, next) => {
    const errors = validateStudent(req.body);
    if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
    try {
      const s = normalized(req.body);
      const result = db.prepare('INSERT INTO students (name, rollNo, department, semester) VALUES (@name, @rollNo, @department, @semester)').run(s);
      const student = get.get(result.lastInsertRowid);
      return res.status(201).location(`/api/students/${student.id}`).json(student);
    } catch (err) { return next(err); }
  });
  app.get('/api/students', (_req, res) => res.status(200).json(db.prepare('SELECT * FROM students ORDER BY id ASC').all()));
  app.get('/api/students/:id', (req, res) => {
    const id = idFrom(req, res); if (id === null) return;
    const student = get.get(id);
    return student ? res.json(student) : res.status(404).json({ error: 'Student not found.' });
  });
  app.put('/api/students/:id', (req, res, next) => {
    const id = idFrom(req, res); if (id === null) return;
    if (!get.get(id)) return res.status(404).json({ error: 'Student not found.' });
    const errors = validateStudent(req.body);
    if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
    try {
      db.prepare(`UPDATE students SET name=@name, rollNo=@rollNo, department=@department, semester=@semester, updatedAt=datetime('now') WHERE id=@id`).run({ ...normalized(req.body), id });
      return res.status(200).json(get.get(id));
    } catch (err) { return next(err); }
  });
  app.delete('/api/students/:id', (req, res) => {
    const id = idFrom(req, res); if (id === null) return;
    const result = db.prepare('DELETE FROM students WHERE id = ?').run(id);
    return result.changes ? res.status(200).json({ message: 'Student deleted successfully.', id }) : res.status(404).json({ error: 'Student not found.' });
  });
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found.' }));
  app.use((err, _req, res, _next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.status(400).json({ error: 'Malformed JSON request body.' });
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'rollNo already exists.' });
    if (err.code?.startsWith('SQLITE_CONSTRAINT')) return res.status(400).json({ error: 'Database constraint violated.' });
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  });
  return app;
}
