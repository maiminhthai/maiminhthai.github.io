import db from "../db/db.mjs";
import crypto from "crypto";
import { User, Role } from "../models/user.mjs";

export default function UserDao() {

    this.getUserByCredentials = (username, password) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username = ?';
            db.get(sql, [username], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve(false);
                }
                else {
                    const user = new User(row.username, row.role, row.name);
                    crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
                        if (err) reject(err);
                        if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
                            resolve(false);
                        else
                            resolve(user);
                    });
                }
            });
        });
    }

    this.getUserByUsername = (username) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username = ?';
            db.get(sql, [username], (err, row) => {
                if (err) {
                    reject(err)
                } else if (!row) {
                    reject({ error: 'user not found.' });
                } else {
                    resolve(new User(row.username, row.role, row.name));
                }
            })
        })
    }
}