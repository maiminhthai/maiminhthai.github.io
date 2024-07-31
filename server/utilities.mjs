import { validationResult } from 'express-validator';
import { User, Role } from './models/user.mjs';


const validateRequest = (req, res, next) => {
    const invalidFields = validationResult(req);

    if (!invalidFields.isEmpty()) {
        const errors = invalidFields.formatWith(errorFormatter);
        return res.status(422).json({ validationErrors: errors.mapped() });
    }
    return next();
};

const errorFormatter = ({ msg }) => {
    return msg;
};

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Not authorized' });
}

const isAdmin = (req, res, next) => {
    if (req.user.role === Role.ADMIN) {
        return next();
    }
    return res.status(401).json({ error: 'Not authorized' });
}

const isMemberOrAdmin = (req, res, next) => {
    if (req.user.role === Role.MEMBER || req.user.role === Role.ADMIN) {
        return next();
    }
    return res.status(401).json({ error: 'Not authorized' });
}

const computeScore = (proposals, preferences) => {
    let userPreferences = []; 
    for (let proposal of proposals) {
        proposal.score = preferences.filter(preference => preference.proposalId === proposal.proposalId)
            .reduce((total, preference) => total + preference.score, 0);
        userPreferences = [...userPreferences, proposal];
    }
    return userPreferences.sort((a, b) => b.score - a.score);
}

const computeApproved = (proposals, budget) => {
    let approvedList = [];
    let sum = 0;
    for (let proposal of proposals) {
        if (sum + proposal.cost <= budget) {
            sum += proposal.cost;
            proposal.approved = true;
            approvedList = [...approvedList, proposal];
        }
    }
    return approvedList;
}

export { validateRequest, isLoggedIn, isAdmin, isMemberOrAdmin, computeScore, computeApproved };