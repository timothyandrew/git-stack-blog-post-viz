import ReactDOM from 'react-dom';
import React from 'react';
import {CommitGraphView} from "./view/CommitGraphView";
import {addCommits, chain} from "./factory";

ReactDOM.render(
  React.createElement(CommitGraphView, {
      commits: chain(3),
      operations: addCommits(3),
      title: 'Add three commits to the <code>master</code> branch',
      widthGuide: (width, commits) => width / 6 * commits.length
  }),
  document.querySelector('#add-commits'), () => console.log('rendered')
);