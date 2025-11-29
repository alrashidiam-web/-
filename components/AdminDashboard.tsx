
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAppSettings, updateAppSetting, getBlogPosts, saveBlogPost, deleteBlogPost, getAllProfiles, updateUserProfile, getFAQs, saveFAQ, deleteFAQ } from '../services/supabaseService';
import type { AppSettings, BlogPost, UserProfile, FAQItem } from '../types';
import { CheckIcon, TrashIcon, PlusCircleIcon, DocumentIcon, WrenchScrewdriverIcon, PersonPlusIcon, QuestionMarkCircleIcon, LockClosedIcon } from './icons';

interface AdminDashboardProps {
  onSettingsUpdate: (settings: AppSettings) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSettingsUpdate }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'settings' | 'blog' | 'users' | 'content'>('settings');
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [settings, setSettings] = useState<AppSettings>({});
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // Editing States
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
        const [s, p, u, f] = await Promise.all([
            getAppSettings(),
            getBlogPosts(),
            getAllProfiles(),
            getFAQs()
        ]);
        setSettings(s);
        setPosts(p);
        setUsers(u);
        setFaqs(f);
    } catch (error) {
        console.error("Failed to load admin data", error);
    } finally {
        setLoading(false);
    }
  };

  // --- Settings Logic ---
  const handleSettingChange = (key: keyof AppSettings, value: string) => {
      setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
      setLoading(true);
      try {
          for (const [key, value] of Object.entries(settings)) {
              if (value !== undefined) await updateAppSetting(key, value as string);
          }
          onSettingsUpdate(settings);
          alert(t('admin.settingsSaved'));
      } catch (error) {
          console.error(error);
          alert("Failed to save settings");
      } finally {
          setLoading(false);
      }
  };

  // --- Blog Logic ---
  const handleEditPost = (post: BlogPost) => setEditingPost(post);
  const handleNewPost = () => setEditingPost({ title: '', excerpt: '', content: '', category: 'General', is_published: true });
  
  const handleSavePost = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingPost) return;
      setLoading(true);
      try {
          await saveBlogPost(editingPost);
          setPosts(await getBlogPosts());
          setEditingPost(null);
      } catch (error) {
          alert("Failed to save post");
      } finally {
          setLoading(false);
      }
  };

  const handleDeletePost = async (id: string) => {
      if(!confirm("Are you sure?")) return;
      try {
          await deleteBlogPost(id);
          setPosts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
          alert("Failed to delete post");
      }
  };

  // --- Users Logic ---
  const handleUserUpdate = async (userId: string, field: keyof UserProfile, value: any) => {
      if(!confirm("Update user?")) return;
      try {
          await updateUserProfile(userId, { [field]: value });
          setUsers(users.map(u => u.id === userId ? { ...u, [field]: value } : u));
      } catch(e) {
          alert("Update failed");
      }
  };

  // --- FAQ Logic ---
  const handleEditFaq = (faq: FAQItem) => setEditingFaq(faq);
  const handleNewFaq = () => setEditingFaq({ question_ar: '', answer_ar: '', question_en: '', answer_en: '', display_order: faqs.length + 1 });
  
  const handleSaveFaq = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingFaq) return;
      setLoading(true);
      try {
          await saveFAQ(editingFaq);
          setFaqs(await getFAQs());
          setEditingFaq(null);
      } catch(e) {
          alert("Failed to save FAQ");
      } finally {
          setLoading(false);
      }
  }
  
  const handleDeleteFaq = async (id: string) => {
      if(!confirm("Delete FAQ?")) return;
      try {
          await deleteFAQ(id);
          setFaqs(prev => prev.filter(f => f.id !== id));
      } catch(e) {
          alert("Failed to delete");
      }
  }


  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`pb-4 px-4 font-bold transition-colors flex items-center gap-2 ${activeTab === id ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
    >
        {Icon && <Icon className="w-5 h-5" />}
        {label}
    </button>
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
            <WrenchScrewdriverIcon className="w-8 h-8 text-sky-600" />
            {t('admin.title')}
        </h1>

        <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
            <TabButton id="settings" label={t('admin.tabs.settings')} icon={WrenchScrewdriverIcon} />
            <TabButton id="users" label={t('admin.tabs.users')} icon={PersonPlusIcon} />
            <TabButton id="content" label={t('admin.tabs.content')} icon={QuestionMarkCircleIcon} />
            <TabButton id="blog" label={t('admin.tabs.blog')} icon={DocumentIcon} />
        </div>

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">{t('admin.settings.socialTitle')}</h2>
                    <div className="space-y-4">
                        {['linkedin', 'twitter', 'instagram', 'youtube'].map(net => (
                            <div key={net}>
                                <label className="block text-sm font-semibold mb-2 dark:text-slate-300 capitalize">{net} URL</label>
                                <input type="text" value={settings[`${net}_url`] || ''} onChange={(e) => handleSettingChange(`${net}_url`, e.target.value)} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">{t('admin.settings.systemTitle')}</h2>
                    
                    <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                         <div className="flex items-center justify-between mb-2">
                             <span className="font-semibold dark:text-white">{t('admin.settings.maintenance')}</span>
                             <button 
                                onClick={() => handleSettingChange('maintenance_mode', settings.maintenance_mode === 'true' ? 'false' : 'true')}
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenance_mode === 'true' ? 'bg-red-500' : 'bg-slate-300'}`}
                             >
                                 <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.maintenance_mode === 'true' ? 'left-7' : 'left-1'}`}></span>
                             </button>
                         </div>
                         <p className="text-xs text-slate-500">Stops users from creating new analyses.</p>
                    </div>

                    <div className="mb-6">
                         <label className="block text-sm font-semibold mb-2 dark:text-slate-300">Stripe Public Key (Simulation)</label>
                         <div className="flex items-center gap-2">
                            <LockClosedIcon className="w-5 h-5 text-slate-400" />
                            <input type="password" value={settings.stripe_public_key || ''} onChange={(e) => handleSettingChange('stripe_public_key', e.target.value)} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" />
                         </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <button onClick={saveSettings} disabled={loading} className="w-full py-4 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors shadow-lg">
                        {loading ? "Saving..." : t('admin.save')}
                    </button>
                </div>
            </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold dark:text-white">{t('admin.users.title')}</h2>
                    <span className="text-sm text-slate-500">{users.length} Users Found</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left dark:text-slate-300">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Plan</th>
                                <th className="p-4">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                    <td className="p-4 font-medium">{user.email}</td>
                                    <td className="p-4">
                                        <select 
                                            value={user.is_admin ? 'admin' : 'user'}
                                            onChange={(e) => handleUserUpdate(user.id, 'is_admin', e.target.value === 'admin')}
                                            className="px-2 py-1 rounded border text-sm dark:bg-slate-700 dark:border-slate-600"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <select 
                                            value={user.subscription_tier}
                                            onChange={(e) => handleUserUpdate(user.id, 'subscription_tier', e.target.value)}
                                            className={`px-2 py-1 rounded border text-sm font-bold dark:bg-slate-700 dark:border-slate-600 ${user.subscription_tier === 'pro' ? 'text-sky-600' : user.subscription_tier === 'enterprise' ? 'text-purple-600' : 'text-slate-600'}`}
                                        >
                                            <option value="free">Free</option>
                                            <option value="pro">Pro</option>
                                            <option value="enterprise">Enterprise</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">{new Date(user.created_at || '').toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* CONTENT TAB (FAQ) */}
        {activeTab === 'content' && (
            <div className="space-y-6 animate-fade-in">
                {editingFaq ? (
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                         <h2 className="text-xl font-bold mb-6 dark:text-white">Edit FAQ</h2>
                         <form onSubmit={handleSaveFaq} className="space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                    <label className="block text-sm font-bold mb-2 dark:text-slate-300">Question (Arabic)</label>
                                    <input type="text" required value={editingFaq.question_ar} onChange={(e) => setEditingFaq({...editingFaq, question_ar: e.target.value})} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 text-right" dir="rtl" />
                                 </div>
                                 <div>
                                    <label className="block text-sm font-bold mb-2 dark:text-slate-300">Answer (Arabic)</label>
                                    <textarea required value={editingFaq.answer_ar} onChange={(e) => setEditingFaq({...editingFaq, answer_ar: e.target.value})} rows={3} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 text-right" dir="rtl" />
                                 </div>
                                 <div>
                                    <label className="block text-sm font-bold mb-2 dark:text-slate-300">Question (English)</label>
                                    <input type="text" required value={editingFaq.question_en} onChange={(e) => setEditingFaq({...editingFaq, question_en: e.target.value})} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" />
                                 </div>
                                 <div>
                                    <label className="block text-sm font-bold mb-2 dark:text-slate-300">Answer (English)</label>
                                    <textarea required value={editingFaq.answer_en} onChange={(e) => setEditingFaq({...editingFaq, answer_en: e.target.value})} rows={3} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" />
                                 </div>
                             </div>
                             <div className="flex gap-4">
                                 <button type="submit" className="px-6 py-2 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700">Save</button>
                                 <button type="button" onClick={() => setEditingFaq(null)} className="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300">Cancel</button>
                             </div>
                         </form>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold dark:text-white">FAQs</h2>
                            <button onClick={handleNewFaq} className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
                                <PlusCircleIcon className="w-5 h-5" /> Add FAQ
                            </button>
                        </div>
                        <div className="space-y-4">
                            {faqs.map(faq => (
                                <div key={faq.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white">{faq.question_en}</p>
                                        <p className="text-sm text-slate-500 text-right">{faq.question_ar}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditFaq(faq)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg"><WrenchScrewdriverIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleDeleteFaq(faq.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* BLOG TAB */}
        {activeTab === 'blog' && (
            <div className="space-y-6 animate-fade-in">
                {editingPost ? (
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold dark:text-white">{editingPost.id ? 'Edit Post' : 'New Post'}</h2>
                            <button onClick={() => setEditingPost(null)} className="text-slate-500">Cancel</button>
                         </div>
                         <form onSubmit={handleSavePost} className="space-y-6">
                             <div>
                                <label className="block text-sm font-bold mb-2 dark:text-slate-300">Title</label>
                                <input type="text" required value={editingPost.title} onChange={(e) => setEditingPost({...editingPost, title: e.target.value})} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" />
                             </div>
                             <div>
                                <label className="block text-sm font-bold mb-2 dark:text-slate-300">Category</label>
                                <input type="text" required value={editingPost.category} onChange={(e) => setEditingPost({...editingPost, category: e.target.value})} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" />
                             </div>
                             <div>
                                <label className="block text-sm font-bold mb-2 dark:text-slate-300">Excerpt</label>
                                <textarea required value={editingPost.excerpt} onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})} rows={3} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600" />
                             </div>
                             <div>
                                <label className="block text-sm font-bold mb-2 dark:text-slate-300">Content (HTML)</label>
                                <textarea required value={editingPost.content} onChange={(e) => setEditingPost({...editingPost, content: e.target.value})} rows={10} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 font-mono text-sm" />
                             </div>
                             <div className="flex items-center gap-2">
                                <input type="checkbox" checked={editingPost.is_published} onChange={(e) => setEditingPost({...editingPost, is_published: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
                                <label className="dark:text-white">Published</label>
                             </div>
                             <button type="submit" disabled={loading} className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700">
                                {loading ? "Saving..." : "Save Post"}
                             </button>
                         </form>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold dark:text-white">Blog Posts</h2>
                            <button onClick={handleNewPost} className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
                                <PlusCircleIcon className="w-5 h-5" /> New Post
                            </button>
                        </div>
                        <div className="space-y-4">
                            {posts.map(post => (
                                <div key={post.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">{post.title}</h4>
                                        <p className="text-xs text-slate-500">{post.date} • {post.is_published ? 'Published' : 'Draft'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditPost(post)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg"><DocumentIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleDeletePost(post.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
