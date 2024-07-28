import Process from "../models/process.mjs";
import ProcessDao from "../dao/process_dao.mjs";
import ProposalDao from "../dao/proposal_dao.mjs";
import PreferenceDao from "../dao/preference_dao.mjs";
import { computeScore, computeApproved } from "../utilities.mjs";

const processDao = new ProcessDao();
const proposalDao = new ProposalDao();
const preferenceDao = new PreferenceDao();

export default function ProcessCotroller() {
    
    this.createProcess = async (budget) => {
        const processNumber = await processDao.getNumberOfProcess();
        if (processNumber === 1) throw { error: 'there is already a process' };
        const id = await processDao.createProcess(budget);
    }

    this.updatePhase = async () => {
        const process = await processDao.getProcess();
        if (process.phase === 3) throw {error: 'phase === 3'};
        const id = await processDao.updatePhase(process.phase + 1);
    }

    this.computeApproved = async () => {
        const process = await processDao.getProcess();
        const proposals = await proposalDao.getAllProposals();
        const preferences = await preferenceDao.getAllPreferences();
        const proposalSortedByScore = computeScore(proposals, preferences);
        const p = proposalSortedByScore.filter(proposal => proposal.score > 0);
        p.forEach(async (proposal) => await proposalDao.updateScore(proposal));
        console.log(proposalSortedByScore);
        const approvedList = computeApproved(proposalSortedByScore, process.budget);
        console.log(process.budget);
        console.log(approvedList);
        approvedList.forEach(async (proposal) => await proposalDao.setApproved(proposal));
    }

    this.getProcess = async () => {
        return processDao.getProcess();
    }

    this.restartProcess = async () => {
        await processDao.deleteProcess();
        await preferenceDao.deleteAllPreferences();
        await proposalDao.deleteAllProposals();
    }
}
