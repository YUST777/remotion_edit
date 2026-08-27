import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "./load-font";

export const MashaProblemVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance and exit fade transitions
  const enterOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 24, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const overallOpacity = Math.min(enterOpacity, exitOpacity);

  // ----------------------------------------------------
  // Phase 1: Header (Problem K - Masha & Bear)
  // ----------------------------------------------------
  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.4 },
  });

  // ----------------------------------------------------
  // Phase 2: Girl & Market Shop (frame 180 to 510)
  // ----------------------------------------------------
  const girlSpring = spring({
    frame: Math.max(0, frame - 180),
    fps,
    config: { damping: 13, stiffness: 160, mass: 0.5 },
  });
  const walkBob = Math.sin(((frame - 180) / 60) * Math.PI * 4) * 16;

  // ----------------------------------------------------
  // Phase 3: Price Evolution Cards (Day 1 vs Day 2) (frame 510 to 870)
  // ----------------------------------------------------
  const day1Spring = spring({
    frame: Math.max(0, frame - 510),
    fps,
    config: { damping: 13, stiffness: 170, mass: 0.45 },
  });
  const arrowSpring = spring({
    frame: Math.max(0, frame - 550),
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.4 },
  });
  const day2Spring = spring({
    frame: Math.max(0, frame - 590),
    fps,
    config: { damping: 13, stiffness: 170, mass: 0.45 },
  });
  const formulaSpring = spring({
    frame: Math.max(0, frame - 630),
    fps,
    config: { damping: 13, stiffness: 160, mass: 0.45 },
  });

  // ----------------------------------------------------
  // Phase 4: Code Solution IDE Terminal (frame 870 to 1250)
  // ----------------------------------------------------
  const ideSpring = spring({
    frame: Math.max(0, frame - 870),
    fps,
    config: { damping: 15, stiffness: 150, mass: 0.5 },
  });

  return (
    <AbsoluteFill
      style={{
        opacity: overallOpacity,
        pointerEvents: "none",
        fontFamily,
      }}
    >
      {/* 1. Background Video (clean minimalist dot grid 1080x1920) */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("background.mp4")}
          pauseWhenBuffering
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Subtle bottom shadow to ensure subtitle text is 100% crystal legible */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 540,
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.55) 0%, transparent 100%)",
          }}
        />
      </AbsoluteFill>

      {/* Pop SFX cues */}
      {frame >= 180 && frame <= 200 && (
        <Sequence from={180} durationInFrames={18}>
          <Audio src={staticFile("clean_pop.wav")} volume={0.18} />
        </Sequence>
      )}
      {frame >= 510 && frame <= 530 && (
        <Sequence from={510} durationInFrames={18}>
          <Audio src={staticFile("clean_pop.wav")} volume={0.18} />
        </Sequence>
      )}
      {frame >= 590 && frame <= 610 && (
        <Sequence from={590} durationInFrames={18}>
          <Audio src={staticFile("clean_pop.wav")} volume={0.18} />
        </Sequence>
      )}
      {frame >= 870 && frame <= 890 && (
        <Sequence from={870} durationInFrames={18}>
          <Audio src={staticFile("clean_pop.wav")} volume={0.18} />
        </Sequence>
      )}

      {/* ----------------------------------------------------
          TOP HEADER: Codeforces Problem Pill + Title
          ---------------------------------------------------- */}
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-60, 0])}px)`,
          opacity: headerSpring,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(16px)",
            padding: "16px 36px",
            borderRadius: 999,
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.18)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Codeforces bars */}
          <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 26 }}>
            <div style={{ width: 6, height: 16, background: "#EAB308", borderRadius: 3 }} />
            <div style={{ width: 6, height: 26, background: "#3B82F6", borderRadius: 3 }} />
            <div style={{ width: 6, height: 20, background: "#EF4444", borderRadius: 3 }} />
          </div>
          <span
            style={{
              color: "#F8FAFC",
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 0.5,
            }}
          >
            Codeforces • Problem K: Masha and the Bear
          </span>
          <span
            style={{
              background: "#22C55E",
              color: "#FFFFFF",
              fontSize: 22,
              fontWeight: 900,
              padding: "6px 16px",
              borderRadius: 20,
            }}
          >
            ★ 800 Easy
          </span>
        </div>

        {/* Arabic Title */}
        <h2
          style={{
            marginTop: 20,
            fontSize: 54,
            fontWeight: 900,
            color: "#0F172A",
            textShadow: "0 2px 14px rgba(0,0,0,0.06)",
            direction: "rtl",
          }}
        >
          مسألة: ماشا والدب 👧🐻
        </h2>
      </div>

      {/* ----------------------------------------------------
          PHASE 2: The Girl (Masha) & The Market Storefront
          (Visible from frame 180 to 510) — Centered at Y: 580
          ---------------------------------------------------- */}
      {frame >= 180 && frame < 510 && (
        <div
          style={{
            position: "absolute",
            top: 580,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: interpolate(
              frame,
              [180, 205, 485, 510],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 40,
              width: 1020,
            }}
          >
            {/* Shop / Market Stall (Left) */}
            <div
              style={{
                width: 500,
                background: "#FFFFFF",
                borderRadius: 40,
                boxShadow: "0 35px 80px rgba(0, 0, 0, 0.16)",
                border: "3px solid #CBD5E1",
                overflow: "hidden",
                transform: `scale(${interpolate(girlSpring, [0, 1], [0.8, 1])})`,
              }}
            >
              {/* Striped Canopy Awning */}
              <div
                style={{
                  width: "100%",
                  height: 90,
                  background:
                    "repeating-linear-gradient(45deg, #EF4444, #EF4444 30px, #FFFFFF 30px, #FFFFFF 60px)",
                  borderBottom: "6px solid #DC2626",
                }}
              />
              <div style={{ padding: "36px 30px", textAlign: "center" }}>
                <div style={{ fontSize: 100 }}>🏪</div>
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 900,
                    color: "#1E293B",
                    marginTop: 14,
                    direction: "rtl",
                  }}
                >
                  محل شوكولاتة غريب! 🍫
                </div>
                <div
                  style={{
                    display: "inline-block",
                    marginTop: 20,
                    padding: "10px 28px",
                    background: "#FEF2F2",
                    color: "#DC2626",
                    borderRadius: 24,
                    fontSize: 28,
                    fontWeight: 900,
                    direction: "rtl",
                    border: "2px solid #FCA5A5",
                  }}
                >
                  الأسعار بتزيد كل يوم 10 جنيه! 📈
                </div>
              </div>
            </div>

            {/* Cartoon Girl (Masha) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: `translateY(${walkBob}px) scale(${interpolate(girlSpring, [0, 1], [0.75, 1])})`,
              }}
            >
              {/* Speech bubble */}
              <div
                style={{
                  background: "#0F172A",
                  color: "#FFFFFF",
                  padding: "14px 28px",
                  borderRadius: 24,
                  fontSize: 28,
                  fontWeight: 900,
                  marginBottom: 20,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
                  direction: "rtl",
                }}
              >
                بتموت في الشوكولاتة 🍫😋
              </div>

              {/* Minimalist Vector Girl SVG (Large & Expressive) */}
              <svg width="400" height="440" viewBox="0 0 220 260" fill="none">
                {/* Hair Back */}
                <ellipse cx="110" cy="95" rx="66" ry="72" fill="#D97706" />
                {/* Head / Face */}
                <circle cx="110" cy="100" r="50" fill="#FED7AA" />
                {/* Cheerful Eyes */}
                <circle cx="93" cy="96" r="7" fill="#1E293B" />
                <circle cx="127" cy="96" r="7" fill="#1E293B" />
                {/* Eye sparkle */}
                <circle cx="91" cy="94" r="2.5" fill="#FFFFFF" />
                <circle cx="125" cy="94" r="2.5" fill="#FFFFFF" />
                {/* Cute Smile */}
                <path
                  d="M 98 112 Q 110 125 122 112"
                  stroke="#1E293B"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {/* Pink Cheeks */}
                <ellipse cx="82" cy="108" rx="10" ry="5.5" fill="#FDA4AF" />
                <ellipse cx="138" cy="108" rx="10" ry="5.5" fill="#FDA4AF" />
                {/* Front Bangs */}
                <path
                  d="M 60 85 Q 110 58 160 85 Q 142 66 110 66 Q 78 66 60 85 Z"
                  fill="#B45309"
                />
                {/* Cute Headband / Ribbon */}
                <path
                  d="M 66 82 Q 110 52 154 82"
                  stroke="#EC4899"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <circle cx="152" cy="78" r="12" fill="#F43F5E" />
                {/* Dress / Body */}
                <path
                  d="M 84 144 L 64 220 L 156 220 L 136 144 Z"
                  fill="#EC4899"
                />
                {/* Apron / Belt */}
                <rect x="80" y="172" width="60" height="32" rx="6" fill="#FFFFFF" />
                <text
                  x="110"
                  y="195"
                  textAnchor="middle"
                  fontSize="22"
                  fill="#EC4899"
                  fontWeight="900"
                >
                  M
                </text>
                {/* Legs */}
                <rect x="90" y="220" width="14" height="34" rx="7" fill="#FED7AA" />
                <rect x="116" y="220" width="14" height="34" rx="7" fill="#FED7AA" />
                {/* Shoes */}
                <ellipse cx="94" cy="254" rx="16" ry="9" fill="#BE185D" />
                <ellipse cx="126" cy="254" rx="16" ry="9" fill="#BE185D" />
                {/* Arm holding chocolate bar */}
                <path
                  d="M 82 155 Q 60 170 76 192"
                  stroke="#FED7AA"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                {/* Chocolate bar */}
                <rect
                  x="50"
                  y="178"
                  width="40"
                  height="54"
                  rx="6"
                  fill="#78350F"
                  transform="rotate(-15 50 178)"
                />
                <rect
                  x="50"
                  y="204"
                  width="40"
                  height="28"
                  rx="3"
                  fill="#D97706"
                  transform="rotate(-15 50 204)"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          PHASE 3: Price Evolution Cards (Day 1 vs Day 2)
          (Visible from frame 510 to 870) — Centered at Y: 560
          ---------------------------------------------------- */}
      {frame >= 510 && frame < 870 && (
        <div
          style={{
            position: "absolute",
            top: 560,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: interpolate(
              frame,
              [510, 530, 840, 865],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
          }}
        >
          {/* Day 1 and Day 2 comparison cards */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 28,
              width: 1040,
              direction: "rtl",
            }}
          >
            {/* Card 1: Day 1 Price */}
            <div
              style={{
                flex: "0 0 370px",
                background: "#FFFFFF",
                borderRadius: 36,
                padding: "36px 24px",
                boxShadow: "0 35px 80px rgba(59, 130, 246, 0.22)",
                border: "5px solid #3B82F6",
                textAlign: "center",
                transform: `scale(${interpolate(day1Spring, [0, 1], [0.7, 1])})`,
              }}
            >
              <div style={{ fontSize: 36, fontWeight: 900, color: "#2563EB" }}>
                🗓️ اليوم الأول
              </div>
              <div style={{ fontSize: 100, margin: "20px 0" }}>🍫</div>
              <div style={{ fontSize: 80, fontWeight: 900, color: "#0F172A" }}>
                1 <span style={{ fontSize: 36, color: "#64748B" }}>جنيه</span>
              </div>
            </div>

            {/* Plus 10 EGP Arrow */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: "0 0 240px",
                transform: `scale(${interpolate(arrowSpring, [0, 1], [0.5, 1])})`,
              }}
            >
              <div
                style={{
                  background: "#22C55E",
                  color: "#FFFFFF",
                  padding: "16px 24px",
                  borderRadius: 26,
                  fontSize: 28,
                  fontWeight: 900,
                  boxShadow: "0 14px 40px rgba(34, 197, 94, 0.5)",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                + 10 جنيه كل يوم 📈
              </div>
              <div
                style={{
                  fontSize: 60,
                  color: "#22C55E",
                  fontWeight: 900,
                  marginTop: 10,
                }}
              >
                ➔
              </div>
            </div>

            {/* Card 2: Day 2 Price */}
            <div
              style={{
                flex: "0 0 370px",
                background: "#FFFFFF",
                borderRadius: 36,
                padding: "36px 24px",
                boxShadow: "0 35px 80px rgba(239, 68, 68, 0.22)",
                border: "5px solid #EF4444",
                textAlign: "center",
                transform: `scale(${interpolate(day2Spring, [0, 1], [0.7, 1])})`,
              }}
            >
              <div style={{ fontSize: 36, fontWeight: 900, color: "#DC2626" }}>
                🗓️ اليوم الثاني
              </div>
              <div style={{ fontSize: 100, margin: "20px 0" }}>🍫🍫</div>
              <div style={{ fontSize: 80, fontWeight: 900, color: "#0F172A" }}>
                11 <span style={{ fontSize: 36, color: "#64748B" }}>جنيه</span>
              </div>
            </div>
          </div>

          {/* Mathematical progression badge */}
          <div
            style={{
              marginTop: 48,
              background: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(16px)",
              borderRadius: 32,
              padding: "24px 50px",
              display: "flex",
              alignItems: "center",
              gap: 24,
              boxShadow: "0 22px 50px rgba(0, 0, 0, 0.25)",
              transform: `scale(${interpolate(formulaSpring, [0, 1], [0.8, 1])})`,
              opacity: formulaSpring,
            }}
          >
            <span style={{ fontSize: 38, color: "#FDE047" }}>💡 فكرة الكود:</span>
            <span
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#FFFFFF",
                fontFamily: "monospace",
                direction: "ltr",
              }}
            >
              Price(Day) = 1 + (Day - 1) × 10
            </span>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          PHASE 4: Codeforces IDE / Solution Terminal
          "اعملهالي كود!" (Visible from frame 870 to end) — Centered at Y: 500
          ---------------------------------------------------- */}
      {frame >= 870 && (
        <div
          style={{
            position: "absolute",
            top: 500,
            left: 45,
            right: 45,
            transform: `translateY(${interpolate(ideSpring, [0, 1], [120, 0])}px) scale(${interpolate(ideSpring, [0, 1], [0.9, 1])})`,
            opacity: ideSpring,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Main IDE Window */}
          <div
            style={{
              width: "100%",
              background: "#0F172A",
              borderRadius: 36,
              boxShadow:
                "0 40px 90px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.15)",
              overflow: "hidden",
            }}
          >
            {/* Terminal Window Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "24px 34px",
                background: "#1E293B",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {/* Traffic Lights */}
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#EF4444" }} />
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#F59E0B" }} />
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#10B981" }} />
              </div>
              {/* Active Tab */}
              <div
                style={{
                  color: "#E2E8F0",
                  fontSize: 26,
                  fontWeight: 800,
                  fontFamily: "monospace",
                }}
              >
                solution.cpp — C++20
              </div>
              <div
                style={{
                  background: "rgba(34, 197, 94, 0.2)",
                  color: "#4ADE80",
                  padding: "8px 20px",
                  borderRadius: 20,
                  fontSize: 22,
                  fontWeight: 900,
                }}
              >
                Accepted ✔️ 15ms
              </div>
            </div>

            {/* Code Body with syntax highlighting */}
            <div
              style={{
                padding: "44px 50px",
                fontFamily: "Consolas, 'Fira Code', Monaco, monospace",
                fontSize: 34,
                lineHeight: 1.75,
                color: "#E2E8F0",
                textAlign: "left",
              }}
            >
              <div>
                <span style={{ color: "#64748B" }}>// Problem K: Solved X, Target Y -&gt; Ans: Y - X</span>
              </div>
              <div style={{ marginTop: 14 }}>
                <span style={{ color: "#93C5FD" }}>#include</span>{" "}
                <span style={{ color: "#FDE047" }}>&lt;iostream&gt;</span>
              </div>
              <div>
                <span style={{ color: "#F472B6" }}>using namespace</span> std;
              </div>
              <div style={{ marginTop: 18 }}>
                <span style={{ color: "#60A5FA" }}>int</span>{" "}
                <span style={{ color: "#34D399" }}>main</span>() {"{"}
              </div>
              <div style={{ paddingLeft: 42 }}>
                <span style={{ color: "#60A5FA" }}>long long</span> X, Y;
              </div>
              <div style={{ paddingLeft: 42 }}>
                cin &gt;&gt; X &gt;&gt; Y;
              </div>
              <div style={{ paddingLeft: 42, marginTop: 14 }}>
                <span style={{ color: "#64748B" }}>// اعملهالي كود! الفرق بين المطلوب والحالي</span>
              </div>
              <div style={{ paddingLeft: 42 }}>
                <span style={{ color: "#60A5FA" }}>long long</span> ans = Y - X;
              </div>
              <div style={{ paddingLeft: 42 }}>
                cout &lt;&lt; ans &lt;&lt; <span style={{ color: "#FDE047" }}>"\\n"</span>;
              </div>
              <div>{"}"}</div>
            </div>
          </div>

          {/* Test Case Callout Box */}
          <div
            style={{
              marginTop: 30,
              width: "100%",
              background: "#FFFFFF",
              borderRadius: 30,
              padding: "26px 40px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 22px 55px rgba(0,0,0,0.14)",
              border: "3px solid #CBD5E1",
              fontFamily: "monospace",
              direction: "ltr",
            }}
          >
            <div>
              <span style={{ color: "#64748B", fontSize: 26, fontWeight: 700 }}>Input: </span>
              <span style={{ color: "#0F172A", fontSize: 36, fontWeight: 900 }}>7 13</span>
            </div>
            <div style={{ fontSize: 40, color: "#22C55E", fontWeight: 900 }}>➔</div>
            <div>
              <span style={{ color: "#64748B", fontSize: 26, fontWeight: 700 }}>Output: </span>
              <span style={{ color: "#16A34A", fontSize: 38, fontWeight: 900 }}>6 (13 - 7)</span>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
