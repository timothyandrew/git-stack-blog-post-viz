import {Commit} from "./model/Commit";
import {AddCommitOperation, Operation} from "./model/Operation";

export const chain = (n: number, branch: string): Commit[] => {
  let commits = [new Commit(undefined, [branch])];

  for (let i = 1; i < n; i++) {
      commits[i] = new Commit(commits[i - 1], [branch]);
  }

  commits[n-1].isBranchTipFor = [branch];
  commits[n-1].isHead = true;

  return commits;
};

export const addCommits = (n: number, branch: string): Operation[] => {
    return [...Array(n)].map(() => new AddCommitOperation(branch));
};