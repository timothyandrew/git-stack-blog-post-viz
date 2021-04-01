import React, {useLayoutEffect, useState} from 'react';
import {CommitGraphFooter} from "./CommitGraphFooter";
import {OperationList} from "./OperationList";
import {Commit} from "../model/Commit";
import {Operation} from "../model/Operation";
import {CommitGraphSvg, SvgLayoutProps} from "./CommitGraphSvg";

interface CommitGraphProps {
  commits: Commit[];
  operations: Operation[];
  title: string;
  layout: SvgLayoutProps;
}

const renderEveryMs = 1000;

export function CommitGraphView(props: CommitGraphProps) {
  const [operations, setOperations] = useState(props.operations);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [lastRender, setLastRender] = useState(0);

  const animRef = React.useRef<number>()

  const tick = (time: DOMHighResTimeStamp) => {
    if (isPlaying) {
      if ((time - lastRender) > renderEveryMs) {
        let localOperations = [...operations];
        let operation = localOperations.filter((p) => !p.isApplied)[0];

        if (operation) {
          operation.isApplied = true;
          setLastRender(time);
          setOperations(localOperations);
        } else {
          setIsDone(true);
          setIsPlaying(false);
        }
      } else {
        animRef.current = requestAnimationFrame(tick);
      }
    }
  };

  const reset = () => {
    let localOperations = [...operations];
    localOperations.forEach((o) => o.isApplied = false);
    setOperations(localOperations);
    setIsPlaying(false);
    setIsDone(false);
  };

  useLayoutEffect(() => {
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, operations, lastRender]);

  let updatedCommits = operations
      .filter((o) => o.isApplied)
      .reduce((commits, o) => o.apply(commits), props.commits);

  return (
      <div>
        <div className="flex items-stretch">
          <div className="w-9/12 border border-gray-800">
            <CommitGraphSvg commits={updatedCommits} operations={operations} layout={props.layout} />
          </div>
          <div className="w-3/12 border ml-2 shadow border-gray-400">
            <OperationList
              operations={operations}
              setOperations={setOperations}
              isDone={isDone}/>
          </div>
        </div>
        <div className="flex flex-row mt-2 text-center items-center justify-between w-9/12 pr-4">
          <CommitGraphFooter
              reset={reset}
              isDone={isDone}
              title={props.title}
              setIsPlaying={setIsPlaying}
              isPlaying={isPlaying} />
        </div>
      </div>
  );
}