"use client";

import { motion } from "motion/react";

export default function Info() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="max-w-lg text-center text-muted-foreground"
    >
      Convert your files instantly, for free, and without limits. Transform
      images, audio, and videos effortlessly with{" "}
      <span className="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary">
        Convertle😉😍
      </span>
      !
    </motion.p>
  );
}
