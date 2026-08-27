import React from "react";
import { Composition } from "remotion";
import { CaptionedVideo } from "./CaptionedVideo";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        durationInFrames={7575}
        fps={60}
        width={2160}
        height={3840}
        defaultProps={{}}
      />
    </>
  );
};
