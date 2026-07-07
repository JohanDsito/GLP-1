import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface LegalSection {
  h: string;
  p: string;
}

export function LegalPage({ doc }: { doc: 'terms' | 'privacy' }) {
  const { t } = useTranslation();
  const sections = t(`legal.${doc}.sections`, { returnObjects: true }) as LegalSection[];

  return (
    <main className="page" style={{ maxWidth: 760 }}>
      <Link className="subtle-link" to="/auth">
        <ArrowLeft className="icon" style={{ display: 'inline-block' }} /> {t('legal.backToApp')}
      </Link>

      <div className="page-head">
        <h1 className="page-title">{t(`legal.${doc}.title`)}</h1>
        <p className="page-subtitle">{t(`legal.${doc}.updated`)}</p>
      </div>

      <div className="panel soft pad" style={{ marginBottom: 16 }}>
        <div className="panel-header">
          <p className="panel-copy">{t('legal.draftNotice')}</p>
          <ShieldAlert className="icon" />
        </div>
      </div>

      <div className="stack" style={{ gap: 18 }}>
        {sections.map((section) => (
          <section key={section.h}>
            <h2 className="panel-title" style={{ fontSize: 18, marginBottom: 6 }}>
              {section.h}
            </h2>
            <p className="panel-copy">{section.p}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
