import sqlite3 from "sqlite3";

const dbPath = './db/db.db'
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) throw err;
});

export default db;
