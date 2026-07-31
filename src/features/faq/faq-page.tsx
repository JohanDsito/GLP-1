import { ArrowLeft, ChevronDown, ChevronRight, HelpCircle, Search, Send, X } from 'lucide-react';
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

export function FaqView() {
  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.user?.id ?? null);

  const categories = t('faq.categories', { returnObjects: true }) as FaqCategory[];
  const items = t('faq.items', { returnObjects: true }) as FaqItem[];

  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const q = normalize(query.trim());
  const searching = q !== '';

  // When searching we look across every category; otherwise we show the
  // questions of the selected topic only (keeps the scroll short as the
  // library grows).
  const shownItems = useMemo(() => {
    if (searching) {
      return items.filter((item) => normalize(`${item.q} ${item.a}`).includes(q));
    }
    if (activeCat) {
      return items.filter((item) => item.category === activeCat);
    }
    return [];
  }, [items, q, searching, activeCat]);

  const countByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      map.set(item.category, (map.get(item.category) ?? 0) + 1);
    }
    return map;
  }, [items]);

  const activeCategoryLabel = categories.find((c) => c.id === activeCat)?.label ?? '';

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

  function QuestionList({ list }: { list: FaqItem[] }) {
    if (list.length === 0) {
      return <p className="panel-copy" style={{ marginTop: 8 }}>{t('faq.noResults')}</p>;
    }
    return (
      <div className="list" style={{ marginTop: 8 }}>
        {list.map((item) => {
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
    );
  }

  return (
    <>
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

      {searching ? (
        // ── Search results across all topics ──────────────────────
        <>
          <p className="dashboard-mini-label" style={{ marginTop: 12 }}>
            {t('faq.resultsCount', { count: shownItems.length })}
          </p>
          <QuestionList list={shownItems} />
        </>
      ) : activeCat ? (
        // ── Questions inside the chosen topic ─────────────────────
        <>
          <button
            type="button"
            className="subtle-link"
            style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
            onClick={() => {
              setActiveCat(null);
              setOpenId(null);
            }}
          >
            <ArrowLeft className="icon" style={{ display: 'inline-block' }} /> {t('faq.allTopics')}
          </button>
          <h2 className="panel-title" style={{ marginTop: 10 }}>{activeCategoryLabel}</h2>
          <QuestionList list={shownItems} />
        </>
      ) : (
        // ── Topic menu (default) ──────────────────────────────────
        <>
          <p className="dashboard-mini-label" style={{ marginTop: 12, marginBottom: 4 }}>{t('faq.chooseTopic')}</p>
          <div className="list">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className="list-item"
                style={{ width: '100%', cursor: 'pointer', textAlign: 'left', background: 'none' }}
                onClick={() => {
                  setActiveCat(cat.id);
                  setOpenId(null);
                }}
              >
                <div>
                  <div className="list-item-title">{cat.label}</div>
                  <div className="list-item-copy">{t('faq.resultsCount', { count: countByCategory.get(cat.id) ?? 0 })}</div>
                </div>
                <ChevronRight className="icon" />
              </button>
            ))}
          </div>
        </>
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
    </>
  );
}
