

export default function Proposal(proposalId, description, cost, username, author, score = 0, approved = false) {
    this.proposalId = proposalId;
    this.description = description;
    this.cost = cost;
    this.username = username;
    this.author = author;
    this.score = score;
    this.approved = approved;
}