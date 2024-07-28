import ProposalDao from "../dao/proposal_dao.mjs";
import Proposal from "../models/proposal.mjs";
import ProcessDao from "../dao/process_dao.mjs";
import UserDao from "../dao/user_dao.mjs";

const proposalDao = new ProposalDao();
const processDao = new ProcessDao();
const userDao = new UserDao();

export default function ProposalController() {
    this.createProposal = async (proposal) => {
        const process = await processDao.getProcess();
        if (proposal.cost > process.budget) throw { message: "cost > process.budget" };
        if (process.phase !== 1) throw { error: "process.phase !== 1" };
        const proposals = await proposalDao.getAllProposalOfUser(proposal.username);
        if (proposals.length === 3) throw { error: "proposals.lengrh === 3" };
        await proposalDao.createProposal(proposal);
    }

    this.getAllProposalOfUser = async (username) => {
        const process = await processDao.getProcess();
        if (process.phase !== 1) throw { error: "process.phase !== 1" };
        return proposalDao.getAllProposalOfUser(username);
    }

    this.updateProposal = async (proposalId, description, cost) => {
        const process = await processDao.getProcess();
        if (cost > process.budget) throw { error: "cost > process.budget" };
        if (process.phase !== 1) throw { error: "process.phase !== 1" };
        await proposalDao.updateProposal(proposalId, description, cost);
    }

    this.deleteProposal = async (proposalId) => {
        const process = await processDao.getProcess();
        if (process.phase !== 1) throw { error: "process.phase !== 1" };
        await proposalDao.deleteProposal(proposalId);
    }

    this.getAllProposals = async () =>{
        const process = await processDao.getProcess();
        if (process.phase !== 3) throw { error: "process.phase !== 3" };
        return proposalDao.getAllProposals();
    }

    this.getApprovedProposals = async () => {
        const process = await processDao.getProcess();
        if (process.phase !== 3) throw { error: "process.phase !== 3" };
        return proposalDao.getAllApprovedProposals();
    }
}