import { BarChart3, CheckCircle2, Circle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  fetchAdminQuestions,
  fetchAdminSideEffectRequests,
  setQuestionStatus,
  setSideEffectRequestStatus,
  type AdminQuestion,
  type AdminSideEffectRequest,
} from '../../lib/supabase/admin-inbox';
import { fetchUserSegmentation, type UserSegmentation } from '../../lib/supabase/segmentation';
import { Section } from '../../shared/ui/section';

type Tab = 'analytics' | 'questions' | 'requests';

function shortDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' · ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function DistributionBars({
  data,
  total,
  labelFor,
}: {
  data: Record<string, number>;
  total: number;
  labelFor: (key: string) => string;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return <p className="panel-copy">—</p>;
  }

  return (
    <div className="stack" style={{ gap: 10 }}>
      {entries.map(([key, count]) => {
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <div key={key} className="stack" style={{ gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="list-item-title">{labelFor(key)}</span>
              <span className="panel-copy">
                {count} · {pct}%
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: 'rgba(120, 140, 160, 0.15)', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: 'var(--accent, #3b6ef5)' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AnalyticsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('analytics');

  const [data, setData] = useState<UserSegmentation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [requests, setRequests] = useState<AdminSideEffectRequest[]>([]);

  useEffect(() => {
    let mounted = true;

    fetchUserSegmentation()
      .then((result) => {
        if (mounted) setData(result);
      })
      .catch((err) => {
        console.error('[analytics] failed to load segmentation', err);
        if (mounted) setError(t('analytics.loadError'));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    fetchAdminQuestions()
      .then((rows) => {
        if (mounted) setQuestions(rows);
      })
      .catch((err) => console.error('[analytics] failed to load questions', err));

    fetchAdminSideEffectRequests()
      .then((rows) => {
        if (mounted) setRequests(rows);
      })
      .catch((err) => console.error('[analytics] failed to load requests', err));

    return () => {
      mounted = false;
    };
  }, []);

  async function toggleQuestion(item: AdminQuestion) {
    const next = item.status === 'answered' ? 'submitted' : 'answered';
    setQuestions((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: next } : q)));
    try {
      await setQuestionStatus(item.id, next);
    } catch {
      setQuestions((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: item.status } : q)));
    }
  }

  async function toggleRequest(item: AdminSideEffectRequest) {
    const next = item.status === 'reviewed' ? 'submitted' : 'reviewed';
    setRequests((prev) => prev.map((r) => (r.id === item.id ? { ...r, status: next } : r)));
    try {
      await setSideEffectRequestStatus(item.id, next);
    } catch {
      setRequests((prev) => prev.map((r) => (r.id === item.id ? { ...r, status: item.status } : r)));
    }
  }

  const total = data?.totalProfiles ?? 0;
  const pendingQuestions = questions.filter((q) => q.status !== 'answered').length;
  const pendingRequests = requests.filter((r) => r.status === 'submitted').length;

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-kicker">{t('analytics.kicker')}</div>
        <h1 className="page-title">{t('analytics.title')}</h1>
        <p className="page-subtitle">{t('analytics.subtitle')}</p>
      </div>

      <div className="choice-chip-row" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
        <button type="button" className={tab === 'analytics' ? 'choice-chip selected' : 'choice-chip'} onClick={() => setTab('analytics')}>
          {t('analytics.tabAnalytics')}
        </button>
        <button type="button" className={tab === 'questions' ? 'choice-chip selected' : 'choice-chip'} onClick={() => setTab('questions')}>
          {t('analytics.tabQuestions')}{pendingQuestions > 0 ? ` (${pendingQuestions})` : ''}
        </button>
        <button type="button" className={tab === 'requests' ? 'choice-chip selected' : 'choice-chip'} onClick={() => setTab('requests')}>
          {t('analytics.tabRequests')}{pendingRequests > 0 ? ` (${pendingRequests})` : ''}
        </button>
      </div>

      {/* ── Analytics ──────────────────────────────────────────────── */}
      {tab === 'analytics' ? (
        <>
          {loading ? <p className="panel-copy">{t('loading')}</p> : null}
          {error ? <div className="auth-alert">{error}</div> : null}
          {data ? (
            <div className="stack" style={{ gap: 16 }}>
              <div className="panel soft pad">
                <div className="panel-header">
                  <div>
                    <div className="page-kicker">{t('analytics.totalUsers')}</div>
                    <div className="metric-value" style={{ fontSize: 40 }}>
                      {data.totalProfiles}
                    </div>
                  </div>
                  <BarChart3 className="icon" />
                </div>
              </div>

              <Section eyebrow={t('analytics.intentTitle')} title={t('analytics.intentTitle')}>
                <DistributionBars data={data.byIntent} total={total} labelFor={(key) => t(`analytics.intentLabels.${key}`, key)} />
              </Section>

              <Section eyebrow={t('analytics.severityTitle')} title={t('analytics.severityTitle')}>
                <DistributionBars data={data.bySymptomProfile} total={total} labelFor={(key) => t(`analytics.severityLabels.${key}`, key)} />
              </Section>

              <Section eyebrow={t('analytics.timeTitle')} title={t('analytics.timeTitle')}>
                <DistributionBars data={data.byTimeBucket} total={total} labelFor={(key) => t(`analytics.timeLabels.${key}`, key)} />
              </Section>

              <Section eyebrow={t('analytics.symptomsTitle')} title={t('analytics.symptomsTitle')}>
                <DistributionBars data={data.topSymptoms} total={total} labelFor={(key) => t(`sideEffects.content.${key}.title`, key)} />
              </Section>
            </div>
          ) : null}
        </>
      ) : null}

      {/* ── User questions ─────────────────────────────────────────── */}
      {tab === 'questions' ? (
        <div className="list">
          {questions.length === 0 ? (
            <p className="panel-copy">{t('analytics.noQuestions')}</p>
          ) : (
            questions.map((q) => {
              const done = q.status === 'answered';
              return (
                <div className="list-item" key={q.id} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span className="dashboard-mini-label">{q.email}</span>
                    <span className="dashboard-mini-label">{shortDateTime(q.createdAt)}</span>
                  </div>
                  <div className="list-item-title">{q.question}</div>
                  <button
                    type="button"
                    className={done ? 'pill primary' : 'pill accent'}
                    style={{ width: 'fit-content', cursor: 'pointer', border: 'none' }}
                    onClick={() => void toggleQuestion(q)}
                  >
                    {done ? <CheckCircle2 className="icon" /> : <Circle className="icon" />}
                    {done ? t('analytics.markPending') : t('analytics.markAnswered')}
                  </button>
                </div>
              );
            })
          )}
        </div>
      ) : null}

      {/* ── Side-effect requests ───────────────────────────────────── */}
      {tab === 'requests' ? (
        <div className="list">
          {requests.length === 0 ? (
            <p className="panel-copy">{t('analytics.noRequests')}</p>
          ) : (
            requests.map((r) => {
              const done = r.status !== 'submitted';
              return (
                <div className="list-item" key={r.id} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span className="dashboard-mini-label">{r.email}</span>
                    <span className="dashboard-mini-label">{shortDateTime(r.createdAt)}</span>
                  </div>
                  <div className="list-item-title">{r.queryText}</div>
                  {r.categoryGuess ? <div className="list-item-copy">{r.categoryGuess}</div> : null}
                  {r.notes ? <div className="list-item-copy">{t('analytics.notesLabel')}: {r.notes}</div> : null}
                  <button
                    type="button"
                    className={done ? 'pill primary' : 'pill accent'}
                    style={{ width: 'fit-content', cursor: 'pointer', border: 'none' }}
                    onClick={() => void toggleRequest(r)}
                  >
                    {done ? <CheckCircle2 className="icon" /> : <Circle className="icon" />}
                    {done ? t('analytics.markPending') : t('analytics.markReviewed')}
                  </button>
                </div>
              );
            })
          )}
        </div>
      ) : null}
    </main>
  );
}
