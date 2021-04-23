import ReactDOM from 'react-dom';
import _ from "lodash";
import React from 'react';
import {CommitGraphView} from "./view/CommitGraphView";
import {addCommits, chain, chains, extendBranch} from "./factory";
import {
  AddCommitOperation,
  CheckoutBranchOperation, CherryPickSequenceOperation, ForceCheckoutBranchOperation,
  JumpToBranchOperation,
  MergeBranchOperation,
  PushBranchOperation, RebaseBranchOperation
} from "./model/Operation";

ReactDOM.render(
    React.createElement(CommitGraphView, {
      commits: chain(2, ["master"]),
      operations: addCommits(3, "master"),
      title: 'Fig. 1: Add three commits to the <code>master</code> branch',
      layout: {
        widthGuide: (width, commits) => width / 5 * commits.length
      }
    }),
    document.querySelector('#add-commits')
);

ReactDOM.render(
    React.createElement(CommitGraphView, {
      commits: chain(3, ["master"]),
      operations: [
        new CheckoutBranchOperation("f1"),
        ...addCommits(2, "f1")
      ],
      title: 'Fig. 2: Create the branch <code>f1</code> and add commits to it',
      layout: {
        widthGuide: (width, commits) => width / 5 * commits.length
      }
    }),
    document.querySelector('#feature-branch')
);

ReactDOM.render(
    React.createElement(CommitGraphView, {
      commits: chains([[2, ["master"]], [2, ["f1"]]]),
      operations: [
        new CheckoutBranchOperation("f2"),
        ...addCommits(2, "f2"),
        new CheckoutBranchOperation("f3"),
        ...addCommits(2, "f3")
      ],
      title: 'Fig. 3: Create two more feature branches with 2 commits each',
      layout: {
        radius: 18,
        height: 270,
        widthGuide: (width, commits) => width / 8 * commits.length
      }
    }),
    document.querySelector('#two-more-feature-branches')
);

ReactDOM.render(
    React.createElement(CommitGraphView, {
      commits: chains([[2, ["master"]], [2, ["f1"]], [2, ["f2"]], [2, ["f3"]]]),
      operations: [
        new JumpToBranchOperation("master"),
        new PushBranchOperation("master", "origin"),
        new JumpToBranchOperation("f1"),
        new PushBranchOperation("f1", "origin"),
        new JumpToBranchOperation("f2"),
        new PushBranchOperation("f2", "origin"),
        new JumpToBranchOperation("f3"),
        new PushBranchOperation("f3", "origin"),
      ],
      title: 'Fig. 4: Push each feature branch up to Github',
      layout: {
        radius: 18,
        height: 330,
        widthGuide: (width, commits) => width / 8 * commits.length
      }
    }),
    document.querySelector('#push-to-github')
);


ReactDOM.render(
    React.createElement(CommitGraphView, {
      commits: chains([
        [2, ["master", "origin/master"]],
        [2, ["f1", "origin/f1"]],
        [2, ["f2", "origin/f2"]],
        [2, ["f3", "origin/f3"]]
      ]),
      operations: [
        new JumpToBranchOperation("origin/f2"),
        new MergeBranchOperation("origin/f3", "origin/f2"),
        new JumpToBranchOperation("origin/f1"),
        new MergeBranchOperation("origin/f2", "origin/f1"),
        new JumpToBranchOperation("origin/master"),
        new MergeBranchOperation("origin/f1", "origin/master"),
      ],
      title: 'Fig. 5: Push each feature branch up to Github',
      layout: {
        radius: 18,
        height: 400,
        widthGuide: (width, commits) => width
      }
    }),
    document.querySelector('#merge-stack-happy-path')
);

