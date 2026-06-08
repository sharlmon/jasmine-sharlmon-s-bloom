import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "@tanstack/react-router";
import FloralScene from "./FloralSphere";

const START_DATE = new Date("2025-06-22T00:00:00");

/* ───────────────────────── Live relationship timer ───────────────────────── */

type Parts = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function diffParts(from: Date, to: Date): Parts {
  if (to.getTime() < from.getTime()) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  let hours = to.getHours() - from.getHours();
  let minutes = to.getMinutes() - from.getMinutes();
  let seconds = to.getSeconds() - from.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const prev = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += prev;
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }
  return { years, months, days, hours, minutes, seconds };
}

function useLiveTimer() {
  const [p, setP] = useState<Parts>({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setP(diffParts(START_DATE, new Date()));
    setMounted(true);
    const id = setInterval(() => setP(diffParts(START_DATE, new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  
  return { timer: p, mounted };
}

function RollingNumber({ value }: { value: number }) {
  return (
    <span className="relative inline-flex overflow-hidden h-[1em] tabular-nums">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 15 }}
          className="inline-block"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function TimerCell({ label, value, color, rotate }: { label: string; value: number, color: string, rotate: string }) {
  return (
    <div className={`flex flex-col items-center transform ${rotate} transition-transform hover:scale-110 hover:rotate-0`}>
      <div
        className="relative flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-2xl"
        style={{
          backgroundColor: color,
          border: "4px solid black",
          boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
        }}
      >
        <div className="font-black text-3xl sm:text-5xl text-center leading-none text-white" style={{ textShadow: "2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000" }}>
          <RollingNumber value={value} />
        </div>
      </div>
      <div className="mt-3 text-[0.7rem] sm:text-[0.8rem] font-black uppercase tracking-[0.2em] text-black bg-white px-2 py-1 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        {label}
      </div>
    </div>
  );
}

/* ───────────────────────────── Floating petals ───────────────────────────── */

const NOTES = [
  "You're the coolest! 😎",
  "My favorite weirdo 🤪",
  "We go together like PB&J 🥪",
  "You make me smile so big! 😁",
  "Best adventure buddy! 🗺️",
  "You're my sunshine! ☀️",
  "Love you more than pizza! 🍕",
  "You're a star! ⭐",
  "My favorite person! 💖",
  "We are totally awesome! 🚀",
];

type Petal = {
  id: number;
  note: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  color: string;
  shape: "tape" | "bubble" | "sticker";
  depth: number;
};

const CARTOON_COLORS = ["#ff3366", "#33ccff", "#ffed4a", "#99ff99", "#cc99ff", "#ff9933"];

function makePetals(n: number): Petal[] {
  const shapes: ("tape" | "bubble" | "sticker")[] = ["tape", "bubble", "sticker"];
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    note: NOTES[i % NOTES.length],
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    size: 160 + Math.random() * 60,
    duration: 15 + Math.random() * 15, // slower, gentler float
    delay: Math.random() * 10,
    drift: (Math.random() - 0.5) * 80,
    color: CARTOON_COLORS[i % CARTOON_COLORS.length],
    shape: shapes[i % shapes.length],
    depth: 0.4 + Math.random() * 0.6, // parallax factor
  }));
}

function PetalNote({
  petal,
  mx,
  my,
}: {
  petal: Petal;
  mx: ReturnType<typeof useMotionValue<number>>;
  my: ReturnType<typeof useMotionValue<number>>;
}) {
  // Parallax offset: reacts to mouse coordinates (0 to 100) relative to center
  const ox = useTransform(mx, (v) => (v - 50) * -2 * petal.depth);
  const oy = useTransform(my, (v) => (v - 50) * -2 * petal.depth);
  const springX = useSpring(ox, { stiffness: 50, damping: 25 });
  const springY = useSpring(oy, { stiffness: 50, damping: 25 });

  const [isHovered, setIsHovered] = useState(false);
  const [screenHeight, setScreenHeight] = useState(1000);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenHeight(window.innerHeight);
    }
  }, []);

  return (
    <motion.div
      className="absolute select-none pointer-events-none"
      style={{
        left: `${petal.x}%`,
        bottom: `-${petal.size}px`,
        width: petal.size,
        zIndex: isHovered ? 100 : 18,
      }}
      initial={{ y: 200, opacity: 0 }}
      animate={{
        y: [-100, -screenHeight - 300],
        x: [0, petal.drift],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        y: { duration: petal.duration, delay: petal.delay, repeat: Infinity, ease: "linear" },
        x: { duration: petal.duration, delay: petal.delay, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" },
        opacity: { duration: petal.duration, delay: petal.delay, repeat: Infinity, ease: "linear" },
      }}
    >
      <motion.div
        className="pointer-events-auto"
        style={{
          x: springX,
          y: springY,
        }}
        whileHover={{ scale: 1.15, rotate: 0 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {petal.shape === "sticker" && (
          <div
            className="relative px-5 py-4 cursor-pointer rounded-2xl text-center font-black text-sm leading-snug border-4 border-black transition-shadow"
            style={{
              backgroundColor: petal.color,
              boxShadow: `${isHovered ? "12px 12px" : "6px 6px"} 0px 0px rgba(0,0,0,1), 0 0 0 4px white`,
              color: "black",
              transform: `rotate(${petal.id % 2 === 0 ? 3 : -3}deg)`,
            }}
          >
            {petal.note}
          </div>
        )}

        {petal.shape === "bubble" && (
          <div
            className="relative px-5 py-4 cursor-pointer rounded-3xl text-center font-black text-sm leading-snug border-4 border-black transition-shadow"
            style={{
              backgroundColor: petal.color,
              boxShadow: isHovered ? "12px 12px 0px 0px rgba(0,0,0,1)" : "6px 6px 0px 0px rgba(0,0,0,1)",
              color: "black",
              transform: `rotate(${petal.id % 2 === 0 ? -2 : 4}deg)`,
            }}
          >
            {petal.note}
            <div 
              className="absolute -bottom-3.5 left-6 w-0 h-0 border-t-[14px] border-t-black border-r-[14px] border-r-transparent"
              style={{ transform: "rotate(15deg)" }}
            />
            <div 
              className="absolute -bottom-2.5 left-[26px] w-0 h-0 border-t-[10px] border-t-[current-color] border-r-[10px] border-r-transparent"
              style={{
                color: petal.color,
                transform: "rotate(15deg)"
              }}
            />
          </div>
        )}

        {petal.shape === "tape" && (
          <div
            className="relative px-5 py-5 cursor-pointer rounded-sm text-center font-black text-sm leading-snug border-4 border-black transition-shadow"
            style={{
              backgroundColor: petal.color,
              boxShadow: isHovered ? "12px 12px 0px 0px rgba(0,0,0,1)" : "6px 6px 0px 0px rgba(0,0,0,1)",
              color: "black",
              transform: `rotate(${petal.id % 2 === 0 ? 5 : -4}deg)`,
            }}
          >
            <div 
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#fffae6]/95 border-2 border-black -rotate-3 shadow-[2px_2px_0px_rgba(0,0,0,0.1)] z-10"
              style={{
                backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.05) 5px, rgba(0,0,0,0.05) 10px)"
              }}
            />
            {petal.note}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────── Falling confetti ─────────────────────────── */

function Confetti({ i }: { i: number }) {
  const left = useMemo(() => Math.random() * 100, []);
  const duration = useMemo(() => 5 + Math.random() * 8, []);
  const delay = useMemo(() => Math.random() * 10, []);
  const size = useMemo(() => 10 + Math.random() * 15, []);
  const color = useMemo(() => CARTOON_COLORS[Math.floor(Math.random() * CARTOON_COLORS.length)], []);
  const type = useMemo(() => Math.random() > 0.5 ? 'circle' : 'rect', []);
  
  return (
    <motion.div
      key={i}
      className="absolute bottom-[-10%] pointer-events-none"
      style={{ 
        left: `${left}%`, 
        width: size, 
        height: type === 'circle' ? size : size * 1.5, 
        backgroundColor: color, 
        border: "2px solid black",
        borderRadius: type === 'circle' ? '50%' : '2px'
      }}
      animate={{ 
        y: ["0vh", "-120vh"], 
        x: [0, 60, -40, 0], 
        rotate: [0, 720]
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ──────────────────────────── Audio control ──────────────────────────────── */

function MusicButton() {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);

  useEffect(() => {
    if (!ref.current) {
      const a = new Audio(
        "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946bc9a8e8.mp3?filename=relaxing-piano-music-117420.mp3",
      );
      a.loop = true;
      a.volume = volume;
      ref.current = a;
    }
  }, []);

  useEffect(() => {
    if (ref.current) ref.current.volume = volume;
  }, [volume]);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) {
      ref.current.pause();
      setPlaying(false);
    } else {
      ref.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
      <button
        onClick={toggle}
        className="w-14 h-14 rounded-full bg-[#ffed4a] border-4 border-black flex items-center justify-center text-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:scale-90"
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {playing ? "⏸" : "🎵"}
      </button>
    </div>
  );
}

/* ─────────────────────────────── Tricky Question Sequence ───────────────────────────────── */
const QUESTIONS = [
  { title: "Quick Question! 🕵️‍♂️", text: "Can I keep you forever and ever?", noText: "LET ME GO 🏃‍♀️💨" },
  { title: "Hold on! 🤨", text: "Are you missing me right now?", noText: "NOT REALLY 🙄" },
  { title: "Just checking... 🥺", text: "Am I the luckiest guy in the world to have you?", noText: "PROBABLY NOT 🤷‍♀️" },
  { title: "One last thing... 📅", text: "Are we still on for our date tomorrow (Tuesday the 9th)? 😉", noText: "I'M BUSY 🙅‍♀️" }
];

function TrickyQuestion({ onYes }: { onYes: () => void }) {
  const [step, setStep] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const noBtnRef = useRef<HTMLButtonElement>(null);

  const moveNoButton = () => {
    const maxX = window.innerWidth * 0.35;
    const maxY = window.innerHeight * 0.35;
    const rx = (Math.random() - 0.5) * maxX * 2;
    const ry = (Math.random() - 0.5) * maxY * 2;
    setNoPosition({ x: rx, y: ry });
  };

  const handleYes = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
      setNoPosition({ x: 0, y: 0 }); // reset NO button position for next question
    } else {
      onYes();
    }
  };

  const currentQ = QUESTIONS[step];

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#ffed4a] bg-[radial-gradient(#ff3366_3px,transparent_3px)] [background-size:32px_32px]">
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 10 }}
          transition={{ type: "spring", bounce: 0.6 }}
          className="bg-white p-8 sm:p-12 border-8 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center max-w-2xl mx-4 relative"
        >
          <div className="absolute -top-6 -right-6 bg-[#33ccff] text-black font-black text-xl border-4 border-black rounded-full w-14 h-14 flex items-center justify-center transform rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {step + 1}/{QUESTIONS.length}
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black mb-6 text-[#ff3366] uppercase leading-tight" style={{ textShadow: "3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000" }}>
            {currentQ.title}
          </h1>
          <p className="text-2xl sm:text-4xl font-bold mb-12 text-black leading-snug">
            {currentQ.text}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 min-h-[100px]">
            <button 
              onClick={handleYes}
              className="px-10 py-4 bg-[#99ff99] border-4 border-black rounded-2xl text-3xl font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#7ceb7c] transition-all transform hover:scale-110"
            >
              YES! 😍
            </button>
            
            <motion.button
              ref={noBtnRef}
              animate={{ x: noPosition.x, y: noPosition.y }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onMouseEnter={moveNoButton}
              onClick={moveNoButton}
              className="absolute sm:relative px-8 py-4 bg-[#ff3366] border-4 border-black rounded-2xl text-2xl font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white z-10"
            >
              {currentQ.noText}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────── Main page ───────────────────────────────── */

export default function AnniversaryPage() {
  const [opened, setOpened] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('anniversary_unlocked') === 'true';
    }
    return false;
  });
  const { timer, mounted } = useLiveTimer();
  const petals = useMemo(() => makePetals(NOTES.length), []);
  const confetti = useMemo(() => Array.from({ length: 40 }, (_, i) => i), []);

  const mx = useMotionValue(50);
  const my = useMotionValue(50);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth) * 100);
      my.set((e.clientY / window.innerHeight) * 100);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  if (!opened) {
    return <TrickyQuestion onYes={() => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('anniversary_unlocked', 'true');
      }
      setOpened(true);
    }} />;
  }

  return (
    <main
      className="relative min-h-dvh w-full overflow-hidden bg-[#33ccff] font-sans"
      style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)", backgroundSize: "40px 40px", backgroundPosition: "0 0, 20px 20px" }}></div>

      {/* falling confetti */}
      <div className="absolute inset-0 z-[6] pointer-events-none">
        {confetti.map((i) => (
          <Confetti key={i} i={i} />
        ))}
      </div>

      {/* 3D bouquet scene */}
      <div className="absolute inset-0 z-[7]">
        <Suspense fallback={null}>
          {/* We pass a prop to trigger the spring up animation from bottom */}
          <FloralScene popped={true} />
        </Suspense>
      </div>

      <MusicButton />

      {/* Navigation Links at Top */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
        className="absolute top-6 left-0 right-0 z-40 flex justify-center gap-4 px-4 flex-wrap"
      >
        <Link to="/songs" className="px-4 py-2 bg-[#ff99cc] border-4 border-black rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">🎵 Songs</Link>
        <Link to="/letter" className="px-4 py-2 bg-[#ffed4a] border-4 border-black rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">💌 Letter</Link>
        <Link to="/reasons" className="px-4 py-2 bg-[#33ccff] border-4 border-black rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">🥰 Reasons</Link>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: -2 }}
        transition={{ type: "spring", bounce: 0.6, delay: 1 }}
        className="absolute z-[20] w-full top-24 font-black text-5xl sm:text-7xl text-center tracking-tight text-white uppercase"
        style={{ textShadow: "4px 4px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000" }}
      >
        Jasmine <span className="text-[#ffed4a] mx-2 text-6xl">❤</span> Sharlmon
      </motion.h1>

      {/* Floating petal notes — pop up from bottom */}
      <AnimatePresence>
        <motion.div
          key="notes"
          className="absolute inset-0 z-[18]"
        >
          {petals.map((p) => (
            <PetalNote key={p.id} petal={p} mx={mx} my={my} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Live timer */}
      <motion.div
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.5, delay: 1.5 }}
        className="absolute z-[22] left-1/2 w-full -translate-x-1/2 bottom-12 sm:bottom-24 px-4"
      >
        {mounted ? (
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 max-w-5xl mx-auto">
            <TimerCell label="Years" value={timer.years} color="#ff3366" rotate="-rotate-3" />
            <TimerCell label="Months" value={timer.months} color="#33ccff" rotate="rotate-2" />
            <TimerCell label="Days" value={timer.days} color="#ffed4a" rotate="-rotate-1" />
            <TimerCell label="Hours" value={timer.hours} color="#99ff99" rotate="rotate-3" />
            <TimerCell label="Minutes" value={timer.minutes} color="#cc99ff" rotate="-rotate-2" />
            <TimerCell label="Seconds" value={timer.seconds} color="#ff9933" rotate="rotate-1" />
          </div>
        ) : (
          <div className="flex justify-center items-center h-24">
            <div className="w-12 h-12 border-8 border-black border-t-white rounded-full animate-spin" />
          </div>
        )}
        
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-8 text-center"
        >
          <span 
            className="inline-block bg-white border-4 border-black px-6 py-2 rounded-full font-black text-2xl uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-2"
          >
            Since June 22, 2025! 💥
          </span>
        </motion.div>
      </motion.div>
    </main>
  );
}
