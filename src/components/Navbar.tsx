"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // The hero section is very tall. We trigger the transition right as the white section
      // comes up into the navbar area.
      setIsScrolled(currentScrollY > window.innerHeight * 0.85);

      // Hide navbar when scrolling down past 100px, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if the content of the navbar should be dark (light mode)
  // Either because we scrolled down past the dark hero, or because we are on a light page (like /blogs)
  const isLightContent = isScrolled || pathname.startsWith("/blogs");

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 h-[72px] transition-transform duration-500 ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}>
      {/* Background Layer (No Blur) */}
      <div 
        className={`absolute inset-0 transition-colors duration-500 -z-10 ${isScrolled ? 'bg-white' : 'bg-transparent'}`}
      />
      
      <div className={`w-full h-full px-12 max-w-[1440px] mx-auto relative z-10 overflow-hidden transition-colors duration-500 ${isLightContent ? 'text-black' : 'text-white'}`}>
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
              width={140} 
              height={32} 
              className={`object-contain transition-all duration-500 ${isLightContent ? '' : 'brightness-0 invert'}`} 
              priority
            />
          </div>

          {/* Right Area: Links + Buttons aligned together */}
          <div className="flex items-center gap-10">
            
            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8 text-[15px] font-light">
              <Link href="/products" className={`relative transition-colors ${pathname.startsWith("/products") ? "font-normal" : isLightContent ? "hover:text-gray-600" : "hover:text-gray-300"}`}>
                Products
                {pathname.startsWith("/products") && <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-[#2563EB]"></span>}
              </Link>
              <Link href="/solutions" className={`relative transition-colors ${pathname.startsWith("/solutions") ? "font-normal" : isLightContent ? "hover:text-gray-600" : "hover:text-gray-300"}`}>
                Solutions
                {pathname.startsWith("/solutions") && <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-[#2563EB]"></span>}
              </Link>
              <Link href="/blogs" className={`relative transition-colors ${pathname.startsWith("/blogs") ? "font-normal" : isLightContent ? "hover:text-gray-600" : "hover:text-gray-300"}`}>
                Blogs
                {pathname.startsWith("/blogs") && <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-[#2563EB]"></span>}
              </Link>
              <Link href="/" className={`relative transition-colors ${pathname === "/" ? "font-normal" : isLightContent ? "hover:text-gray-600" : "hover:text-gray-300"}`}>
                Be partner
                {pathname === "/" && <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-[#2563EB]"></span>}
              </Link>
            </div>

            {/* Actions */}
            <div className={`flex items-center gap-4 border-l pl-6 transition-colors duration-500 ${isLightContent ? 'border-black/10' : 'border-white/20'}`}>
              {/* Sign in Button */}
              <button className={`px-6 py-[10px] rounded-[9999px] border text-[15px] transition-colors ${isLightContent ? 'border-black/20 hover:bg-black/5' : 'border-white/40 hover:bg-white/10'}`}>
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
