import { ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../entities/auth/auth-store';
import type { SideEffectRequestCategoryGuess } from '../../lib/supabase/side-effect-requests';
import { submitSideEffectRequest } from '../../lib/supabase/side-effect-requests';

export function SideEffectRequestPage() {
  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const [categoryGuess, setCategoryGuess] = useState<SideEffectRequestCategoryGuess>('unsure');
  const [queryText, setQueryText] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  async function handleSubmit() {
    if (!userId || !queryText.trim()) {
      return;
    }

    setSubmitting(true);
    setStatus('idle');

    try {
      await submitSideEffectRequest(userId, { categoryGuess, queryText: queryText.trim(), notes: notes.trim() || undefined });
      setStatus('success');
      setQueryText('');
      setNotes('');
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page">
      <Link className="subtle-link" to="/symptom-monitor">
        <ArrowLeft className="icon" style={{ display: 'inline-block' }} /> {t('sideEffects.title')}
      </Link>

      <div className="page-head">
        <h1 className="page-title">{t('sideEffects.request.title')}</h1>
        <p className="page-subtitle">{t('sideEffects.request.subtitle')}</p>
      </div>

      <section className="panel pad">
        <div className="stack">
          <label className="stack" style={{ gap: 8 }}>
            <span className="onboarding-step">{t('sideEffects.request.categoryLabel')}</span>
            <div className="dashboard-pills">
              {(['physical', 'psychological', 'unsure'] as SideEffectRequestCategoryGuess[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={categoryGuess === option ? 'pill primary' : 'pill soft'}
                  onClick={() => setCategoryGuess(option)}
                >
                  {t(`sideEffects.request.categoryOptions.${option}`)}
                </button>
              ))}
            </div>
          </label>

          <label className="stack" style={{ gap: 8 }}>
            <span className="onboarding-step">{t('sideEffects.request.queryLabel')}</span>
            <input
              className="auth-input"
              type="text"
              placeholder={t('sideEffects.request.queryPlaceholder')}
              value={queryText}
              onChange={(event) => setQueryText(event.target.value)}
            />
          </label>

          <label className="stack" style={{ gap: 8 }}>
            <span className="onboarding-step">{t('sideEffects.request.notesLabel')}</span>
            <input
              className="auth-input"
              type="text"
              placeholder={t('sideEffects.request.notesPlaceholder')}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>

          {status === 'success' ? <div className="auth-alert">{t('sideEffects.request.success')}</div> : null}
          {status === 'error' ? <div className="auth-alert">{t('sideEffects.request.error')}</div> : null}

          <button
            className="cta"
            type="button"
            disabled={submitting || !queryText.trim()}
            onClick={() => void handleSubmit()}
          >
            {t('sideEffects.request.submit')}
            <Send className="icon" />
          </button>
        </div>
      </section>
    </main>
  );
}
