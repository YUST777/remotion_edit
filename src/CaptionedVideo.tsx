import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import captions from "../public/captions.json";
import { TikTokCaption } from "./TikTokCaption";

export const CaptionedVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* 1. Underlying video */}
      <OffthreadVideo
        src={staticFile("video.mp4")}
        pauseWhenBuffering
      />

      {/* 2. Synced animated caption sequences only */}
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
              sequenceStartMs={caption.startMs}
              words={(caption as any).words}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

