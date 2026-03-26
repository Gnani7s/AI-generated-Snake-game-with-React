import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { TRACKS } from '../constants';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-[400px] bg-black p-6 border-2 border-magenta">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-24 h-24 border border-cyan overflow-hidden">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className={`w-full h-full object-cover grayscale contrast-150 ${isPlaying ? 'animate-pulse' : ''}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-cyan/10 mix-blend-overlay" />
        </div>

        <div className="flex-1 min-w-0 font-mono">
          <h3 className="text-lg font-black truncate text-cyan glitch-text" data-text={currentTrack.title}>{currentTrack.title}</h3>
          <p className="text-[10px] text-magenta/80 truncate uppercase tracking-widest">{currentTrack.artist}</p>
          <div className="flex items-center gap-2 mt-2 text-yellow">
            <Music size={12} />
            <span className="text-[8px] uppercase tracking-tighter font-bold">RAW_AUDIO_STREAM</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 font-mono">
        <div className="relative h-2 bg-zinc-900 border border-cyan/20">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-cyan"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrev}
              className="p-2 text-cyan hover:text-magenta transition-colors border border-cyan/20"
            >
              <SkipBack size={16} />
            </button>
            <button 
              onClick={togglePlay}
              className="px-4 py-2 bg-magenta text-black font-black uppercase text-xs hover:bg-cyan transition-colors"
            >
              {isPlaying ? 'HALT' : 'INIT'}
            </button>
            <button 
              onClick={handleNext}
              className="p-2 text-cyan hover:text-magenta transition-colors border border-cyan/20"
            >
              <SkipForward size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-cyan/40 text-[8px]">
            <Volume2 size={12} />
            <span>AMP_0.8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
