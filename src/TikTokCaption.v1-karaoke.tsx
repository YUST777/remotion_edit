import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./load-font";

const ACTIVE_COLOR = "#FFE600";  // Ultra-vibrant TikTok Yellow
const KEYWORD_COLOR = "#00F7FF"; // Luminous Cyan for tech words
const INACTIVE_COLOR = "#FFFFFF";

const KEYWORDS = [
  "ECPC",
  "ACPC",
  "ICPC",
  "ICPC HUE",
  "Problem Solving",
  "C++",
  "Python",
  "Java",
  "Community",
  "Interview",
  "Database",
  "ماشا والدب",
  "حورس",
  "دمياط"
];

interface WordToken {
  text: string;
  cleanText: string;
  startMs: number;
  endMs: number;
  isKeyword: boolean;
}

export const TikTokCaption: React.FC<{
  text: string;
  totalDurationMs: number;
}> = ({ text, totalDurationMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  // 1. Calculate character-weighted word intervals for realistic audio speech sync
  const tokens = useMemo<WordToken[]>(() => {
    const rawWords = text.trim().split(/\s+/);
    if (rawWords.length === 0) return [];

    const weights = rawWords.map((w) => Math.max(2, w.length));
    const totalWeight = weights.reduce((acc, curr) => acc + curr, 0);

    let currentStart = 0;
    return rawWords.map((word, i) => {
      const wordDuration = (weights[i] / totalWeight) * totalDurationMs;
      const startMs = currentStart;
      const endMs = currentStart + wordDuration;
      currentStart = endMs;

      const clean = word.replace(/[؟?.,!:"]/g, "");
      const isKeyword = KEYWORDS.some((kw) =>
        clean.toLowerCase().includes(kw.toLowerCase())
      );

      return {
        text: word,
        cleanText: clean,
        startMs,
        endMs,
        isKeyword,
      };
    });
  }, [text, totalDurationMs]);

  // Overall sentence container spring entrance
  const enterSpring = spring({
    frame,
    fps,
    config: {
      damping: 14,
      stiffness: 180,
      mass: 0.5,
    },
    durationInFrames: 10,
  });
  const containerScale = interpolate(enterSpring, [0, 1], [0.88, 1]);
  const containerY = interpolate(enterSpring, [0, 1], [25, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 700,
        direction: "rtl",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          transform: `scale(${containerScale}) translateY(${containerY}px)`,
          maxWidth: 1950,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          direction: "rtl",
          padding: "26px 52px",
          background: "rgba(10, 12, 18, 0.62)",
          borderRadius: 48,
          backdropFilter: "blur(16px)",
          border: "3px solid rgba(255, 255, 255, 0.22)",
          boxShadow: "0 25px 80px rgba(0, 0, 0, 0.85), inset 0 1px 2px rgba(255, 255, 255, 0.2)",
          gap: "12px 18px",
        }}
      >
        {tokens.map((token, i) => {
          const isActive = timeInMs >= token.startMs && timeInMs < token.endMs;
          const isPast = timeInMs >= token.endMs;

          // Word-level pop animation when active
          const activeProgressMs = Math.max(0, timeInMs - token.startMs);
          const activeFrame = (activeProgressMs / 1000) * fps;
          
          const wordPop = spring({
            frame: activeFrame,
            fps,
            config: {
              damping: 10,
              stiffness: 240,
              mass: 0.4,
            },
          });

          const wordScale = isActive ? interpolate(wordPop, [0, 1], [1.0, 1.18]) : 1.0;
          const wordTranslateY = isActive ? interpolate(wordPop, [0, 1], [0, -10]) : 0;

          // Colors
          let color = INACTIVE_COLOR;
          if (isActive) {
            color = ACTIVE_COLOR;
          } else if (token.isKeyword) {
            color = KEYWORD_COLOR;
          }

          // Active glow
          const activeGlow = isActive
            ? "0 0 35px rgba(255, 230, 0, 0.9), 0 0 15px #FFE600, 0 10px 40px rgba(0, 0, 0, 0.95)"
            : "0 10px 40px rgba(0, 0, 0, 0.95)";

          return (
            <span
              key={`${token.text}-${i}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${wordScale}) translateY(${wordTranslateY}px)`,
                transformOrigin: "center bottom",
                fontFamily,
                fontSize: 112,
                fontWeight: 900,
                lineHeight: 1.35,
                color,
                WebkitTextStroke: isActive ? "16px #000000" : "14px #000000",
                paintOrder: "stroke fill",
                textShadow: activeGlow,
                padding: "2px 8px",
                borderRadius: 20,
                backgroundColor: isActive ? "rgba(255, 230, 0, 0.16)" : "transparent",
                border: isActive ? "2px solid rgba(255, 230, 0, 0.4)" : "2px solid transparent",
                transition: "background-color 0.1s ease, border 0.1s ease",
                unicodeBidi: "isolate",
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
