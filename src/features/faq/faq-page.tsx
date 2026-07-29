import { ChevronDown, HelpCircle, Search, Send, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../entities/auth/auth-store';
import { submitUserQuestion } from '../../lib/supabase/user-questions';
import { Section } from '../../shared/ui/section';

interface FaqCategory {
  id: string;
  label: string;
}

interface FaqItem {
  id: string;
  category: string;
  q: string;
  a: string;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

export function FaqPage() {
  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.user?.id ?? null);

  const categories = t('faq.categories', { returnObjects: true }) as FaqCategory[];
  const items = t('faq.items', { returnObjects: true }) as FaqItem[];

  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return items.filter((item) => {
      const matchesCat = activeCat === 'all' || item.category === activeCat;
      const matchesQuery = q === '' || normalize(`${item.q} ${item.a}`).includes(q);
      return matchesCat && matchesQuery;
    });
  }, [items, query, activeCat]);

  async function handleSubmitQuestion() {
    if (!userId || !question.trim()) {
      return;
    }
    setSubmitting(true);
    setStatus('idle');
    try {
      await submitUserQuestion(userId, question.trim());
      setStatus('success');
      setQuestion('');
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-kicker">{t('faq.kicker')}</div>
        <h1 className="page-title">{t('faq.title')}</h1>
        <p className="page-subtitle">{t('faq.subtitle')}</p>
      </div>

      {/* Search */}
      <div className="faq-search">
        <Search className="icon" />
        <input
          className="faq-search__input"
          type="search"
          placeholder={t('faq.searchPlaceholder')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query ? (
          <button type="button" className="faq-search__clear" onClick={() => setQuery('')} aria-label={t('faq.searchClear')}>
            <X className="icon" />
          </button>
        ) : null}
      </div>

      {/* Category filter */}
      <div className="choice-chip-row" style={{ flexWrap: 'wrap', marginTop: 12 }}>
        <button
          type="button"
          className={activeCat === 'all' ? 'choice-chip selected' : 'choice-chip'}
          onClick={() => setActiveCat('all')}
        >
          {t('faq.allLabel')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={activeCat === cat.id ? 'choice-chip selected' : 'choice-chip'}
            onClick={() => setActiveCat(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <p className="dashboard-mini-label" style={{ marginTop: 12 }}>
        {t('faq.resultsCount', { count: filtered.length })}
      </p>

      {/* Question list */}
      {filtered.length > 0 ? (
        <div className="list" style={{ marginTop: 8 }}>
          {filtered.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div className="list-item" key={item.id} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span className="list-item-title">{item.q}</span>
                  <ChevronDown
                    className="icon"
                    style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : undefined, transition: 'transform 0.15s' }}
                  />
                </button>
                {isOpen ? <p className="panel-copy" style={{ marginTop: 8 }}>{item.a}</p> : null}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="panel-copy" style={{ marginTop: 8 }}>{t('faq.noResults')}</p>
      )}

      <p className="dashboard-mini-label" style={{ marginTop: 16 }}>{t('faq.disclaimer')}</p>

      <div style={{ height: 20 }} />

      {/* Ask a question */}
      <Section eyebrow={t('faq.kicker')} title={t('faq.ask.title')}>
        <div className="panel pad">
          <div className="panel-header">
            <p className="panel-copy">{t('faq.ask.copy')}</p>
            <HelpCircle className="icon" />
          </div>
          <div className="stack" style={{ gap: 10 }}>
            <textarea
              className="auth-input"
              rows={3}
              placeholder={t('faq.ask.placeholder')}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              style={{ resize: 'vertical' }}
            />
            {status === 'success' ? <div className="auth-alert">{t('faq.ask.success')}</div> : null}
            {status === 'error' ? <div className="auth-alert">{t('faq.ask.error')}</div> : null}
            <button
              className="cta"
              type="button"
              disabled={submitting || !question.trim()}
              onClick={() => void handleSubmitQuestion()}
            >
              {submitting ? t('auth.working') : t('faq.ask.submit')}
              <Send className="icon" />
            </button>
          </div>
        </div>
      </Section>
    </main>
  );
}
