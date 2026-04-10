import localFont from "next/font/local";

export const microgrammaBold = localFont({
  src: "./local/microgramma-bold.otf",
  display: "swap",
  weight: "800",
  variable: "--font-microgramma-bold",
});

const FONTS = {
  microgrammaBold,
};

export default FONTS;

export type FontKey = keyof typeof FONTS;
