import * as React from "react";

export function Dot(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 29.107 29.107"
            fill={props.fill}
            width={props.dim}
            height={props.dim}
            {...props}
        >
            <path d="M14.554 0C6.561 0 0 6.562 0 14.552c0 7.996 6.561 14.555 14.554 14.555 7.996 0 14.553-6.559 14.553-14.555C29.106 6.562 22.55 0 14.554 0z" />
        </svg>
    );
}

export function Check(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width={props.dim}
            height={props.dim}
            {...props}
        >
            <ellipse cx={256} cy={256} rx={256} ry={255.832} fill={props.fill} />
            <path
                fill="#fff"
                d="M235.472 392.08l-121.04-94.296 34.416-44.168 74.328 57.904 122.672-177.016 46.032 31.888z"
            />
        </svg>
    );
}
