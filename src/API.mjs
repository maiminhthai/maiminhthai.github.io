import { User } from "./models/User.mjs";

const baseURL = "http://localhost:3001/api";

/** User APIs */
async function login(credentials) {
    const response = await fetch(baseURL + '/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    })
    if (!response.ok) throw new Error(response.statusText);
    const user = await response.json();
    return new User(user.username, user.role, user.name);
}

async function getUserInfo() {
    const response = await fetch(baseURL + '/sessions/current', {
        credentials: 'include'
    })
    if (!response.ok) throw new Error(response.statusText);
    const user = await response.json();
    return new User(user.username, user.role, user.name);
}

async function logout() {
    const response = await fetch(baseURL + '/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    })
    if (!response.ok) throw new Error(response.statusText);
}

/** Process API */
async function getProcess() {
    const response = await fetch(baseURL + '/process')
    if (!response.ok) throw new Error(response.statusText);
    let process = await response.json();
    return process;
}

async function createProcess(budget) {
    const response = await fetch(baseURL + '/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({budget: budget}),
    })
    if (!response.ok) throw new Error(response.statusText);
}

async function updatePhase() {
    const response = await fetch(baseURL + '/process', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    if (!response.ok) throw new Error(response.statusText);
}

async function deleteProcess() {
    const response = await fetch(baseURL + '/process', {
        method: 'DELETE',
        credentials: 'include'
    })
    if (!response.ok) throw new Error(response.statusText);
}

/** Proposals API */
async function getProposals(username) {
    const response = await fetch(baseURL + `/proposals/${username}`, {
        credentials: 'include'
    })
    if (!response.ok) throw new Error(response.statusText);
    let proposals = await response.json();
    return proposals;
}

async function addProposal(proposal) {
    const response = await fetch(baseURL + '/proposals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(proposal),
    })
    if (!response.ok) throw new Error(response.statusText);
}

async function updateProposal(proposal) {
    const response = await fetch(baseURL + `/proposals/${proposal.proposalId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ description: proposal.description, cost: proposal.cost }),
    })
    if (!response.ok) throw new Error(response.statusText);
}

async function deleteProposal(proposalId) {
    const response = await fetch(baseURL + `/proposals/${proposalId}`, {
        method: 'DELETE',
        credentials: 'include'
    })
    if (!response.ok) throw new Error(response.statusText);
}

/** Preference API */
async function getPreferences(username) {
    const response = await fetch(baseURL + `/preferences/${username}`, {
        credentials: 'include'
    })
    if (!response.ok) throw new Error(response.statusText);
    let preferences = await response.json();
    return preferences;
}

async function addPreference(preference) {
    console.log(preference);
    const response = await fetch(baseURL + '/preferences', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({proposalId: preference.proposalId, score: preference.score}),
    })
    if (!response.ok) throw new Error(response.statusText);
}

async function updatePreference(preference) {
    const response = await fetch(baseURL + `/preferences/${preference.proposalId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ score: preference.score }),
    })
    if (!response.ok) throw new Error(response.statusText);
}

async function deletePreference(proposalId) {
    const response = await fetch(baseURL + `/preferences/${proposalId}`, {
        method: 'DELETE',
        credentials: 'include'
    })
    if (!response.ok) throw new Error(response.statusText);
}

/** Phase 3 API */
async function computeApproved() {
    const response = await fetch(baseURL + '/process/approved', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    if (!response.ok) throw new Error(response.statusText);
}

async function getApprovedList() {
    const response = await fetch(baseURL + `/approved`);
    if (!response.ok) throw new Error(response.statusText);
    let proposals = await response.json();
    return proposals;
}

async function getAllProposals() {
    const response = await fetch(baseURL + `/proposals`, {
        credentials: 'include'
    })
    if (!response.ok) throw new Error(response.statusText);
    let proposals = await response.json();
    return proposals;
}

const API = {
    login, logout, getUserInfo, getProcess, createProcess, updatePhase, deleteProcess, computeApproved,
    getProposals, addProposal, updateProposal, deleteProposal, getPreferences, addPreference, updatePreference,
    deletePreference, getApprovedList, getAllProposals
};
export default API;