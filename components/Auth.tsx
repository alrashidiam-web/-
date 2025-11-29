
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { User } from '../types';
import { signIn, signUp } from '../services/supabaseService';
import { XMarkIcon } from './icons';

interface AuthProps {
    user: User | null;
    onLogout: () => void;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ user, onLogout, isOpen, onOpen, onClose }) => {
    const { t } = useTranslation();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isSignUp) {
                await signUp(email, password);
                alert("Account created! You are now logged in.");
            } else {
                await signIn(email, password);
            }
            // Note: We do NOT call onClose() here anymore.
            // The App component listens to auth state changes and will close the modal
            // and redirect the user automatically. This prevents race conditions.
            setEmail('');
            setPassword('');
        } catch (err: any) {
            console.error("Auth error:", err);
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        return (
            <div className="flex items-center gap-3 animate-fade-in">
                <div className="text-sm text-right hidden sm:block">
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{t('auth.welcome')}</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">{user.email}</p>
                </div>
                <button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg shadow-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                    {t('auth.logout')}
                </button>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={onOpen}
                className="px-4 py-2 text-sm font-semibold bg-sky-600 text-white rounded-lg shadow-md hover:bg-sky-700 transition-colors"
            >
                {t('auth.login')}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                {isSignUp ? "Create Account" : "Login"}
                            </h3>
                            <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAuth} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                <input 
                                    type="password" 
                                    required 
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg active:scale-95"
                            >
                                {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Login")}
                            </button>
                        </form>

                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center bg-slate-50 dark:bg-slate-900/50">
                            <button 
                                onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                                className="text-sm text-sky-600 dark:text-sky-400 font-semibold hover:underline"
                            >
                                {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Auth;
