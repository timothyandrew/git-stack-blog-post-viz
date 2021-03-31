import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Circle, LinkHorizontalLine} from "@visx/shape";
import {hierarchy, Tree} from "@visx/hierarchy";
import {Group} from "@visx/group";
import {LinearGradient} from "@visx/gradient";
import {CommitGraphFooter} from "./CommitGraphFooter";
import {OperationList} from "./OperationList";
import {Commit} from "./model/Commit";
import {Operation} from "./model/Operation";

interface CommitGraphSvgProps {
  commits: Commit[];
  operations: Operation[];
}

const margin = {top: 30, left: 60, right: 60, bottom: 30};

export function CommitGraphSvg(props: CommitGraphSvgProps) {
  const [svgDimensions, setSvgDimensions] = useState<[number, number]>([0, 0]);
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      const width = svgRef.current.width.baseVal.value;
      const height = svgRef.current.height.baseVal.value;
      setSvgDimensions([height - margin.top - margin.bottom, width - margin.left - margin.right]);
    }
  }, [svgRef]);

  const root = hierarchy(props.commits[0], (parent) => {
    return props.commits.filter((c) => c.parent === parent);
  });

  return (
    <svg width="100%" height="200" ref={svgRef}>
      <LinearGradient id="links-gradient" from="#fd9b93" to="#fe6e9e"/>
      <Tree root={root} size={svgDimensions}>
        {tree => (
            <Group top={margin.top} left={margin.left}>
              {tree.links().map((link, i) => (
                  <LinkHorizontalLine
                      key={i}
                      data={link}
                      stroke="#000"
                      strokeWidth="1"
                      fill="none"
                  />
              ))}

              {tree.descendants().map((node, key) => {
                const radius = 23;

                let top = node.x;
                let left = node.y;

                return (
                    <Group top={top} left={left} key={key}>
                      <Circle
                          r={radius}
                          fill={node.data.getBg()}
                          className="bg-yellow-500"
                          stroke={node.data.getBorder()}
                          strokeWidth={1}
                      />
                      <text
                          dy=".33em"
                          fontSize={10}
                          className="font-mono"
                          textAnchor="middle"
                          style={{pointerEvents: 'none'}}
                          fill={node.data.getFg()}
                      >
                        {node.data.sha}
                      </text>
                    </Group>
                );
              })}
            </Group>
        )}
      </Tree>
    </svg>
  );
}
