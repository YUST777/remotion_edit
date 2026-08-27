import { loadFont } from "@remotion/google-fonts/Cairo";

export const { fontFamily } = loadFont("normal", {
  weights: ["700", "900"],
  subsets: ["arabic", "latin"],
});
