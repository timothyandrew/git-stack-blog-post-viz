import {Commit} from "./Commit";
import _ from "lodash";
import {chain} from "../factory";

// KLUDGE: This is probably too expensive, but it's passable for now
const cloneCommits = (commits: Commit[]): Commit[] => {
  let updated = _.cloneDeep(commits);
  updated.forEach((c, i) => c.branches = _.cloneDeep(commits[i].branches));
  return updated;
};

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
    const commits = cloneCommits(oldCommits);

    const parent = commits.filter(c => c.isHead)[0];
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
    const commits = cloneCommits(oldCommits);
    const parent = commits[commits.length - 1];
    parent.isBranchTipFor = [...parent.isBranchTipFor, this.branch];
    return commits;
  }
}

export class JumpToBranchOperation extends Operation {
  branch: string;

  constructor(branch: string) {
    super(`checkout ${branch}`);
    this.branch = branch;
  }

  apply(oldCommits: Commit[]): Commit[] {
    const commits = cloneCommits(oldCommits);
    commits.forEach(c => c.isHead = c.isBranchTipFor.includes(this.branch));
    return commits;
  }
}

export class PushBranchOperation extends Operation {
  branch: string;
  remote: string;

  constructor(branch: string, remote: string, force: boolean = false) {
    const flags = force ? '-fu' : '-u';
    super(`push ${flags} ${remote} ${branch}`);
    this.branch = branch;
    this.remote = remote;
  }

  apply(oldCommits: Commit[]): Commit[] {
    const commits = cloneCommits(oldCommits);
    let head: Commit;
    let remoteBranchName = `${this.remote}/${this.branch}`;


    commits.forEach(c => {
      if (c.isHead) { head = c; }

      if (c.isBranchTipFor.includes(remoteBranchName)) {
        _.remove(c.isBranchTipFor, (b) => b === remoteBranchName);
      }
    });

    head.isBranchTipFor = [...head.isBranchTipFor, remoteBranchName];
    return commits;
  }
}

export class MergeBranchOperation extends Operation {
  from: string;
  onto: string;

  constructor(from: string, onto: string) {
    super(`git merge ${from}`);
    this.from = from;
    this.onto = onto;
  }

  apply(oldCommits: Commit[]): Commit[] {
    const commits = cloneCommits(oldCommits);

    let fromCommit;
    let ontoCommit;

    const commit = commits.forEach(c => {
      if (c.isBranchTipFor.includes(this.from)) { fromCommit = c }
      if (c.isBranchTipFor.includes(this.onto)) { ontoCommit = c }
    });

    _.remove(ontoCommit.isBranchTipFor, b => b == this.onto);
    ontoCommit.isHead = false;

    const mergeCommit = new Commit(ontoCommit, [this.onto], fromCommit);
    mergeCommit.isBranchTipFor = [this.onto];
    mergeCommit.isHead = true;

    return [...commits, mergeCommit];
  }
}

export class RebaseBranchOperation extends Operation {
  branch: string;
  onto: string;
  count: number;
  conflicts: boolean;

  constructor(branch: string, onto: string, count: number, conflicts: boolean = false) {
    super(`git rebase ${onto}`);
    this.branch = branch;
    this.onto = onto;
    this.count = count;
    this.conflicts = conflicts;
  }

  apply(oldCommits: Commit[]): Commit[] {
    const clonedCommits = cloneCommits(oldCommits);

    let ontoCommit;
    let branchCommit;

    const commit = clonedCommits.forEach(c => {
      if (c.isBranchTipFor.includes(this.onto)) { ontoCommit = c }
      if (c.isBranchTipFor.includes(this.branch)) { branchCommit = c }
    });

    const rebasedCommits = chain(this.count, [this.branch], ontoCommit, true);

    if (this.conflicts) {
      rebasedCommits[0].jitter = "JITTER";
      rebasedCommits[0].highlight = {
        enabled: true,
        label: "Conflict"
      };
    }

    branchCommit.isHead = false;
    _.remove(branchCommit.isBranchTipFor, (b) => b === this.branch);

    return [...clonedCommits, ...rebasedCommits];
  }
}
