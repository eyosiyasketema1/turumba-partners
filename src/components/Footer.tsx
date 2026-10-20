import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-white text-black pt-32 pb-10">
      <div className="max-w-[1440px] mx-auto w-full px-12">
        
        {/* Top CTA Section */}
        <div className="flex flex-col items-center text-center mb-28">
          {/* Badge */}
          <div className="bg-[#E7EFF9] text-[#1565C0] text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-8">
            GET STARTED
          </div>
          
          <h2 className="text-[36px] lg:text-[48px] leading-[1.1] tracking-[-0.03em] font-medium text-[#1A1A1A] max-w-2xl mb-10">
            Ready to run messaging and engagement from one place?
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="bg-[#1565C0] hover:bg-[#11519A] transition-colors text-white font-medium py-3.5 px-7 rounded-full text-[15px] flex items-center gap-2">
              Start now for free 
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.33334 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 3.33334L12.6667 8.00001L8 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="bg-white border border-[#E5E5E5] hover:border-[#C7C7C7] transition-colors text-[#1A1A1A] font-medium py-3.5 px-7 rounded-full text-[15px]">
              Request a demo
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-[#EEEEEE] mb-20" />

        {/* Links Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Left: Logo & Description */}
          <div className="lg:col-span-4 lg:col-start-1">
            <div className="mb-6 flex items-end gap-2">
              <Image src="/brand/turumba-logo-blue.svg" alt="Turumba Messaging" width={133} height={44} className="h-[44px] w-auto" />
            </div>
            <p className="text-[#707070] text-[14px] leading-[1.6] max-w-[280px]">
              One platform for messaging, automation, and realtime support — powered by AI.
            </p>
          </div>

          {/* Right: 3 Columns of Links */}
          <div className="lg:col-span-7 lg:col-start-6 grid grid-cols-2 md:grid-cols-3 gap-8">
            
            {/* Column 1: PRODUCT */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[#1A1A1A] text-[12px] font-bold tracking-wider uppercase mb-2">Product</h4>
              <Link href="#" className="text-[#707070] hover:text-[#1A1A1A] text-[14px] transition-colors">Messaging</Link>
              <Link href="#" className="text-[#707070] hover:text-[#1A1A1A] text-[14px] transition-colors">Automation</Link>
              <Link href="#" className="text-[#707070] hover:text-[#1A1A1A] text-[14px] transition-colors">AI Engine</Link>
              <Link href="#" className="text-[#707070] hover:text-[#1A1A1A] text-[14px] transition-colors">Real-time Inbox</Link>
              <Link href="#" className="text-[#707070] hover:text-[#1A1A1A] text-[14px] transition-colors">Website Chat</Link>
            </div>

            {/* Column 2: RESOURCES */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[#1A1A1A] text-[12px] font-bold tracking-wider uppercase mb-2">Resources</h4>
              <Link href="#" className="text-[#707070] hover:text-[#1A1A1A] text-[14px] transition-colors">Documentation</Link>
              <Link href="#" className="text-[#707070] hover:text-[#1A1A1A] text-[14px] transition-colors">Blog</Link>
              <Link href="#" className="text-[#707070] hover:text-[#1A1A1A] text-[14px] transition-colors">API Reference</Link>
              <Link href="#" className="text-[#707070] hover:text-[#1A1A1A] text-[14px] transition-colors">Changelog</Link>
            </div>

            {/* Column 3: COMPANY */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[#1A1A1A] text-[12px] font-bold tracking-wider uppercase mb-2">Company</h4>
              <Link href="#" className="text-[#707070] hover:text-[#1A1A1A] text-[14px] transition-colors">About</Link>
              <Link href="#" className="text-[#707070] hover:text-[#1A1A1A] text-[14px] transition-colors">Contact</Link>
              <Link href="#" className="text-[#707070] hover:text-[#1A1A1A] text-[14px] transition-colors">Privacy</Link>
              <Link href="#" className="text-[#707070] hover:text-[#1A1A1A] text-[14px] transition-colors">Terms</Link>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-[#EEEEEE] mb-8" />

        {/* Bottom Tagline & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-[#8F8F8F]">
          <p>© 2026 Turumba. All rights reserved.</p>
          <p>Built for teams that need control and intelligence.</p>
        </div>

      </div>
    </footer>
  );
}
