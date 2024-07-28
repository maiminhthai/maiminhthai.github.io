import db from "../db/db.mjs";
import Preference from "../models/preference.mjs";

export default function PreferenceDao() {
    this.createPreference = (preference) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO preferences(username, proposalId, score) VALUES (?, ?, ?)';
            db.run(sql, [preference.username, preference.proposalId, preference.score], function (err) {
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

    this.getAllPreferenceOfUser = (username) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM preferences WHERE username=?';
            db.all(sql, [username], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const preferences = rows.map(row => new Preference(row.username, row.proposalId, row.score));
                    resolve(preferences);
                }
            })
        })
    }

    this.updatePreferenceScore = (preference) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE preferences SET score=? WHERE username=? AND proposalId=?';
            db.run(sql, [preference.score, preference.username, preference.proposalId], function (err) {
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

    this.deletePreference = (username, proposalId) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM preferences WHERE username=? AND proposalId=?';
            db.run(sql, [username, proposalId], function (err) {
                if (err) {
                    reject(err);
                } else
                    resolve(this.changes);
            });
        });
    }

    this.deleteAllPreferences = () => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM preferences';
            db.run(sql, [], function (err) {
                if (err) {
                    reject(err);
                } else
                    resolve(this.changes);
            });
        });
    }

    this.getAllPreferencesOfProposal = (proposalId) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM preferences WHERE proposalId=?';
            db.all(sql, [proposalId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const preferences = rows.map(row => new Preference(row.username, row.proposalId, row.score));
                    resolve(preferences);
                }
            })
        })
    }

    this.getAllPreferences = () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM preferences';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const preferences = rows.map(row => new Preference(row.username, row.proposalId, row.score));
                    resolve(preferences);
                }
            })
        })
    }
}