import { useEffect, useRef, useState, Suspense } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, animate } from "framer-motion";
import FloralScene from "./FloralSphere";

const START_DATE = new Date("2025-06-22T00:00:00");

function useDaysTogether() {
  const [days, setDays] = useState(0);
  useEffect(() => {
    const d = Math.max(0, Math.floor((Date.now() - START_DATE.getTime()) / 86400000));
    setDays(d);
  }, []);
  return days;
}

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!value) return;
    const controls = animate(0, value, {
      duration: 2.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);
  return <>{display}</>;
}

function Butterfly({ delay, top, color }: { delay: number; top: string; color: string }) {
  return (
    <motion.div
      className="absolute text-2xl pointer-events-none select-none"
      style={{ top, color, filter: "drop-shadow(0 0 8px currentColor)" }}
      initial={{ x: "-10vw", opacity: 0 }}
      animate={{
        x: ["-10vw", "110vw"],
        y: [0, -30, 20, -10, 0],
        opacity: [0, 1, 1, 1, 0],
      }}
      transition={{ duration: 22, delay, repeat: Infinity, ease: "linear" }}
    >
      ✦
    </motion.div>
  );
}

const SENTENCES = [
  "Meeting you genuinely felt magical…",
  "Like finding a beautiful path I never knew existed.",
  "Every day since that hike has become part of a story I never want to stop writing.",
  "I have loved you ever since. ❤️",
];

export default function AnniversaryPage() {
  const [opened, setOpened] = useState(false);
  const days = useDaysTogether();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);

  // soft cursor light
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cx = useSpring(mx, { stiffness: 80, damping: 20 });
  const cy = useSpring(my, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const toggleAudio = () => {
    if (!audioRef.current) {
      const a = new Audio(
        // tiny royalty-free ambient pad (data uri would be huge; use a CDN-hosted soft tone)
        "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946bc9a8e8.mp3?filename=relaxing-piano-music-117420.mp3",
      );
      a.loop = true;
      a.volume = 0.35;
      audioRef.current = a;
    }
    if (muted) {
      audioRef.current.play().catch(() => {});
      setMuted(false);
    } else {
      audioRef.current.pause();
      setMuted(true);
    }
  };

  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-[#150a1c] text-cream">
      {/* cursor glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 z-[5] h-[480px] w-[480px] rounded-full blur-3xl opacity-50"
        style={{
          left: cx,
          top: cy,
          background:
            "radial-gradient(circle, oklch(0.85 0.15 25 / 0.35), oklch(0.7 0.18 320 / 0.2) 40%, transparent 70%)",
        }}
      />

      {/* 3D bouquet */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <FloralScene exploded={opened} />
        </Suspense>
      </div>

      {/* vignette + grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[6]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(20,8,28,0.65) 85%, rgba(20,8,28,0.9) 100%)",
        }}
      />

      {/* butterflies */}
      <Butterfly delay={0} top="18%" color="#f9c4d6" />
      <Butterfly delay={7} top="62%" color="#e8b3ff" />
      <Butterfly delay={14} top="38%" color="#ffd28a" />

      {/* Audio toggle */}
      <button
        onClick={toggleAudio}
        className="fixed top-6 right-6 z-50 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80 hover:bg-white/20 transition"
      >
        {muted ? "♪ play music" : "♪ pause"}
      </button>

      {/* Title overlay */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, transition: { duration: 1.2 } }}
            transition={{ duration: 1.4, delay: 0.4 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pointer-events-none"
          >
            <p className="font-sans text-[0.7rem] md:text-xs uppercase tracking-[0.5em] text-white/60 mb-6">
              A love letter, in bloom
            </p>
            <h1 className="font-serif text-5xl md:text-7xl text-white text-center leading-tight drop-shadow-[0_4px_30px_rgba(255,180,210,0.4)]">
              Jasmine <span className="font-script text-rose">&amp;</span> Sharlmon
            </h1>
            <p className="mt-4 text-sm md:text-base text-white/70 italic">
              June 22nd, 2025 — the hike that started everything
            </p>

            {/* CTA */}
            <motion.button
              onClick={() => setOpened(true)}
              className="pointer-events-auto group relative mt-16 rounded-full px-10 py-5 overflow-hidden"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              animate={{
                boxShadow: [
                  "0 0 30px rgba(255,180,210,0.4), 0 0 60px rgba(200,150,255,0.25)",
                  "0 0 60px rgba(255,180,210,0.7), 0 0 120px rgba(200,150,255,0.4)",
                  "0 0 30px rgba(255,180,210,0.4), 0 0 60px rgba(200,150,255,0.25)",
                ],
              }}
              transition={{ boxShadow: { duration: 2.8, repeat: Infinity, ease: "easeInOut" } }}
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,200,220,0.12))",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.4)",
              }}
            >
              <span className="relative z-10 font-serif text-lg md:text-xl text-white tracking-[0.25em]">
                CLICK TO OPEN
              </span>
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(255,220,235,0.5), transparent 70%)",
                }}
              />
            </motion.button>

            <motion.p
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="mt-12 text-[0.65rem] uppercase tracking-[0.4em] text-white/50"
            >
              move your cursor — the flowers feel you
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory panel */}
      <AnimatePresence>
        {opened && (
          <motion.section
            key="memory"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-30 flex items-center justify-center px-6 py-20"
          >
            <div
              className="relative max-w-2xl w-full rounded-[2.5rem] px-8 py-14 md:px-16 md:py-20 text-center"
              style={{
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.18), rgba(255,200,225,0.08))",
                backdropFilter: "blur(28px)",
                border: "1px solid rgba(255,255,255,0.35)",
                boxShadow:
                  "0 40px 120px -20px rgba(255,120,180,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.1, duration: 0.9 }}
                className="text-[0.7rem] uppercase tracking-[0.5em] text-white/70 mb-4"
              >
                Met on a hike · June 22, 2025
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.3, duration: 1 }}
                className="font-serif text-4xl md:text-6xl text-white leading-tight"
              >
                Jasmine <span className="font-script text-rose italic">&amp;</span> Sharlmon
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 2.6, duration: 1 }}
                className="my-8 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-rose to-transparent"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8, duration: 0.8 }}
                className="text-xs uppercase tracking-[0.4em] text-white/60"
              >
                We've shared
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.0, duration: 1 }}
                className="my-3 font-serif text-7xl md:text-9xl text-white tabular-nums"
                style={{
                  background:
                    "linear-gradient(180deg, #fff 0%, #ffd6e8 60%, #f9c46b 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 4px 24px rgba(255,180,210,0.4))",
                }}
              >
                <CountUp value={days} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2, duration: 0.8 }}
                className="text-sm uppercase tracking-[0.5em] text-white/70 mb-10"
              >
                days together
              </motion.p>

              <div className="space-y-4 font-serif text-lg md:text-xl italic text-white/90 leading-relaxed">
                {SENTENCES.map((s, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.6 + i * 0.7, duration: 0.9 }}
                  >
                    {s}
                  </motion.p>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 6.5, duration: 1.2 }}
                className="font-script text-3xl text-rose mt-10"
              >
                forever, Sharlmon
              </motion.p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
