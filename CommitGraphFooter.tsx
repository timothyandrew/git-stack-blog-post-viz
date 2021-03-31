import React from "react";

export interface CommitGraphFooterProps {
  isPlaying: boolean;
  setIsPlaying: (boolean) => void
  reset: () => void
}

export function CommitGraphFooter(props: CommitGraphFooterProps) {
  return (
      <div className="flex flex-row mt-2 text-center items-center justify-between w-10/12">
        <h2 className="font-light mt-0 text-xl text-gray-800">Feature branch</h2>
        <div className="flex text-center">
          <button
              onClick={() => props.setIsPlaying(!props.isPlaying)}
              className="play font-normal uppercase text-xs border shadow border-gray-900 mx-4 bg-gray-700 text-gray-100 hover:bg-gray-900 py-1 rounded-sm px-4">
            {props.isPlaying ? "Stop" : "Play"}
          </button>

          <button
              onClick={() => props.reset()}
              className="reset font-light text-sm text-gray-400 hover:underline text-xs">
            Reset
          </button>
        </div>
      </div>
  );
}
