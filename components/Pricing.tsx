
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, CrownIcon, XCircleIcon } from './icons';
import type { UserProfile } from '../types';
import { upgradeSubscription } from '../services/supabaseService';

interface PricingProps {
  userProfile: UserProfile | null;
  onLoginRequest: () => void;
  onRefreshProfile: () => void;
}

const Pricing: React.FC<PricingProps> = ({ userProfile, onLoginRequest, onRefreshProfile }) => {
  const { t, i18n } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingTier, setLoadingTier] = useState<'pro' | 'enterprise' | null>(null);

  const isRtl = i18n.dir() === 'rtl';
  const currentPlan = userProfile?.subscription_tier || 'free';

  const handleUpgrade = async (tier: 'pro' | 'enterprise') => {
    if (!userProfile) {
      onLoginRequest();
      return;
    }

    if (tier === 'enterprise') {
      window.location.href = "mailto:sales@strategic-advisor.com?subject=Enterprise Inquiry";
      return;
    }

    if (confirm(`Mock Payment: Upgrade to ${tier.toUpperCase()} plan?`)) {
      setLoadingTier(tier);
      try {
        await upgradeSubscription(userProfile.id, tier);
        alert("Upgrade Successful! Welcome to Pro.");
        onRefreshProfile();
      } catch (e) {
        console.error("Upgrade failed", e);
        alert("Upgrade failed. Please try again.");
      } finally {
        setLoadingTier(null);
      }
    }
  };

  const plans = [
    {
      id: 'free',
      name: t('pricing.plans.free.name'),
      desc: t('pricing.plans.free.desc'),
      price: t('pricing.plans.free.price'),
      features: t('pricing.plans.free.features', { returnObjects: true }) as string[],
      cta: t('pricing.plans.free.cta'),
      popular: false,
      color: 'bg-white dark:bg-slate-800',
      btnColor: 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-white',
    },
    {
      id: 'pro',
      name: t('pricing.plans.pro.name'),
      desc: t('pricing.plans.pro.desc'),
      price: billingCycle === 'yearly' ? '$39' : t('pricing.plans.pro.price'),
      period: billingCycle === 'yearly' ? '/mo' : '/mo',
      features: t('pricing.plans.pro.features', { returnObjects: true }) as string[],
      cta: t('pricing.plans.pro.cta'),
      popular: true,
      color: 'bg-gradient-to-b from-sky-50 to-white dark:from-slate-800 dark:to-slate-900 border-sky-500',
      btnColor: 'bg-sky-600 text-white hover:bg-sky-700 shadow-lg shadow-sky-500/30',
    },
    {
      id: 'enterprise',
      name: t('pricing.plans.enterprise.name'),
      desc: t('pricing.plans.enterprise.desc'),
      price: t('pricing.plans.enterprise.price'),
      features: t('pricing.plans.enterprise.features', { returnObjects: true }) as string[],
      cta: t('pricing.plans.enterprise.cta'),
      popular: false,
      color: 'bg-white dark:bg-slate-800',
      btnColor: 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600',
    }
  ];

  return (
    <div className="animate-fade-in py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          {t('pricing.title')}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          {t('pricing.subtitle')}
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center gap-4">
          <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
            {t('pricing.monthly')}
          </span>
          <button
            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${billingCycle === 'yearly' ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-600'}`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${billingCycle === 'yearly' ? (isRtl ? '-translate-x-7' : 'translate-x-7') : (isRtl ? '-translate-x-1' : 'translate-x-1')}`}
            />
          </button>
          <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
            {t('pricing.yearly')} 
            <span className="ms-2 inline-block px-2 py-0.5 text-xs font-bold text-green-700 bg-green-100 rounded-full">
              {t('pricing.save')} 20%
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <div 
              key={plan.id}
              className={`relative rounded-2xl p-8 border ${plan.popular ? 'border-2 border-sky-500 shadow-xl scale-105 z-10' : 'border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md'} ${plan.color} transition-all duration-300 flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-sky-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
                  <CrownIcon className="w-4 h-4" />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 h-10">{plan.desc}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                {plan.period && <span className="text-slate-500 dark:text-slate-400">{plan.period}</span>}
              </div>

              <button
                onClick={() => handleUpgrade(plan.id as any)}
                disabled={isCurrent || loadingTier === plan.id}
                className={`w-full py-3 rounded-xl font-bold text-center transition-all ${plan.btnColor} ${isCurrent ? 'opacity-50 cursor-default' : ''}`}
              >
                {loadingTier === plan.id 
                  ? 'Processing...' 
                  : isCurrent 
                    ? t('pricing.currentPlan') 
                    : plan.cta}
              </button>

              <ul className="mt-8 space-y-4 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircleIcon className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-sky-500' : 'text-slate-400'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing;
