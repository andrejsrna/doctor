'use client'

import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'

interface AudioPreviewProps {
  url: string
}

const AudioPreview = ({ url }: AudioPreviewProps) => {
  return (
    <div className="w-full max-w-md mx-auto audio-player-container">
      <style jsx global>{`
        .audio-player-container .rhap_container {
          background-color: rgba(12, 5, 24, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 9999px;
          padding: 1rem;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
          border: 1px solid rgba(168, 85, 247, 0.2);
        }
        .audio-player-container .rhap_progress-indicator,
        .audio-player-container .rhap_volume-indicator {
          background-color: #a855f7;
        }
        .audio-player-container .rhap_progress-filled {
          background-color: #d8b4fe;
        }
        .audio-player-container .rhap_main-controls-button,
        .audio-player-container .rhap_volume-button {
          color: #d8b4fe;
          font-size: 24px;
        }
        .audio-player-container .rhap_time {
          color: #d8b4fe;
        }
        .audio-player-container .rhap_progress-bar,
        .audio-player-container .rhap_volume-bar {
          background-color: rgba(216, 180, 254, 0.2);
        }
      `}</style>
      <AudioPlayer
        src={url}
        autoPlayAfterSrcChange={false}
        showJumpControls={false}
        customIcons={{
          play: <FaPlay />,
          pause: <FaPause />,
          volume: <FaVolumeUp />,
          volumeMute: <FaVolumeMute />,
        }}
        layout="horizontal-reverse"
        className="w-full"
      />
    </div>
  )
}

export default AudioPreview 