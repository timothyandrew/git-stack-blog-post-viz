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

  const jumpToEnd = () => {
    let localOperations = [...operations];
    localOperations.forEach((o) => o.isApplied = true);
    setOperations(localOperations);
    setIsPlaying(false);
    setIsDone(true);
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
        <div className="flex flex-col lg:flex-row items-start lg:items-start my-16">
          <div className="flex flex-col items-stretch w-full">
            <div className="border border-gray-800 w-full">
              <CommitGraphSvg commits={updatedCommits} operations={operations} layout={props.layout} />
            </div>
            <div className="flex flex-row mt-2 text-center items-center justify-between">
              <CommitGraphFooter
                  reset={reset}
                  isDone={isDone}
                  title={props.title}
                  setIsPlaying={setIsPlaying}
                  jumpToEnd={jumpToEnd}
                  isPlaying={isPlaying} />
            </div>
          </div>
          <div className="border py-4 lg:w-4/12 pl-4 mt-4 lg:mt-0 lg:ml-2 shadow border-gray-400">
            <OperationList
              operations={operations}
              setOperations={setOperations}
              isDone={isDone}/>
          </div>
        </div>
      </div>
  );
}