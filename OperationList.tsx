import {Operation} from "./model/Operation";
import React, {useEffect, useRef, useState} from 'react';

export interface OperationListProps {
    operations: Operation[];
}

export function OperationList(props: OperationListProps) {
    return (
        <ul>
            {props.operations.map((o) => {
                return <li className={o.isApplied ? "bg-green-400" : "bg-red-400"}>{o.command}</li>;
            })}
        </ul>
    );
}