import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { 
  Activity, 
  Cloud, 
  Bell, 
  Clock, 
  Heart, 
  Footprints,
  Navigation,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useWatchData } from './hooks/useWatchData';
import { Screen, Reminder } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('watch');
  const { time, steps, heartRate, weather } = useWatchData();
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', text: 'Drink Water', time: '10:00 AM', completed: false },
    { id: '2', text: 'Walk 500 steps', time: '11:30 AM', completed: false },
    { id: '3', text: 'Meditation', time: '2:00 PM', completed: true },
  ]);

  const screens: Screen[] = ['watch', 'fitness', 'weather', 'reminders'];
  const currentIndex = screens.indexOf(currentScreen);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentScreen(screens[currentIndex - 1]);
    } else if (info.offset.x < -threshold && currentIndex < screens.length - 1) {
      setCurrentScreen(screens[currentIndex + 1]);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans text-white overflow-hidden select-none">
      {/* Watch Frame */}
      <div className="relative w-[320px] h-[320px] rounded-full border-8 border-zinc-800 bg-zinc-950 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-center">
        
        {/* Navigation Indicators */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
          {screens.map((s, i) => (
            <div 
              key={s} 
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-emerald-500 w-3' : 'bg-zinc-700'}`}
            />
          ))}
        </div>

        {/* Content Container */}
        <motion.div 
          className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
            >
              {currentScreen === 'watch' && (
                <div className="flex flex-col items-center">
                  <span className="text-zinc-500 text-xs font-medium uppercase tracking-widest mb-1">
                    {formatDate(time)}
                  </span>
                  <h1 className="text-6xl font-bold tracking-tighter mb-2">
                    {formatTime(time)}
                  </h1>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-1 text-emerald-500">
                      <Footprints size={14} />
                      <span className="text-sm font-mono">{steps}</span>
                    </div>
                    <div className="flex items-center gap-1 text-rose-500">
                      <Heart size={14} />
                      <span className="text-sm font-mono">{heartRate}</span>
                    </div>
                  </div>
                </div>
              )}

              {currentScreen === 'fitness' && (
                <div className="w-full space-y-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Fitness</h2>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-500">
                          <Footprints size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] text-zinc-500 uppercase font-bold">Steps</p>
                          <p className="text-lg font-bold leading-tight">{steps}</p>
                        </div>
                      </div>
                      <div className="text-[10px] text-emerald-500 font-bold">84%</div>
                    </div>
                    
                    <div className="bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-500/10 rounded-full text-rose-500">
                          <Heart size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] text-zinc-500 uppercase font-bold">Heart Rate</p>
                          <p className="text-lg font-bold leading-tight">{heartRate} <span className="text-[10px] font-normal text-zinc-500">BPM</span></p>
                        </div>
                      </div>
                      <div className="w-12 h-6 flex items-end gap-0.5">
                        {[4, 7, 5, 8, 6, 9].map((h, i) => (
                          <div key={i} className="flex-1 bg-rose-500/30 rounded-t-sm" style={{ height: `${h * 10}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentScreen === 'weather' && (
                <div className="flex flex-col items-center">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Weather</h2>
                  <Cloud size={48} className="text-sky-400 mb-2" />
                  <div className="text-4xl font-bold mb-1">{weather?.temp ?? '--'}°</div>
                  <div className="text-sm text-zinc-400 mb-2">{weather?.condition ?? 'Loading...'}</div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase tracking-wider">
                    <Navigation size={10} />
                    {weather?.location ?? 'Locating...'}
                  </div>
                </div>
              )}

              {currentScreen === 'reminders' && (
                <div className="w-full h-full flex flex-col">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Reminders</h2>
                  <div className="space-y-2 overflow-y-auto max-h-[180px] pr-1 scrollbar-hide">
                    {reminders.map(reminder => (
                      <div 
                        key={reminder.id}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-colors ${
                          reminder.completed 
                            ? 'bg-zinc-900/30 border-zinc-900 text-zinc-600' 
                            : 'bg-zinc-900/50 border-zinc-800 text-white'
                        }`}
                      >
                        <div>
                          <p className={`text-xs font-bold ${reminder.completed ? 'line-through' : ''}`}>{reminder.text}</p>
                          <p className="text-[10px] opacity-60">{reminder.time}</p>
                        </div>
                        {reminder.completed ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-zinc-700" />
                        )}
                      </div>
                    ))}
                  </div>
                  <button className="mt-auto py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase rounded-full transition-colors">
                    Add New
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Bottom Bezel Decoration */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-700 tracking-[0.3em] uppercase">
          Health Watch
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 text-zinc-600 text-xs text-center max-w-xs">
        Swipe left or right on the watch face to navigate between screens.
      </div>
    </div>
  );
}
