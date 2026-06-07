import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
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
  const [p, setP] = useState<Parts>(() => diffParts(START_DATE, new Date()));
  useEffect(() => {
    const id = setInterval(() => setP(diffParts(START_DATE, new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return p;
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
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function TimerCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative px-3 sm:px-5 py-3 sm:py-4 rounded-2xl min-w-[64px] sm:min-w-[88px]"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.18), rgba(255,200,225,0.06))",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.28)",
          boxShadow:
            "0 18px 60px -20px rgba(255,120,180,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        <div
          className="font-serif text-3xl sm:text-5xl text-center leading-none"
          style={{
            background: "linear-gradient(180deg,#fff 0%,#ffd6e8 55%,#e8b96b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 4px 18px rgba(255,180,210,0.35))",
          }}
        >
          <RollingNumber value={value} />
        </div>
      </div>
      <div className="mt-2 text-[0.55rem] sm:text-[0.65rem] uppercase tracking-[0.35em] text-white/55">
        {label}
      </div>
    </div>
  );
}

/* ───────────────────────────── Floating petals ───────────────────────────── */

const NOTES = [
  "You make ordinary days beautiful ❤️",
  "My favorite place is next to you",
  "You are my peace",
  "Every day with you feels special",
  "You make life brighter",
  "I still smile when I think of you",
  "Forever feels too short",
  "Thank you for being you",
  "You are my home",
  "Loving you is my favorite thing",
];

type Petal = {
  id: number;
  note: string;
  x: number; // 0..100 vw
  y: number; // 0..100 vh
  size: number;
  duration: number;
  delay: number;
  hue: number;
  drift: number;
};

function makePetals(n: number): Petal[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    note: NOTES[i % NOTES.length],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 130 + Math.random() * 70,
    duration: 18 + Math.random() * 18,
    delay: Math.random() * 10,
    hue: 340 + Math.random() * 30,
    drift: (Math.random() - 0.5) * 40,
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
  // cursor reaction — tiny offset based on distance from petal anchor
  const ox = useTransform(mx, (v) => (v - petal.x) * -0.25);
  const oy = useTransform(my, (v) => (v - petal.y) * -0.25);
  const sox = useSpring(ox, { stiffness: 50, damping: 18 });
  const soy = useSpring(oy, { stiffness: 50, damping: 18 });

  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{
        left: `${petal.x}%`,
        top: `${petal.y}%`,
        x: sox,
        y: soy,
        width: petal.size,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.95, 0.95, 0],
        y: [0, -40 - petal.drift, -10, 20],
        rotate: [-8, 8, -4, 6],
      }}
      transition={{
        duration: petal.duration,
        delay: petal.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div
        className="relative px-4 py-3 rounded-[40%_60%_50%_50%/60%_40%_60%_40%] text-center font-serif italic text-[0.8rem] sm:text-sm leading-snug"
        style={{
          background: `radial-gradient(ellipse at 30% 30%, hsla(${petal.hue},80%,88%,0.95), hsla(${petal.hue},70%,70%,0.85) 60%, hsla(${petal.hue},65%,55%,0.75))`,
          color: "#3a0a1e",
          boxShadow: `0 10px 30px -8px hsla(${petal.hue},70%,40%,0.45), inset 0 1px 0 rgba(255,255,255,0.6)`,
          border: "1px solid rgba(255,255,255,0.4)",
          textShadow: "0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        {petal.note}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────── Falling rose petals ─────────────────────────── */

function FallingPetal({ i }: { i: number }) {
  const left = useMemo(() => Math.random() * 100, []);
  const duration = useMemo(() => 8 + Math.random() * 10, []);
  const delay = useMemo(() => Math.random() * 8, []);
  const size = useMemo(() => 14 + Math.random() * 20, []);
  const hue = useMemo(() => 340 + Math.random() * 30, []);
  return (
    <motion.div
      key={i}
      className="absolute top-[-10%] pointer-events-none"
      style={{ left: `${left}%`, width: size, height: size }}
      animate={{ y: ["0vh", "120vh"], x: [0, 30, -20, 0], rotate: [0, 360] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at 30% 30%, hsla(${hue},85%,80%,0.95), hsla(${hue},70%,55%,0.85))`,
          borderRadius: "60% 40% 60% 40% / 70% 50% 50% 30%",
          boxShadow: `0 4px 16px hsla(${hue},70%,50%,0.4)`,
        }}
      />
    </motion.div>
  );
}

/* ──────────────────────────── Audio control ──────────────────────────────── */

function MusicButton() {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [open, setOpen] = useState(false);

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
    <div
      className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-full p-1.5 pl-2"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,200,220,0.08))",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: "0 12px 40px -10px rgba(255,120,180,0.35)",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={toggle}
        className="grid place-items-center h-9 w-9 rounded-full text-white/90 hover:text-white transition"
        style={{ background: "rgba(255,255,255,0.12)" }}
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 5v14l12-7z" />
          </svg>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 88, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="accent-rose mr-2 h-1"
            aria-label="Volume"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────── Main page ───────────────────────────────── */

export default function AnniversaryPage() {
  const [opened, setOpened] = useState(false);
  const timer = useLiveTimer();
  const petals = useMemo(() => makePetals(NOTES.length), []);
  const falling = useMemo(() => Array.from({ length: 22 }, (_, i) => i), []);

  // cursor — percentages of viewport
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const gx = useSpring(useTransform(mx, (v) => `${v}%`), { stiffness: 60, damping: 20 });
  const gy = useSpring(useTransform(my, (v) => `${v}%`), { stiffness: 60, damping: 20 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth) * 100);
      my.set((e.clientY / window.innerHeight) * 100);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <main
      className="relative min-h-dvh w-full overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #3a1024 0%, #1f0814 55%, #0d0410 100%)",
      }}
    >
      {/* soft cursor glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 z-[5] h-[520px] w-[520px] rounded-full blur-3xl opacity-60"
        style={{
          left: gx,
          top: gy,
          background:
            "radial-gradient(circle, rgba(255,150,190,0.35), rgba(200,140,255,0.18) 45%, transparent 70%)",
        }}
      />

      {/* light rays */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[4] opacity-50 mix-blend-screen"
        style={{
          background:
            "conic-gradient(from 220deg at 50% 30%, transparent 0deg, rgba(255,200,220,0.12) 30deg, transparent 60deg, rgba(255,220,180,0.1) 120deg, transparent 160deg, rgba(220,180,255,0.1) 220deg, transparent 260deg)",
        }}
      />

      {/* falling petals (ambient) */}
      <div className="absolute inset-0 z-[6] pointer-events-none">
        {falling.map((i) => (
          <FallingPetal key={i} i={i} />
        ))}
      </div>

      {/* 3D bouquet scene */}
      <div className="absolute inset-0 z-[7]">
        <Suspense fallback={null}>
          <FloralScene exploded={opened} />
        </Suspense>
      </div>

      {/* invisible click target over the bouquet (only before opening) */}
      {!opened && (
        <button
          onClick={() => setOpened(true)}
          aria-label="Open our story"
          className="absolute z-[15] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[60vmin] w-[60vmin] rounded-full focus:outline-none"
        />
      )}

      {/* vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[8]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(13,4,16,0.7) 85%, rgba(13,4,16,0.95) 100%)",
        }}
      />

      <MusicButton />

      {/* Title — always visible, soft glow */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, delay: 0.4 }}
        className="absolute z-[20] left-1/2 -translate-x-1/2 top-8 sm:top-12 font-serif text-3xl sm:text-5xl text-center tracking-wide"
        style={{
          textShadow:
            "0 0 24px rgba(255,180,210,0.55), 0 0 60px rgba(255,150,200,0.35)",
        }}
      >
        Jasmine <span className="font-script italic text-rose">&amp;</span> Sharlmon
      </motion.h1>

      {/* CTA before open */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            key="cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.15, transition: { duration: 0.9 } }}
            transition={{ duration: 1.4, delay: 1 }}
            className="absolute z-[16] left-1/2 -translate-x-1/2 bottom-[14vh] flex flex-col items-center pointer-events-none"
          >
            <motion.div
              animate={{
                textShadow: [
                  "0 0 18px rgba(255,180,210,0.5)",
                  "0 0 40px rgba(255,180,210,0.85)",
                  "0 0 18px rgba(255,180,210,0.5)",
                ],
              }}
              transition={{ duration: 2.6, repeat: Infinity }}
              onClick={() => setOpened(true)}
              className="pointer-events-auto cursor-pointer font-serif italic text-xl sm:text-2xl text-white/95 tracking-wide select-none"
            >
              Open Our Story <span className="text-rose">❤</span>
            </motion.div>
            <p className="mt-3 text-[0.6rem] uppercase tracking-[0.4em] text-white/45">
              tap the bouquet
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bloom flash on open */}
      <AnimatePresence>
        {opened && (
          <motion.div
            key="flash"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.4, 2.6, 3.4] }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute z-[9] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[60vmin] w-[60vmin] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,220,235,0.9), rgba(255,160,200,0.4) 40%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating petal notes — revealed after open */}
      <AnimatePresence>
        {opened && (
          <motion.div
            key="notes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1.4 }}
            className="absolute inset-0 z-[18]"
          >
            {petals.map((p) => (
              <PetalNote key={p.id} petal={p} mx={mx} my={my} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live timer — center, revealed after open */}
      <AnimatePresence>
        {opened && (
          <motion.div
            key="timer"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-[22] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 px-4"
          >
            <div className="flex flex-wrap items-end justify-center gap-2 sm:gap-3">
              <TimerCell label="Years" value={timer.years} />
              <TimerCell label="Months" value={timer.months} />
              <TimerCell label="Days" value={timer.days} />
              <TimerCell label="Hours" value={timer.hours} />
              <TimerCell label="Minutes" value={timer.minutes} />
              <TimerCell label="Seconds" value={timer.seconds} />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 1 }}
              className="mt-6 text-center font-script text-2xl sm:text-3xl text-rose"
              style={{ textShadow: "0 0 20px rgba(255,150,190,0.5)" }}
            >
              forever in bloom
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
