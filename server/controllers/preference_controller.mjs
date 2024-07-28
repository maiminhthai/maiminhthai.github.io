import PreferenceDao from "../dao/preference_dao.mjs";
import Preference from "../models/preference.mjs";
import ProcessDao from "../dao/process_dao.mjs";
import ProposalDao from "../dao/proposal_dao.mjs";

const preferenceDao = new PreferenceDao(); 
const processDao = new ProcessDao();
const proposalDao = new ProposalDao();

export default function PreferenceController() {
    this.createPreference = async (preference) => {
        const process = await processDao.getProcess();
        if (process.phase !== 2) throw { error: "process.phase !== 2" };
        await preferenceDao.createPreference(preference);
    }

    this.getAllPreferenceOfUser = async (username) => {
        const process = await processDao.getProcess();
        if (process.phase !== 2) throw { error: "process.phase !== 2" };
        const preferences = await preferenceDao.getAllPreferenceOfUser(username);
        const allProposals = await proposalDao.getAllProposals();
        let userPreferences = [];   //its actually is a list of proposal
        for (let proposal of allProposals) {
            const preference = preferences.find(preference => preference.proposalId === proposal.proposalId);
            if (preference) {
                proposal.score = preference.score;
                userPreferences = [...userPreferences, proposal];
            } else {
                userPreferences = [...userPreferences, proposal];
            }
        }
        return userPreferences.sort((a, b) => b.score - a.score);
    }

    this.updatePreferenceScore = async (username, proposalId, score) => {
        const preference = new Preference(username, proposalId, score);
        const process = await processDao.getProcess();
        if (process.phase !== 2) throw { error: "process.phase !== 2" };
        await preferenceDao.updatePreferenceScore(preference);
    }

    this.deletePreference = async (username, preferenceId) => {
        const process = await processDao.getProcess();
        if (process.phase !== 2) throw { error: "process.phase !== 2" };
        await preferenceDao.deletePreference(username, preferenceId);
    }
}