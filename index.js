import ReactDOM from 'react-dom';
import React from 'react';
import {CommitGraphView} from "./view/CommitGraphView";
import {addCommits, chain} from "./factory";
import {CheckoutBranchOperation} from "./model/Operation";

ReactDOM.render(
    React.createElement(CommitGraphView, {
      commits: chain(3, "master"),
      operations: addCommits(3, "master"),
      title: 'Add three commits to the <code>master</code> branch',
      widthGuide: (width, commits) => width / 6 * commits.length
    }),
    document.querySelector('#add-commits')
);

ReactDOM.render(
    React.createElement(CommitGraphView, {
      commits: chain(3, "master"),
      operations: [
        new CheckoutBranchOperation("f1"),
        ...addCommits(3, "f1")
      ],
      title: 'Foo Bar',
      widthGuide: (width, commits) => width / 6 * commits.length
    }),
    document.querySelector('#feature-branch')
);
