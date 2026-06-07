import { motion } from "framer-motion";
import { useState } from "react";

export default function Logo() {
  const [isHovered, setIsHovered] = useState(false);

  // We use the dotless 'i' (ı) so we can create a custom, animated dot
  const word1 = "skı"; 
  const word2 = "ll";
  const word3 = "Sphere";

  // Animation variants for the letters staggering
  const letterVariants = {
    initial: { y: 0 },
    hover: (i) => ({
      y: [0, -8, 0],
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        delay: i * 0.05,
      },
    }),
  };

  // Animation for the custom red dot
  const dotVariants = {
    initial: { y: 0, scale: 1 },
    hover: {
      y: [-20, 0, -10, 0],
      x: [0, 5, -5, 0],
      scale: [1, 1.3, 0.9, 1],
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="relative flex items-center cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.95 }}
    >
      <div 
        className="flex items-center text-4xl tracking-tighter text-[#0a2540]"
        style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700 }}
      >
        {/* skı */}
        {word1.split("").map((char, index) => (
          <motion.span
            key={"w1-" + index}
            custom={index}
            variants={letterVariants}
            initial="initial"
            animate={isHovered ? "hover" : "initial"}
            className="relative inline-block"
          >
            {char}
            {char === "ı" && (
              <motion.div
                variants={dotVariants}
                initial="initial"
                animate={isHovered ? "hover" : "initial"}
                className="absolute -top-1 left-1/2 w-2.5 h-2.5 bg-red-500 rounded-full"
                style={{ 
                  transform: "translateX(-50%)", 
                  boxShadow: "0 0 10px rgba(239, 68, 68, 0.6)" 
                }}
              />
            )}
          </motion.span>
        ))}

        {/* ll */}
        {word2.split("").map((char, index) => (
          <motion.span
            key={"w2-" + index}
            custom={index + word1.length}
            variants={letterVariants}
            initial="initial"
            animate={isHovered ? "hover" : "initial"}
            className="inline-block relative -ml-0.5"
            style={{ transform: "scaleY(1.15)", transformOrigin: "bottom" }} // Make the 'll' taller like the Heights logo
          >
            {char}
          </motion.span>
        ))}

        {/* Sphere */}
        <span className="ml-1 flex">
          {word3.split("").map((char, index) => (
            <motion.span
              key={"w3-" + index}
              custom={index + word1.length + word2.length}
              variants={letterVariants}
              initial="initial"
              animate={isHovered ? "hover" : "initial"}
              className="inline-block"
              style={char === "S" ? { color: "#6366f1" } : {}}
            >
              {char}
            </motion.span>
          ))}
        </span>
      </div>

      {/* Decorative vertical bar like in the Heights logo */}
      <motion.div 
        className="w-1.5 h-12 bg-[#0a2540] ml-2 rounded-sm relative overflow-hidden"
        initial={{ scaleY: 1 }}
        animate={isHovered ? { scaleY: [1, 1.2, 1] } : { scaleY: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="absolute inset-0 bg-red-500 opacity-0"
          animate={isHovered ? { opacity: [0, 0.5, 0], y: ['100%', '-100%'] } : {}}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </motion.div>
  );
}
