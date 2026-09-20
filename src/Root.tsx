import React from "react";
import { Composition } from "remotion";
import { CaptionedVideo } from "./CaptionedVideo";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        durationInFrames={13292}
        fps={60}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
