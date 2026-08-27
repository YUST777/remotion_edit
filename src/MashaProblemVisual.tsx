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

// ----------------------------------------------------
// 1. User-Provided Girl SVG (Masha) — Trimmed to exact path bounds
// ----------------------------------------------------
const GirlSvg: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="33 8.6 84 132.9"
    preserveAspectRatio="xMidYMax meet"
    style={style}
  >
    <style type="text/css">{`
      .girl-cls-0 {fill:#F9CDA8;}
      .girl-cls-1 {fill:none;stroke:#4E3220;stroke-width:1.3776;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
      .girl-cls-2 {fill:#CA4670;}
      .girl-cls-3 {fill:#FFCB4B;}
      .girl-cls-4 {fill:#F3F1D4;}
      .girl-cls-5 {fill:#FFFFFF;}
      .girl-cls-6 {fill:#1A1F24;}
      .girl-cls-7 {fill:#258F44;}
      .girl-cls-8 {fill:none;stroke:#4E3220;stroke-width:1.3142;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
      .girl-cls-9 {fill:#6E3F2B;}
      .girl-cls-10 {fill:#94344C;}
      .girl-cls-11 {fill:none;stroke:#4E3220;stroke-width:1.5;stroke-linejoin:round;stroke-miterlimit:10;}
      .girl-cls-12 {fill:#F3F1D3;}
      .girl-cls-13 {fill:none;stroke:#6E3F2B;stroke-width:1.0596;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
      .girl-cls-14 {fill:#A06147;}
      .girl-cls-15 {fill:none;stroke:#4E3220;stroke-width:1.3695;stroke-linejoin:round;stroke-miterlimit:10;}
      .girl-cls-16 {fill:#F3F1D4;}
      .girl-cls-17 {fill:none;stroke:#4E3220;stroke-width:1.3858;stroke-linejoin:round;stroke-miterlimit:10;}
      .girl-cls-18 {fill:#FFFFFF;}
      .girl-cls-19 {fill:none;stroke:#6E3F2B;stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
      .girl-cls-20 {fill:none;stroke:#4E3220;stroke-width:1.0135;stroke-linecap:round;stroke-miterlimit:10;}
    `}</style>
    <path className="girl-cls-0" d="m39 78.6-5.4 1.4-0.6 1 1.5 1s-1.6 1.2-1.2 2 0.5 1.5 1.3 1.5 1.7 0.5 1.7 0.5c0.7 2.3 1.7 1 3.7-0.6l3-0.8 2.1-0.6v-4l-6.1-1.4z"/>
    <path className="girl-cls-1" d="m39.4 78.6c-2.4 1-6.4 1.2-6.4 2.4 0 1.8 4.4-0.3 4.8-0.2 0 0-6.9 3.3-4.2 4.7-0.4 2.3 2.1 0.4 5.1-1.9-0.9 1.8-3.7 3.7-1.6 4.1 0.9 0 2.6-2.2 3.9-2.6 2-0.6 2.9-1 4.1-1.3"/>
    <path className="girl-cls-2" d="m62.7 133.1c-3 2-6.1 2.4-7 3.6-0.7 0.9-2.2 2.6-0.3 3.6l9.1 1.1 4.5-1.9 8.3-1.2-0.7-3.3-10.6-1.4-3.3-0.5z"/>
    <path className="girl-cls-3" d="m56.4 136.4c2.6-0.7 7.1 1.6 11.3 2.7l-0.7 1.4-12.5-1.4-0.2-1.2 2.1-1.5z"/>
    <path className="girl-cls-4" d="m54.7 138.6c5.2 0.3 6.2 1.4 9.8 1.5 3.6 0 4.9-2.3 7.2-2.2 2.6 0.5 5.6 0.3 5.8-1.1l-0.3 1.1-2 1.4-9.8 2.1-10.2-1.4-0.5-1.4z"/>
    <path className="girl-cls-4" d="m64.4 133.4c-0.3 3.2 3.8 3 4.7 0.8l-4.7-0.8z"/>
    <path className="girl-cls-1" d="m64.6 133.6c-0.5 2.4 2.9 2.7 4 0.9m-5.9-1.4c-3.6 2.3-6 2.2-7.2 3.6-1.5 1.7-1.9 3.3 0.5 3.6 3.2 0 4.5 0.7 9 0.8 3.5 0 4.2-1.7 6.4-2 1.4 0.4 6.2 0.9 6.1-1.2 0-1.3-0.5-1.8-0.9-2.7"/>
    <path className="girl-cls-2" d="m90.5 135.5c-0.5 1.4-1 4.3-0.5 5 1 0.5 8.9 0.7 11 1 2.1 0.4 3.1-0.8 2.9-3-0.2-2.1-0.4-7.5-2-7.5l-11.4 4.5z"/>
    <path className="girl-cls-3" d="m90 137.7c2.4-0.9 10.1-1.1 14 0.8l-0.6 2.7-13.7-0.7 0.3-2.8z"/>
    <path className="girl-cls-4" d="m90 139.5c2.2 0.1 7.6-0.4 9 0.1 2 0.7 4.5 1.9 4.8-0.3l-0.3 1.7-1.8 0.5-10.3-0.5-1.7-0.5 0.3-1z"/>
    <path className="girl-cls-4" d="m99 133c0.5 3 2.8 1.4 2.4-1.6l-2.4 1.6z"/>
    <path className="girl-cls-8" d="m99 133c0.1 2 2.7 2.9 2.4-1.6"/>
    <path className="girl-cls-1" d="m90.5 135.5c-0.9 1.1-1 3.1-1 4 0 1.2 1 1.6 2 1.5 1.5 0 5.9-0.3 7.5 0 1.7 0.4 2.5 1 3.6 0.5 1-0.4 1.4-1.2 1.4-2.2 0-2.7-0.3-5.9-1.5-8.3"/>
    <path className="girl-cls-9" d="m66.1 89.4-6.8 42c4.8 2.6 19.2 4.6 30.4 4.1 5.7-0.4 7.7-1.4 12.3-4.1 2-1.4 3.6-2.1 6-4.7l0.2-1.3c-4.7-6.4-15.1-20.4-20.3-36h-21.8z"/>
    <path className="girl-cls-10" d="m61 124.5-1 2.9c7 3.3 26.2 5.7 34 3.3 6.6-2.8 9.6-4 11.5-8.2l-2-3.2c-1.1 2.4-5.5 4.6-9.5 6.7-4 1.9-9.9 2.1-15 1.7-8-0.7-14-1.6-18-3.2z"/>
    <path className="girl-cls-4" d="m61 123.4-0.3 1.2c6.3 2.3 10 3.4 17 4 3 0.4 10.2 0.5 14.3-0.7 3.6-1 10-4.9 12-7.2l-1-1.4c-1 2.4-6.9 5.3-9 6.3-4.3 2.1-10.4 2.3-16 1.8-6.3-0.5-10.4-1.3-17-3.5v-0.5z"/>
    <path className="girl-cls-11" d="m66.1 89.6-6.8 41.8c3.7 2.5 25.2 5.2 34.6 3.2 3.8-0.9 11.8-5 14.1-8.7-5.9-7.3-15.5-21.4-20-35.9"/>
    <path className="girl-cls-11" d="m60 127.5c8 3.5 28 5.9 34.6 3.1 7.1-3.5 9.3-5 10.5-8.1"/>
    <path className="girl-cls-1" d="m60 127.4c4 1.5 16.5 5.2 29.5 4"/>
    <path className="girl-cls-0" d="m78.5 13.4c-5.5-0.3-8.6 1.1-12.5 4.7-3 2.9-6 8-8.3 16.9l-2 19.4c0.9 4.6 5.3 9 13.3 12.5 3.5 1.6 7.6 2.1 10.5 1.2 7.2-2.1 16.5-3.6 17.6-13.6 0.4-10.5-1.5-19.9-4.6-25.5-3-5.5-9.8-12.5-14-15.6z"/>
    <path className="girl-cls-10" d="m77.5 11c-5-4-5.9-4.1-7.9-2.4-3 2.4-10.2 10.5-13 20.9-2.2 7.1-1.9 17.5-0.5 23.5 0.3-0.9 1.4-7.1 1.4-9 0-3 0.1-8.1 1.1-13 2.4-9.1 10.4-18.4 18.4-17.6l1.1-0.3-0.6-2.1z"/>
    <path className="girl-cls-10" d="m76.5 10.6c5 4.3 13.5 11.9 17.5 21.4 2.4 5.1 2.5 10 3.5 19.4 1 11-9 13.5-19 16.5l8.9 4.5 13.1 7.6 2.1-2.1 3.4-12.9 5-6.6c3-3.8 4-7.3 3.1-14.4-1.6-10.9-3.5-19.6-13.6-26.9-7.4-4.7-15-6.7-24-6.5z"/>
    <path className="girl-cls-4" d="m57.6 35 10.4-1 2-4.1 1 3.7 7.4 0.4 1.6-4.1 1 4.6 14.5 1.9c-2.1-7.4-9.4-16.4-17-23-7.4-0.9-10.6 2.1-14 5.2-4 4.3-6.4 11.3-6.9 16.4z"/>
    <path className="girl-cls-12" d="m65 79v5.4l2 0.6 9.5-1 4.5-8-2-4-7 0.6z"/>
    <path className="girl-cls-1" d="m78.5 13.1c-6.6-0.1-9.5 1.8-13.5 5.9-3.1 3.5-6.4 9.6-7.3 16.4-0.3 3.2 0.3 8.2-1 12.1-1.1 3.5-1.7 5.9 0.3 9.6 2.6 4.8 5.5 6.5 13.4 9.9l2.6 1"/>
    <path className="girl-cls-11" d="m76 10.4c3.5 0 5.6 0.2 7.6 0.6 7.9 1.1 21.8 5 27 19 1.6 4.1 3.5 13 3.5 17.5 0 5.6-2.1 8.6-4 10.9-2.6 3.6-8.1 8.5-13.5 11-2.6 1.1-7.5 2.7-9.6 2.7"/>
    <path className="girl-cls-11" d="m76 10.6c3 2.5 10.7 8.8 15 16 5 8.3 5.4 11.8 6.4 24.4 0.5 5.1-1.9 10.1-8.4 13.4-2.4 1.1-6.9 3-11.3 3.7"/>
    <path className="girl-cls-11" d="m55.1 51c-0.6-8-0.5-14 0.9-20 2.6-9.6 8-15.5 13.5-21 1.9-1.5 1.5-3.5 7.1 1.6"/>
    <path className="girl-cls-1" d="m57.6 35c3.4-0.4 6.8-0.9 10.5-1l1.8-3.5 0.7 3.5c3 0 5.5 0.1 7.9 0.1l1-4.2 1.5 4.5c4.1 0.2 9 1 14.5 1.7"/>
    <path className="girl-cls-10" d="m62.5 64 5.2 5.4 3.8-1.4-9-4z"/>
    <path className="girl-cls-10" d="m72.6 67.5-2.1 2.5-8.6 6.6-4.9 3c5.6 0 9.6-0.5 12.4-3.1l3.6-3.5 2 1 3-0.6 2-0.9-2-5h-5.4z"/>
    <path className="girl-cls-10" d="m77.4 68.5c-0.9 1.6-0.4 4.6 1.2 5.1l1.9 2.4 2 2 7.5 2.6-2.9-8.6c-1.1-2-4.6-3.9-9.7-3.5z"/>
    <path className="girl-cls-11" d="m67 69.4c-3 2.2-6.4 6.6-10 10.2 10.5 0.3 12.5-3 14-5.6l1-1.1"/>
    <path className="girl-cls-17" d="m78 67.5c-1.4 0.1-2.9 0-4.4 0-2.1 0-2.6 6.5 0.3 6.5 2.1 0 2.1-0.9 3.1 0 1 0 2 0 3-1.5"/>
    <path className="girl-cls-1" d="m77.6 68.6c1.9-0.5 7.4 0.4 9 2.4 1.4 1.5 2.9 8.1 2.9 9.7-3-2.1-6.9-3.1-8-4.7-1.5-2-1-3.4-4.4-4"/>
    <path className="girl-cls-9" d="m88 86-0.4 3.5c-8.6 1-16 2-21.6-0.1-1-1.4-1.5-6.8-1-10.4l2-0.9-0.5 4.8 1 1.1 8.6 0.4 4.5-9 3 2.5-0.6 4.1 2.5 2.9 2.5 1.1z"/>
    <path className="girl-cls-1" d="m65 79c-0.1 3 0.5 9.6 1.5 10.4 4.5 1.6 12 1.6 21.1 0.2 0.5-0.6 1-2.6 1.4-3.7"/>
    <path className="girl-cls-1" d="m83.6 78c-1.1 4-0.1 6 1.9 6.6 3.5 0.9 7.1 4.8 13.5 4.3 1.6 0 2.6-0.5 4.6-1.5"/>
    <path className="girl-cls-13" d="m71.5 68.6c-2.5 0-3.6 0.5-4.9 1.4"/>
    <path className="girl-cls-11" d="m108 62c-4 7.5-4.1 13-6 18"/>
    <path className="girl-cls-17" d="m88 73.4 8.4 5.2c1.6-0.1 4.1 0 5.6 0.5"/>
    <path className="girl-cls-1" d="m72.9 72.9-1.9 2.6c-1.1 1.5-2 2.1-4 3.5"/>
    <path className="girl-cls-1" d="m80.6 75.4-3.2 7.1c-1 2.1-1.8 1.9-3.5 1.9l-6.3-0.4c-2.1-0.6-1-3.5-0.6-5.4"/>
    <path className="girl-cls-12" d="m84 78c-1.1 3-0.5 6.4 2.1 6.6 2.9 0.9 6.9 4.3 11.9 4.4l4.1-1.1-2.1-2.5 0.4-3.9 1.6-2.6-5.6-0.4-8.5-4.9 1.1 2.9 1 3.6-1.5 0.4-4.5-2.5z"/>
    <path className="girl-cls-5" d="m60 43c0.5-4 5-6.4 8.6-4l1.4 2.5v3.9c-1.5 2.1-4 1.6-5 1.6-4-0.4-5-1.5-5-4z"/>
    <path className="girl-cls-5" d="m78.5 43c1-4 5-6.4 9-4 3.5 1.6 3.5 6.4 1.5 7.1-2.4 1.4-4 1.4-7.5 0.8-3-0.8-3.4-0.3-3-3.9z"/>
    <path className="girl-cls-7" d="m85.4 40.9c-1.9 0-3.7 1.6-3.7 3.1 0 2 1.3 3.5 3.7 3.4 2.1 0 3.5-1.5 3.5-3.4 0.1-1.6-1.4-3-3.5-3.1z"/>
    <path className="girl-cls-6" d="m85.1 42.5c-1.1 0-1.7 1.1-1.6 2 0 1 1.1 1.6 2 1.5 0.9 0 1.9-1 1.5-2 0-1-0.9-1.5-1.9-1.5z"/>
    <path className="girl-cls-18" d="m86.5 42.5c-1 0-1 1.5 0 1.4 1.1 0.1 1.1-1.4 0-1.4z"/>
    <path className="girl-cls-7" d="m67.4 40.4c-2 0-3.4 1.7-3.3 3.2 0 1.9 1.4 3.3 3.5 3.1 1 0 2-0.3 2.4-1.2l0.1-3.1c-0.1-1.4-1.1-2-2.7-2z"/>
    <path className="girl-cls-6" d="m67.5 41.9c-1.5 0-2.1 1-1.9 2 0 1.1 1 1.6 2 1.6s1.9-0.5 1.9-1.9c0-1-0.9-1.7-2-1.7z"/>
    <path className="girl-cls-18" d="m66.5 41.9c-1 0-0.9 1.5 0 1.5s1.1-1.5 0-1.5z"/>
    <path className="girl-cls-9" d="m33.6 72.4-0.2 3.1 10 4.5 6.5-8.9-1.4-2.7z"/>
    <path className="girl-cls-14" d="m33.6 72.4 9 4.2 5.9-8.6-9-4z"/>
    <path className="girl-cls-1" d="m33.6 72.4-0.2 3.1 10 4.5 6.5-8.9-1.3-3m-15 4.3 8.9 4.2 6-8.6-9-4-6.1 8.4z"/>
    <path className="girl-cls-15" d="m42.9 75.9 0.5 3.5"/>
    <path className="girl-cls-16" d="m42 68.1c-1.5 0-2 2.4 0 2.4 1.5 0 1.6-2 0-2.4z"/>
    <path className="girl-cls-12" d="m46.4 77-2 3.1 0.2 4.5 3 0.3c0.3 1.2 6 2.5 9.4 2.2 2.5-0.2 5.1-1 7.6-2.6l-0.1-5.6c-1.6 0.5-7 0.6-6.9 0.1l1-1.4-8.1-1.1-2.1 1-2-0.5z"/>
    <path className="girl-cls-1" d="m59 77.9c-4.1-1-6-1.3-8.9-1.3-1.6 0-4.1 7.8-2.1 8.9 1 1.1 6.6 2 9 1.9 2.5 0 4.5-0.8 7.5-2.4"/>
    <path className="girl-cls-19" d="m44.4 80.1-4.9-2"/>
    <path className="girl-cls-1" d="m46.1 77 2.3 0.4"/>
    <path className="girl-cls-17" d="m44.4 84.4 0.5 0.5 2-0.2"/>
    <path className="girl-cls-0" d="m102 79c-2 1-3 5-2 6.9l2 2 3-0.3c1.9 1 3.1 3.4 3.6 1.9l-0.1-1.6 4.1 2 0.9-0.9h1.5v-2.5l-1.4-2.1 3 0.6 0.3-1.4-2.9-1.2-4-1.8 1-2.5v-1.2l-2 0.7-3 1.9-4-0.5z"/>
    <path className="girl-cls-1" d="m102 79c-2.5 1-5.4 7.4 0.1 9.1 0.4-0.2 1.8-0.2 2.9-1.6"/>
    <path className="girl-cls-1" d="m106 79.4c2.1-0.4 4.1-2.8 4.4-2.5 1.3-0.5 1.5 1.1 0.1 2.5-1 1.5 0.5 2.6 3 3.1 1.1 0.1 3.6 0.4 3.5 1.9-0.4 1.7-5.4 0-5.5 0 4 3 4.1 3.5 3.5 4.5-0.9 0.7-6-1.9-7.5-2.3 2 3.4 1.5 3.8 0.5 3.4-0.6-0.5-2-2.4-2.5-2.4-1.9-0.7-4-1.7-4-3.5 0-1.5 1-3.1 2.5-3.6 1.1-0.5 1.6-0.5 2-1.1z"/>
    <path className="girl-cls-1" d="m102 79 3.9 0.5"/>
    <path className="girl-cls-12" d="m46.4 77c-0.8 2-1.9 4.5-1.4 7.5l2.5 0.1c-0.4-3-0.1-5.1 1.1-7.2l-2.2-0.4z"/>
    <path className="girl-cls-1" d="m48.4 77.4-2-0.4c-0.8 2-1.9 4-1.5 7.6h2.1"/>
    <path className="girl-cls-20" d="m71.5 48.6c-2 0.3-3.1 3.5-0.4 4.5"/>
    <path className="girl-cls-1" d="m77.6 69c2.9 0 4.9 0.6 6.3 3.4"/>
    <path className="girl-cls-8" d="m66.5 57.9c4.5 1.6 11 2 17.6-1.3"/>
    <path className="girl-cls-10" d="m89 86.9-0.5 1.7 3 3 1.5-0.1 2.5-2.6-5.1-1.9-1.4-0.1z"/>
    <path className="girl-cls-1" d="m88.5 88.9c2.5 2.2 3.2 3.7 4.6 2.5 0.4-0.4 1.3-1.3 2.3-2.5"/>
    <path className="girl-cls-6" d="m69.9 41.5c-0.9-5-9.5-6-9.9 0.1l0.1 2.3c0.6-5.3 6.9-7.5 9.8-2.4z"/>
    <path className="girl-cls-6" d="m78.6 42.4c0.8-3.5 5.4-7 9.9-3.4 1.9 2 1.9 3.6 1.9 5-1-6.6-9.8-7.5-11.8-1.6z"/>
    <path className="girl-cls-8" d="m66.5 57.9c3.6 1 9.6 2.6 17.6-1.3"/>
  </svg>
);

