import { Apple, ChevronDown, Dumbbell } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Section } from '../../shared/ui/section';

interface NutritionPillar {
  title: string;
  copy: string;
}

interface NutritionFaqEntry {
  question: string;
  answer: string;
}

export function NutritionPage() {
  const { t } = useTranslation();
  const pillars = t('nutrition.pillars', { returnObjects: true }) as NutritionPillar[];
  const faq = t('nutrition.faq', { returnObjects: true }) as NutritionFaqEntry[];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-kicker">{t('nutrition.hero.title')}</div>
        <h1 className="page-title">{t('nutrition.hero.title')}</h1>
        <p className="page-subtitle">{t('nutrition.hero.subtitle')}</p>
      </div>

      <Section eyebrow={t('nutrition.hero.title')} title={t('nutrition.hero.title')}>
        <div className="grid cards">
          {pillars.map((pillar) => (
            <article className="panel soft pad" key={pillar.title}>
              <div className="panel-header">
                <div>
                  <div className="list-item-title">{pillar.title}</div>
                  <p className="panel-copy">{pillar.copy}</p>
                </div>
                <Apple className="icon" />
              </div>
            </article>
          ))}
        </div>
      </Section>

      <div style={{ height: 16 }} />

      <Section eyebrow="FAQ" title="FAQ">
        <div className="list">
          {faq.map((entry, index) => {
            const isOpen = openFaqIndex === index;

            return (
              <div className="list-item" key={entry.question} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span className="list-item-title">{entry.question}</span>
                  <ChevronDown
                    className="icon"
                    style={{ transform: isOpen ? 'rotate(180deg)' : undefined, transition: 'transform 0.15s' }}
                  />
                </button>
                {isOpen ? <p className="panel-copy">{entry.answer}</p> : null}
              </div>
            );
          })}
        </div>
      </Section>

      <div style={{ height: 16 }} />

      <Section eyebrow={t('musclePlan.title')} title={t('musclePlan.title')}>
        <div className="panel pad muscle-glp1-card">
          <div className="panel-header">
            <div>
              <div className="pill accent">{t('musclePlan.upgrade.scienceBadge')}</div>
              <p className="panel-copy" style={{ marginTop: 8 }}>{t('musclePlan.upgrade.scienceCard')}</p>
            </div>
            <Dumbbell className="icon" />
          </div>
          <Link className="cta" to="/muscle-plan/dashboard">
            {t('musclePlan.title')}
          </Link>
        </div>
      </Section>
    </main>
  );
}
