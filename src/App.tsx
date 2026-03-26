import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

function App() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden crt-flicker">
      <div className="scanline pointer-events-none" />
      
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-12 z-10"
      >
        <h1 
          className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-2 glitch-text text-magenta"
          data-text="SYSTEM_FAILURE"
        >
          SYSTEM_FAILURE
        </h1>
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-xs uppercase tracking-[0.5em] text-cyan font-bold animate-pulse">
            [ PROTOCOL: SLITHER_AND_RHYTHM ]
          </p>
          <p className="text-[10px] text-magenta/60 font-mono">
            STATUS: UNSTABLE // DATA_CORRUPTION: DETECTED
          </p>
        </div>
      </motion.header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
        {/* Left Sidebar - Terminal Output */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-3 hidden lg:flex flex-col gap-4 pixel-border p-4 bg-black/80"
        >
          <div className="space-y-2 font-mono text-[10px]">
            <p className="text-cyan">{">"} INITIALIZING_NEURAL_LINK...</p>
            <p className="text-magenta">{">"} ERROR: BUFFER_OVERFLOW</p>
            <p className="text-cyan">{">"} BYPASSING_SECURITY...</p>
            <p className="text-yellow">{">"} WARNING: UNAUTHORIZED_ACCESS</p>
            <p className="text-cyan">{">"} LOADING_SNAKE_MODULE.EXE</p>
            <p className="text-cyan">{">"} LOADING_AUDIO_STREAM.WAV</p>
          </div>
        </motion.div>

        {/* Center - Game */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="lg:col-span-6 flex justify-center"
        >
          <div className="pixel-border p-2 bg-black">
            <SnakeGame />
          </div>
        </motion.div>

        {/* Right Sidebar - Player */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-3 flex flex-col items-center lg:items-end gap-8"
        >
          <div className="pixel-border p-1 bg-magenta/10">
            <MusicPlayer />
          </div>
          
          <div className="hidden lg:block text-right font-mono text-[10px] text-cyan/40">
            <p>ENCRYPTION_KEY: 0x7F3A9B</p>
            <p>PACKET_LOSS: 12.4%</p>
            <p>LATENCY: 44ms</p>
          </div>
        </motion.div>
      </main>

      <footer className="mt-16 text-[10px] font-mono text-magenta/40 z-10">
        [ TERMINAL_ID: 882-X-99 ] // [ USER: UNKNOWN ]
      </footer>
    </div>
  );
}

export default App;
