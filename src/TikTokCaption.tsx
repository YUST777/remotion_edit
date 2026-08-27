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

      return {
        text: word,
        startMs,
        endMs,
      };
    });
  }, [text, totalDurationMs, sequenceStartMs, words]);

  // Group consecutive Latin/English words into LTR clusters so phrases like "Problem Solving"
  // and "ICPC HUE" preserve their natural Left-to-Right order inside RTL flexbox.
  const isLatinToken = (text: string) => {
    return !/[\u0600-\u06FF]/.test(text) && /[A-Za-z0-9]/.test(text);
  };

  interface TokenChunk {
    isLatin: boolean;
    tokens: WordToken[];
  }

  const chunks = useMemo<TokenChunk[]>(() => {
    const result: TokenChunk[] = [];
    for (const token of tokens) {
      const isLatin = isLatinToken(token.text);
      const lastChunk = result[result.length - 1];
      if (lastChunk && lastChunk.isLatin && isLatin) {
        // Group consecutive Latin words together into one LTR chunk
        lastChunk.tokens.push(token);
      } else {
        result.push({
          isLatin,
          tokens: [token],
        });
      }
    }
    return result;
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
  const containerY = interpolate(enterSpring, [0, 1], [15, 0]);

  const renderWord = (token: WordToken, globalIndex: number) => {
    const isActive = timeInMs >= token.startMs && timeInMs < token.endMs;
    const isPast = timeInMs >= token.endMs;

    // Word-level micro-spring for interactive tactile feel
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

    // Elegant, subtle scale (1.08x instead of cartoonish 1.2x)
    const wordScale = isActive ? interpolate(wordPop, [0, 1], [1.0, 1.08]) : 1.0;
    const wordTranslateY = isActive ? interpolate(wordPop, [0, 1], [0, -6]) : 0;

    // Clean minimalist color hierarchy
    let color = INACTIVE_WORD_COLOR;
    let opacity = 1;

    if (isActive) {
      color = ACTIVE_WORD_COLOR;
      opacity = 1;
    } else if (isPast) {
      color = PAST_WORD_COLOR;
      opacity = 0.92;
    } else {
      color = INACTIVE_WORD_COLOR;
      opacity = 0.8;
    }

    return (
      <span
        key={`${token.text}-${globalIndex}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${wordScale}) translateY(${wordTranslateY}px)`,
          transformOrigin: "center bottom",
          fontFamily,
          fontSize: 110,
          fontWeight: 900,
          lineHeight: 1.35,
          color,
          opacity,
          WebkitTextStroke: "12px #000000",
          paintOrder: "stroke fill",
          textShadow: isActive
            ? "0 0 24px rgba(253, 224, 71, 0.6), 0 4px 20px rgba(0, 0, 0, 0.95)"
            : "0 4px 20px rgba(0, 0, 0, 0.95)",
          unicodeBidi: "isolate",
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
          maxWidth: 1900,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          direction: "rtl",
          padding: "16px 36px",
          gap: "16px 32px",
          // Minimalist: Clean, floating aesthetic without heavy bounding boxes
          textShadow: "0 4px 24px rgba(0, 0, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.9)",
        }}
      >
        {chunks.map((chunk, chunkIdx) => {
          if (chunk.isLatin) {
            // Consecutive Latin/English words: MUST flow Left-to-Right
            return (
              <span
                key={`latin-chunk-${chunkIdx}`}
                style={{
                  display: "inline-flex",
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  gap: 32,
                  unicodeBidi: "isolate",
                }}
              >
                {chunk.tokens.map((token, i) =>
                  renderWord(token, chunkIdx * 100 + i)
                )}
              </span>
            );
          }

          // Arabic / single token
          return chunk.tokens.map((token, i) =>
            renderWord(token, chunkIdx * 100 + i)
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
