import { openDatabase } from './db.js';
import { createApp } from './app.js';
const db = openDatabase();
const app = createApp(db);
const port = Number(process.env.PORT || 3000);
const server = app.listen(port, () => console.log(`Student Management running at http://localhost:${port}`));
function shutdown() { server.close(() => { db.close(); process.exit(0); }); }
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
