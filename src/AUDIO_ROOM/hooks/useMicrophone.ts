"use client";

import {
  useState,
} from "react";

const useMicrophone =
  () => {

    const [stream,
      setStream] =
      useState<MediaStream | null>(
        null
      );

    const [
      isMicEnabled,
      setIsMicEnabled,
    ] =
      useState(false);

    // ==========================
    // START MIC
    // ==========================

    const startMic =
      async () => {
        try {

          const mediaStream =
            await navigator.mediaDevices.getUserMedia(
              {
                audio:
                  true,
              }
            );

          setStream(
            mediaStream
          );

          setIsMicEnabled(
            true
          );

          console.log(
            "🎤 Mic Started"
          );

        } catch (
          error
        ) {
          console.error(
            "Mic permission denied:",
            error
          );
        }
      };

    // ==========================
    // STOP MIC
    // ==========================

    const stopMic =
      () => {

        if (
          stream
        ) {
          stream
            .getTracks()
            .forEach(
              (
                track
              ) =>
                track.stop()
            );
        }

        setStream(
          null
        );

        setIsMicEnabled(
          false
        );

        console.log(
          "🔇 Mic Stopped"
        );
      };

    return {
      stream,
      isMicEnabled,
      startMic,
      stopMic,
    };
  };

export default useMicrophone;