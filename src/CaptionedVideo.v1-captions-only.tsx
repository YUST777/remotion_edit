import React from "react";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig, Video } from "remotion";
import captions from "../public/captions.json";
import { TikTokCaption } from "./TikTokCaption";

export const CaptionedVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* 1. Underlying 4K vertical video */}
      <Video src={staticFile("video.mp4")} />

      {/* 2. Synced animated caption sequences */}
      {captions.map((caption, index) => {
        const from = Math.round((caption.startMs / 1000) * fps);
        const to = Math.round((caption.endMs / 1000) * fps);
        const durationInFrames = Math.max(1, to - from);

        return (
          <Sequence
            key={index}
            from={from}
            durationInFrames={durationInFrames}
            name={`Caption: ${caption.text.slice(0, 20)}...`}
          >
            <TikTokCaption
              text={caption.text}
              totalDurationMs={caption.endMs - caption.startMs}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
