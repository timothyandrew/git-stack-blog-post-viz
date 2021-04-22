import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Circle, LinkHorizontalLine} from "@visx/shape";
import {hierarchy, Tree} from "@visx/hierarchy";
import {Group} from "@visx/group";
import {LinearGradient} from "@visx/gradient";
import {CommitGraphFooter} from "./CommitGraphFooter";
import {OperationList} from "./OperationList";
import {Commit} from "../model/Commit";
import {Operation} from "../model/Operation";
import {Marker, MarkerArrow} from "@visx/marker";
import _ from 'lodash';

export interface SvgLayoutProps {
  widthGuide: (width: number, commits: Commit[]) => number;
  height: number;
  radius: number;
}

interface CommitGraphSvgProps {
  commits: Commit[];
  operations: Operation[];
  layout: SvgLayoutProps;
}

const margin = {top: 10, left: 50, right: 50, bottom: 10};

export function CommitGraphSvg(props: CommitGraphSvgProps) {
  const [pageBounds, setPageBounds] = useState<[number, number]>([0, 0]);
  const [width, setWidth] = useState(510);
  const svgContainerRef = useRef(null);

  const updateDimensions = _.debounce(() => {
    if (svgContainerRef.current) {
      const width = svgContainerRef.current.offsetWidth;
      const height = svgContainerRef.current.offsetHeight;
      setWidth(width);
      setPageBounds([height - margin.top - margin.bottom, width - margin.left - margin.right]);
    }
  }, 500);

  useEffect(() => { updateDimensions() }, [svgContainerRef]);
  useEffect(() => { window.addEventListener('resize', () => updateDimensions()) }, []);

  const radius = props.layout.radius ?? 23;
  const highlightSize = radius * 2.8;
  const height = props.layout.height ?? 200;
  const widthGuide = props.layout.widthGuide ? props.layout.widthGuide : (width: number) => width;
  const dimensions: [number, number] = [pageBounds[0], widthGuide(pageBounds[1], props.commits)];

  const root = hierarchy(props.commits[0], (parent) => {
    return props.commits.filter((c) => c.parent === parent);
  });

  const commitsMultipleParents = props.commits.filter(c => c.secondParent);

  const nodesBySha = (tree) => {
    let data = {};
    tree.each(node => data[node.data.getSha()] = node);
    return data;
  }

  const getSecondaryLinks = (nodesBySha) => {
    return commitsMultipleParents.map(c => {
      return {
        source: nodesBySha[c.getSha()],
        target: nodesBySha[c.secondParent.getSha()]
      };
    });
  }

  const arrowRefX = (): number => {
    if (radius == 15) { return 24 }
    if (radius == 18) { return 27 }
    if (radius == 23) { return 32 }
    return 23;
  };

  return (
    <div className="w-full" ref={svgContainerRef}>
      <svg width={width} height={height}>
        <LinearGradient id="links-gradient" from="#fd9b93" to="#fe6e9e"/>
        <MarkerArrow id={`arrow-${arrowRefX()}`} stroke="#333" fill="#333" size={5} strokeWidth={2} refX={arrowRefX()} />
        <Tree root={root} size={dimensions}>
          {tree => (
              <Group top={margin.top} left={margin.left}>
                {getSecondaryLinks(nodesBySha(tree)).map((link, i) => {
                  return (
                      <LinkHorizontalLine
                          markerEnd={`url(#arrow-${arrowRefX()})`}
                          key={`secondary-${i}`}
                          data={link}
                          stroke="#000"
                          strokeWidth="1"
                          fill="none" />
                  );
                })}

                {tree.links().map((link, i) => {
                  let source = link.source;
                  link.source = link.target;
                  link.target = source;

                  return (
                    <LinkHorizontalLine
                        markerEnd={`url(#arrow-${arrowRefX()})`}
                        key={i}
                        data={link}
                        stroke="#000"
                        strokeWidth="1"
                        fill="none" />
                    );
                })}

                {tree.descendants().map((node, key) => {

                  let top = node.x;
                  let left = node.y;

                  return (
                      <Group top={top} left={left} key={key}>
                        <Circle
                            r={radius}
                            fill={node.data.getBg()}
                            className="bg-yellow-500"
                            stroke={node.data.getBorder()}
                            strokeWidth={1} />
                        <text
                            dy=".33em"
                            fontSize={10}
                            className="font-mono"
                            textAnchor="middle"
                            style={{pointerEvents: 'none'}}
                            fill={node.data.getFg()}>
                          {node.data.getSha()}
                        </text>

                        { node.data.isHead && <text
                            dy={-radius - 10}
                            fontSize={12}
                            className="font-mono font-semibold"
                            textAnchor="middle"
                            style={{pointerEvents: 'none'}}
                            fill='#000'>
                          HEAD
                        </text>}

                        { node.data.isBranchTipFor.map((s, i) => <text
                            dy={radius + 18 + (15 * i)}
                            fontSize={12}
                            className="font-mono"
                            textAnchor="middle"
                            style={{pointerEvents: 'none'}}
                            fill='#000'>
                            {s}
                          </text>
                        )}

                        { node.data.highlight && node.data.highlight.enabled && <>
                            <text
                              dy={-radius - 10}
                              fontSize={12}
                              className="font-mono font-semibold"
                              textAnchor="middle"
                              style={{pointerEvents: 'none'}}
                              fill='#7F1D1D'>
                              { node.data.highlight.label ?? "" }
                            </text>

                            <rect
                                height={highlightSize}
                                width={highlightSize}
                                y={-highlightSize / 2}
                                x={-highlightSize / 2}
                                fill="rgba(0,0,0,0)"
                                stroke="#B91C1C"
                                strokeWidth={3}
                                rx={2}
                            />
                          </>
                        }
                      </Group>
                  );
                })}
              </Group>
          )}
        </Tree>
      </svg>
    </div>
  );
}
