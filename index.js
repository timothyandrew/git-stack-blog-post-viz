import ReactDOM from 'react-dom';
import React from 'react';
import {CommitGraphView} from "./CommitGraphView";
import {addCommits, chain} from "./factory";

ReactDOM.render(
  React.createElement(CommitGraphView, {
      commits: chain(5),
      operations: addCommits(5)
  }),
  document.querySelector('#foo'), () => console.log('rendered')
);