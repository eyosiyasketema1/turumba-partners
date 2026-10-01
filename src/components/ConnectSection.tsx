"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function ConnectSection() {
  return (
    <section className="w-full bg-white text-black py-32 overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full px-12">
        
        {/* Header Row */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20"
        >
          <h2 className="text-[64px] leading-[100%] tracking-[-0.03em] font-medium max-w-lg bg-gradient-to-l from-[#2563EB] to-[#20A9E1] text-transparent bg-clip-text">
            We are looking to <br />
            connect with
          </h2>
          <p className="text-[20px] leading-[130%] tracking-[-0.01em] text-[#626262] font-medium max-w-[563px] lg:mt-4">
            We especially want to hear from organizations wrestling with communication, follow-up, discipleship, engagement, content delivery, or collaboration. You don&apos;t need the answers. If you see the need for better digital infrastructure, build it with us.
          </p>
        </motion.div>

        {/* Grid Row */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#E6E6E6]">
          
          {/* Row 1 */}
          <Card index={0} text="AI and data experts" />
          <Card index={1} text="Digital Ministry Leaders" />
          <Card index={2} text="Organizations exploring new models of digital engagement" className="lg:col-span-2" />

          {/* Row 2 */}
          <Card index={3} text="Ministries & mission organization" />
          <Card index={4} text="Churches and church networks" />
          <Card index={5} text="Content and discipleship organizations" />
          <Card index={6} text="Researchers and innovators" />

          {/* Row 3 */}
          <Card index={7} text="Founders and strategic partners" className="lg:col-span-2" />
          <Card index={8} text="Mentors and follow-up teams" />
          <Card index={9} text="Technology partners and developers" />

          {/* Circles on the inner grid intersections plus the four outer corners */}
          {[
            ...[125.5, 251.5].flatMap((top) => [25, 50, 75].map((left) => ({ left, top }))),
            { left: 0, top: -0.5 },
            { left: 100, top: -0.5 },
            { left: 0, top: 377.5 },
            { left: 100, top: 377.5 },
          ].map(({ left, top }) => (
            <span
              key={`${left}-${top}`}
              aria-hidden="true"
              className="pointer-events-none absolute z-10 hidden lg:block w-[9px] h-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C2C2C2]"
              style={{ left: `calc(${left}% - 0.5px)`, top }}
            />
          ))}

        </div>
      </div>
    </section>
  );
}

function Card({ text, className = "", index = 0 }: { text: string; className?: string; index?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative border-r border-b border-[#E6E6E6] h-[126px] px-8 flex items-center gap-4 ${className}`}
    >
      <div className="w-4 h-4 rounded-full bg-gradient-to-l from-[#2563EB] to-[#20A9E1] shrink-0" />
      <span className="text-[17px] font-semibold text-gray-800 leading-snug">
        {text}
      </span>
    </motion.div>
  );
}
