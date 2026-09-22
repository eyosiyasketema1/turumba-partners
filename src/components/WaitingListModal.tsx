"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WaitingListModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-waiting-list', handleOpen);
    return () => window.removeEventListener('open-waiting-list', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-[720px] bg-white rounded-2xl shadow-2xl z-10 overflow-hidden my-auto"
        >
          
          {/* Close Button */}
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors z-20"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="p-8 md:p-12">
            
            {!isSubmitted ? (
              /* --- STATE 1: FORM --- */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-[#2563EB] text-[12px] font-bold tracking-[0.15em] uppercase mb-4">
                  Early Access
                </p>
                <h2 className="text-[32px] md:text-[40px] font-bold text-[#0F172A] leading-tight mb-4 tracking-[-0.02em]">
                  Join the Turumba Waiting List
                </h2>
                <p className="text-[16px] text-[#64748B] leading-relaxed mb-10 max-w-xl">
                  Be among the early organizations, leaders, and builders helping shape the future of Digital Infrastructure for Kingdom Collaboration.
                </p>

                <form onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[14px] font-medium text-[#0F172A] mb-2">
                        Full Name <span className="text-[#2563EB]">*</span>
                      </label>
                      <input required type="text" placeholder="Selamawit Bekele" className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[15px] text-gray-900 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all" />
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-[#0F172A] mb-2">
                        Email Address <span className="text-[#2563EB]">*</span>
                      </label>
                      <input required type="email" placeholder="selamawit@hopechurch.org" className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[15px] text-gray-900 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all" />
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-[#0F172A] mb-2">
                        Organization / Ministry
                      </label>
                      <input type="text" placeholder="Hope Church Network" className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[15px] text-gray-900 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all" />
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-[#0F172A] mb-2">
                        Country
                      </label>
                      <input type="text" placeholder="Ethiopia" className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[15px] text-gray-900 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all" />
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-[#0F172A] mb-2">
                        Your Role
                      </label>
                      <input type="text" placeholder="Director of Digital Ministry" className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[15px] text-gray-900 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all" />
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-[#0F172A] mb-2">
                        What best describes you?
                      </label>
                      <input type="text" placeholder="Church / Church Network" className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[15px] text-gray-900 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium text-[#0F172A] mb-2">
                      What challenge are you most interested in solving with Turumba?
                    </label>
                    <textarea rows={4} placeholder="We reach thousands of people through Facebook and YouTube, but we lose most of them after the first message. We need a way to follow up personally at that scale." className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-[15px] text-gray-900 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all resize-y"></textarea>
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-medium py-4 px-8 rounded-lg text-[16px] shadow-sm w-full md:w-auto">
                      Join the Waiting List
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* --- STATE 2: SUCCESS / SHARE --- */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-2">
                
                {/* Top Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <button onClick={() => setIsOpen(false)} className="bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white font-medium py-3.5 px-6 rounded-lg text-[15px] shadow-sm">
                    Back to the vision
                  </button>
                  <button onClick={() => setIsSubmitted(false)} className="bg-white border border-gray-200 hover:border-gray-300 transition-colors text-[#0F172A] font-medium py-3.5 px-6 rounded-lg text-[15px]">
                    Add another response
                  </button>
                </div>

                <div className="w-full h-px bg-gray-100 mb-10" />

                {/* Invite Section (Light green tinted bg in design) */}
                <div className="bg-[#F4FAF8] -mx-8 -mb-8 md:-mx-12 md:-mb-12 p-8 md:p-12">
                  <p className="text-[#059669] text-[12px] font-bold tracking-[0.15em] uppercase mb-4">
                    Invite Others
                  </p>
                  <h2 className="text-[28px] md:text-[32px] font-bold text-[#0F172A] leading-tight mb-3 tracking-[-0.02em]">
                    Invite others to join the movement.
                  </h2>
                  <p className="text-[16px] text-[#64748B] leading-relaxed mb-8 max-w-lg">
                    The future should not be built alone. Pass it on to someone who should be part of it.
                  </p>

                  <div className="bg-white border border-gray-200 rounded-lg p-2 pl-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 shadow-sm">
                    <span className="text-gray-600 text-[15px] truncate">turumba.net/waiting-list</span>
                    <button className="text-[#2563EB] font-semibold text-[15px] hover:text-[#1D4ED8] px-4 py-2 transition-colors whitespace-nowrap">
                      Copy link
                    </button>
                  </div>

                  {/* Social Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button className="bg-white border border-gray-200 hover:border-gray-300 transition-colors rounded-lg px-4 py-2.5 flex items-center gap-2 text-[14px] font-medium text-[#0F172A] shadow-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      WhatsApp
                    </button>
                    <button className="bg-white border border-gray-200 hover:border-gray-300 transition-colors rounded-lg px-4 py-2.5 flex items-center gap-2 text-[14px] font-medium text-[#0F172A] shadow-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                      Telegram
                    </button>
                    <button className="bg-white border border-gray-200 hover:border-gray-300 transition-colors rounded-lg px-4 py-2.5 flex items-center gap-2 text-[14px] font-medium text-[#0F172A] shadow-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                      Email
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
