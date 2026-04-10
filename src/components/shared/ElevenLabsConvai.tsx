import React from "react";

interface ElevenLabsConvaiProps {
  agentId?: string;
  className?: string;
  [key: string]: any;
}

const ElevenLabsConvai: React.FC<ElevenLabsConvaiProps> = ({
  agentId,
  className,
  ...props
}) => {
  return React.createElement("elevenlabs-convai", {
    "agent-id": agentId,
    className,
    ...props,
  });
};

export default ElevenLabsConvai;