ReactDOM.render(
    React.createElement(CommitGraphView, {
      commits: chains([
        [2, ["master", "origin/master"]],
        [2, ["f1", "origin/f1"]],
        [2, ["f2", "origin/f2"]],
        [2, ["f3", "origin/f3"]]
      ]),
      operations: [
        new JumpToBranchOperation("f1"),
        new AddCommitOperation("f1"),
        new PushBranchOperation("f1", "origin"),
        new JumpToBranchOperation("f2"),
        new AddCommitOperation("f2"),
        new PushBranchOperation("f2", "origin"),
        new JumpToBranchOperation("f3"),
        new AddCommitOperation("f3"),
        new PushBranchOperation("f3", "origin"),
      ],
      title: 'Fig. 6: Add commits to each feature branch (code review)',
      layout: {
        radius: 18,
        height: 400,
        widthGuide: (width, commits) => width
      }
    }),
    document.querySelector('#add-commits-feature-branches')
);

ReactDOM.render(
    React.createElement(CommitGraphView, {
      commits: _.flow([
        (chain) => chains(chain),
        (chain) => extendBranch(chain, "f1", 1),
        (chain) => extendBranch(chain, "f2", 1)
      ])([
        [2, ["master", "origin/master"]],
        [2, ["f1", "origin/f1"]],
        [2, ["f2", "origin/f2"]],
        [2, ["f3", "origin/f3"]]
      ]),
      operations: [
        new JumpToBranchOperation("f2"),
        new RebaseBranchOperation("f2", "f1", 3),
        new PushBranchOperation("f2", "origin", true),
        new JumpToBranchOperation("f3"),
        new RebaseBranchOperation("f3", "f2", 2),
        new PushBranchOperation("f3", "origin", true),
      ],
      title: 'Fig. 7: Rebase stack to incorporate new commits',
      layout: {
        radius: 18,
        height: 400,
        widthGuide: (width, commits) => width
      }
    }),
    document.querySelector('#rebase-no-conflict')
);

ReactDOM.render(
    React.createElement(CommitGraphView, {
      commits: _.flow([
        (chain) => chains(chain),
        (chain) => extendBranch(chain, "f1", 1),
        (chain) => extendBranch(chain, "f2", 1)
      ])([
        [2, ["master", "origin/master"]],
        [2, ["f1", "origin/f1"]],
        [2, ["f2", "origin/f2"]],
        [2, ["f3", "origin/f3"]]
      ]),
      operations: [
        new JumpToBranchOperation("f2"),
        new RebaseBranchOperation("f2", "f1", 3, true),
        new PushBranchOperation("f2", "origin", true),
        new JumpToBranchOperation("f3"),
        new RebaseBranchOperation("f3", "f2", 4),
        new PushBranchOperation("f3", "origin", true),
      ],
      title: 'Fig. 8: Rebase stack with conflicts',
      layout: {
        radius: 15,
        height: 400,
        widthGuide: (width, commits) => width
      }
    }),
    document.querySelector('#rebase-conflict')
);

ReactDOM.render(
    React.createElement(CommitGraphView, {
      commits: _.flow([
        (chain) => chains(chain),
        (chain) => extendBranch(chain, "f1", 1),
        (chain) => extendBranch(chain, "f2", 1)
      ])([
        [2, ["master", "origin/master"]],
        [2, ["f1", "origin/f1"]],
        [2, ["f2", "origin/f2"]],
        [2, ["f3", "origin/f3"]]
      ]),
      operations: [
        new JumpToBranchOperation("master", true),
        new CherryPickSequenceOperation("f1", "master", 3, "origin/master"),
        new ForceCheckoutBranchOperation("f1"),
        new CherryPickSequenceOperation("f2", "f1", 3, "origin/f1"),
        new ForceCheckoutBranchOperation("f2"),
        new CherryPickSequenceOperation("f3", "f2", 2, "origin/f2"),
        new ForceCheckoutBranchOperation("f3"),
      ],
      title: 'Fig. 9: Cherry-pick each feature branch',
      layout: {
        radius: 15,
        height: 400,
        widthGuide: (width, commits) => width
      }
    }),
    document.querySelector('#cherry-pick-workflow')
);
