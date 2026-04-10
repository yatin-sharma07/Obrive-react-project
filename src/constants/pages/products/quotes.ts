import {
  OBMOVE_IMAGES,
  OBPARK_IMAGES,
  OBNAVI_IMAGES,
  OBNEST_IMAGES,
} from "@/assets/images";

export const OBPARK_QUOTES = [
  {
    quote:
      `"AR and MR-based navigation systems like Obpark represent a significant step forward in intelligent transportation solutions. By combining spatial computing with real-time data, these systems improve parking efficiency, enhance user convenience, and contribute to smarter urban mobility ecosystems."`,
    author: "IEEE DIRECTOR",
    authorImage: OBPARK_IMAGES.OBPARK_AUTHOR,
  },
] as const;

export const OBNEST_QUOTES = [
  {
    quote:
      `"In Beverly Hills, our clients expect nothing less than extraordinary experiences when exploring luxury properties. Obnest has completely redefined the way we showcase homes—allowing buyers to walk through estates virtually, customize interiors in real time, and make confident decisions faster than ever. This isn't just a tool; it's the future of real estate marketing."`,
    author: "Leading Beverly Hills Real Estate Agency",
    authorImage: OBNEST_IMAGES.OBNEST_AUTHOR,
  },
] as const;

export const OBNAVI_QUOTES = [
  {
    quote:
      `"The future of retail lies in creating seamless, personalized, and immersive experiences inside the store. Solutions like Obnavi are exactly what the industry needs—bridging the gap between digital convenience and physical shopping. By combining AR/MR navigation with real-time product discovery, Obnavi not only enhances customer satisfaction but also drives measurable revenue growth for retailers. This kind of innovation is set to redefine how consumers engage with physical spaces and will become a benchmark for modern retail success."`,
    author: "Leading Beverly Hills Real Estate Agency",
    authorImage: OBNAVI_IMAGES.OBNAVI_AUTHOR,
  },
] as const;

export const OBMOVE_QUOTES = [
  {
    quote:
      `"The future of automotive retail lies in immersive, digital-first experiences. platforms like Obmove use MR/VR showrooms and AR to let customers explore life-sized cars, customize them in real time, and visualize them at home. This boosts buyer confidence and transforms dealership engagement—shaping the next decade of the auto industry."`,
    author: "Rajesh Menon, Automotive Retail Transformation Specialist & Industry Consultant",
    authorImage: OBMOVE_IMAGES.OBMOVE_AUTHOR,
  },
] as const;

export type QUOTES_TYPE = {
  quote: string;
  author: string;
  authorImage?: any;
};
