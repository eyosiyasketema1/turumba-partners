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
    <div className="bg-[#F8F9FA] min-h-screen text-[#0F172A] flex flex-col">

      {/* Spacer for fixed navbar */}
      <div className="pt-32 pb-16 px-6 md:px-12 max-w-[1440px] mx-auto w-full flex-grow">
        
        {/* Header Section (Editorial Style) */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[64px] md:text-[80px] lg:text-[110px] leading-[0.9] font-medium tracking-tight uppercase text-black"
          >
            Insights &<br/>Updates
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-xs md:pb-3"
          >
            <p className="text-gray-600 text-[15px] font-light mb-4">
              Thoughts, stories, and ideas on digital infrastructure, messaging, and building the future of ministry technology.
            </p>
            <Link href="#other-articles" className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-800 hover:text-black transition-colors border-b border-gray-300 pb-1 uppercase tracking-wider">
              Explore Articles <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>

        {/* Featured Post Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-32 flex flex-col group cursor-pointer"
        >
          <Link href={`/blogs/${featuredPost.id}`}>
            {/* Massive Featured Image */}
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[650px] rounded-[6px] overflow-hidden mb-12 shadow-sm">
              <Image
                src={featuredPost.imageUrl}
                alt={featuredPost.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                priority
              />
            </div>
            
            {/* Featured Post Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Title & Meta */}
              <div className="md:col-span-7 flex flex-col pr-0 md:pr-12">
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-gray-500 font-medium mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
                  {featuredPost.category}
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-medium tracking-tight mb-6 text-black group-hover:text-[#2563EB] transition-colors">
                  {featuredPost.title}
                </h2>
              </div>
              
              {/* Right Side: Excerpt & CTA */}
              <div className="md:col-span-5 flex flex-col md:pt-10">
                <p className="text-gray-600 text-lg font-light leading-relaxed mb-8">
                  {featuredPost.excerpt}
                </p>
                
                {/* Meta details (Dates & Writer) */}
                <div className="flex items-center gap-6 text-sm text-gray-500 font-light mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{featuredPost.author}</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-3 text-[15px] font-medium text-black hover:text-[#2563EB] transition-colors uppercase tracking-wider">
                  Read full article <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
            </div>
          </Link>
        </motion.div>

        {/* Latest Posts Header */}
        <div id="latest-posts" className="flex justify-between items-center border-t border-black/10 pt-16 mb-8">
          <div className="flex items-center gap-3 text-black font-semibold tracking-widest uppercase text-sm">
            <span className="w-2.5 h-2.5 bg-black rounded-full"></span>
            Latest Posts
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 text-[11px] font-bold uppercase tracking-widest text-black gap-6">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-gray-500">Filter by category:</span>
            <div className="flex gap-2 flex-wrap">
              <button className="bg-black text-white px-4 py-1.5 rounded-full">All</button>
              <button className="border border-black/20 px-4 py-1.5 rounded-full hover:border-black transition-colors">Infrastructure</button>
              <button className="border border-black/20 px-4 py-1.5 rounded-full hover:border-black transition-colors">Collaboration</button>
              <button className="border border-black/20 px-4 py-1.5 rounded-full hover:border-black transition-colors">Messaging</button>
            </div>
          </div>
        </div>

        {/* Latest Posts Grid (Editorial Masonry Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-16">
          {otherPosts.map((post, index) => {
            // Determine column span based on index to create 1/3 and 2/3 dynamic layouts
            const spanClasses = [
              "lg:col-span-8", // 2/3
              "lg:col-span-4", // 1/3
              "lg:col-span-4", // 1/3
              "lg:col-span-8", // 2/3
              "lg:col-span-6", // 1/2
              "lg:col-span-6"  // 1/2
            ];
            
            const aspectClasses = [
              "aspect-[16/9] lg:aspect-[2/1]", // Wide
              "aspect-[4/5] lg:aspect-[3/4]",  // Tall
              "aspect-[4/5] lg:aspect-[3/4]",  // Tall
              "aspect-[16/9] lg:aspect-[2/1]", // Wide
              "aspect-[4/3]",                  // Standard
              "aspect-[4/3]"                   // Standard
            ];

            const gridClass = spanClasses[index % spanClasses.length];
            const aspectClass = aspectClasses[index % aspectClasses.length];

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group flex flex-col ${gridClass}`}
              >
                <Link href={`/blogs/${post.id}`} className="flex flex-col h-full">
                  {/* Sharp Image Container */}
                  <div className={`relative w-full ${aspectClass} rounded-[6px] overflow-hidden bg-gray-200 mb-6`}>
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col">
                    {/* Meta Data */}
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                      <span>{post.date}</span>
                      <span className="text-gray-300">/</span>
                      <span className="border border-black/20 px-2 py-0.5 rounded-full text-black">
                        {post.category}
                      </span>
                    </div>

                    {/* Title (Super bold, tight tracking like reference) */}
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-black uppercase tracking-tight leading-[1.1] mb-4 group-hover:text-[#2563EB] transition-colors">
                      {post.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 text-[15px] font-light line-clamp-2 mb-4 leading-relaxed max-w-xl">
                      {post.excerpt}
                    </p>

                    {/* CTA Link */}
                    <div className="inline-flex items-center gap-2 text-[#2563EB] font-bold text-[11px] uppercase tracking-widest group-hover:translate-x-1 transition-transform w-fit">
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
