import dayjs from "dayjs";

export default function Preference(username, proposalId, score) {
    this.username = username;
    this.proposalId = proposalId;
    this.score = score;
}