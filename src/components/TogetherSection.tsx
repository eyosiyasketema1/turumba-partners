"use client";

import React from 'react';
import { motion } from 'framer-motion';

const items = [
  {
    from: "From fragmented tools",
    to: "to connected infrastructure.",
    bgImage: "/bg1.jpg",
    imageDefault: "/card1-default.jpg",
    imageHover: "/card1-hover.jpg"
  },
  {
    from: "From messages",
    to: "to meaningful relationships.",
    bgImage: "/bg2.jpg",
    imageDefault: "/card2-default.jpg",
    imageHover: "/card2-hover.jpg"
  },
  {
    from: "From isolated efforts",
    to: "to intentional collaboration.",
    bgImage: "/bg3.jpg",
    imageDefault: "/card3-default.jpg",
    imageHover: "/card3-hover.jpg"
  },
  {
    from: "From technology that simply reaches people",
    to: "to technology that helps us serve people better.",
    bgImage: "/bg1.jpg",
    imageDefault: "/card4-default.jpg",
    imageHover: "/card4-hover.jpg"
  }
];

export default function TogetherSection() {
  return (
    <section className="w-full bg-white text-black pb-32">
      <div className="max-w-[1440px] mx-auto w-full px-12">
        
        {/* Header */}
        <div className="flex flex-col mb-12 lg:mb-16">
          <h2 className="text-[64px] leading-[1.1] pb-2 tracking-[-0.03em] font-medium bg-gradient-to-l from-[#2563EB] to-[#20A9E1] text-transparent bg-clip-text">
            Together, we can move
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            return (
              <motion.div 
                key={i}
                className="group relative w-full h-[420px] rounded-[32px] overflow-hidden bg-gray-50 flex flex-col justify-end p-3 cursor-pointer shadow-sm border border-gray-100"
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } },
                  hover: { y: 0 }
                }}
              >
                
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <motion.img 
                    src={item.bgImage}
                    alt="Card Background"
                    className="absolute inset-0 w-full h-full object-cover"
                    variants={{
                      hidden: { scale: 1 },
                      visible: { scale: 1 },
                      hover: { scale: 1.05 }
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  {/* Reduced dark overlay */}
                  <div className="absolute inset-0 bg-black/5 z-10" />
                </div>

                {/* AI-Generated Images converted to Pure White Icons via CSS blending */}
                {/* mix-blend-screen is placed on this static parent to prevent Framer Motion from breaking the blending context */}
                <div className="absolute top-8 left-0 right-0 h-[160px] flex items-center justify-center z-10 pointer-events-none px-6 mix-blend-screen">
                  <div className="relative w-[160px] h-[160px] flex items-center justify-center">
                    
                    {/* Default Icon (Fades out on hover) */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      variants={{
                        hidden: { opacity: 1, scale: 1 },
                        visible: { opacity: 1, scale: 1 },
                        hover: { opacity: 0, scale: 0.95 }
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <img
                        src={item.imageDefault}
                        className="w-full h-full object-contain"
                        style={{ filter: "invert(1) grayscale(1) brightness(250%) contrast(200%)" }}
                        alt=""
                      />
                    </motion.div>

                    {/* Hover Icon (Fades in on hover) */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      variants={{
                        hidden: { opacity: 0, scale: 0.95 },
                        visible: { opacity: 0, scale: 0.95 },
                        hover: { opacity: 1, scale: 1 }
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <img
                        src={item.imageHover}
                        className="w-full h-full object-contain"
                        style={{ filter: "invert(1) grayscale(1) brightness(250%) contrast(200%)" }}
                        alt=""
                      />
                    </motion.div>

                  </div>
                </div>

                {/* Floating Text Card */}
                <motion.div 
                  className="relative z-20 w-full bg-white/95 backdrop-blur-sm rounded-[24px] p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60"
                  variants={{
                    hidden: { y: 0 },
                    visible: { y: 0 },
                    hover: { y: -4 }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.p 
                    className="text-[14px] lg:text-[15px] mb-2"
                    variants={{
                      hidden: { color: "#A1A1AA", fontWeight: 500 },
                      visible: { color: "#A1A1AA", fontWeight: 500 },
                      hover: { color: "#0F172A", fontWeight: 700 }
                    }}
                  >
                    {item.from}
                  </motion.p>
                  <motion.p 
                    className="text-[18px] lg:text-[20px] leading-[1.3] tracking-[-0.01em]"
                    variants={{
                      hidden: { color: "#2563EB", fontWeight: 700 },
                      visible: { color: "#2563EB", fontWeight: 700 },
                      hover: { color: "#94A3B8", fontWeight: 500 }
                    }}
                  >
                    {item.to}
                  </motion.p>
                </motion.div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
