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
      <div className="flex flex-row lg:flex-col items-center justify-between lg:items-start">
        <h3 className="text-xl font-medium lg:text-base text-center ml-3 my-0 lg:m-0 text-center">Git Operation List</h3>
        <ul className="m-0 p-0 pt-1 ml-8 mr-4 my-0 lg:m-0">
          {props.operations.map((o) => {
            return (
              <li
                  onMouseEnter={() => focusOperation(o)}
                  onMouseLeave={() => maybeUnfocusOperation(o)}
                  className="font-mono list-none m-0 my-1 flex items-center cursor-default">
                <div className="flex-none">
                  {
                    o.isApplied
                      ? <Check fill="#34D399" dim='16px' />
                      : <Dot fill="#EEE" dim='16px' />
                  }
                </div>
                <span className="py-0 text-gray-901 text-xs font-medium bg-gray-100 hover:bg-gray-300 px-1 ml-1 mr-2 rounded">{o.command}</span>
              </li>
            );
          })}
        </ul>
      </div>
  );
}