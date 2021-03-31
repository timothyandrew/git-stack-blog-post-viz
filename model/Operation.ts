import {Commit} from "./Commit";

export class Operation {
    command: string;
    isApplied: boolean;

    constructor(command: string) {
        this.command = command;
        this.isApplied = false;
    }

    apply(commits: Commit[]): Commit[] { throw 'Unimplemented'; }
}

export class AddCommitOperation extends Operation {
    constructor() {
        super("git commit");
    }

    apply(commits: Commit[]): Commit[] {
        const parent = commits[commits.length - 1];
        return [...commits, new Commit(parent)];
    }
}