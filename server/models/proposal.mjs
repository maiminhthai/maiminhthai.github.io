import dayjs from "dayjs";

export default function Proposal(proposalId, description, cost, username, author, score = 0, approved = 0) {
    this.proposalId = proposalId;
    this.description = description;
    this.cost = cost;
    this.username = username;
    this.author = author;
    this.score = score;
    this.approved = approved === 0 ? false : true;
}