import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Particle {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
}

interface SplashViewProps {
  onEnter: () => void;
}

export default function SplashView({ onEnter }: SplashViewProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate 30 golden particles representing fresh coffee aroma
    const list: Particle[] = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1.5,
      left: Math.random() * 100,
      duration: Math.random() * 5 + 4, // 4-9s
      delay: Math.random() * 4,
    }));
    setParticles(list);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-between py-16 text-center overflow-hidden">
      {/* Dynamic Silver Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-white opacity-40 blur-[0.5px]"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              bottom: `-20px`,
              opacity: 0,
              animation: `floatUp ${p.duration}s linear ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Embedded inline keyframes specifically for particle flows */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          30% {
            opacity: 0.45;
          }
          80% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-105vh) scale(1.3);
            opacity: 0;
          }
        }
      `}</style>

      {/* Gentle Radial Ambient Backlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_75%)] pointer-events-none z-1" />

      {/* Main Logo Content Container */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.82, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            {/* Pulsing Backlight */}
            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
            
            {/* Elegant Monogram Ring */}
            <div className="w-32 h-32 md:w-36 md:h-36 border border-white/10 rounded-full flex items-center justify-center relative bg-surface-container/20 backdrop-blur-md">
              <span className="material-symbols-outlined text-white text-[64px] md:text-[72px] font-light">
                coffee_maker
              </span>
            </div>
          </div>

          <h1 className="font-serif text-white text-4.5xl md:text-5xl tracking-tighter font-light italic mt-2">
            L'Artisan Café
          </h1>
          
          <div className="h-[1px] w-14 bg-white/15 mx-auto" />
          
          <button
            onClick={onEnter}
            className="mt-4 px-10 py-3 bg-white text-black font-sans font-medium tracking-[0.2em] uppercase text-[10px] hover:bg-[#d1d1d1] active:scale-95 transition-all shadow-[0_4px_25px_rgba(255,255,255,0.05)] cursor-pointer border border-white/10"
          >
            Enter Lounge
          </button>
        </motion.div>
      </div>

      {/* Tagline Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="flex flex-col items-center justify-center gap-3 relative z-10"
      >
        <p className="font-sans text-[10px] text-on-surface-variant tracking-[0.3em] uppercase pointer-events-none">
          Scan. Order. Savor.
        </p>
        <div className="flex justify-center gap-1.5">
          <span className="w-1 h-1 bg-white/50 rounded-full" />
          <span className="w-1 h-1 bg-white/30 rounded-full" />
          <span className="w-1 h-1 bg-white/10 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}
