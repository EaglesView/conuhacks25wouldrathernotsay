
"use client";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

const Background = ({ children, }: { children: ReactNode }) => {
  const waveVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1, ease: "easeOut" } },
  };
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {/* Children content (placed above the background) */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {children}
      </div>

      {/* Background Waves (behind the content) */}
      <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden z-0">
        {[5, 4, 3, 2, 1].map((layer, index) => (
          <motion.img
            key={layer}
            src={`/Layer ${layer}.svg`}
            alt={`Layer ${layer}`}
            className="absolute bottom-0 w-full"
            initial="hidden"
            animate="visible"
            variants={waveVariants}
            style={{ zIndex: index }}
          />
        ))}
      </div>
    </div>
  );
};

export default Background;
