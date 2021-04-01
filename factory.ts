import {Commit} from "./model/Commit";
import {AddCommitOperation, Operation} from "./model/Operation";
import _ from "lodash";

export const chain = (n: number,
                      branches: string[],
                      initialParent: Commit | undefined = undefined,
                      markHead: boolean = true): Commit[] => {
  let commits = [new Commit(initialParent, branches)];

  for (let i = 1; i < n; i++) {
      commits[i] = new Commit(commits[i - 1], branches);
  }

  commits[n-1].isBranchTipFor = _.clone(branches);

  if (markHead) {
    commits[n-1].isHead = true;
  }

  return commits;
};

export const extendBranch = (commits: Commit[], branch: string, count: number): Commit[] => {
  let parent = commits.filter(c => c.isBranchTipFor.includes(branch))[0];
  let newCommits = chain(count, [branch], parent, false);
  _.remove(parent.isBranchTipFor, (b) => b === branch);
  return [...commits, ...newCommits];
}

export const chains = (specs: [number, string[]][]): Commit[] => {
  const commits =  specs.reduce((commits, spec) => {
    if (commits.length > 0) {
      let commitChain = chain(spec[0], spec[1], commits[commits.length - 1], false);
      return [...commits, ...commitChain];
    } else {
      let commitChain = chain(spec[0], spec[1], undefined, false);
      return commitChain;
    }
  }, [] as Commit[]);

  _.last(commits).isHead = true;

  return commits;
};

export const addCommits = (n: number, branch: string): Operation[] => {
    return [...Array(n)].map(() => new AddCommitOperation(branch));
};