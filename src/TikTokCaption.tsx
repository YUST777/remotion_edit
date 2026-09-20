import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./load-font";

// Belly Brand Palette
const ACTIVE_WORD_COLOR = "#FB7600"; // belly darkorange (vibrant punchy orange)
const INACTIVE_WORD_COLOR = "#F8F0E8"; // belly linen (warm crisp off-white)
const PAST_WORD_COLOR = "#F0D8B8"; // belly bisque (soft warm cream)
const STROKE_COLOR = "#2B221F"; // belly black (deep warm shadow stroke)

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

  // Group consecutive Latin/English words so phrases like "AI agent" or "3D modeling in Blender"
  // always flow Left-to-Right inside the Arabic sentence.
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
  const containerY = interpolate(enterSpring, [0, 1], [8, 0]);

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
    const wordTranslateY = isActive ? interpolate(wordPop, [0, 1], [0, -4]) : 0;

    let color = INACTIVE_WORD_COLOR;
    let opacity = 1;

    if (isActive) {
      color = ACTIVE_WORD_COLOR;
    } else if (isPast) {
      color = PAST_WORD_COLOR;
      opacity = 0.92;
    } else {
      color = INACTIVE_WORD_COLOR;
      opacity = 0.85;
    }

    return (
      <span
        key={`${token.text}-${globalIndex}`}
        style={{
          display: "inline-block",
          margin: "0 8px",
          transform: `scale(${wordScale}) translateY(${wordTranslateY}px)`,
          transformOrigin: "center bottom",
          fontFamily,
          fontSize: 56,
          fontWeight: 900,
          lineHeight: 1.35,
          color,
          opacity,
          WebkitTextStroke: `7px ${STROKE_COLOR}`,
          paintOrder: "stroke fill",
          textShadow: isActive
            ? "0 0 20px rgba(251, 118, 0, 0.7), 0 4px 16px rgba(43, 34, 31, 0.95)"
            : "0 3px 14px rgba(43, 34, 31, 0.95)",
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
        paddingBottom: 65,
        direction: "rtl",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity: containerOpacity,
          transform: `translateY(${containerY}px)`,
          maxWidth: 1550,
          textAlign: "center",
          direction: "rtl",
          padding: "12px 28px",
          textShadow: "0 3px 16px rgba(43, 34, 31, 0.95)",
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
                  gap: 12,
                  margin: "0 8px",
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
