import {Commit} from "./Commit";
import _ from "lodash";

export class Operation {
  command: string;
  isApplied: boolean;

  constructor(command: string) {
    this.command = command;
    this.isApplied = false;
  }

  apply(commits: Commit[]): Commit[] {
    throw 'Unimplemented';
  }
}

export class AddCommitOperation extends Operation {
  branch: string;

  constructor(branch: string) {
    super("commit");
    this.branch = branch;
  }

  apply(oldCommits: Commit[]): Commit[] {
    const commits = _.cloneDeep(oldCommits);

    const parent = commits[commits.length - 1];
    const commit = new Commit(parent, [this.branch]);

    parent.isHead = false;
    _.remove(parent.isBranchTipFor, (b) => b === this.branch);

    commit.isHead = true;
    commit.isBranchTipFor = [this.branch];

    return [...commits, commit];
  }
}

export class CheckoutBranchOperation extends Operation {
  branch: string;

  constructor(branch: string) {
    super(`checkout -b ${branch}`);
    this.branch = branch;
  }

  apply(oldCommits: Commit[]): Commit[] {
    const commits = _.cloneDeep(oldCommits);
    const parent = commits[commits.length - 1];
    parent.isBranchTipFor = [...parent.isBranchTipFor, this.branch];
    return commits;
  }
}
