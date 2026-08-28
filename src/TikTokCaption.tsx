import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./load-font";

// Minimalist, elegant aesthetic colors
const ACTIVE_WORD_COLOR = "#FDE047"; // Clean, warm aesthetic yellow (Tailwind Yellow-300)
const INACTIVE_WORD_COLOR = "#FFFFFF";
const PAST_WORD_COLOR = "rgba(255, 255, 255, 0.85)";

interface WordToken {
  text: string;
  startMs: number;
  endMs: number;
}

export const TikTokCaption: React.FC<{
  text: string;
  totalDurationMs: number;
  sequenceStartMs?: number;
  words?: Array<{ text: string; startMs: number; endMs: number }>;
}> = ({ text, totalDurationMs, sequenceStartMs = 0, words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  // Use exact millisecond word timestamps when provided, otherwise proportional fallback
  const tokens = useMemo<WordToken[]>(() => {
    if (words && words.length > 0) {
      return words.map((w) => ({
        text: w.text,
        startMs: Math.max(0, w.startMs - sequenceStartMs),
        endMs: Math.max(0, w.endMs - sequenceStartMs),
      }));
    }

    const rawWords = text.trim().split(/\s+/).filter(Boolean);
    const wordDuration = totalDurationMs / Math.max(1, rawWords.length);
    return rawWords.map((word, i) => ({
      text: word,
      startMs: i * wordDuration,
      endMs: (i + 1) * wordDuration,
    }));
  }, [text, totalDurationMs, sequenceStartMs, words]);

  // Group consecutive Latin/English words so phrases like "Problem Solving" or "C++, Python, Java"
  // always flow left-to-right inside the Arabic sentence.
  const isLatinToken = (t: string) => !/[\u0600-\u06FF]/.test(t) && /[A-Za-z0-9]/.test(t);

  interface Chunk {
    isLatin: boolean;
    tokens: WordToken[];
  }

  const chunks = useMemo<Chunk[]>(() => {
    const res: Chunk[] = [];
    for (const token of tokens) {
      const isLat = isLatinToken(token.text);
      const last = res[res.length - 1];
      if (last && last.isLatin && isLat) {
        last.tokens.push(token);
      } else {
        res.push({ isLatin: isLat, tokens: [token] });
      }
    }
    return res;
  }, [tokens]);

  // Subtle, elegant sentence fade-in and micro-lift
  const enterSpring = spring({
    frame,
    fps,
    config: {
      damping: 18,
      stiffness: 160,
      mass: 0.4,
    },
    durationInFrames: 8,
  });

  const containerOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const containerY = interpolate(enterSpring, [0, 1], [12, 0]);

  const renderWord = (token: WordToken, globalIndex: number) => {
    const isActive = timeInMs >= token.startMs && timeInMs < token.endMs;
    const isPast = timeInMs >= token.endMs;

    const activeProgressMs = Math.max(0, timeInMs - token.startMs);
    const activeFrame = (activeProgressMs / 1000) * fps;

    const wordPop = spring({
      frame: activeFrame,
      fps,
      config: {
        damping: 14,
        stiffness: 220,
        mass: 0.35,
      },
    });

    const wordScale = isActive ? interpolate(wordPop, [0, 1], [1.0, 1.08]) : 1.0;
    const wordTranslateY = isActive ? interpolate(wordPop, [0, 1], [0, -6]) : 0;

    let color = INACTIVE_WORD_COLOR;
    let opacity = 1;

    if (isActive) {
      color = ACTIVE_WORD_COLOR;
    } else if (isPast) {
      color = PAST_WORD_COLOR;
      opacity = 0.8;
    } else {
      color = INACTIVE_WORD_COLOR;
      opacity = 0.8;
    }

    return (
      <span
        key={`${token.text}-${globalIndex}`}
        style={{
          display: "inline-block",
          margin: "0 14px",
          transform: `scale(${wordScale}) translateY(${wordTranslateY}px)`,
          transformOrigin: "center bottom",
          fontFamily,
          fontSize: 96,
          fontWeight: 900,
          lineHeight: 1.35,
          color,
          opacity,
          WebkitTextStroke: "12px #000000",
          paintOrder: "stroke fill",
          textShadow: isActive
            ? "0 0 24px rgba(253, 224, 71, 0.6), 0 4px 20px rgba(0, 0, 0, 0.95)"
            : "0 4px 20px rgba(0, 0, 0, 0.95)",
          transition: "color 0.1s ease, opacity 0.1s ease",
        }}
      >
        {token.text}
      </span>
    );
  };

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 720,
        direction: "rtl",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity: containerOpacity,
          transform: `translateY(${containerY}px)`,
          maxWidth: 960,
          textAlign: "center",
          direction: "rtl",
          padding: "16px 24px",
          textShadow: "0 4px 24px rgba(0, 0, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.9)",
          lineHeight: 1.35,
        }}
      >
        {chunks.map((chunk, chunkIdx) => {
          if (chunk.isLatin) {
            return (
              <span
                key={`latin-chunk-${chunkIdx}`}
                style={{
                  display: "inline-flex",
                  direction: "ltr",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 20,
                  margin: "0 14px",
                  unicodeBidi: "isolate",
                }}
              >
                {chunk.tokens.map((token, i) =>
                  renderWord(token, chunkIdx * 100 + i)
                )}
              </span>
            );
          }

          return chunk.tokens.map((token, i) =>
            renderWord(token, chunkIdx * 100 + i)
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
