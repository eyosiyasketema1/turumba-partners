"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, Mail, Link as LinkIcon } from "lucide-react";
import { motion, useScroll } from "framer-motion";
import { use, useState } from "react";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/data/posts";

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll();
  const post = BLOG_POSTS.find(p => p.id === resolvedParams.id);
  if (!post) notFound();
  const more = BLOG_POSTS.filter(p => p.id !== post.id);

  // share: native share sheet where available, email, copy link
  const pageUrl = () => (typeof window !== "undefined" ? window.location.href : "");
  const shareNative = async () => {
    if (navigator.share) { try { await navigator.share({ title: post.title, text: post.excerpt, url: pageUrl() }); } catch { /* closed */ } }
    else copyLink();
  };
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(pageUrl()); setCopied(true); window.setTimeout(() => setCopied(false), 2000); } catch { /* blocked */ }
  };

  return (
    <div className="bg-[#F7F7F7] min-h-screen text-[#1A1A1A] selection:bg-[#1565C0] selection:text-white pb-32">
      
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#1565C0] origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />
      
      <article className="max-w-[1440px] mx-auto px-6 pt-32 pb-24">
        
        {/* Back Link (Static) */}
        <div className="mb-12">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#707070] hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to latest posts
          </Link>
        </div>
        
        {/* Header Section */}
        <header className="max-w-4xl mx-auto text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-[#707070] mb-8"
          >
            <span>{post.date}</span>
            <span className="text-[#C7C7C7]">/</span>
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
            className="text-xl md:text-2xl text-[#707070] font-light max-w-3xl mx-auto leading-relaxed"
          >
            {post.excerpt}
          </motion.p>
        </header>

        {/* Massive Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-6xl mx-auto aspect-[16/9] md:aspect-[21/9] relative overflow-hidden mb-16 md:mb-24 bg-[#E5E5E5] rounded-[6px]"
        >
          <Image 
            src={post.imageUrl} 
            alt={post.imageAlt} 
            fill 
            sizes="(min-width: 1152px) 1152px, 100vw"
            quality={90}
            style={{ objectPosition: post.imagePosition }}
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
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#8F8F8F] mb-3 lg:mb-4">Written By</h4>
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Circular Avatar */}
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-[#EEEEEE] shrink-0 border border-black/5">
                    <Image src="/partners/samson-usmael.jpg" alt="" fill sizes="48px" className="object-cover object-[50%_18%]" />
                  </div>
                  
                  {/* Name, Title, and Socials */}
                  <div className="flex flex-col">
                    <p className="font-bold text-black text-xs md:text-sm uppercase tracking-wide mb-0.5">{post.author}</p>
                    <p className="text-[11px] md:text-[11px] text-[#707070] font-medium mb-1.5">{post.authorRole}</p>
                    
                  </div>
                </div>
              </div>

              {/* Share Links */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#8F8F8F] mb-3 lg:mb-4">Share Article</h4>
                <div className="flex items-center gap-3 lg:gap-4 text-[#8F8F8F]">
                  <button type="button" onClick={shareNative} aria-label="Share this article" className="hover:text-[#1565C0] transition-colors"><Share2 className="w-4 h-4 md:w-5 md:h-5" /></button>
                  <a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(post.excerpt + "\n\n")}`} onClick={(e) => { e.currentTarget.href = `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(post.excerpt + "\n\n" + pageUrl())}`; }} aria-label="Share by email" className="hover:text-[#1565C0] transition-colors"><Mail className="w-4 h-4 md:w-5 md:h-5" /></a>
                  <button type="button" onClick={copyLink} aria-label="Copy link" className="hover:text-black transition-colors"><LinkIcon className="w-4 h-4 md:w-5 md:h-5" /></button>
                  {copied && <span className="text-[11px] font-bold uppercase tracking-widest text-[#1565C0]">Copied</span>}
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
            <div className="text-[17px] md:text-[19px] leading-[1.7] md:leading-[1.8] text-[#2B2A2A] font-light space-y-6 md:space-y-8">
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

                // a heading written directly above its paragraph (no blank line) becomes its own block
                const blocks = post.content.split('\n\n').filter(Boolean).flatMap((b) => {
                  const nl = b.indexOf('\n');
                  return /^#{2,3}\s/.test(b) && nl > 0 ? [b.slice(0, nl), b.slice(nl + 1).trim()].filter(Boolean) : [b];
                });
                
                return blocks.map((block, index) => {
                  const key = index;
                  
                  if (block.startsWith('## ')) {
                    return <h2 key={key} className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight mt-16 mb-6">{parseInline(block.replace(/^##\s/, ''))}</h2>;
                  } else if (block.startsWith('### ')) {
                    return <h3 key={key} className="text-xl md:text-2xl font-bold text-black uppercase tracking-tight mt-12 mb-4">{parseInline(block.replace(/^###\s/, ''))}</h3>;
                  } else if (block.startsWith('> ')) {
                    return (
                      <blockquote key={key} className="border-l-[3px] border-[#1565C0] pl-6 my-16">
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
                  } else if (block.startsWith('![')) {
                    const m = block.match(/^!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)/);
                    if (m) {
                      return (
                        <figure key={key} className="my-12 md:my-16 -mx-0 md:-mx-8">
                          <div className="relative w-full aspect-[3/2] rounded-[12px] overflow-hidden bg-[#E5E5E5]">
                            <Image src={m[2]} alt={m[1]} fill sizes="(min-width: 768px) 760px, 100vw" quality={90} className="object-cover" />
                          </div>
                          {m[3] && <figcaption className="mt-3 text-[13px] md:text-sm text-[#707070] font-normal">{m[3]}</figcaption>}
                        </figure>
                      );
                    }
                    return <p key={key}>{parseInline(block)}</p>;
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
                <div className="w-2 h-2 bg-[#C7C7C7] rounded-full"></div>
                <div className="w-2 h-2 bg-[#C7C7C7] rounded-full"></div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* More articles */}
        {more.length > 0 && (
          <section aria-labelledby="more-articles" className="max-w-6xl mx-auto mt-24 md:mt-32 pt-12 border-t border-black/10">
            <h2 id="more-articles" className="flex items-center gap-3 text-black font-semibold tracking-widest uppercase text-sm mb-10">
              <span className="w-2.5 h-2.5 bg-black rounded-full"></span>
              More articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {more.map((p) => (
                <Link key={p.id} href={`/blogs/${p.id}`} className="group flex flex-col">
                  <div className="relative w-full aspect-[16/10] rounded-[6px] overflow-hidden bg-[#E5E5E5] mb-5">
                    <Image src={p.imageUrl} alt={p.imageAlt} fill sizes="(min-width: 768px) 50vw, 100vw" style={{ objectPosition: p.imagePosition }} className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#707070] mb-3">
                    <span>{p.date}</span>
                    <span className="text-[#C7C7C7]">/</span>
                    <span className="border border-black/20 px-2 py-0.5 rounded-full text-black">{p.category}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight leading-[1.1] mb-3 group-hover:text-[#1565C0] transition-colors">{p.title}</h3>
                  <p className="text-[#707070] text-[15px] font-light line-clamp-2 leading-relaxed">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

    </div>
  );
}