// ----------------------------------------------------
// 2. User-Provided Market SVG — Trimmed to exact path bounds
// ----------------------------------------------------
const MarketSvg: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="6 19.5 138 111"
    preserveAspectRatio="xMidYMax meet"
    style={style}
  >
    <style type="text/css">{`
      .market-cls-0 {fill:#3A1B11;}
      .market-cls-1 {fill:#9D5426;}
      .market-cls-2 {fill:#EFE0C2;}
      .market-cls-3 {fill:#CF8837;}
      .market-cls-4 {fill:none;stroke:#3A1B11;stroke-width:0.8893;stroke-linecap:round;stroke-miterlimit:10;}
      .market-cls-5 {fill:#5F2616;}
      .market-cls-6 {fill:#6D3018;}
      .market-cls-7 {fill:#7B3F25;}
      .market-cls-8 {fill:none;stroke:#3A1B11;stroke-width:0.9;stroke-linejoin:round;stroke-miterlimit:10;}
      .market-cls-9 {fill:#3B190A;}
      .market-cls-10 {fill:#EEAE86;}
      .market-cls-11 {fill:none;stroke:#3B190A;stroke-width:0.8;stroke-linecap:round;stroke-miterlimit:10;}
      .market-cls-12 {fill:#BF6D35;}
      .market-cls-13 {fill:#CE623C;}
      .market-cls-14 {fill:none;stroke:#7F4425;stroke-width:0.87;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
      .market-cls-15 {fill:#F0DEBE;}
      .market-cls-16 {fill:#EDBB51;}
      .market-cls-17 {fill:#CA7E29;}
      .market-cls-18 {fill:#FAEBD7;}
      .market-cls-19 {fill:none;stroke:#3B190A;stroke-width:0.8305;stroke-linecap:round;stroke-miterlimit:10;}
      .market-cls-20 {fill:none;stroke:#3B190A;stroke-width:0.75;stroke-linecap:round;stroke-miterlimit:10;}
      .market-cls-21 {fill:#3A1A0B;}
      .market-cls-22 {fill:none;stroke:#3A1A0B;stroke-width:0.7691;stroke-linecap:round;stroke-miterlimit:10;}
      .market-cls-23 {fill:none;stroke:#3A1A0B;stroke-width:0.6589;stroke-linecap:round;stroke-miterlimit:10;}
    `}</style>
    <path className="market-cls-0" d="m134 41 0.2 89.5h2c0.3 0 0.5 1 0.5-89.5h-2.7z"/>
    <path className="market-cls-0" d="m27.6 45v38l2.4-0.1v-38h-2.4z"/>
    <polygon className="market-cls-1" points="16.3 40.8 27.6 45.9 122.7 45.8 134.3 40.9"/>
    <polygon className="market-cls-2" points="6.3 41 19.4 19.6 131.5 19.6 143.7 41"/>
    <polyline className="market-cls-3" points="130 19.6 129.8 19.6 142.1 40.8"/>
    <path className="market-cls-0" d="m13.7 41v89.3l2.2 0.2 0.2-89.5h-2.4z"/>
    <rect className="market-cls-18" x="19.6" y="98.7" width="111.2" height="4.1"/>
    <rect className="market-cls-3" x="19.6" y="104.5" width="111.2" height="25.5"/>
    <rect className="market-cls-3" x="11" y="101.4" width="127.3" height="3.3"/>
    <rect className="market-cls-1" x="19.4" y="104.7" width="111.4" height="3"/>
    <path className="market-cls-9" d="m66 60.8c-0.6-4.1 1.4-8.4 6.1-10.3 4.3-1.1 5.8 1.9 5.8 2 2.4-0.2 4.9 2.3 4 7.1-0.1 1.7 0.3 6.4 1.2 9.2 0.2 0.6-4.4 1.3-11.6 0.3-6.9 0.5-6.6-0.6-6.5-0.6s1.9-3.9 1-7.7z"/>
    <path className="market-cls-10" d="m70.8 69.4-0.1 3.1c1.2 2.2 5.7 2.4 6.6 0l0.1-2.9-6.6-0.2z"/>
    <path className="market-cls-11" d="m77.3 71.9v-2.6"/>
    <path className="market-cls-11" d="m70.8 72.1 0.1-2.7"/>
    <path className="market-cls-10" d="m67.6 61c0.5-2.3 2.3-2.1 2.8-2.1 1.7 0 6-1.7 6.8-3.4 1.6 0.5 1.4 3.5 3.1 5.3-0.2 1.5-0.1 3.2-0.8 4.8-2.2 6.2-10.4 5.9-11.4-0.8l-0.4-3.8z"/>
    <path className="market-cls-10" d="m67.2 61.3c-2 0.2-1.6 3.3 0.4 3.3l-0.4-3.3z"/>
    <path className="market-cls-10" d="m80.9 61.3-0.3 3.2c2.1 0 2.5-3.2 0.3-3.2z"/>
    <path className="market-cls-22" d="m67.3 61.3c-1 0-1.8 1-1.3 2.5 0.3 0.6 0.7 0.9 1.4 0.9"/>
    <path className="market-cls-22" d="m80.7 61.3c2.9-0.2 1.8 3.8-0.1 3.2"/>
    <path className="market-cls-9" d="m70.7 61.8c0 1 1.4 1.1 1.3-0.1-0.1-0.9-1.3-1-1.3 0.1z"/>
    <path className="market-cls-9" d="m76.3 61.7c0 1.1 1.5 1.4 1.4-0.1-0.1-0.8-1.4-0.8-1.4 0.1z"/>
    <path className="market-cls-23" d="m72.3 65.6c0.7 1 2.8 1 3.6 0"/>
    <path className="market-cls-19" d="m70.1 59.8c0.5-0.4 1.4-0.5 2-0.3"/>
    <path className="market-cls-19" d="m76.1 59.6c0.6-0.3 1.6-0.3 2.1 0.2"/>
    <path className="market-cls-9" d="m69.9 59.1"/>
    <path className="market-cls-8" d="m66.9 98.3-44.4-0.1c-0.8 0-0.9 0-0.7-2.1l0.2-2.4c0.1-0.9 0.6-1.1 1.3-1l6.7 0.1c0-0.7 0.2-3.1 0.2-3.1 0-1.1 0.4-2.1 1.2-2l4 0.1h1s4 0.1 4.1 0.1h5.5 2.7l14.2 0.4 0.8 4.2 2.9 0.4 0.3 5.4z"/>
    <path className="market-cls-5" d="m22.1 94.2-0.2 2.8c-0.1 0.9 0.1 0.9 1 0.9h5.3l-0.4-4c-1-0.1-4.8-0.3-5-0.3-0.5 0-0.6 0-0.7 0.6z"/>
    <path className="market-cls-6" d="m23.6 92.2 0.5-3.7c0.2-1.2 0.9-1.2 1.9-1.1l2.8 0.2c1 0.1 0.8 0.8 0.9 1.2l0.3 3.6-6.4-0.2z"/>
    <path className="market-cls-6" d="m26.7 87.4 0.5-4.4c0-0.5 0.3-1 0.7-1h3.7c1.5 0.2 1.8 0.6 1.8 1.4l0.4 4.1-7.1-0.1z"/>
    <path className="market-cls-5" d="m29.8 82 0.3-3.7c0.1-0.9 0.7-1.1 1.3-1l3.2-0.1c1.2 0.1 1.1 0.7 1.3 3.1l0.1 1.7h-6.2z"/>
    <path className="market-cls-6" d="m36.1 82 0.4-3.8c0.2-1 0.6-1 2.2-1l2.3-0.3c0.9 0.1 1.4 0.2 1.4 2l0.2 3.1h-6.5z"/>
    <path className="market-cls-6" d="m42.2 82.5 0.4-4.3c0.2-0.8 0.8-1.1 1.5-1.1l2.4-0.2c1.2-0.1 2 0 2.1 2l0.4 3.6h-6.8z"/>
    <path className="market-cls-6" d="m48.6 82.7 0.4-4.3c0.2-1 0.8-1.1 1.6-1.1l3.1-0.2c1 0 1.3 0.3 1.4 1.8l0.4 4-6.9-0.2z"/>
    <path className="market-cls-6" d="m55.5 82.7 0.4-4.5c0.1-0.8 0.4-1 1.1-1l3.3-0.1c1.3 0 1.7 0.8 1.7 2l0.4 4-6.9-0.4z"/>
    <path className="market-cls-5" d="m53.1 87.6 0.9-4.3c0.1-0.8 1-0.9 1.9-0.9l3.2 0.1c0.8 0.4 1 0.3 1.2 1.3l0.5 4.2-7.7-0.4z"/>
    <path className="market-cls-5" d="m56.3 92.4 0.3-3.4c0.1-1.1 0.6-1.1 1.3-1.1l3.4-0.1c0.4 0 1.3 0 1.4 1.1 0.2 1.6 0.3 3.3 0.3 3.6l-6.7-0.1z"/>
    <path className="market-cls-5" d="m60.9 98.1 0.5-4.6c0.3-0.6 0.7-0.7 1.2-0.8l2.7 0.1-0.4 5.3h-4z"/>
    <path className="market-cls-5" d="m54.5 98 0.4-3.9c0.2-1 0.9-0.8 1.3-0.9l4.1 0.1c0.6-0.2 0.6 0.3 0.7 1.3l0.2 3.5-6.7-0.1z"/>
    <path className="market-cls-6" d="m49.5 92.6 0.4-3.6c0.2-0.9 0.1-1 1.8-1.1h3c0.5 0 0.9 0 1 1.1l0.3 3.9-6.5-0.3z"/>
    <path className="market-cls-5" d="m48 98 0.4-4.1c0.1-1 0.8-1 1.6-1l3.8 0.1c0.5 0 0.1-0.3 0.8 4.9l-6.6 0.1z"/>
    <path className="market-cls-6" d="m43 92.8 0.4-4.2c0.3-0.9 0.8-1.3 1.6-1.2l2.6-0.1c1.5 0.2 1.8 0 1.9 1.3l0.2 4.3-6.7-0.1z"/>
    <path className="market-cls-5" d="m40.9 97.9 0.2-3.7c0.2-0.9 0.8-1.1 1.9-1.1l4 0.2c0.4-0.2 1.2 0.2 1.1 1.1l0.1 3.4-7.3 0.1z"/>
    <path className="market-cls-6" d="m36.7 92.5 0.6-4.1c0.1-0.6 0.4-0.9 1.7-0.9h2.9c0.7 0 0.9 0.5 0.8 1.4l0.2 3.9-6.2-0.3z"/>
    <path className="market-cls-5" d="m34.8 97.9 0.2-3.6c0-0.8 0.4-1.2 1-1.2l3.9-0.1c1 0 0.9 0.3 1 1.4l0.2 3.4-6.3 0.1z"/>
    <path className="market-cls-6" d="m30.1 92.8 0.5-4.3c0-1.1 1.1-1.2 1.5-1.1h3.2c0.6 0 1.1 0 1.3 2l0.2 3.6-6.7-0.2z"/>
    <path className="market-cls-5" d="m28 97.8 0.4-3.6c-0.1-1.1 0.5-0.8 1.6-0.9l4.1 0.1c1 0 0.8 0.3 0.9 1l0.1 3.5-7.1-0.1z"/>
    <path className="market-cls-7" d="m24.4 89.2 0.3-0.8 4.2-0.3 0.4 0.9-4.9 0.2z"/>
    <path className="market-cls-12" d="m22.3 94.1c-0.2-1.2 0.9-1.2 1.6-1 0.8 0.2 3.7-0.6 3.7 0.7-1 0.7-2.5 0.1-3.3 0.1-1.1 0.4-1.9 0.4-2 0.2z"/>
    <path className="market-cls-12" d="m28.7 93.9c0-0.9 0.9-0.9 2-0.7 1.7 0 3.6-0.4 3.5 0.6-0.7 0.6-2.8 0.1-3.5 0.1-0.7 0.2-1.7 0.5-2 0z"/>
    <path className="market-cls-12" d="m35.6 93.9c0.1-1.1 1.5-0.8 2-0.6 1 0.1 2.8-0.6 2.9 0.6-0.8 0.7-2.4 0-3.3 0-0.6 0.2-1.5 0.6-1.6 0z"/>
    <path className="market-cls-12" d="m41.8 93.7c0.1-1.1 2.1-0.6 2.9-0.5 1.4-0.1 2.9-0.4 2.7 0.7-1.9 0.5-2.4 0-3.5 0-0.5 0.2-2.1 0.6-2.1-0.2z"/>
    <path className="market-cls-12" d="m48.7 93.7c0.2-1 1.3-0.6 2.8-0.5 1-0.3 3.1-0.4 2.4 0.9-0.9 0.3-2.2-0.2-2.9-0.2-0.9 0-2 0.7-2.3-0.2z"/>
    <path className="market-cls-12" d="m55.2 93.9c0.3-1.3 1.7-0.6 2.7-0.7 1.4 0.1 3-0.4 2.7 0.9-1.3 0.4-2.1-0.2-3.5-0.2-0.5 0.3-1.6 0.6-1.9 0z"/>
    <path className="market-cls-12" d="m61.9 94.1c-0.2-1 0.7-1.1 2.4-0.9 0.7 0.1 1.1 0.9 0 0.7-1.2 0-2.3 0.5-2.4 0.2z"/>
    <path className="market-cls-6" d="m33.7 87.4 0.4-4.3c0.2-0.8 1.2-0.9 1.5-0.9l3.1 0.1c0.7 0.2 1.5 0.4 1.6 1.1l0.2 4.3-6.8-0.3z"/>
    <path className="market-cls-6" d="m40.1 87.6 0.5-4.5c0.3-0.6 1-0.8 2.1-0.8h2.3c0.9 0.2 1.4 0.3 1.5 1.1l0.4 4.3-6.8-0.1z"/>
    <path className="market-cls-5" d="m46.7 87.6 0.5-4.2c0.2-1.2 0.7-1.2 1.5-1.1h3.4c0.8 0.1 1.1 0.3 1.1 1.2l0.2 4.1h-6.7z"/>
    <path className="market-cls-7" d="m30.5 78.9 0.2-0.7 4.3-0.1v0.6l-4.5 0.2z"/>
    <path className="market-cls-12" d="m27.8 83.9c-0.1-1.3 1.1-0.9 2.2-0.9 2.5-0.1 3-0.1 2.5 1.1-0.4 0.3-1.8-0.3-3.1-0.2-0.7 0.2-1.5 0.4-1.6 0z"/>
    <path className="market-cls-12" d="m34.4 84c-0.1-1.4 1.3-1 2.5-1 2.3 0 2.7 0.2 2.1 1.1-0.3 0.3-1.4-0.3-3-0.1-0.6-0.1-1.5 0.4-1.6 0z"/>
    <path className="market-cls-12" d="m40.9 83.9c-0.3-1.3 1.7-0.8 3.1-0.9 1.6 0 1.9 0.3 1.5 1-0.3 0.4-1.6-0.2-2.7-0.1-0.8 0-1.9 0.3-1.9 0z"/>
    <path className="market-cls-12" d="m47.6 83.7c0.3-1.1 1.4-0.6 3-0.7 1 0 2.1-0.1 1.8 0.9-0.3 0.5-1.8-0.1-2.3 0-0.9 0-2.4 0.5-2.5-0.2z"/>
    <path className="market-cls-12" d="m54.5 83.7c0.1-1.1 1.4-0.7 2.5-0.7 1.4 0 2.2-0.4 1.9 0.9-0.3 0.5-1.7-0.2-2.6 0-0.5 0.1-1.8 0.5-1.8-0.2z"/>
    <path className="market-cls-7" d="m37 78.9 0.1-0.9 4.2-0.1 0.1 0.8-4.4 0.2z"/>
    <path className="market-cls-7" d="m43.4 78.7v-0.7l4.2-0.2 0.1 0.7-4.3 0.2z"/>
    <path className="market-cls-7" d="m49.9 78.9 0.1-0.9 4.2-0.1 0.2 0.8-4.5 0.2z"/>
    <path className="market-cls-7" d="m56.7 78.9 0.2-0.8 3.7-0.1 0.3 0.7-4.2 0.2z"/>
    <path className="market-cls-7" d="m31 88.8 0.1-0.7 4.6-0.1 0.2 0.6-4.9 0.2z"/>
    <path className="market-cls-7" d="m37.7 88.9 0.2-0.7 4-0.2v0.6l-4.2 0.3z"/>
    <path className="market-cls-7" d="m43.9 89 0.2-0.8 4.4-0.2 0.1 0.8-4.7 0.2z"/>
    <path className="market-cls-7" d="m50.8 89 0.2-0.8 4-0.1 0.1 0.7-4.3 0.2z"/>
    <path className="market-cls-13" d="m67.7 72.4c-2.1 0.8-4.7 1.3-5.7 5.1l-2.5 9.4c-0.5 3.1 2.6 3.6 5.9 7.4l2.3-7.2-2.2 0.2 0.6-2.8 1.6-12.1z"/>
    <path className="market-cls-13" d="m79.9 72.3 2.5 0.9c2 0.8 3.3 2.3 3.7 4.1l1.4 7.7-5.8-0.5-1.8-12.2z"/>
    <path className="market-cls-13" d="m70.2 71.4-2.5 0.9-2.2 15.3 1 0.9 5.2-1.5 7.7 0.9 2.2-3-1.3-12.6-2.2-0.7-0.1 0.7c-0.9 2.3-5.7 2.8-7.1 0.2l-0.7-1.1z"/>
    <path className="market-cls-18" d="m64.2 98.7h18.5l-1.8-21.4-0.6-5-2-0.6 0.5 6.6-9.5 0.1 0.5-7-2.1 0.9-3.5 26.4z"/>
    <path className="market-cls-14" d="m84 81.5c0-1.5-0.7-3.3 0-4 0.9-1.1 2.4-1.8 4.5-1.1 1.5 0.6 1.7 1.3 2.1 3.4l0.5 1.7"/>
    <path className="market-cls-15" d="m83.9 82.5-3.4-0.5c-1.6 0.8-1.7 4.1-2 5-0.3 1.1 6.3 1.8 7.1-1.1v-2.8l-1.7-0.6z"/>
    <path className="market-cls-15" d="m81.5 88.4c-1.4 0.2-3.4-1.3-3.9-0.1-0.5 1.1-0.8 4.5-0.4 4.7 0.7 0.3 4.8-0.4 5.2-1 0.3-0.6 1.5-4.1-0.9-3.6z"/>
    <path className="market-cls-14" d="m78.3 87.5c-1.2 0.4-1.5 5.3-1.1 5.4"/>
    <path className="market-cls-16" d="m79.6 82.7 1.7 0.3 1.1 0.6c0.5 0 1.9-0.2 2.9-0.7-0.2-0.9-4.3-2.3-5.7-0.2z"/>
    <path className="market-cls-14" d="m85.6 83.1 2.5 0.6c0.5-1.2 2.4-2.6 4.9-1.7 1.5 0.6 1.5 1.9 2.1 4.3"/>
    <path className="market-cls-15" d="m85.3 86.5v-2.9l-1.2-0.5 0.2 3.5c-2.2 0.3-3.2 4.9-2.2 5.6 2.6 0.9 6.6 0.8 7.4-0.2 1.1-1.2 0.1-5.9-4.2-5.5z"/>
    <path className="market-cls-15" d="m94.6 86.6c-3.7 0-4.2 3.9-4.1 5.1 0.1 1.1 7.5 1.3 7.7 0.2 0.3-3.4-1-5.3-3.6-5.3z"/>
    <path className="market-cls-16" d="m82.7 87.7 1.7 0.5 1.6 0.4 3-1c-0.5-0.7-5.4-2.6-6.3 0.1z"/>
    <path className="market-cls-16" d="m91 87.5 3.6 1.1 2.4-1c-0.3-1.1-5.1-2.1-6-0.1z"/>
    <path className="market-cls-14" d="m85.3 83v3.5c-2.8 0.1-3.7 3.4-3.6 5.2"/>
    <path className="market-cls-14" d="m80 88c1.9 0.2 2.4 0 2.4 0"/>
    <path className="market-cls-15" d="m82.4 91.9c-1.3-0.4-4.3-0.3-4.7 0.5-0.4 1.2-0.9 4.3-0.8 4.8 0.2 1.1 6.7 1.2 7.4 0.4 0.6-0.7-0.7-5.6-1.9-5.7z"/>
    <path className="market-cls-17" d="m77.3 92.9 3 0.5 3.3-1c-1.6-1.4-5.4-1.3-6.3 0.5z"/>
    <path className="market-cls-14" d="m84.3 97.4c-0.2 1-6.4 1-7.2 0.5-0.6-0.3-0.2-1.4 0.2-4 0.3-2.5 4.3-2.8 5.8-1.7 0.8 0.6 1.3 4.5 1.2 5.2z"/>
    <path className="market-cls-15" d="m91 91.9c-1.6-0.4-4.1-0.3-4.6 0.7-0.4 0.8-1.5 4.6-0.8 5.3s7 0.6 7.4 0c0.5-0.5-0.6-5.9-2-6z"/>
    <path className="market-cls-17" d="m85.9 92.6 3.2 0.8 3-1c-1.4-1.4-5.8-1.3-6.2 0.2z"/>
    <path className="market-cls-14" d="m93.1 97.8c-0.2 0.7-3.1 0.6-6.5 0.5-1.7-0.2-1.3-0.7-1.1-2.4 0.6-4.4 1.5-4.2 4.2-4.3 3.5 0.3 3 2.8 3.4 6.2z"/>
    <path className="market-cls-15" d="m99.4 91.9c-1.7-0.2-3.9 0-4.4 0.9-0.5 1.4-1.4 4.8-0.8 5.2 0.5 0.4 6.7 0.5 7.2 0.1 0.6-0.2 0.7-1.4 0.1-3.7-0.1-1-1-2.5-2.1-2.5z"/>
    <path className="market-cls-14" d="m101.6 98.1c-0.6 0.4-5.9 0.3-6.9 0-1.1-0.3-0.5-1.5-0.1-3.9 0.4-2.7 3-2.7 5-2.3 1.5 0.5 1.8 1.7 2.3 5 0.2 0.7 0 1-0.3 1.2z"/>
    <path className="market-cls-17" d="m94.5 92.6 3.1 0.8 3.4-1c-1.4-1.3-6-1.3-6.5 0.2z"/>
    <path className="market-cls-14" d="m90 91.6c0.2-4.2 2-5.1 5-5 2.5 0.5 2.7 1.4 3.2 4.9"/>
    <path className="market-cls-16" d="m84.1 77.3c2.1 0.6 3 1.8 5.8 0-2.5-1.9-5.1-0.8-5.8 0z"/>
    <path className="market-cls-16" d="m89.1 82.6 2.3 0.9 2.2-1c-0.6-0.5-3.2-1-4.5 0.1z"/>
    <path className="market-cls-1" d="m102.3 82 0.9-3.8c0.3-0.9 2.2-2.1 3.4-1.5 1.3 0.6 2.5 0.6 2.6 1l1.3 4.8-8.2-0.5z"/>
    <path className="market-cls-12" d="m103.5 77.7c1.9 1.7 4.7 1.6 5.9 0.4 0.9-0.8-1.5-0.7-2.4-1.4-1-0.3-2.6 0-3.5 1z"/>
    <path className="market-cls-12" d="m99.1 82.9c0.3-1 5.3-1.7 6.4-0.4l0.2 0.6-5.8 0.2-0.8-0.4z"/>
    <path className="market-cls-5" d="m98.8 83.7-0.7 2.9c-0.4 1.1 0.4 1.6 2.5 1.6h4.5l0.4-5.4c-2.9 0.9-6.3-0.7-6.4 0.9z"/>
    <path className="market-cls-1" d="m110.5 81.9c0.6 0 1-3.8 1-3.8 0.5-1.4 2.5-2 3.9-1.4 1.3 0.7 2.1 0.6 2.2 1.2l1 5.2-8.3-0.1 0.2-1.1z"/>
    <path className="market-cls-12" d="m111.5 77.6c3 1.9 4.1 1.5 6.2 0.6-0.4-1.4-1.7-0.9-2.1-1.4-0.7-0.4-3.1-0.8-4.1 0.8z"/>
    <path className="market-cls-6" d="m105.7 86.3 1.2-3.8 6.5-0.5 0.3 4.6-8-0.3z"/>
    <path className="market-cls-5" d="m113.7 86.5 1.2-4.1h6.2l0.9 4.1h-8.3z"/>
    <path className="market-cls-9" d="m100.2 92 1-4.4c0.4-1.1 1.2-1.5 3-1.5 2.4 0 4 0.2 4.2 2l0.6 3.8-8.8 0.1z"/>
    <path className="market-cls-9" d="m108.6 91.9 0.6-3.9c0.4-1.4 1-1.9 3.3-1.9 3.2 0 3.7 0.5 3.9 2.5l0.7 3.4-8.5-0.1z"/>
    <path className="market-cls-9" d="m116.9 91.9 0.6-3.9c0.4-1.5 0.9-1.7 3.4-1.7 2.8 0 3.5 0.3 3.9 2.2l0.9 3.5-8.8-0.1z"/>
    <path className="market-cls-6" d="m103.4 92.9c-2.3-0.1-3.3-0.3-2.9-1.5l0.7-3.4h6.8l1.1 4.8-5.7 0.1z"/>
    <path className="market-cls-5" d="m108.6 92.4 0.8-4 7.3-0.4 1 4.3-9.1 0.1z"/>
    <path className="market-cls-6" d="m116.9 92 1.1-4h6.8l0.8 4h-8.7z"/>
    <path className="market-cls-9" d="m103.4 96.7c-0.3 1.3 0.3 2 2.3 2.1 2.3 0.1 5.9 0.1 6.3-0.2 0.6-0.5 1.4-1 1-2.1l-0.9-3.9c-0.2-1.2-2.5-1.5-5.2-1.4-2.5 0-1.9 1.9-3.5 5.5z"/>
    <path className="market-cls-9" d="m112.2 96.8c-0.3 1.1-0.3 1.8 2 2 1.9 0.1 5.2 0.2 5.7-0.4 0.6-0.5 1.2-0.6 0.8-1.7l-1.1-4.3c-0.7-1.4-3-1.2-4.6-1-2.4 0.1-1.4 1.6-2.8 5.4z"/>
    <path className="market-cls-9" d="m119.9 96.8c-0.5 1.1 0.3 1.9 2 2 2.1 0 5.5 0.3 6.6-0.4 0.9-0.8 0.3-1.5-0.1-4.3-0.3-1.9-0.9-2.7-3.6-2.7-3.9-0.2-3.7 0.9-3.7 1.5l-1.2 3.9z"/>
    <path className="market-cls-5" d="m104.1 96.8 1.1-3.7 6.3-0.1 0.9 4.1c0.3 0.9-0.9 0.9-6.4 0.8-1.9-0.1-2-0.4-1.9-1.1z"/>
    <path className="market-cls-5" d="m112.6 96.8 0.9-3.9 5.4-0.1 1 4.2c0.2 1.1-0.8 1.1-5.3 1-1.6-0.1-2.2-0.2-2-1.2z"/>
    <path className="market-cls-5" d="m120.6 96.6 0.8-3.8 6-0.2 1 4.4c0.2 0.9-0.9 1.1-5.5 1-1.9-0.1-2.8 0-2.3-1.4z"/>
    <path className="market-cls-17" d="m101.7 87.7c-0.1-1.1 5.5-1.6 6.3 0 2 1.8-7.3 1.9-6.3 0z"/>
    <path className="market-cls-17" d="m109.6 87.7c-0.1-1.1 6.4-1.6 7 0 1.4 2.3-8 1.8-7 0z"/>
    <path className="market-cls-17" d="m118 87.7c-0.1-1.1 5.6-1.6 6 0 1.2 1.9-6.7 1.7-6 0z"/>
    <path className="market-cls-17" d="m105 92.8c0.1-0.9 5.7-1.9 6.4-0.4 1.7 2-7.3 2.2-6.4 0.4z"/>
    <path className="market-cls-17" d="m113.2 92.8c0.4-1.7 5.2-1.3 5.8-0.9 2 2.5-5.1 3-5.8 0.9z"/>
    <path className="market-cls-17" d="m121.5 92.6c0.1-1 5.4-1.6 6 0 1.4 2-6.8 1.8-6 0z"/>
    <path className="market-cls-17" d="m109.9 81.7c-2.4 0-3.4 0.9-2.2 1.7 1.5 1 3.9 1.1 5.5-0.1 1.4-1.2-1.6-1.7-3.3-1.6z"/>
    <path className="market-cls-17" d="m117.5 81.7c-2.4-0.1-3.4 0.9-2.1 1.7s4.2 1.1 5.5-0.1c0.7-1.3-2.2-1.7-3.4-1.6z"/>
    <path className="market-cls-21" d="m77.2 55.5"/>
    <path className="market-cls-21" d="m77.7 55.5"/>
    <path className="market-cls-23" d="m72.1 65.6c0.9 0.8 2.4 1.1 3.8 0"/>
    <path className="market-cls-20" d="m70.1 59.8c0.6-0.3 1.6-0.5 2-0.3"/>
    <path className="market-cls-20" d="m76.1 59.6c0.5-0.3 1.8-0.1 2 0.2"/>
  </svg>
);

