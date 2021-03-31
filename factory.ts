import {Commit} from "./model/Commit";
import {AddCommitOperation, Operation} from "./model/Operation";

export const chain = (n: number): Commit[] => {
  let commits = [new Commit(undefined)];

  for (let i = 1; i < n; i++) {
      commits[i] = new Commit(commits[i - 1]);
  }

  commits[n-1].isBranchTip = true;
  commits[n-1].isHead = true;

  return commits;
};

export const addCommits = (n: number): Operation[] => {
    return [...Array(n)].map(() => new AddCommitOperation());
};