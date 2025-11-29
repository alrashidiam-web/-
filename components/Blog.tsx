
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BlogIcon } from './icons';
import type { BlogPost } from '../types';
import { getBlogPosts } from '../services/supabaseService';

const Blog: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Try fetching from DB
                const dbPosts = await getBlogPosts();
                
                if (dbPosts && dbPosts.length > 0) {
                    setPosts(dbPosts);
                } else {
                    // Fallback to i18n mocked data if DB is empty
                    const i18nPosts = t('blog.posts', { returnObjects: true }) as BlogPost[];
                    // Ensure i18n returned an array (guard against undefined)
                    setPosts(Array.isArray(i18nPosts) ? i18nPosts : []);
                }
            } catch (err) {
                console.error("Failed to load blog posts", err);
                // Fallback
                const i18nPosts = t('blog.posts', { returnObjects: true }) as BlogPost[];
                setPosts(Array.isArray(i18nPosts) ? i18nPosts : []);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [t]);

    const activePost = posts.find(p => p.id === selectedPostId);

    const handleBack = () => {
        window.scrollTo(0,0);
        setSelectedPostId(null);
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center dark:bg-slate-900"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (activePost) {
        return (
            <div className="animate-fade-in bg-white dark:bg-slate-900 min-h-screen pb-16">
                 {/* Article Header */}
                <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-12 px-6">
                    <div className="container mx-auto max-w-3xl">
                        <button onClick={handleBack} className="text-sm font-semibold text-sky-600 dark:text-sky-400 mb-6 hover:underline flex items-center gap-1">
                             {i18n.dir() === 'rtl' ? '← العودة للمدونة' : '← Back to Blog'}
                        </button>
                        <div className="flex items-center gap-4 mb-4 text-sm text-slate-500 dark:text-slate-400">
                             <span className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-3 py-1 rounded-full text-xs font-bold uppercase">{activePost.category}</span>
                             <span>{activePost.date}</span>
                             <span>•</span>
                             <span>{activePost.readTime}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">{activePost.title}</h1>
                        <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-serif">{activePost.excerpt}</p>
                    </div>
                </div>

                {/* Article Content */}
                <div className="container mx-auto px-6 max-w-3xl py-12">
                     <div 
                        className="prose prose-lg prose-slate dark:prose-invert max-w-none font-serif leading-loose"
                        dangerouslySetInnerHTML={{ __html: activePost.content }} 
                     />
                     <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('blog.share')}</h3>
                        <div className="flex gap-4">
                            {/* Simple mock share buttons */}
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">LinkedIn</button>
                            <button className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-bold hover:bg-sky-600 transition-colors">Twitter</button>
                        </div>
                     </div>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-fade-in bg-slate-50 dark:bg-slate-900 min-h-screen">
             {/* Hero */}
            <div className="relative bg-slate-900 dark:bg-black py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 opacity-90"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-sky-400 text-xs font-semibold mb-6 border border-slate-700">
                        <BlogIcon className="w-4 h-4" />
                        <span>{t('blog.badge')}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">{t('blog.title')}</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">{t('blog.subtitle')}</p>
                </div>
            </div>

            {/* Post Grid */}
            <div className="container mx-auto px-6 py-16">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {posts.map(post => (
                          <article key={post.id} className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onClick={() => { window.scrollTo(0,0); setSelectedPostId(post.id); }}>
                               <div className="h-48 bg-slate-200 dark:bg-slate-700 w-full relative overflow-hidden">
                                   <div className={`absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-80 group-hover:scale-105 transition-transform duration-500`}></div>
                                   <div className="absolute top-4 left-4">
                                       <span className="bg-white/90 dark:bg-black/50 backdrop-blur-sm text-slate-900 dark:text-white px-3 py-1 rounded-full text-xs font-bold uppercase">{post.category}</span>
                                   </div>
                               </div>
                               <div className="p-6 flex-1 flex flex-col">
                                   <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                       <span>{post.date}</span>
                                       <span>•</span>
                                       <span>{post.readTime}</span>
                                   </div>
                                   <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{post.title}</h2>
                                   <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-1 line-clamp-3">{post.excerpt}</p>
                                   <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                        <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">{t('blog.readMore')} &rarr;</span>
                                   </div>
                               </div>
                          </article>
                      ))}
                 </div>
            </div>
        </div>
    );
};

export default Blog;
