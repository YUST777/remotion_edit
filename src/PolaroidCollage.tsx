import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const TEAM_PHOTOS = [
  "FB_IMG_1787255507972.jpg",
  "FB_IMG_1787255520182.jpg",
  "FB_IMG_1787255521870.jpg",
  "FB_IMG_1787255523676.jpg",
  "FB_IMG_1787255525505.jpg",
  "FB_IMG_1787255526885.jpg",
  "FB_IMG_1787255528811.jpg",
  "FB_IMG_1787255530522.jpg",
  "FB_IMG_1787255532232.jpg",
  "FB_IMG_1787255533904.jpg",
  "FB_IMG_1787255535768.jpg",
  "FB_IMG_1787255537505.jpg",
  "FB_IMG_1787255546583.jpg",
  "FB_IMG_1787255548494.jpg",
  "FB_IMG_1787255550024.jpg",
  "FB_IMG_1787255724546.jpg",
];

// Curated organic scatter layout keeping Y > 2500 clear for subtitles
const SCATTER_LAYOUT = [
  { x: 120,  y: 420,  rot: -11, scale: 1.02 },
  { x: 1100, y: 380,  rot: 9,   scale: 0.98 },
  { x: 550,  y: 680,  rot: -5,  scale: 1.05 },
  { x: 80,   y: 980,  rot: 13,  scale: 0.96 },
  { x: 1150, y: 920,  rot: -14, scale: 1.03 },
  { x: 620,  y: 1240, rot: 7,   scale: 1.06 },
  { x: 140,  y: 1540, rot: -8,  scale: 1.00 },
  { x: 1120, y: 1480, rot: 12,  scale: 0.97 },
  { x: 420,  y: 1780, rot: -13, scale: 1.04 },
  { x: 920,  y: 1820, rot: 6,   scale: 1.01 },
  { x: 260,  y: 620,  rot: 10,  scale: 0.99 },
  { x: 880,  y: 720,  rot: -12, scale: 1.02 },
  { x: 380,  y: 1120, rot: -7,  scale: 1.03 },
  { x: 980,  y: 1200, rot: 11,  scale: 0.98 },
  { x: 180,  y: 2020, rot: 8,   scale: 1.02 },
  { x: 980,  y: 2060, rot: -10, scale: 1.05 },
];

// Stagger 12 frames (200ms) gives exactly 16 distinct crisp pops
const STAGGER_FRAMES = 12;

export const PolaroidCollage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Smooth exit fade-out in the last 20 frames
  const exitProgress = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const exitScale = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0.92],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        opacity: exitProgress,
        transform: `scale(${exitScale})`,
        transformOrigin: "center center",
        pointerEvents: "none",
      }}
    >
      {/* Pop sound effect triggers for EVERY SINGLE ONE of the 16 photos */}
      {TEAM_PHOTOS.map((_, i) => {
        const delay = i * STAGGER_FRAMES;
        return (
          <Sequence key={`sfx-${i}`} from={delay} durationInFrames={18}>
            <Audio
              src={staticFile("clean_pop.wav")}
              volume={0.18}
            />
          </Sequence>
        );
      })}

      {/* 16 Polaroid Photos Staggered Drop */}
      {TEAM_PHOTOS.map((filename, i) => {
        const delay = i * STAGGER_FRAMES;
        const photoFrame = Math.max(0, frame - delay);

        const dropSpring = spring({
          frame: photoFrame,
          fps,
          config: {
            damping: 12,
            stiffness: 170,
            mass: 0.5,
          },
        });

        // Don't render until delay is reached
        if (frame < delay) return null;

        const layout = SCATTER_LAYOUT[i % SCATTER_LAYOUT.length];

        const currentScale = interpolate(
          dropSpring,
          [0, 1],
          [1.5, layout.scale]
        );
        const currentY = interpolate(
          dropSpring,
          [0, 1],
          [layout.y - 160, layout.y]
        );
        const currentRot = interpolate(
          dropSpring,
          [0, 1],
          [layout.rot * 1.6, layout.rot]
        );
        const opacity = interpolate(dropSpring, [0, 0.3], [0, 1], {
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={filename}
            style={{
              position: "absolute",
              left: layout.x,
              top: currentY,
              transform: `rotate(${currentRot}deg) scale(${currentScale})`,
              transformOrigin: "center center",
              opacity,
              zIndex: i + 10,
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
              // Clean, GPU-accelerated Polaroid drop shadow
              background: "#FFFFFF",
              padding: "24px 24px 76px 24px",
              borderRadius: "14px",
              boxShadow: "0 18px 45px rgba(0, 0, 0, 0.55)",
              border: "1px solid rgba(0, 0, 0, 0.12)",
              width: 820,
            }}
          >
            {/* Team photo */}
            <div
              style={{
                width: "100%",
                height: 520,
                overflow: "hidden",
                borderRadius: "4px",
                background: "#111",
              }}
            >
              <Img
                src={staticFile(`teams/${filename}`)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* TEAM # • ECPC QUALIFICATIONS */}
            <div
              style={{
                marginTop: 20,
                textAlign: "center",
                fontFamily: "Arial, 'Trebuchet MS', sans-serif",
                fontSize: 28,
                fontWeight: 900,
                color: "#2D3748",
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              TEAM #{i + 1} • ECPC QUALIFICATIONS
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
