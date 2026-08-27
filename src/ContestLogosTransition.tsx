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
import { fontFamily } from "./load-font";

export const ContestLogosTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Timeline markers relative to sequence start (6.8s to 16.5s, total ~9.7s = 582 frames)
  // 6.8s: ECPC starts (Frame 0)
  // 9.8s: ACPC starts (Frame 180 = 3.0s in)
  // 13.3s: ICPC starts (Frame 390 = 6.5s in)
  // 15.8s: Exit starts (Frame 540)

  const ecpcSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 160, mass: 0.5 },
  });

  const acpcSpring = spring({
    frame: Math.max(0, frame - 192),
    fps,
    config: { damping: 13, stiffness: 160, mass: 0.5 },
  });

  const icpcSpring = spring({
    frame: Math.max(0, frame - 414),
    fps,
    config: { damping: 13, stiffness: 160, mass: 0.5 },
  });

  // Smooth exit transition at the end of the explanation
  const exitProgress = interpolate(
    frame,
    [durationInFrames - 24, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const exitScale = interpolate(
    frame,
    [durationInFrames - 24, durationInFrames],
    [1, 0.9],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Layout positions over time:
  // Phase 1 (Frame 0-192): ECPC centered
  // Phase 2 (Frame 192-414): ECPC moves right, ACPC enters left
  // Phase 3 (Frame 414+): 3 cards side-by-side in RTL order: [ECPC 🇪🇬] -> [ACPC 🌍] -> [ICPC 🌐]
  const layoutPhase = interpolate(
    frame,
    [0, 192, 212, 414, 434],
    [0, 0, 1, 1, 2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Card X positions in 2160 width:
  // Phase 0: ECPC X = 780 (centered, width 600)
  // Phase 1: ECPC X = 1180, ACPC X = 380
  // Phase 2: ECPC X = 1440, ACPC X = 810, ICPC X = 180 (RTL flow: Egypt -> Arab/Africa -> World)
  const ecpcX = interpolate(layoutPhase, [0, 1, 2], [780, 1180, 1440]);
  const acpcX = interpolate(layoutPhase, [0, 1, 2], [780, 380, 810]);
  const icpcX = 180;

  // Card Y position (upper half of screen, chest/eye level above subtitles)
  const cardY = 1200;

  return (
    <AbsoluteFill
      style={{
        opacity: exitProgress,
        transform: `scale(${exitScale})`,
        transformOrigin: "center center",
        pointerEvents: "none",
      }}
    >
      {/* Sound effects for each logo entrance */}
      <Sequence from={0} durationInFrames={20}>
        <Audio src={staticFile("clean_pop.wav")} volume={0.18} />
      </Sequence>
      <Sequence from={192} durationInFrames={20}>
        <Audio src={staticFile("clean_pop.wav")} volume={0.18} />
      </Sequence>
      <Sequence from={414} durationInFrames={20}>
        <Audio src={staticFile("clean_pop.wav")} volume={0.18} />
      </Sequence>

      {/* --- 1. ECPC CARD (Level 1 - Egypt) --- */}
      <div
        style={{
          position: "absolute",
          left: ecpcX,
          top: cardY,
          width: 540,
          transform: `scale(${interpolate(ecpcSpring, [0, 1], [0.4, 1])})`,
          opacity: interpolate(ecpcSpring, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          }),
          background: "#FFFFFF",
          borderRadius: 32,
          padding: "24px 20px 28px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow:
            "0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.3)",
          border: "3px solid #3B82F6",
        }}
      >
        <div
          style={{
            width: "100%",
            height: 380,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderRadius: 16,
          }}
        >
          <Img
            src={staticFile("logo_ecpc.png")}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 16,
            background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
            color: "#FFFFFF",
            padding: "8px 24px",
            borderRadius: 20,
            fontFamily,
            fontSize: 32,
            fontWeight: 900,
            direction: "rtl",
            boxShadow: "0 4px 15px rgba(29, 78, 216, 0.4)",
          }}
        >
          مستوى مصر
        </div>
      </div>

      {/* Arrow 1: ECPC -> ACPC (visible in Phase 1 & 2) */}
      {frame >= 192 && (
        <div
          style={{
            position: "absolute",
            left: layoutPhase >= 2 ? 1365 : 960,
            top: cardY + 200,
            fontSize: 55,
            color: "#FFE600",
            fontWeight: 900,
            textShadow: "0 0 25px rgba(255, 230, 0, 0.8), 0 4px 15px black",
            transform: "scaleX(-1)", // RTL arrow pointing from right to left
            zIndex: 30,
          }}
        >
          ➔
        </div>
      )}

      {/* --- 2. ACPC CARD (Level 2 - Arab & Africa) --- */}
      {frame >= 192 && (
        <div
          style={{
            position: "absolute",
            left: acpcX,
            top: cardY,
            width: 540,
            transform: `scale(${interpolate(acpcSpring, [0, 1], [0.4, 1])})`,
            opacity: interpolate(acpcSpring, [0, 0.3], [0, 1], {
              extrapolateRight: "clamp",
            }),
            background: "#FFFFFF",
            borderRadius: 32,
            padding: "24px 20px 28px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow:
              "0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(245, 158, 11, 0.3)",
            border: "3px solid #F59E0B",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 380,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: 16,
            }}
          >
            <Img
              src={staticFile("logo_acpc.png")}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </div>
          <div
            style={{
              marginTop: 16,
              background: "linear-gradient(135deg, #D97706, #F59E0B)",
              color: "#FFFFFF",
              padding: "8px 24px",
              borderRadius: 20,
              fontFamily,
              fontSize: 32,
              fontWeight: 900,
              direction: "rtl",
              boxShadow: "0 4px 15px rgba(217, 119, 6, 0.4)",
            }}
          >
            العرب وأفريقيا
          </div>
        </div>
      )}

      {/* Arrow 2: ACPC -> ICPC (visible in Phase 2) */}
      {frame >= 414 && (
        <div
          style={{
            position: "absolute",
            left: 735,
            top: cardY + 200,
            fontSize: 55,
            color: "#FFE600",
            fontWeight: 900,
            textShadow: "0 0 25px rgba(255, 230, 0, 0.8), 0 4px 15px black",
            transform: "scaleX(-1)", // RTL arrow
            zIndex: 30,
          }}
        >
          ➔
        </div>
      )}

      {/* --- 3. ICPC CARD (Level 3 - World Finals) --- */}
      {frame >= 414 && (
        <div
          style={{
            position: "absolute",
            left: icpcX,
            top: cardY,
            width: 540,
            transform: `scale(${interpolate(icpcSpring, [0, 1], [0.4, 1])})`,
            opacity: interpolate(icpcSpring, [0, 0.3], [0, 1], {
              extrapolateRight: "clamp",
            }),
            background: "#FFFFFF",
            borderRadius: 32,
            padding: "24px 20px 28px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow:
              "0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(16, 185, 129, 0.4)",
            border: "3px solid #10B981",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 380,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: 16,
            }}
          >
            <Img
              src={staticFile("logo_icpc.png")}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </div>
          <div
            style={{
              marginTop: 16,
              background: "linear-gradient(135deg, #059669, #10B981)",
              color: "#FFFFFF",
              padding: "8px 24px",
              borderRadius: 20,
              fontFamily,
              fontSize: 32,
              fontWeight: 900,
              direction: "rtl",
              boxShadow: "0 4px 15px rgba(5, 150, 105, 0.4)",
            }}
          >
            بطولة العالم
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
