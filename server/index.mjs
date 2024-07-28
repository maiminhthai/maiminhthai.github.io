// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { body, param, query } from 'express-validator';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import { validateRequest, isLoggedIn, isAdmin, isMemberOrAdmin } from './utilities.mjs';
import UserController from './controllers/user_controller.mjs';
import ProcessCotroller from './controllers/process_controller.mjs';
import ProposalController from './controllers/proposal_controller.mjs';
import PreferenceController from './controllers/preference_controller.mjs';
import Preference from './models/preference.mjs';
import Proposal from './models/proposal.mjs';

const userController = new UserController();
const processController = new ProcessCotroller();
const proposalController = new ProposalController();
const preferenceController = new PreferenceController();

// init express
const app = new express();
app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));

app.use(session({
  secret: "jgpfjdgsrkgmmklfdkgjr",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

/** Passport */
passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await userController.getUserByCredentials(username, password);
  if (!user)
    return callback(null, false, 'Incorrect username or password');

  return callback(null, user);
}));

passport.serializeUser(function (user, callback) {
  callback(null, user);
});

passport.deserializeUser(function (user, callback) {
  return callback(null, user);
});

/** User APIs */
app.post('/api/sessions',
  body('username').isString().notEmpty(),
  body('password').isString().notEmpty(),
  validateRequest,
  function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
      if (!user) {
        return res.status(401).json({ error: info });
      }
      req.login(user, (err) => {
        if (err)
          return next(err);

        return res.json(req.user);
      });
    })(req, res, next);
  }
);

app.get('/api/sessions/current',
  isLoggedIn,
  (req, res) => res.status(200).json(req.user)
);

app.delete('/api/sessions/current',
  isLoggedIn,
  (req, res) => {
    req.logout(() => {
    res.end();
  });
});

/** Process API */
app.post('/api/process',
  isLoggedIn,
  isAdmin,
  body('budget').notEmpty().isInt(),
  validateRequest,
  (req, res) => processController.createProcess(req.body.budget)
    .then(() => res.status(200).end())
    .catch(err => res.status(500).json(err))
);

app.put('/api/process',
  isLoggedIn,
  isAdmin,
  (req, res) => processController.updatePhase()
    .then(() => res.status(200).end())
    .catch(err => res.status(500).json(err))
);

app.get('/api/process',
  (req, res) => processController.getProcess()
    .then((process) => res.status(200).json(process))
    .catch(err => res.status(500).json(err))
);

app.delete('/api/process',
  isLoggedIn,
  isAdmin,
  (req, res) => processController.restartProcess()
    .then(() => res.status(200).end())
    .catch(err => res.status(500).json(err))
);

app.put('/api/process/approved',
  isLoggedIn,
  isAdmin,
  (req, res) => processController.computeApproved()
    .then(() => res.status(200).end())
    .catch(err => res.status(500).json(err))
);

/** Proposal API */
app.post('/api/proposals',
  isLoggedIn,
  isMemberOrAdmin,
  body('description').notEmpty().isString(),
  body('cost').notEmpty().isInt(),
  validateRequest,
  (req, res) => proposalController.createProposal(new Proposal(undefined, req.body.description, req.body.cost, req.user.username, req.user.name))
    .then(() => res.status(200).end())
    .catch(err => res.status(500).json(err))
);

app.put('/api/proposals/:proposalId',
  isLoggedIn,
  isMemberOrAdmin,
  param('proposalId').notEmpty().isString(),
  body('description').notEmpty().isString(),
  body('cost').notEmpty().isInt(),
  validateRequest,
  (req, res) => proposalController.updateProposal(Number(req.params.proposalId), req.body.description, req.body.cost)
    .then(() => res.status(200).end())
    .catch(err => res.status(500).json(err))
);

app.get('/api/proposals/:username',
  isLoggedIn,
  isMemberOrAdmin,
  param('username').notEmpty().isString().custom((username, {req})=>username === req.user.username),
  validateRequest,
  (req, res) => proposalController.getAllProposalOfUser(req.params.username)
    .then(proposals => res.status(200).json(proposals))
    .catch(err => res.status(500).json(err))
);

app.get('/api/approved',
  (req, res) => proposalController.getApprovedProposals()
    .then(proposals => res.status(200).json(proposals))
    .catch(err => res.status(500).json(err))
);

app.get('/api/proposals',
  isLoggedIn,
  isMemberOrAdmin,
  (req, res) => proposalController.getAllProposals()
    .then(proposals => res.status(200).json(proposals))
    .catch(err => res.status(500).json(err))
);

app.delete('/api/proposals/:proposalId',
  isLoggedIn,
  isMemberOrAdmin,
  param('proposalId').notEmpty().isString(),
  validateRequest,
  (req, res) => proposalController.deleteProposal(Number(req.params.proposalId))
    .then(() => res.status(200).end())
    .catch(err => res.status(500).json(err))
);

/** Preference API */

app.post('/api/preferences',
  isLoggedIn,
  isMemberOrAdmin,
  body('proposalId').notEmpty().isInt(),
  body('score').notEmpty().isInt().custom(score => score >= 1 && score <= 3),
  validateRequest,
  (req, res) => preferenceController.createPreference(new Preference(req.user.username, req.body.proposalId, req.body.score))
    .then(() => res.status(200).end())
    .catch(err => res.status(500).json(err))
);

app.put('/api/preferences/:proposalId',
  isLoggedIn,
  isMemberOrAdmin,
  body('score').notEmpty().isInt().custom(score => score >= 1 && score <= 3),
  validateRequest,
  (req, res) => preferenceController.updatePreferenceScore(req.user.username, Number(req.params.proposalId), req.body.score)
    .then(() => res.status(200).end())
    .catch(err => res.status(500).json(err))
);

app.delete('/api/preferences/:proposalId',
  isLoggedIn,
  isMemberOrAdmin,
  (req, res) => preferenceController.deletePreference(req.user.username, Number(req.params.proposalId))
    .then(() => res.status(200).end())
    .catch(err => res.status(500).json(err)),
);

app.get('/api/preferences/:username',
  isLoggedIn,
  isMemberOrAdmin,
  param('username').notEmpty().isString().custom((username, { req }) => username === req.user.username),
  validateRequest,
  (req, res) => preferenceController.getAllPreferenceOfUser(req.params.username)
    .then(proposals => res.status(200).json(proposals))
    .catch(err => res.status(500).json(err))
);

// activate the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export { app };