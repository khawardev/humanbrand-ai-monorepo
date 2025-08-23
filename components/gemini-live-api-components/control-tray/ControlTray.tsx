'use client'
import cn from "classnames";
import { memo, ReactNode, useEffect, useRef, useState } from "react";
import { useLiveAPIContext } from "../../../contexts/LiveAPIContext";
import { AudioRecorder } from "../../../lib/gemini-live-api/audio-recorder";
import AudioPulse from "../audio-pulse/AudioPulse";
import "./control-tray.scss"; // The new SCSS will be applied here
import { MdMic, MdMicOff, MdPause, MdPlayArrow } from "react-icons/md";

export type ControlTrayProps = {
  children?: ReactNode;
  user?: any;
};

// This component is refactored for a single-line, pill-shaped layout.
function ControlTray({ children, user }: ControlTrayProps) {
  // --- All original state and logic is preserved ---
  const [inVolume, setInVolume] = useState(0);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const renderCanvasRef = useRef<HTMLCanvasElement>(null);
  const connectButtonRef = useRef<HTMLButtonElement>(null);

  const { client, connected, connect, disconnect, volume } = useLiveAPIContext();

  // Effect for the mic pulse CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--volume",
      `${Math.max(5, Math.min(inVolume * 200, 10))}px` // Increased max pulse slightly
    );
  }, [inVolume]);

  // Effect for managing the audio recorder
  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([{ mimeType: "audio/pcm;rate=16000", data: base64 }]);
    };
    if (connected && !muted && audioRecorder) {
      audioRecorder.on("data", onData).on("volume", setInVolume).start();
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off("data", onData).off("volume", setInVolume);
    };
  }, [connected, client, muted, audioRecorder]);

  // --- Refactored JSX for the new layout ---
  return (
    // The main single-line flex container.
    <section className="control-tray">
      {/* Button 1: Connect / Disconnect */}
      <button
        disabled={!user}
        ref={connectButtonRef}
        className={cn("connect-toggle-pill", { connected })}
        onClick={connected ? disconnect : connect}
      >
        {connected ? <MdPause size={24} /> : <MdPlayArrow size={24} />}
      </button>

      {/* Button 2: Microphone Mute/Unmute (Primary Action) */}
      <button
        disabled={!user || !connected}
        className={cn("mic-pill")}
        onClick={() => setMuted(!muted)}
      >
        {!muted ? <MdMic size={26} /> : <MdMicOff size={26} />}
      </button>

      {/* Element 3: Audio Visualizer Display */}
      <div className={cn("visualizer-pill", { disabled: !connected })}>
        <AudioPulse volume={volume} active={connected} hover={false} />
      </div>

      {/* Render any additional child components passed into the tray here */}
      {children}

      {/* The canvas remains hidden and is used for audio processing */}
      <canvas style={{ display: "none" }} ref={renderCanvasRef} />
    </section>
  );
}

export default memo(ControlTray);