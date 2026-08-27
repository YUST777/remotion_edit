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
    config: { damping: 13, stiffness: 150, mass: 0.5 },
  });
  const shopkeeperBounce = Math.sin(((frame - 180) / 60) * Math.PI * 3) * 14;
  const walkBob = Math.sin(((frame - 180) / 60) * Math.PI * 4) * 32;

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
      {/* 1. Background Video (clean minimalist dot grid 2160x3840) */}
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
            height: 1100,
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%)",
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
          TOP HEADER: Codeforces Problem Pill + Title (2160 coords)
          ---------------------------------------------------- */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-100, 0])}px)`,
          opacity: headerSpring,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(24px)",
            padding: "28px 68px",
            borderRadius: 999,
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.22)",
            border: "2px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Codeforces bars */}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 48 }}>
            <div style={{ width: 12, height: 30, background: "#EAB308", borderRadius: 6 }} />
            <div style={{ width: 12, height: 48, background: "#3B82F6", borderRadius: 6 }} />
            <div style={{ width: 12, height: 38, background: "#EF4444", borderRadius: 6 }} />
          </div>
          <span
            style={{
              color: "#F8FAFC",
              fontSize: 54,
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
              fontSize: 40,
              fontWeight: 900,
              padding: "10px 30px",
              borderRadius: 30,
            }}
          >
            ★ 800 Easy
          </span>
        </div>

        {/* Arabic Title */}
        <h2
          style={{
            marginTop: 32,
            fontSize: 104,
            fontWeight: 900,
            color: "#0F172A",
            textShadow: "0 4px 20px rgba(0,0,0,0.08)",
            direction: "rtl",
          }}
        >
          مسألة: ماشا والدب 👧🐻
        </h2>
      </div>

      {/* ----------------------------------------------------
          PHASE 2: The Girl (Masha) & The Market Storefront
          (Visible from frame 180 to 510) — Native 2160x3840 High-Resolution
          ---------------------------------------------------- */}
      {frame >= 180 && frame < 510 && (
        <div
          style={{
            position: "absolute",
            top: 960,
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
              alignItems: "flex-end",
              gap: 40,
              width: 2040,
              transform: `scale(${interpolate(girlSpring, [0, 1], [0.8, 1])})`,
            }}
          >
            {/* The Creative Candy & Chocolate Shop (Left side) */}
            <div
              style={{
                position: "relative",
                width: 1000,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Message Bubble above the shop: "الأسعار بتزيد 10 ج كل يوم! 📈🤯" */}
              <div
                style={{
                  position: "relative",
                  background: "#DC2626",
                  color: "#FFFFFF",
                  padding: "32px 64px",
                  borderRadius: 52,
                  fontSize: 58,
                  fontWeight: 900,
                  boxShadow: "0 28px 70px rgba(220, 38, 38, 0.45)",
                  direction: "rtl",
                  textAlign: "center",
                  marginBottom: 32,
                  border: "6px solid #FFFFFF",
                  whiteSpace: "nowrap",
                }}
              >
                الأسعار بتزيد 10 ج كل يوم! 📈🤯
                {/* Speech bubble tail pointing down */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -28,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "28px solid transparent",
                    borderRight: "28px solid transparent",
                    borderTop: "30px solid #DC2626",
                  }}
                />
              </div>

              {/* Creative Vector Storefront SVG (Large 1000x1050) */}
              <svg width="1000" height="1050" viewBox="0 0 440 430" fill="none">
                {/* Shop Building Wall */}
                <rect x="25" y="110" width="390" height="310" rx="28" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="6" />

                {/* Striped 3D Canopy Awning */}
                <g>
                  <path d="M 15 115 L 50 40 L 390 40 L 425 115 Z" fill="#EF4444" />
                  <path d="M 60 115 L 85 40 L 135 40 L 115 115 Z" fill="#FFFFFF" />
                  <path d="M 175 115 L 190 40 L 250 40 L 235 115 Z" fill="#FFFFFF" />
                  <path d="M 295 115 L 305 40 L 355 40 L 345 115 Z" fill="#FFFFFF" />
                  <path
                    d="M 15 115 Q 40 135 65 115 Q 90 135 115 115 Q 140 135 165 115 Q 190 135 215 115 Q 240 135 265 115 Q 290 135 315 115 Q 340 135 365 115 Q 390 135 425 115"
                    fill="#DC2626"
                    stroke="#B91C1C"
                    strokeWidth="4"
                  />
                </g>

                {/* Shop Wooden Signboard */}
                <rect x="70" y="55" width="300" height="46" rx="14" fill="#78350F" stroke="#F59E0B" strokeWidth="4" />
                <text
                  x="220"
                  y="87"
                  textAnchor="middle"
                  fill="#FEF3C7"
                  fontSize="24"
                  fontWeight="900"
                  fontFamily={fontFamily}
                >
                  🍫 دكان الشوكولاتة 🏪
                </text>

                {/* Large Storefront Glass Window */}
                <rect x="50" y="145" width="340" height="175" rx="18" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="5" />
                <path d="M 60 155 L 140 155 L 90 310 L 60 310 Z" fill="rgba(255,255,255,0.45)" />

                {/* Candy Jars & Chocolate Bars on Showcase Shelf */}
                <rect x="55" y="240" width="330" height="14" rx="4" fill="#B45309" />
                {/* Candy Jar 1 */}
                <rect x="75" y="185" width="58" height="55" rx="12" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="3" />
                <circle cx="94" cy="205" r="8" fill="#EF4444" />
                <circle cx="114" cy="215" r="7" fill="#F59E0B" />
                <circle cx="98" cy="225" r="8" fill="#3B82F6" />
                {/* Chocolate Stacks */}
                <rect x="155" y="195" width="54" height="45" rx="6" fill="#78350F" stroke="#451A03" strokeWidth="3" />
                <rect x="172" y="195" width="22" height="45" rx="2" fill="#D97706" />
                {/* Candy Jar 2 */}
                <rect x="230" y="180" width="58" height="60" rx="12" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="3" />
                <circle cx="250" cy="200" r="11" fill="#EC4899" />
                <line x1="250" y1="211" x2="250" y2="235" stroke="#CBD5E1" strokeWidth="4" />
                <circle cx="270" cy="205" r="9" fill="#10B981" />
                <line x1="270" y1="214" x2="270" y2="235" stroke="#CBD5E1" strokeWidth="4" />
                {/* Golden Chocolate Bar Display */}
                <rect x="310" y="190" width="60" height="50" rx="6" fill="#92400E" stroke="#F59E0B" strokeWidth="3" />
                <text x="340" y="222" textAnchor="middle" fontSize="24">🍫</text>

                {/* Friendly Shopkeeper behind Counter */}
                <g transform={`translate(0, ${shopkeeperBounce})`}>
                  <circle cx="220" cy="290" r="32" fill="#FED7AA" stroke="#FDBA74" strokeWidth="3" />
                  <path d="M 190 280 Q 220 250 250 280 Z" fill="#475569" />
                  <circle cx="210" cy="288" r="4" fill="#0F172A" />
                  <circle cx="230" cy="288" r="4" fill="#0F172A" />
                  <path d="M 210 298 Q 220 306 230 298" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
                  <path d="M 214 305 Q 220 312 226 305" stroke="#0F172A" strokeWidth="3" fill="none" />
                  <path d="M 194 322 L 180 360 L 260 360 L 246 322 Z" fill="#EF4444" />
                  <rect x="200" y="325" width="40" height="35" rx="4" fill="#FFFFFF" />
                </g>

                {/* Shop Wooden Counter in Foreground */}
                <rect x="35" y="340" width="370" height="70" rx="14" fill="#B45309" stroke="#78350F" strokeWidth="5" />
                <line x1="45" y1="365" x2="395" y2="365" stroke="#78350F" strokeWidth="3" />
                <line x1="45" y1="390" x2="395" y2="390" stroke="#78350F" strokeWidth="3" />
                <rect x="135" y="352" width="170" height="46" rx="12" fill="#FEF2F2" stroke="#EF4444" strokeWidth="3" />
                <text
                  x="220"
                  y="384"
                  textAnchor="middle"
                  fill="#DC2626"
                  fontSize="22"
                  fontWeight="900"
                  fontFamily={fontFamily}
                >
                  +10 ج كل يوم! 📈
                </text>
              </svg>
            </div>

            {/* Cartoon Girl (Masha) - Large, expressive, animated walk (860x1050) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: `translateY(${walkBob}px)`,
                width: 860,
              }}
            >
              {/* Speech bubble above Masha */}
              <div
                style={{
                  position: "relative",
                  background: "#0F172A",
                  color: "#FFFFFF",
                  padding: "32px 64px",
                  borderRadius: 52,
                  fontSize: 58,
                  fontWeight: 900,
                  marginBottom: 32,
                  boxShadow: "0 28px 70px rgba(0,0,0,0.3)",
                  direction: "rtl",
                  border: "6px solid #FFFFFF",
                  whiteSpace: "nowrap",
                }}
              >
                بتموت في الشوكولاتة! 🍫😋
                {/* Speech bubble tail */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -28,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "26px solid transparent",
                    borderRight: "26px solid transparent",
                    borderTop: "30px solid #0F172A",
                  }}
                />
              </div>

              {/* Minimalist Vector Girl SVG (860x980) */}
              <svg width="860" height="980" viewBox="0 0 240 280" fill="none">
                {/* Hair Back */}
                <ellipse cx="120" cy="100" rx="76" ry="80" fill="#D97706" />
                {/* Pigtails */}
                <ellipse cx="44" cy="115" rx="26" ry="34" fill="#D97706" />
                <circle cx="58" cy="95" r="12" fill="#EC4899" />
                <ellipse cx="196" cy="115" rx="26" ry="34" fill="#D97706" />
                <circle cx="182" cy="95" r="12" fill="#EC4899" />

                {/* Head / Face */}
                <circle cx="120" cy="105" r="56" fill="#FED7AA" />
                {/* Eyes */}
                <ellipse cx="102" cy="100" rx="8.5" ry="10" fill="#1E293B" />
                <ellipse cx="138" cy="100" rx="8.5" ry="10" fill="#1E293B" />
                <circle cx="99" cy="97" r="3.2" fill="#FFFFFF" />
                <circle cx="135" cy="97" r="3.2" fill="#FFFFFF" />
                <circle cx="104" cy="104" r="1.8" fill="#FFFFFF" />
                <circle cx="140" cy="104" r="1.8" fill="#FFFFFF" />
                {/* Smile */}
                <path
                  d="M 106 118 Q 120 134 134 118"
                  stroke="#1E293B"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="#F43F5E"
                />
                {/* Cheeks */}
                <ellipse cx="88" cy="114" rx="12" ry="7" fill="#FDA4AF" />
                <ellipse cx="152" cy="114" rx="12" ry="7" fill="#FDA4AF" />
                {/* Hair Bangs */}
                <path
                  d="M 64 88 Q 120 58 176 88 Q 156 68 120 68 Q 84 68 64 88 Z"
                  fill="#B45309"
                />
                {/* Ribbon */}
                <path
                  d="M 72 82 Q 120 50 168 82"
                  stroke="#EC4899"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <circle cx="166" cy="78" r="14" fill="#F43F5E" />

                {/* Dress */}
                <path
                  d="M 92 155 L 70 235 L 170 235 L 148 155 Z"
                  fill="#EC4899"
                />
                {/* Apron */}
                <rect x="86" y="185" width="68" height="36" rx="8" fill="#FFFFFF" />
                <text
                  x="120"
                  y="211"
                  textAnchor="middle"
                  fontSize="24"
                  fill="#EC4899"
                  fontWeight="900"
                >
                  M
                </text>

                {/* Legs */}
                <rect x="98" y="235" width="16" height="36" rx="8" fill="#FED7AA" />
                <rect x="126" y="235" width="16" height="36" rx="8" fill="#FED7AA" />
                {/* Shoes */}
                <ellipse cx="102" cy="270" rx="18" ry="10" fill="#BE185D" />
                <ellipse cx="138" cy="270" rx="18" ry="10" fill="#BE185D" />

                {/* Arm holding chocolate */}
                <path
                  d="M 90 168 Q 66 182 82 206"
                  stroke="#FED7AA"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <rect
                  x="56"
                  y="190"
                  width="48"
                  height="64"
                  rx="8"
                  fill="#78350F"
                  stroke="#451A03"
                  strokeWidth="3"
                  transform="rotate(-15 56 190)"
                />
                <rect
                  x="56"
                  y="222"
                  width="48"
                  height="32"
                  rx="4"
                  fill="#F59E0B"
                  stroke="#D97706"
                  strokeWidth="2"
                  transform="rotate(-15 56 222)"
                />
              </svg>
            </div>
          </div>

          {/* Cozy Ground Pavement Bar */}
          <div
            style={{
              width: 1940,
              height: 48,
              background: "linear-gradient(to right, #CBD5E1, #94A3B8, #CBD5E1)",
              borderRadius: 24,
              boxShadow: "0 18px 45px rgba(0,0,0,0.15)",
              marginTop: -20,
            }}
          />
        </div>
      )}

      {/* ----------------------------------------------------
          PHASE 3: Price Evolution Cards (Day 1 vs Day 2)
          (Visible from frame 510 to 870) — Native 2160x3840, Correct RTL, Single Chocolate
          ---------------------------------------------------- */}
      {frame >= 510 && frame < 870 && (
        <div
          style={{
            position: "absolute",
            top: 960,
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
          {/* Day 1 and Day 2 comparison cards in RTL:
              RIGHT: Day 1 (اليوم الأول)
              MIDDLE: Arrow pointing LEFT (⟵) with "+10 جنيه"
              LEFT: Day 2 (اليوم الثاني)
          */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 48,
              width: 2040,
              direction: "rtl",
            }}
          >
            {/* Card 1 (RIGHT in RTL): Day 1 Price */}
            <div
              style={{
                flex: "0 0 820px",
                background: "#FFFFFF",
                borderRadius: 72,
                padding: "96px 60px",
                boxShadow: "0 60px 140px rgba(59, 130, 246, 0.28)",
                border: "12px solid #3B82F6",
                textAlign: "center",
                transform: `scale(${interpolate(day1Spring, [0, 1], [0.7, 1])})`,
              }}
            >
              <div style={{ fontSize: 78, fontWeight: 900, color: "#2563EB" }}>
                🗓️ اليوم الأول
              </div>
              {/* Single Chocolate bar */}
              <div style={{ fontSize: 260, margin: "40px 0" }}>🍫</div>
              <div style={{ fontSize: 180, fontWeight: 900, color: "#0F172A" }}>
                1 <span style={{ fontSize: 80, color: "#64748B" }}>جنيه</span>
              </div>
            </div>

            {/* Middle Badge: Arrow pointing clearly LEFT (←) from Day 1 to Day 2 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: "0 0 300px",
                transform: `scale(${interpolate(arrowSpring, [0, 1], [0.5, 1])})`,
              }}
            >
              <div
                style={{
                  background: "#22C55E",
                  color: "#FFFFFF",
                  padding: "32px 44px",
                  borderRadius: 48,
                  fontSize: 50,
                  fontWeight: 900,
                  boxShadow: "0 28px 75px rgba(34, 197, 94, 0.55)",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                + 10 جنيه 📈
              </div>

              {/* Geometric SVG arrow pointing LEFT (from Day 1 to Day 2 in RTL) */}
              <svg width="180" height="96" viewBox="0 0 96 52" fill="none" style={{ marginTop: 32 }}>
                <path
                  d="M 82 26 L 14 26 M 36 8 L 14 26 L 36 44"
                  stroke="#22C55E"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Card 2 (LEFT in RTL): Day 2 Price — SAME single chocolate bar for 11 EGP */}
            <div
              style={{
                flex: "0 0 820px",
                background: "#FFFFFF",
                borderRadius: 72,
                padding: "96px 60px",
                boxShadow: "0 60px 140px rgba(239, 68, 68, 0.28)",
                border: "12px solid #EF4444",
                textAlign: "center",
                transform: `scale(${interpolate(day2Spring, [0, 1], [0.7, 1])})`,
              }}
            >
              <div style={{ fontSize: 78, fontWeight: 900, color: "#DC2626" }}>
                🗓️ اليوم الثاني
              </div>
              {/* STILL ONE single chocolate bar, now costing 11 EGP! */}
              <div style={{ fontSize: 260, margin: "40px 0" }}>🍫</div>
              <div style={{ fontSize: 180, fontWeight: 900, color: "#0F172A" }}>
                11 <span style={{ fontSize: 80, color: "#64748B" }}>جنيه</span>
              </div>
              <div
                style={{
                  display: "inline-block",
                  marginTop: 24,
                  padding: "16px 44px",
                  background: "#FEF2F2",
                  color: "#DC2626",
                  borderRadius: 36,
                  fontSize: 46,
                  fontWeight: 900,
                }}
              >
                نفس الشوكولاتة! 💥
              </div>
            </div>
          </div>

          {/* Mathematical progression formula banner */}
          <div
            style={{
              marginTop: 90,
              background: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(24px)",
              borderRadius: 60,
              padding: "44px 100px",
              display: "flex",
              alignItems: "center",
              gap: 48,
              boxShadow: "0 36px 90px rgba(0, 0, 0, 0.3)",
              transform: `scale(${interpolate(formulaSpring, [0, 1], [0.8, 1])})`,
              opacity: formulaSpring,
            }}
          >
            <span style={{ fontSize: 70, color: "#FDE047" }}>💡 فكرة المسألة:</span>
            <span
              style={{
                fontSize: 66,
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
          "اعملهالي كود!" (Visible from frame 870 to end) — Native 2160x3840, NO COMMENTS
          ---------------------------------------------------- */}
      {frame >= 870 && (
        <div
          style={{
            position: "absolute",
            top: 890,
            left: 90,
            right: 90,
            transform: `translateY(${interpolate(ideSpring, [0, 1], [180, 0])}px) scale(${interpolate(ideSpring, [0, 1], [0.9, 1])})`,
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
              borderRadius: 64,
              boxShadow:
                "0 70px 160px rgba(0, 0, 0, 0.65), 0 0 0 3px rgba(255, 255, 255, 0.15)",
              overflow: "hidden",
            }}
          >
            {/* Terminal Window Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "44px 64px",
                background: "#1E293B",
                borderBottom: "2px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {/* Traffic Lights */}
              <div style={{ display: "flex", gap: 20 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#EF4444" }} />
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#F59E0B" }} />
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#10B981" }} />
              </div>
              {/* Active Tab */}
              <div
                style={{
                  color: "#E2E8F0",
                  fontSize: 52,
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
                  padding: "16px 40px",
                  borderRadius: 36,
                  fontSize: 44,
                  fontWeight: 900,
                }}
              >
                Accepted ✔️ 15ms
              </div>
            </div>

            {/* Code Body with syntax highlighting (NO COMMENTS) */}
            <div
              style={{
                padding: "96px 110px",
                fontFamily: "Consolas, 'Fira Code', Monaco, monospace",
                fontSize: 74,
                lineHeight: 1.9,
                color: "#E2E8F0",
                textAlign: "left",
              }}
            >
              <div>
                <span style={{ color: "#93C5FD" }}>#include</span>{" "}
                <span style={{ color: "#FDE047" }}>&lt;iostream&gt;</span>
              </div>
              <div>
                <span style={{ color: "#F472B6" }}>using namespace</span> std;
              </div>
              <div style={{ marginTop: 42 }}>
                <span style={{ color: "#60A5FA" }}>int</span>{" "}
                <span style={{ color: "#34D399" }}>main</span>() {"{"}
              </div>
              <div style={{ paddingLeft: 80 }}>
                <span style={{ color: "#60A5FA" }}>long long</span> X, Y;
              </div>
              <div style={{ paddingLeft: 80 }}>
                cin &gt;&gt; X &gt;&gt; Y;
              </div>
              <div style={{ paddingLeft: 80, marginTop: 38 }}>
                <span style={{ color: "#60A5FA" }}>long long</span> ans = Y - X;
              </div>
              <div style={{ paddingLeft: 80 }}>
                cout &lt;&lt; ans &lt;&lt; <span style={{ color: "#FDE047" }}>"\\n"</span>;
              </div>
              <div>{"}"}</div>
            </div>
          </div>

          {/* Test Case Callout Box */}
          <div
            style={{
              marginTop: 56,
              width: "100%",
              background: "#FFFFFF",
              borderRadius: 56,
              padding: "50px 84px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 36px 95px rgba(0,0,0,0.18)",
              border: "5px solid #CBD5E1",
              fontFamily: "monospace",
              direction: "ltr",
            }}
          >
            <div>
              <span style={{ color: "#64748B", fontSize: 50, fontWeight: 700 }}>Input: </span>
              <span style={{ color: "#0F172A", fontSize: 76, fontWeight: 900 }}>7 13</span>
            </div>
            <div style={{ fontSize: 80, color: "#22C55E", fontWeight: 900 }}>➔</div>
            <div>
              <span style={{ color: "#64748B", fontSize: 50, fontWeight: 700 }}>Output: </span>
              <span style={{ color: "#16A34A", fontSize: 78, fontWeight: 900 }}>6 (13 - 7)</span>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
