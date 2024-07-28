import dayjs from "dayjs";

export default function Process(processId, budget, phase) {
    this.processId = processId;
    this.budget = budget;
    this.phase = phase;
};