import db from "../db/db.mjs";
import Process from "../models/process.mjs";

export default function ProcessDao() {
    this.createProcess = (budget) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO process(budget, phase) VALUES (?, ?)';
            db.run(sql, [budget, 1], function (err) {
                if (err) {
                    reject(err)
                } else if (this.changes !== 1) {
                    reject({ error: 'this.changes !== 1' });
                } else {
                    resolve(this.lastID);
                }
            })
        })
    }

    this.updatePhase = (phase) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE process SET phase=?';
            db.run(sql, [phase], function (err) {
                if (err) {
                    reject(err)
                } else if (this.changes !== 1) {
                    reject({ error: 'this.changes !== 1' });
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    this.getProcess = () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM process';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } if (rows.length === 0) {
                    resolve(new Process(undefined, 0, 0));
                } else {
                    const process = new Process(rows[0].processId, rows[0].budget, rows[0].phase);
                    resolve(process);
                }
            })
        })
    }

    this.getNumberOfProcess = () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM process';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.length);
                }
            })
        })
    }

    this.deleteProcess = () => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM process';
            db.run(sql, [], function (err) {
                if (err) {
                    reject(err);
                } else
                    resolve(this.changes);
            });
        });
    }
};