import React from "react";

export interface CommitGraphFooterProps {
  isPlaying: boolean;
  isDone: boolean;
  setIsPlaying: (boolean) => void;
  reset: () => void;
  title: string;
}

export function CommitGraphFooter(props: CommitGraphFooterProps) {
  const handlePlayClicked = () => {
    if (props.isDone) {
      props.reset();
    }

    props.setIsPlaying(!props.isPlaying);
  };

  return (
      <>
        <h2 className="font-medium mt-0 text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: props.title }}></h2>
        <div className="flex text-center">
          <button
              onClick={handlePlayClicked}
              className="play font-normal uppercase text-xs border shadow border-gray-900 mx-4 bg-gray-700 text-gray-100 hover:bg-gray-900 py-1 rounded-sm px-4">
            {props.isPlaying ? "Stop" : (props.isDone ? "Restart" : "Play")}
          </button>

          <button
              onClick={() => props.reset()}
              className="reset font-light text-sm text-gray-400 hover:underline text-xs">
            Reset
          </button>
        </div>
      </>
  );
}

