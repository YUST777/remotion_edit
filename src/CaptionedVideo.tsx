import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import captions from "../public/captions.json";
import { ContestLogosTransition } from "./ContestLogosTransition";
import { PolaroidCollage } from "./PolaroidCollage";
import { TikTokCaption } from "./TikTokCaption";

export const CaptionedVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* 1. Underlying video rendered via OffthreadVideo (frame-accurate, zero glitches/stutter) */}
      <OffthreadVideo src={staticFile("video.mp4")} pauseWhenBuffering />

      {/* 2. Official Logos Roadmap Transition (ECPC -> ACPC -> ICPC) from 6.94s to 15.8s */}
      <Sequence
        from={Math.round(6.94 * fps)}
        durationInFrames={Math.round(8.9 * fps)}
        name="Contest Logos Transition (ECPC -> ACPC -> ICPC)"
      >
        <ContestLogosTransition />
      </Sequence>

      {/* 2. 16 Teams Polaroid Photo Collage Sequence (starts at ~70.8s, completely disappears before 76.5s for the QR code) */}
      <Sequence
        from={Math.round(70.8 * fps)}
        durationInFrames={Math.round(5.5 * fps)}
        name="16 Teams Polaroid Collage"
      >
        <PolaroidCollage />
      </Sequence>

      {/* 3. Synced animated caption sequences (rendered on top) */}
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
