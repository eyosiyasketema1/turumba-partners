"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

/* One navbar for the whole site: home sections + blog + partners. */
const LINKS: { href: string; label: string; match?: (p: string) => boolean }[] = [
  { href: "/#story", label: "The journey" },
  { href: "/#capabilities", label: "Capabilities" },
  { href: "/#ai", label: "AI engine" },
  { href: "/#scripture", label: "Scripture" },
  { href: "/#vision", label: "The vision" },
  { href: "/blogs", label: "Blogs", match: (p) => p.startsWith("/blogs") },
  { href: "/partners", label: "Be partner", match: (p) => p.startsWith("/partners") },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Turn the bar solid once the dark hero has scrolled past.
      setIsScrolled(currentScrollY > window.innerHeight * 0.85);

      // Hide navbar when scrolling down past 100px, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
        setMenuOpen(false);
      } else {
        setIsHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dark content (light mode) once scrolled past the dark hero, on light pages (like /blogs), or with the menu open
  const isLightContent = isScrolled || menuOpen || pathname.startsWith("/blogs");
  const solidBg = isScrolled || menuOpen;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ${isHidden ? "-translate-y-full" : "translate-y-0"}`}>
      {/* Background Layer (No Blur) */}
      <div className={`absolute inset-0 transition-colors duration-500 -z-10 ${solidBg ? "bg-white" : "bg-transparent"}`} />

      <div className={`w-full h-[72px] px-6 max-w-[1440px] mx-auto relative z-10 overflow-hidden transition-colors duration-500 ${isLightContent ? "text-black" : "text-white"}`}>
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="w-full h-full flex items-center justify-between"
        >
          {/* Logo Area */}
          <Link href="/" aria-label="Turumba home" className="flex items-center" onClick={() => setMenuOpen(false)}>
            {/* official lockups: full color on white, white & blue on dark (Brand Bible · Logo colors) */}
            <Image
              src={isLightContent ? "/brand/turumba-logo-blue.svg" : "/brand/turumba-logo-white.svg"}
              alt="Turumba Messaging"
              width={133}
              height={44}
              className="h-[44px] w-auto"
              priority
            />
          </Link>

          {/* Right Area: Links + Buttons aligned together */}
          <div className="flex items-center gap-10">
            {/* Nav Links */}
            <div className="hidden xl:flex items-center gap-8 text-[15px] font-light whitespace-nowrap">
              {LINKS.map((l) => {
                const active = l.match?.(pathname) ?? false;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`relative transition-colors ${active ? "font-normal" : isLightContent ? "hover:text-[#707070]" : "hover:text-[#C7C7C7]"}`}
                  >
                    {l.label}
                    {active && <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-[#1565C0]"></span>}
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className={`flex items-center gap-4 xl:border-l xl:pl-6 transition-colors duration-500 ${isLightContent ? "border-black/10" : "border-white/20"}`}>
              {/* Sign in Button */}
              <button className={`hidden sm:block px-6 py-[10px] rounded-[9999px] border text-[15px] transition-colors ${isLightContent ? "border-black/20 hover:bg-black/5" : "border-white/40 hover:bg-white/10"}`}>
                Sign in
              </button>

              {/* Craft Button */}
              <button className="hidden sm:flex flex-row justify-center items-center px-5 py-[10px] gap-[8px] h-[40px] bg-[#1565C0] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-full text-white text-[15px] font-medium transition-colors hover:bg-[#11519A] whitespace-nowrap">
                Start now for free
              </button>

              {/* Menu toggle (below xl) */}
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
                className={`xl:hidden flex items-center justify-center w-10 h-10 rounded-full border transition-colors ${isLightContent ? "border-black/20 hover:bg-black/5" : "border-white/40 hover:bg-white/10"}`}
              >
                {menuOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile / tablet menu */}
      {menuOpen && (
        <div className="xl:hidden bg-white text-black border-t border-black/5 shadow-[0_12px_24px_-12px_rgba(15,23,42,0.18)]">
          <div className="px-6 max-w-[1440px] mx-auto py-4 flex flex-col">
            {LINKS.map((l) => {
              const active = l.match?.(pathname) ?? false;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={`py-3 text-[16px] border-b border-black/5 last:border-b-0 ${active ? "text-[#1565C0] font-medium" : "font-light hover:text-[#707070]"}`}
                >
                  {l.label}
                </Link>
              );
            })}
            <div className="sm:hidden mt-4 flex flex-col gap-3">
              <button className="px-6 py-[10px] rounded-full border border-black/20 text-[15px]">Sign in</button>
              <button className="px-6 py-[10px] rounded-full bg-[#1565C0] text-white text-[15px] font-medium">Start now for free</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
