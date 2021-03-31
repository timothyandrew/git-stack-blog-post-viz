import ReactDOM from 'react-dom';
import React from 'react';
import {CommitGraphView} from "./view/CommitGraphView";
import {addCommits, chain} from "./factory";

ReactDOM.render(
  React.createElement(CommitGraphView, {
      commits: chain(3),
      operations: addCommits(3)
  }),
  document.querySelector('#foo'), () => console.log('rendered')
);