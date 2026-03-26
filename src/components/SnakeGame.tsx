import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy } from 'lucide-react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(true);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isPaused, isGameOver, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-[400px] px-4 font-mono">
        <div className="flex items-center gap-2">
          <Trophy className="text-magenta" size={20} />
          <span className="text-xl font-bold text-magenta">[ SCORE: {score} ]</span>
        </div>
        <div className="text-[10px] text-cyan uppercase tracking-widest">
          {isGameOver ? '!! CRITICAL_ERROR !!' : isPaused ? '>> STANDBY' : '>> EXECUTING'}
        </div>
      </div>

      <div 
        className="relative bg-black overflow-hidden border-2 border-cyan"
        style={{ width: 400, height: 400 }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-20">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-cyan/30" />
          ))}
        </div>

        {/* Food */}
        <motion.div
          className="absolute bg-yellow"
          style={{
            width: 400 / GRID_SIZE,
            height: 400 / GRID_SIZE,
            left: food.x * (400 / GRID_SIZE),
            top: food.y * (400 / GRID_SIZE),
          }}
          animate={{ 
            opacity: [1, 0.5, 1],
            scale: [1, 1.1, 1]
          }}
          transition={{ repeat: Infinity, duration: 0.2 }}
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${segment.x}-${segment.y}-${i}`}
            className={`absolute ${i === 0 ? 'bg-cyan' : 'bg-cyan/60'} border border-black`}
            style={{
              width: 400 / GRID_SIZE,
              height: 400 / GRID_SIZE,
              left: segment.x * (400 / GRID_SIZE),
              top: segment.y * (400 / GRID_SIZE),
              zIndex: 5,
            }}
          />
        ))}

        {/* Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4 z-10"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-4xl font-black text-magenta uppercase tracking-tighter glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
                  <p className="text-cyan font-mono text-xs">RECOVERY_FAILED: SCORE_{score}</p>
                  <button
                    onClick={resetGame}
                    className="mt-4 px-8 py-2 bg-magenta text-black font-bold uppercase text-xs hover:bg-cyan transition-colors pixel-border"
                  >
                    REBOOT_SYSTEM
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-black text-cyan uppercase tracking-tighter">SUSPENDED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="mt-4 px-8 py-2 bg-cyan text-black font-bold uppercase text-xs hover:bg-magenta transition-colors pixel-border"
                  >
                    RESUME_PROCESS
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-cyan/60 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 border border-cyan/40">DIR_KEYS</span>
          <span>NAVIGATE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 border border-cyan/40">SPACE</span>
          <span>SUSPEND</span>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
