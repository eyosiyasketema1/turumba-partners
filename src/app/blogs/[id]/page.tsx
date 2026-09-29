"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, Mail, Link as LinkIcon } from "lucide-react";
import { motion, useScroll } from "framer-motion";
import { use } from "react";
import { BLOG_POSTS } from "@/data/posts";

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  // Find the post, or default to the first one if not found
  const post = BLOG_POSTS.find(p => p.id === resolvedParams.id) || BLOG_POSTS[0];

  const { scrollYProgress } = useScroll();

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-[#0F172A] selection:bg-[#2563EB] selection:text-white pb-32">
      
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#2563EB] origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />
      
      <article className="max-w-[1440px] mx-auto px-6 md:px-12 pt-32 pb-24">
        
        {/* Back Link (Static) */}
        <div className="mb-12">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to latest posts
          </Link>
        </div>
        
        {/* Header Section */}
        <header className="max-w-4xl mx-auto text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-8"
          >
            <span>{post.date}</span>
            <span className="text-gray-300">/</span>
            <span className="border border-black/20 px-3 py-1 rounded-full text-black">{post.category}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] text-black mb-8"
          >
            {post.title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-500 font-light max-w-3xl mx-auto leading-relaxed"
          >
            {post.excerpt}
          </motion.p>
        </header>

        {/* Massive Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-6xl mx-auto aspect-[16/9] md:aspect-[21/9] relative overflow-hidden mb-16 md:mb-24 bg-gray-200 rounded-[6px]"
        >
          <Image 
            src={post.imageUrl} 
            alt={post.title} 
            fill 
            className="object-cover" 
            priority
          />
        </motion.div>

        {/* Content Layout (Sidebar + Main Reading Column) */}
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
          
          {/* Sticky Left Sidebar (Metadata & Share) */}
          <aside className="w-full lg:w-48 flex-shrink-0">
            <div className="lg:sticky lg:top-40 flex flex-row lg:flex-col justify-between lg:justify-start gap-6 lg:gap-12 border-y border-black/10 lg:border-none py-6 lg:py-0 mb-8 lg:mb-0">
              
              {/* Author Info */}
              <div className="flex flex-col">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 lg:mb-4">Written By</h4>
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Circular Avatar */}
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-black/5">
                    <Image 
                      src={post.author === "Eyosiya" ? "/hero-bg-2.png" : "/blog-img-4.jpg"} 
                      alt={post.author} 
                      fill 
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  
                  {/* Name, Title, and Socials */}
                  <div className="flex flex-col">
                    <p className="font-bold text-black text-xs md:text-sm uppercase tracking-wide mb-0.5">{post.author}</p>
                    <p className="text-[10px] md:text-[11px] text-gray-500 font-medium mb-1.5">{post.author === "Eyosiya" ? "Founder & CEO" : "Digital Ministry Team"}</p>
                    
                    {/* Socials */}
                    <div className="flex items-center gap-2.5">
                      <a href="#" className="text-gray-400 hover:text-black transition-colors" aria-label="X (Twitter)">
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                      </a>
                      <a href="#" className="text-gray-400 hover:text-[#0A66C2] transition-colors" aria-label="LinkedIn">
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Links */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 lg:mb-4">Share Article</h4>
                <div className="flex items-center gap-3 lg:gap-4 text-gray-400">
                  <button className="hover:text-[#2563EB] transition-colors"><Share2 className="w-4 h-4 md:w-5 md:h-5" /></button>
                  <button className="hover:text-[#2563EB] transition-colors"><Mail className="w-4 h-4 md:w-5 md:h-5" /></button>
                  <button className="hover:text-black transition-colors"><LinkIcon className="w-4 h-4 md:w-5 md:h-5" /></button>
                </div>
              </div>

            </div>
          </aside>

          {/* Main Reading Column (The actual article content) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-grow max-w-[65ch] w-full"
          >
            <div className="text-[17px] md:text-[19px] leading-[1.7] md:leading-[1.8] text-gray-800 font-light space-y-6 md:space-y-8">
              {(() => {
                if (!post.content) {
                  return <p>This is a placeholder for the article body. The full written content for this article has not been published yet!</p>;
                }

                // Simple yet beautiful Markdown-to-JSX parser for our editorial style
                const parseInline = (text: string) => {
                  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
                  return parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i} className="font-bold text-black">{part.slice(2, -2)}</strong>;
                    }
                    if (part.startsWith('*') && part.endsWith('*')) {
                      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
                    }
                    return part;
                  });
                };

                const blocks = post.content.split('\n\n').filter(Boolean);
                
                return blocks.map((block, index) => {
                  const key = index;
                  
                  if (block.startsWith('## ')) {
                    return <h2 key={key} className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight mt-16 mb-6">{parseInline(block.replace(/^##\s/, ''))}</h2>;
                  } else if (block.startsWith('### ')) {
                    return <h3 key={key} className="text-xl md:text-2xl font-bold text-black uppercase tracking-tight mt-12 mb-4">{parseInline(block.replace(/^###\s/, ''))}</h3>;
                  } else if (block.startsWith('> ')) {
                    return (
                      <blockquote key={key} className="border-l-[3px] border-[#2563EB] pl-6 my-16">
                        <p className="text-2xl md:text-3xl font-medium text-black leading-snug italic tracking-tight">
                          {parseInline(block.replace(/^>\s/, ''))}
                        </p>
                      </blockquote>
                    );
                  } else if (block.startsWith('- ') || block.startsWith('* ')) {
                    const items = block.split('\n').filter(i => i.trim());
                    return (
                      <ul key={key} className="list-disc pl-6 space-y-4 my-8">
                        {items.map((item, i) => (
                          <li key={i}>{parseInline(item.replace(/^[-*]\s/, ''))}</li>
                        ))}
                      </ul>
                    );
                  } else if (block === '---') {
                    return <hr key={key} className="my-16 border-t border-black/10" />;
                  } else {
                    return <p key={key}>{parseInline(block)}</p>;
                  }
                });
              })()}

              {/* End of article marker */}
              <div className="flex items-center gap-4 mt-16">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </motion.div>

        </div>
      </article>

    </div>
  );
}
