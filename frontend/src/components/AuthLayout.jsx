import { motion } from "framer-motion";
import Logo from "./Logo";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 lg:p-12">
      {/* Elegant Waterfall Gradient Background */}
      <div className="absolute inset-0 z-0 bg-[#f0f4f8] overflow-hidden">
        {/* Soft colorful corner ambient lights */}
        <div 
          className="absolute inset-0 opacity-60 mix-blend-multiply"
          style={{
            background: 'radial-gradient(circle at 0% 0%, #a855f7 0%, transparent 45%), radial-gradient(circle at 100% 0%, #3b82f6 0%, transparent 45%), radial-gradient(circle at 0% 100%, #fbbf24 0%, transparent 45%), radial-gradient(circle at 100% 100%, #ec4899 0%, transparent 45%)'
          }}
        ></div>

        {/* Animated Waterfall White Beams (Top to Bottom) */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-80">
          <motion.div
            className="absolute w-[40vw] h-[120vh]"
            animate={{
              y: ["-120vh", "120vh"]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)",
              filter: "blur(50px)"
            }}
          />
          <motion.div
            className="absolute w-[60vw] h-[100vh]"
            animate={{
              y: ["-120vh", "120vh"]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              delay: 3
            }}
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
              filter: "blur(60px)"
            }}
          />
        </div>
        
        {/* Soft white fade at bottom to anchor the design */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white to-transparent opacity-90"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        
        {/* Left Side: Bold Copy */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-12">
              <Logo />
            </div>

            <h1 className="text-6xl lg:text-7xl font-black text-[#0a2540] leading-[1.05] tracking-tight mb-8">
              Work that <br/> matters.
            </h1>
            
            <p className="text-xl text-[#425466] leading-relaxed max-w-lg mb-10 font-medium">
              Join the marketplace of elite talent and world-class clients. Solve complex problems, craft stunning solutions, and get ahead of the competition.
            </p>

            <div className="flex items-center gap-6">
              <button className="bg-[#0a2540] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#1e3a8a] transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20">
                Start now <span className="text-lg leading-none">›</span>
              </button>
              <button className="text-[#0a2540] font-semibold text-sm hover:text-blue-600 transition-colors flex items-center gap-1">
                Contact sales <span className="text-lg leading-none">›</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Floating Auth Card */}
        <div className="flex flex-col justify-center items-center lg:items-end relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md bg-white rounded-[24px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1),0_0_20px_-10px_rgba(0,0,0,0.05)] p-10 overflow-hidden relative"
          >
            {/* Very subtle gradient top edge for the card */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#a855f7] to-[#3b82f6]"></div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#0a2540] mb-2">{title}</h2>
              <p className="text-sm text-[#425466]">{subtitle}</p>
            </div>

            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
