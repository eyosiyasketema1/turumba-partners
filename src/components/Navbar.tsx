"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // The hero section is very tall. We trigger the transition right as the white section
      // comes up into the navbar area.
      setIsScrolled(window.scrollY > window.innerHeight * 0.85);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 h-[100px]">
      {/* Progressive Blur Layer */}
      <div 
        className={`absolute inset-0 backdrop-blur-md transition-colors duration-500 -z-10 ${isScrolled ? 'bg-white/80' : 'bg-white/10'}`}
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
        }}
      />
      
      <div className={`w-full h-full px-12 max-w-[1440px] mx-auto relative z-10 overflow-hidden transition-colors duration-500 ${isScrolled ? 'text-black' : 'text-white'}`}>
        <motion.div 
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="w-full h-full flex items-center justify-between"
        >
          {/* Logo Area */}
          <div className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Turumba Messaging Logo" 
              width={180} 
              height={40} 
              className={`object-contain transition-all duration-500 ${isScrolled ? '' : 'brightness-0 invert'}`} 
              priority
            />
          </div>

          {/* Right Area: Links + Buttons aligned together */}
          <div className="flex items-center gap-10">
            
            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8 text-[15px] font-light">
              <Link href="#" className={`transition-colors ${isScrolled ? 'hover:text-gray-600' : 'hover:text-gray-300'}`}>Products</Link>
              <Link href="#" className={`transition-colors ${isScrolled ? 'hover:text-gray-600' : 'hover:text-gray-300'}`}>Solutions</Link>
              <Link href="#" className={`transition-colors ${isScrolled ? 'hover:text-gray-600' : 'hover:text-gray-300'}`}>Blogs</Link>
              <Link href="#" className="relative font-normal">
                Be partner
                {/* Active indicator underline */}
                <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-[#2563EB]"></span>
              </Link>
            </div>

            {/* Actions */}
            <div className={`flex items-center gap-4 border-l pl-6 transition-colors duration-500 ${isScrolled ? 'border-black/10' : 'border-white/20'}`}>
              {/* Sign in Button */}
              <button className={`px-6 py-[10px] rounded-[9999px] border text-[15px] transition-colors ${isScrolled ? 'border-black/20 hover:bg-black/5' : 'border-white/40 hover:bg-white/10'}`}>
                Sign in
              </button>
              
              {/* Craft Button */}
              <button className="flex flex-row justify-center items-center px-5 py-[10px] gap-[8px] h-[40px] bg-[#2563EB] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-full text-white text-[15px] font-medium transition-colors hover:bg-blue-700 whitespace-nowrap">
                Start now for free
              </button>
            </div>
            
          </div>
        </motion.div>
      </div>
    </nav>
  );
}
