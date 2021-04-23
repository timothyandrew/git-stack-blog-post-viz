import React from "react";

export interface CommitGraphFooterProps {
  isPlaying: boolean;
  isDone: boolean;
  setIsPlaying: (boolean) => void;
  reset: () => void;
  jumpToEnd: () => void;
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
      <div className="flex flex-col sm:flex-row mt-2 text-center items-center sm:items-center justify-between w-full">
        <h2 className="font-medium mt-0 text-gray-700 text-sm ml-0 md:truncate text-center dark:text-gray-100" dangerouslySetInnerHTML={{ __html: props.title }}></h2>
        <div className="flex mt-2 md:mt-0 text-center justify-end">
          <button
              onClick={handlePlayClicked}
              className="play font-normal  uppercase text-xs border shadow dark:hover:bg-gray-300 border-gray-900 mx-4 text-gray-100 hover:bg-gray-900 py-1 rounded-sm px-4 bg-gray-700 
                         dark:bg-purple-600 dark:font-bold dark:text-white dark:hover:bg-purple-500 dark:border-0">
            {props.isPlaying ? "Pause" : (props.isDone ? "Restart" : "Play")}
          </button>

          <button
              onClick={() => props.jumpToEnd()}
              className="reset font-light text-sm dark:text-gray-600 text-gray-400 hover:underline text-xs mr-4">
            →End
          </button>

          <button
              onClick={() => props.reset()}
              className="reset font-light text-sm dark:text-gray-600 text-gray-400 hover:underline text-xs mr-0">
            Reset
          </button>
        </div>
      </div>
  );
}

