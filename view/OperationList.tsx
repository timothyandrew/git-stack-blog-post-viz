import {Operation} from "../model/Operation";
import React, {useState} from 'react';
import {Check, Dot} from "./SvgIcons";
import _ from "lodash";

export interface OperationListProps {
  operations: Operation[];
  setOperations: (operations: Operation[]) => void;
  isDone: boolean;
}

export function OperationList(props: OperationListProps) {
  const focusOperation = (focus: Operation) => {
    let operations = [...props.operations];
    let splitIndex = operations.indexOf(focus) + 1;

    let left = operations.slice(0, splitIndex)
    left.forEach(o => o.isApplied = true);
    let right = operations.slice(splitIndex)
    right.forEach(o => o.isApplied = false);

    props.setOperations([...left, ...right]);
  };

  const maybeUnfocusOperation = (unfocus: Operation) => {
    let operations = [...props.operations];

    if (props.isDone) {
      operations.forEach(o => o.isApplied = true);
    } else {
      operations.forEach(o => o.isApplied = false);
    }

    props.setOperations([...operations]);
  };

  return (
      <>
        <h3 className="text-sm text-center font-semibold">Git Commands</h3>
        <ul className="m-0 p-0 pt-1 mr-2">
          {props.operations.map((o) => {
            return (
              <li
                  onMouseEnter={() => focusOperation(o)}
                  onMouseLeave={() => maybeUnfocusOperation(o)}
                  className="font-mono list-none m-0 flex justify-center items-center cursor-pointer">
                {
                  o.isApplied
                    ? <Check fill="#34D399" dim='16px' />
                    : <Dot fill="#EEE" dim='16px' />
                }
                <span className="ml-2 text-gray-700 text-sm hover:bg-gray-200 px-2">{o.command}</span>
              </li>
            );
          })}
        </ul>
      </>
  );
}