import React from 'react';
import { useTranslation } from 'react-i18next';
import type { BubbleUser } from '../types';

interface AuthProps {
    user: BubbleUser | null;
    onLogin: () => void;
    onLogout: () => void;
}

const Auth: React.FC<AuthProps> = ({ user, onLogin, onLogout }) => {
    const { t } = useTranslation();

    if (user && user.is_logged_in) {
        return (
            <div className="flex items-center gap-3">
                <div className="text-sm text-right">
                    <p className="text-slate-500 dark:text-slate-400">{t('auth.welcome')}</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200 truncate">{user.email}</p>
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
        <button
            onClick={onLogin}
            className="px-4 py-2 text-sm font-semibold bg-sky-600 text-white rounded-lg shadow-md hover:bg-sky-700 transition-colors"
        >
            {t('auth.login')}
        </button>
    );
};

export default Auth;
