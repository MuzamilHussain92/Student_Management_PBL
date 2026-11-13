import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { openDatabase } from '../src/db.js';
import { createApp } from '../src/app.js';
const db = openDatabase(':memory:');
const app = createApp(db);
const valid = { name: 'Ali Ahmed', rollNo: 'K26SW001', department: 'Software Engineering', semester: 1 };
let id;
test('POST creates student and returns 201', async () => {
  const r = await request(app).post('/api/students').send(valid);
  assert.equal(r.status, 201); assert.equal(r.body.rollNo, valid.rollNo); assert.ok(r.body.id); id = r.body.id;
  assert.equal(r.headers.location, `/api/students/${id}`);
});
test('GET list returns JSON array and created student', async () => {
  const r = await request(app).get('/api/students'); assert.equal(r.status, 200); assert.ok(Array.isArray(r.body)); assert.equal(r.body[0].id, id);
});
test('GET one returns correct student', async () => {
  const r = await request(app).get(`/api/students/${id}`); assert.equal(r.status, 200); assert.equal(r.body.name, valid.name);
});
test('POST missing field returns 400', async () => {
  const r = await request(app).post('/api/students').send({ name: 'Missing' }); assert.equal(r.status, 400);
});
test('POST invalid semester returns 400', async () => {
  const r = await request(app).post('/api/students').send({ ...valid, rollNo: 'K26SW002', semester: 0 }); assert.equal(r.status, 400);
});
test('POST duplicate rollNo returns 409', async () => {
  const r = await request(app).post('/api/students').send(valid); assert.equal(r.status, 409);
});
test('GET unknown ID returns 404', async () => {
  const r = await request(app).get('/api/students/999999'); assert.equal(r.status, 404);
});
test('GET malformed ID returns 400', async () => {
  const r = await request(app).get('/api/students/abc'); assert.equal(r.status, 400);
});
test('PUT updates student and returns 200', async () => {
  const r = await request(app).put(`/api/students/${id}`).send({ ...valid, semester: 2 }); assert.equal(r.status, 200); assert.equal(r.body.semester, 2);
  assert.equal(db.prepare('SELECT semester FROM students WHERE id=?').get(id).semester, 2);
});
test('PUT unknown ID returns 404', async () => {
  const r = await request(app).put('/api/students/999999').send(valid); assert.equal(r.status, 404);
});
test('DELETE returns 200 and removes row', async () => {
  const r = await request(app).delete(`/api/students/${id}`); assert.equal(r.status, 200); assert.equal(db.prepare('SELECT * FROM students WHERE id=?').get(id), undefined);
});
test('GET after DELETE returns 404', async () => {
  const r = await request(app).get(`/api/students/${id}`); assert.equal(r.status, 404);
});
test('DELETE again returns 404', async () => {
  const r = await request(app).delete(`/api/students/${id}`); assert.equal(r.status, 404);
});
test('Malformed JSON returns 400', async () => {
  const r = await request(app).post('/api/students').set('Content-Type', 'application/json').send('{bad'); assert.equal(r.status, 400);
});
test('Unknown API route returns 404', async () => {
  const r = await request(app).get('/api/does-not-exist'); assert.equal(r.status, 404);
});
test('Health endpoint returns 200', async () => {
  const r = await request(app).get('/api/health'); assert.equal(r.status, 200);
});
test.after(() => db.close());
