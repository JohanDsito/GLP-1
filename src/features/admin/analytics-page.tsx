import { BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchUserSegmentation, type UserSegmentation } from '../../lib/supabase/segmentation';
import { Section } from '../../shared/ui/section';

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
            <div
              style={{
                height: 8,
                borderRadius: 999,
                background: 'rgba(120, 140, 160, 0.15)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: 'var(--accent, #3b6ef5)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AnalyticsPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<UserSegmentation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchUserSegmentation()
      .then((result) => {
        if (mounted) {
          setData(result);
        }
      })
      .catch((err) => {
        console.error('[analytics] failed to load segmentation', err);
        if (mounted) {
          setError(t('analytics.loadError'));
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const total = data?.totalProfiles ?? 0;

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-kicker">{t('analytics.kicker')}</div>
        <h1 className="page-title">{t('analytics.title')}</h1>
        <p className="page-subtitle">{t('analytics.subtitle')}</p>
      </div>

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
            <DistributionBars
              data={data.byIntent}
              total={total}
              labelFor={(key) => t(`analytics.intentLabels.${key}`, key)}
            />
          </Section>

          <Section eyebrow={t('analytics.severityTitle')} title={t('analytics.severityTitle')}>
            <DistributionBars
              data={data.bySymptomProfile}
              total={total}
              labelFor={(key) => t(`analytics.severityLabels.${key}`, key)}
            />
          </Section>

          <Section eyebrow={t('analytics.timeTitle')} title={t('analytics.timeTitle')}>
            <DistributionBars
              data={data.byTimeBucket}
              total={total}
              labelFor={(key) => t(`analytics.timeLabels.${key}`, key)}
            />
          </Section>

          <Section eyebrow={t('analytics.symptomsTitle')} title={t('analytics.symptomsTitle')}>
            <DistributionBars
              data={data.topSymptoms}
              total={total}
              labelFor={(key) => t(`sideEffects.content.${key}.title`, key)}
            />
          </Section>

          <div className="panel soft pad">
            <div className="panel-header">
              <div>
                <div className="page-kicker">{t('analytics.pendingRequests')}</div>
                <div className="metric-value" style={{ fontSize: 32 }}>
                  {data.pendingRequests}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
