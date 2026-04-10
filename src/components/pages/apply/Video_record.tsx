"use client";

import { useRef, useState } from "react";
import BgImage from "@/assets/images/backgrounds/fluent_chat-video-20-filled.png";
import FONTS from "@/assets/fonts";

export default function VideoRecord({
  props,
}: {
  props: { setStage: React.Dispatch<React.SetStateAction<number>> };
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [previewActive, setPreviewActive] = useState(false);

  /** Enable live preview */
  const startPreview = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setPreviewActive(true);
    } catch (err) {
      console.error("Error accessing webcam/mic:", err);
    }
  };

  /** Start recording */
  const startRecording = () => {
    if (!stream) return;
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = recorder;
    setRecordedChunks([]);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    recorder.onstop = () => {
      // Create video blob *after* chunks are fully available
      setTimeout(() => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
      }, 100);
    };

    recorder.start();
    setRecording(true);
  };

  /** Stop recording */
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  /** Submit and cleanup camera */
  const submitVideo = async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); // stop camera and mic
      setStream(null);
      setPreviewActive(false);
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
    props.setStage(14);
  };

  return (
    <main
      className={`mt-8 flex flex-col items-center ${FONTS.microgrammaBold.className} justify-center p-6`}
    >
      <div className="text-center mt-5">
        <h1 className="text-2xl font-bold mb-2">Set up webcam and mic...</h1>
        <p className="text-sm font-light">
          Tell us a little bit about yourself!
        </p>
        <p className="text-sm font-light mb-4">
          We want to know what excites you.
        </p>
        <p className="text-sm font-light mb-4">
          What do you do for fun? <br /> What kind of food do you like?
        </p>
      </div>

      {/* Video / Placeholder Section */}
      <div className="relative rounded-xl w-[600px] h-[340px] flex items-center justify-center overflow-hidden mb-6">
        {/* Placeholder */}
        {!previewActive && !videoURL && (
          <img
            src={BgImage.src}
            alt="Placeholder"
            className="opacity-70 object-contain"
          />
        )}

        {/* Live preview */}
        {previewActive && !videoURL && (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        )}

        {/* Recorded video playback */}
        {videoURL && (
          <video
            src={videoURL}
            controls
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        )}
      </div>

      {/* Buttons */}
      <div className="flex space-x-4 justify-around gap-5">
        {!previewActive ? (
          <button
            onClick={startPreview}
            className="bg-[#074139] px-6  text-white py-2 rounded-sm shadow-md hover:bg-[#00594C] transition"
          >
            Enable Camera
          </button>
        ) : !recording ? (
          <button
            onClick={startRecording}
            className="bg-[#074139]  text-white px-6 py-2 rounded-sm shadow-md hover:bg-[#00594C] transition"
          >
            Start Interview
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-600 px-6 py-2  text-white rounded-sm shadow-md hover:bg-red-700 transition"
          >
            Stop Recording
          </button>
        )}

        <button
          onClick={submitVideo}
          disabled={!videoURL}
          className="px-6 py-2 rounded-sm  text-white shadow-md transition bg-[#074139] hover:bg-[#00594C]"
        >
          Submit
        </button>
      </div>
    </main>
  );
}
