"use client";

import { motion } from "motion/react";
import Convertle from "../svgs/Convertle";

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
      }}
      className="flex items-center gap-2"
    >
      <Convertle className="h-10 w-auto" />
      <h1 className="font-[family-name:var(--font-barrio)] text-3xl">Convertle</h1>
    </motion.div>
  );
}
