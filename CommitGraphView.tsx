import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Circle, LinkHorizontalLine} from "@visx/shape";
import {hierarchy, Tree} from "@visx/hierarchy";
import {Group} from "@visx/group";
import {LinearGradient} from "@visx/gradient";
import {CommitGraphFooter} from "./CommitGraphFooter";
import {OperationList} from "./OperationList";
import {Commit} from "./model/Commit";
import {Operation} from "./model/Operation";
import {CommitGraphSvg} from "./CommitGraphSvg";

interface CommitGraphProps {
  commits: Commit[];
  operations: Operation[];
}

const margin = {top: 30, left: 60, right: 60, bottom: 30};
const renderEveryMs = 1000;


export function CommitGraphView(props: CommitGraphProps) {
  const [operations, setOperations] = useState(props.operations);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastRender, setLastRender] = useState(0);
  const [svgDimensions, setSvgDimensions] = useState<[number, number]>([0, 0]);

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
  };

  useLayoutEffect(() => {
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, operations, lastRender]);

  let updatedCommits = operations
      .filter((o) => o.isApplied)
      .reduce((commits, o) => o.apply(commits), props.commits);

  return (
      <div className="my-8">
        <div className="flex items-center mt-8">
          <div className="w-10/12 border border-gray-800">
            <CommitGraphSvg commits={updatedCommits} operations={operations} />
          </div>
          <div className="w-2/12">
            <OperationList operations={props.operations}/>
          </div>
        </div>
        <CommitGraphFooter reset={reset} setIsPlaying={setIsPlaying} isPlaying={isPlaying} />
      </div>
  );
}