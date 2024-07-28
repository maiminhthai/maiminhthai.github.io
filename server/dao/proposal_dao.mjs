import db from "../db/db.mjs";
import Proposal from "../models/proposal.mjs";

export default function ProposalDao() {
    this.createProposal = (proposal) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO proposals(description, cost, username, author, score, approved) VALUES (?, ?, ?, ?, ?, ?)';
            const bool = proposal.approved ? 1 : 0;
            db.run(sql, [proposal.description, proposal.cost, proposal.username, proposal.author, proposal.score, bool], function (err) {
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
    
    this.getAllProposalOfUser = (username) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM proposals WHERE username=?';
            db.all(sql, [username], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const proposals = rows.map(row => new Proposal(row.proposalId, row.description, row.cost, row.username, row.author, row.score, row.approved));
                    resolve(proposals);
                }
            })
        })
    }

    this.updateProposal = (proposalId, description, cost) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE proposals SET description=?, cost=? WHERE proposalId=?';
            db.run(sql, [description, cost, proposalId], function (err) {
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

    this.updateScore = (proposal) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE proposals SET score=? WHERE proposalId=?';
            db.run(sql, [proposal.score, proposal.proposalId], function (err) {
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

    this.setApproved = (proposal) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE proposals SET approved=? WHERE proposalId=?';
            const bool = proposal.approved ? 1 : 0;
            db.run(sql, [bool, proposal.proposalId], function (err) {
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

    this.deleteProposal = (proposalId) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM proposals WHERE proposalId=?';
            db.run(sql, [proposalId], function (err) {
                if (err) {
                    reject(err);
                } else
                    resolve(this.changes);
            });
        });
    }

    this.deleteAllProposals = () => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM proposals';
            db.run(sql, [], function (err) {
                if (err) {
                    reject(err);
                } else
                    resolve(this.changes);
            });
        });
    }

    this.getAllProposals = () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM proposals';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const proposals = rows.map(row => new Proposal(row.proposalId, row.description, row.cost, row.username, row.author, row.score, row.approved));
                    resolve(proposals);
                }
            })
        })
    }

    this.getAllApprovedProposals = () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM proposals WHERE approved=1';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const proposals = rows.map(row => new Proposal(row.proposalId, row.description, row.cost, row.username, row.author, row.score, row.approved));
                    resolve(proposals);
                }
            });
        });
    }
}