// ----------------------------------------------------
// 3. User-Provided Message Bubble SVG
// ----------------------------------------------------
const MessageBubbleSvg: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 115 97"
    style={style}
  >
    <style type="text/css">{`
      .bubble-cls-0 {fill:#442416;}
      .bubble-cls-1 {fill:#CE714A;}
      .bubble-cls-2 {fill:#FAEBD8;}
    `}</style>
    <path className="bubble-cls-0" d="m106.9 44.8c0.5 1.6 1.1 3.2 0.9 7.2-0.3 6.5-4.8 14.3-14.8 16.8l-3.1 0.4h-21.4c-2.9 9.6-11.1 17.9-23.4 18.4-0.8 2.1-2.1 4.4-3 6.6-0.2 0.2 0.3 0.2 0.9 0.2 10.3 0 19.9-6.3 23.9-15.6l1.6-3.4h22.5c9.6-0.2 17.7-6.8 18.8-16.9 0.5-5.1-0.8-9.6-2.9-12.8v-0.9zm-11.2-17.2c0.5 1.5 0.5 3.2 0.3 5.5l2.4 1.2c-0.4-2.5-1.3-4.7-2.7-6.7z"/>
    <path className="bubble-cls-0" d="m46.2 75.4c-0.1-2-0.3-3.8-0.8-6.1h-22c-6.8 0-13.4-4.3-16.4-10.4 1.6 7.1 7.9 16.3 19.3 16.5h19.9z"/>
    <path className="bubble-cls-1" d="m45.4 69.3c1.4 7 0.5 13.8-4.6 20.5-0.3 0.5 0.6 0.4 1.9 0.4 10.8-0.4 20.7-8.5 24-20.2l0.1-0.7h-21.4z"/>
    <path className="bubble-cls-2" d="m96.1 33.1c0.1-0.7 0.1-1.3 0.1-1.9 0-7.1-5.9-13.9-15-13.9l-2.4 0.2c-2.7-7.4-9.8-15.4-20.2-15.4-9.1 0-17.2 6.2-20.7 17.3-1.5-0.4-3.2-1-5.7-1-7.2 0-14.7 6-14.7 14.3-3.5 1.1-11.2 6.1-12.6 15.3-0.8 6.9 2.8 21.1 19 21.3h65.6c7-0.2 17.3-4.8 18.2-16.9 0.5-9.6-6.8-17.4-11.6-19.3z"/>
  </svg>
);

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
  // Phase 2: Girl & Market Shop (frame 180 to 510) — NO JUMPING AT ALL
  // ----------------------------------------------------
  const girlSpring = spring({
    frame: Math.max(0, frame - 180),
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.5 },
  });

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
          (Visible from frame 180 to 510) — NO JUMPING, Native SVGs
          ---------------------------------------------------- */}
      {frame >= 180 && frame < 510 && (
        <div
          style={{
            position: "absolute",
            top: 860,
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
              alignItems: "flex-end", // BASELINE ALIGNMENT: both feet and legs touch the floor
              gap: 80,
              width: 2040,
              transform: `scale(${interpolate(girlSpring, [0, 1], [0.85, 1])})`,
            }}
          >
            {/* The Market Stall & Message Bubble (Left side) */}
            <div
              style={{
                position: "relative",
                width: 1100,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* User Message Bubble SVG with creative centered text */}
              <div
                style={{
                  position: "relative",
                  width: 780,
                  height: 658,
                  marginBottom: -80,
                  filter: "drop-shadow(0 22px 45px rgba(68, 36, 22, 0.24))",
                }}
              >
                <MessageBubbleSvg style={{ width: "100%", height: "100%" }} />
                {/* Text centered dead-center inside the cream speech bubble body */}
                <div
                  style={{
                    position: "absolute",
                    top: 75,
                    left: 105,
                    width: 510,
                    height: 330,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    direction: "rtl",
                    textAlign: "center",
                    fontFamily,
                  }}
                >
                  {/* Main text */}
                  <div
                    style={{
                      fontSize: 66,
                      fontWeight: 900,
                      color: "#2C140A",
                      lineHeight: 1.2,
                    }}
                  >
                    الأسعار بتزيد
                  </div>

                  {/* High-contrast price bump */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "center",
                      gap: 14,
                      marginTop: 12,
                      direction: "rtl",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 76,
                        fontWeight: 900,
                        color: "#DC2626",
                        lineHeight: 1,
                      }}
                    >
                      +10 ج
                    </span>
                    <span
                      style={{
                        fontSize: 54,
                        fontWeight: 900,
                        color: "#442416",
                        lineHeight: 1,
                      }}
                    >
                      كل يوم!
                    </span>
                  </div>
                </div>
              </div>

              {/* User-provided Market SVG (exact bottom bounds, display block) */}
              <MarketSvg style={{ width: 1100, height: 885, display: "block" }} />
            </div>

            {/* User-provided Girl (Masha) SVG (proportional height, display block) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 440,
              }}
            >
              {/* User-provided Girl SVG (shoes firmly touching the ground bar) */}
              <GirlSvg style={{ width: 440, height: 696, display: "block" }} />
            </div>
          </div>

          {/* Ground Pavement Strip */}
          <div
            style={{
              width: 1940,
              height: 44,
              background: "linear-gradient(to right, #CBD5E1, #94A3B8, #CBD5E1)",
              borderRadius: 22,
              boxShadow: "0 18px 45px rgba(0,0,0,0.15)",
              marginTop: 0,
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
                اليوم الأول
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
                + 10 جنيه
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
                اليوم الثاني
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
            <span style={{ fontSize: 70, color: "#FDE047" }}>فكرة المسألة:</span>
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
                Accepted 15ms
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
