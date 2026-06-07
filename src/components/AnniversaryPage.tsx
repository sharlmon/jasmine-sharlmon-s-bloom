import { useEffect, useState, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import peony from "@/assets/flower-peony.png";
import rose from "@/assets/flower-rose.png";
import magnolia from "@/assets/flower-magnolia.png";
import anemone from "@/assets/flower-anemone.png";
import leaf from "@/assets/leaf-sprig.png";

const FLOWERS = [
  { src: peony, top: "-6%", left: "-8%", size: 380, depth: 40, rot: -15 },
  { src: rose, top: "8%", right: "-6%", size: 320, depth: 55, rot: 20 },
  { src: leaf, top: "30%", left: "-4%", size: 260, depth: 30, rot: 30 },
  { src: magnolia, bottom: "-8%", left: "12%", size: 340, depth: 60, rot: -25 },
  { src: anemone, bottom: "-4%", right: "8%", size: 300, depth: 70, rot: 15 },
  { src: leaf, top: "12%", right: "22%", size: 180, depth: 25, rot: -40 },
  { src: rose, bottom: "22%", left: "-2%", size: 200, depth: 45, rot: 50 },
  { src: peony, top: "55%", right: "-5%", size: 240, depth: 50, rot: -30 },
  { src: anemone, top: "2%", left: "32%", size: 150, depth: 20, rot: 25 },
  { src: leaf, bottom: "12%", right: "32%", size: 170, depth: 35, rot: -55 },
];

function Flower({
  src, top, left, right, bottom, size, depth, rot, mx, my,
}: {
  src: string; top?: string; left?: string; right?: string; bottom?: string;
  size: number; depth: number; rot: number;
  mx: ReturnType<typeof useMotionValue<number>>;
  my: ReturnType<typeof useMotionValue<number>>;
}) {
  const x = useTransform(mx, [-0.5, 0.5], [-depth, depth]);
  const y = useTransform(my, [-0.5, 0.5], [-depth, depth]);
  const rotate = useTransform(mx, [-0.5, 0.5], [rot - 10, rot + 10]);
  const xs = useSpring(x, { stiffness: 60, damping: 18 });
  const ys = useSpring(y, { stiffness: 60, damping: 18 });
  const rs = useSpring(rotate, { stiffness: 40, damping: 14 });

  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden
      loading="lazy"
      width={size}
      height={size}
      className="absolute pointer-events-auto select-none drop-shadow-[0_20px_40px_oklch(0.58_0.18_5/0.18)]"
      style={{ top, left, right, bottom, width: size, height: size, x: xs, y: ys, rotate: rs }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: 1,
        scale: [1, 1.03, 1],
      }}
      transition={{
        opacity: { duration: 1.4, delay: Math.random() * 0.6 },
        scale: { duration: 6 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" },
      }}
      whileHover={{ scale: 1.18, rotate: rot + 30, transition: { type: "spring", stiffness: 200, damping: 12 } }}
    />
  );
}

function Petal({ i }: { i: number }) {
  const left = useMemo(() => Math.random() * 100, []);
  const duration = useMemo(() => 14 + Math.random() * 10, []);
  const delay = useMemo(() => Math.random() * 12, []);
  const size = useMemo(() => 8 + Math.random() * 10, []);
  return (
    <motion.div
      key={i}
      className="absolute rounded-full"
      style={{
        left: `${left}%`,
        top: -20,
        width: size,
        height: size * 0.6,
        background: "linear-gradient(135deg, oklch(0.86 0.08 12), oklch(0.72 0.16 8))",
        opacity: 0.7,
      }}
      animate={{ y: ["0vh", "110vh"], x: [0, 60, -40, 30, 0], rotate: [0, 180, 360] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

export default function AnniversaryPage() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [mx, my]);

  useEffect(() => {
    const start = new Date("2025-06-22T00:00:00").getTime();
    const update = () => {
      const diff = Date.now() - start;
      setDays(Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))));
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Floating petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => <Petal key={i} i={i} />)}
      </div>

      {/* Hero */}
      <section className="relative min-h-screen w-full">
        {FLOWERS.map((f, i) => (
          <Flower key={i} {...f} mx={mx} my={my} />
        ))}

        <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-2xl w-full rounded-[2rem] bg-card/70 backdrop-blur-xl border border-white/60 shadow-[0_30px_80px_-20px_oklch(0.58_0.18_5/0.25)] px-10 py-14 md:px-16 md:py-20 text-center"
          >
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }}
              className="text-sm uppercase tracking-[0.4em] text-primary/70 mb-6"
            >
              Our First Year
            </motion.p>
            <h1 className="font-serif text-4xl md:text-6xl leading-tight text-foreground">
              Happy <span className="italic text-primary">1st</span> Anniversary
            </h1>
            <p className="font-script text-3xl md:text-5xl text-primary mt-4">
              Jasmine &amp; Sharlmon
            </p>
            <div className="my-8 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <p className="text-base md:text-lg text-muted-foreground italic">
              June 22nd marks one beautiful year.
            </p>
            {days !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                className="mt-8 inline-flex items-baseline gap-3 rounded-full bg-secondary/60 px-6 py-3"
              >
                <span className="font-serif text-4xl text-primary">{days}</span>
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">days &amp; counting</span>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.4em] text-muted-foreground z-10"
        >
          scroll for love letter
        </motion.div>
      </section>

      {/* Love letter */}
      <section className="relative z-10 px-6 py-32 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="font-script text-4xl text-primary mb-8">To my Jasmine,</p>
          <div className="space-y-6 font-serif text-xl md:text-2xl leading-relaxed text-foreground/90">
            <p>
              A year ago you walked into my world and quietly rearranged every
              ordinary thing into something worth keeping.
            </p>
            <p>
              Three-hundred-and-sixty-five mornings of your laugh, your patience,
              your hand finding mine without needing to look — and somehow it
              still feels like the very first day.
            </p>
            <p>
              Thank you for the slow Sundays, the loud kitchens, the soft
              silences. For choosing me, again and again, in all the small
              unseen ways.
            </p>
            <p className="italic text-primary">
              Here's to many more years of us — of growing wilder, kinder, and
              more in love than we ever thought possible.
            </p>
          </div>
          <p className="font-script text-3xl text-primary mt-10">
            Forever yours, Sharlmon.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
