"use client";

import dynamic from "next/dynamic";

// Lazy load ElevenLabs widget to reduce initial bundle size
const ElevenLabsConvai = dynamic(
  () => import("@/components/shared/ElevenLabsConvai"),
  { 
    ssr: false,
  }
);

interface ElevenLabsConvaiWrapperProps {
  agentId: string;
}

export default function ElevenLabsConvaiWrapper({ agentId }: ElevenLabsConvaiWrapperProps) {
  return <ElevenLabsConvai agentId={agentId} />;
}
