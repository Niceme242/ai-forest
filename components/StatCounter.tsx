'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type StatCounterProps = {
  label: string;
  target: number;
  suffix?: string;
};

export function StatCounter({ label, target, suffix = '+' }: StatCounterProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame: number;

    const start = () => {
      const duration = 1400;
      const t0 = performance.now();
      const animate = (now: number) => {
        const progress = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(eased * target));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { start(); observer.disconnect(); } },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [target]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="rounded-2xl border border-green-200 bg-white p-7 text-center shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200"
    >
      <p className="text-4xl font-bold text-green-700 tabular-nums">
        {value.toLocaleString('fr-FR')}
        <span className="text-2xl font-semibold text-green-500 ml-0.5">{suffix}</span>
      </p>
      <p className="mt-2 text-sm font-medium uppercase tracking-[0.24em] text-gray-500">{label}</p>
    </motion.div>
  );
}
