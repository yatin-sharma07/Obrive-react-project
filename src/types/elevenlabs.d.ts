import React from "react";

interface ElevenLabsConvaiProps extends React.HTMLAttributes<HTMLElement> {
  "agent-id"?: string;
  [key: string]: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": ElevenLabsConvaiProps;
    }
  }
}

export {};
