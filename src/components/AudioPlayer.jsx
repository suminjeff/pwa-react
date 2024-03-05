import { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeDown,
  faVolumeMute,
  faVolumeOff,
  faP,
} from "@fortawesome/free-solid-svg-icons";

const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: "#ccc",
  progressColor: "#0178ff",
  cursorColor: "transparent",
  responsive: true,
  height: 80,
  normalize: true,
  backend: "WebAudio",
  barWidth: 2,
  barGap: 3,
});

// Helper function to format time
function formatTime(seconds) {
  let date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}

export default function AudioPlayer({ audioFile }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioFileName, setAudioFileName] = useState("");

  // Initialize WaveSurfer and set up event Listeners
  useEffect(() => {
    // create WaveSurfer instance with options
    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    // load the audio file
    wavesurfer.current.load(audioFile);

    // When WaveSurfer is ready
    wavesurfer.current.on("ready", () => {
      setVolume(wavesurfer.current.getVolume());
      setDuration(wavesurfer.current.getDuration());
      setAudioFileName(audioFile.split("/").pop());
    });

    // Update current time in state as audio plays
    wavesurfer.current.on("audioprocess", () => {
      setCurrentTime(wavesurfer.current.getCurrentTime());
    });

    // Clean up event listeners and destroy instance on unmount
    return () => {
      wavesurfer.current.un("audioprocess");
      wavesurfer.current.un("ready");
      wavesurfer.current.destroy();
    };
  }, [audioFile]);

  // Toggle playback of audio
  const handlePlayPause = () => {
    setPlaying(!playing);
    wavesurfer.current.playPause();
  };

  // Adjust audio volume
  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    wavesurfer.current.setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  // Toggle mute/unmute audio
  const handleMute = () => {
    setMuted(!muted);
    wavesurfer.current.setVolume(muted ? 0 : volume);
  };

  // Increase volume by 10%
  const handleVolumeUp = () => {
    setVolume(Math.min(1, volume + 0.1));
  };

  // Decrease volume by 10%
  const handleVolumeDown = () => {
    setVolume(Math.min(0, volume - 1.0));
  };

  return (
    <>
      <div id="waveform" ref={waveformRef} style={{ width: "100%" }}>
        <div className="controls">
          {/* Play/Pause button */}
          <button onClick={handlePlayPause}>
            <FontAwesomeIcon icon={playing ? faPause : faPlay} />
          </button>

          {/* Mute/Unmute button */}
          <button onClick={handleMute}>
            <FontAwesomeIcon icon={muted ? faVolumeOff : faVolumeMute} />
          </button>

          {/* Volume slider */}
          <button>
            <FontAwesomeIcon />
          </button>
          <input
            type="range"
            id="volume"
            name="volume"
            min="0"
            max="1"
            step="0.05"
            value="0"
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          />
          {/* Volume Down button */}
          <button onClick={handleVolumeDown}>
            <FontAwesomeIcon icon={faVolumeDown} />
          </button>
          {/* Volume Up button */}
          <button onClick={handleVolumeUp}>
            <FontAwesomeIcon icon={faVolumeUp} />
          </button>
        </div>
        <div className="audio-info">
          {/* Audio file name and current play time */}
          <span>
            Playing: {audioFileName} <br />
          </span>
          <span>
            Duration: {formatTime(duration)} | Current Time:{" "}
            {formatTime(currentTime)} <br />
          </span>
          <span>Volume: {Math.round(volume * 100)}%</span>
        </div>
      </div>
    </>
  );
}
