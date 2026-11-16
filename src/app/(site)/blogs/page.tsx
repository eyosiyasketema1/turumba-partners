"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, User, ArrowRight } from "lucide-react";

// Placeholder mock data
import { BLOG_POSTS } from "@/data/posts";

export default function BlogsPage() {
  const featuredPost = BLOG_POSTS[0];
  const otherPosts = BLOG_POSTS.slice(1);

  return (
    <div className="bg-[#F7F7F7] min-h-screen text-[#1A1A1A] flex flex-col">

      {/* Spacer for fixed navbar */}
      <div className="pt-28 md:pt-28 pb-16 px-6 max-w-[1440px] mx-auto w-full flex-grow">
        
        {/* Header Section (Editorial Style) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[44px] sm:text-[56px] md:text-[64px] lg:text-[72px] leading-[0.92] font-medium tracking-tight uppercase text-black"
          >
            Insights &<br className="lg:hidden" /> Updates
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-xs md:pb-3"
          >
            <p className="text-[#707070] text-[15px] font-light mb-4">
              Thoughts, stories, and ideas on digital infrastructure, messaging, and building the future of ministry technology.
            </p>
            <Link href="#latest-posts" className="inline-flex items-center gap-2 text-[13px] font-medium text-[#2B2A2A] hover:text-black transition-colors border-b border-[#C7C7C7] pb-1 uppercase tracking-wider">
              Explore Articles <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>

        {/* Featured Post Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20 md:mb-32 flex flex-col group cursor-pointer"
        >
          <Link href={`/blogs/${featuredPost.id}`}>
            {/* Massive Featured Image */}
            <div className="blog-feature relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-[min(470px,calc(100svh-460px))] lg:min-h-[320px] rounded-[16px] overflow-hidden mb-8 md:mb-10 bg-[#E5E5E5]">
              <Image
                src={featuredPost.imageUrl}
                alt={featuredPost.imageAlt}
                fill
                sizes="(min-width: 1440px) 1392px, 100vw"
                quality={90}
                style={{ objectPosition: featuredPost.imagePosition }}
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                priority
              />
              {/* brand pattern and a soft edge so the photo sits in the Turumba look */}
              <div aria-hidden className="absolute inset-0 pointer-events-none bg-[url('/brand/pattern-white.svg')] bg-[length:1400px_auto] bg-center opacity-[0.18] mix-blend-overlay" />
              <div aria-hidden className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_90%_at_50%_45%,rgba(4,20,38,0)_55%,rgba(4,20,38,0.35)_100%)]" />
              {/* Blue Ocean tint, stronger toward the corner, and a fine film grain */}
              <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-color bg-[linear-gradient(135deg,rgba(21,101,192,0.04)_0%,rgba(21,101,192,0.10)_45%,rgba(21,101,192,0.28)_100%)]" />
              <div aria-hidden className="absolute inset-0 pointer-events-none mix-blend-soft-light bg-[linear-gradient(160deg,rgba(28,75,209,0)_35%,rgba(21,101,192,0.45)_100%)]" />
              <div aria-hidden className="blog-grain absolute inset-0 pointer-events-none opacity-[0.22] mix-blend-overlay" />
            </div>
            
            {/* Featured Post Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
              
              {/* Left Side: Title & Meta */}
              <div className="md:col-span-7 flex flex-col pr-0 md:pr-12">
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#707070] font-medium mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#1565C0]"></span>
                  {featuredPost.category}
                </div>
                <h2 className="text-[32px] md:text-5xl lg:text-[46px] leading-[1.08] font-medium tracking-tight mb-4 md:mb-6 text-black group-hover:text-[#1565C0] transition-colors">
                  {featuredPost.title}
                </h2>
              </div>
              
              {/* Right Side: Excerpt & CTA */}
              <div className="md:col-span-5 flex flex-col md:pt-8">
                <p className="text-[#707070] text-base md:text-lg font-light leading-relaxed mb-6 md:mb-8">
                  {featuredPost.excerpt}
                </p>
                
                {/* Meta details (Dates & Writer) */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#707070] font-light mb-6 md:mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{featuredPost.author}, {featuredPost.authorRole}</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-3 text-[15px] font-medium text-black hover:text-[#1565C0] transition-colors uppercase tracking-wider">
                  Read full article <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
            </div>
          </Link>
        </motion.div>

        {/* Latest Posts Header */}
        <div id="latest-posts" className="flex justify-between items-center border-t border-black/10 pt-16 mb-12">
          <div className="flex items-center gap-3 text-black font-semibold tracking-widest uppercase text-sm">
            <span className="w-2.5 h-2.5 bg-black rounded-full"></span>
            Latest Posts
          </div>
        </div>

        {/* Latest Posts Grid (Editorial Masonry Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-16">
          {otherPosts.map((post, index) => {
            // Determine column span based on index to create 1/3 and 2/3 dynamic layouts
            // two articles: side by side, same shape
            const gridClass = "lg:col-span-6";
            const aspectClass = "aspect-[4/3]";

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group flex flex-col ${gridClass}`}
              >
                <Link href={`/blogs/${post.id}`} className="flex flex-col flex-1">
                  {/* Sharp Image Container */}
                  <div className={`relative w-full ${aspectClass} rounded-[6px] overflow-hidden bg-[#E5E5E5] mb-6`}>
                    <Image
                      src={post.imageUrl}
                      alt={post.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      style={{ objectPosition: post.imagePosition }}
                      className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col">
                    {/* Meta Data */}
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#707070] mb-3">
                      <span>{post.date}</span>
                      <span className="text-[#C7C7C7]">/</span>
                      <span className="border border-black/20 px-2 py-0.5 rounded-full text-black">
                        {post.category}
                      </span>
                    </div>

                    {/* Title (Super bold, tight tracking like reference) */}
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-black uppercase tracking-tight leading-[1.1] mb-4 group-hover:text-[#1565C0] transition-colors">
                      {post.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-[#707070] text-[15px] font-light line-clamp-2 mb-4 leading-relaxed max-w-xl">
                      {post.excerpt}
                    </p>

                    {/* CTA Link */}
                    <div className="inline-flex items-center gap-2 text-[#1565C0] font-bold text-[11px] uppercase tracking-widest group-hover:translate-x-1 transition-transform w-fit">
                      Read article <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
