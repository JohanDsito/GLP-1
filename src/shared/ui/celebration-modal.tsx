import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAchievementDef } from '../../entities/achievements/catalog';

export function CelebrationModal({ codes, onClose }: { codes: string[]; onClose: () => void }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  if (codes.length === 0) {
    return null;
  }

  const code = codes[index];
  const def = getAchievementDef(code);
  const isLast = index === codes.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: 'rgba(9, 20, 18, 0.6)',
        display: 'grid',
        placeItems: 'center',
        padding: 20,
      }}
    >
      <div
        className="panel pad celebration-card"
        style={{ width: 'min(100%, 400px)', background: 'var(--surface)', textAlign: 'center', overflow: 'hidden' }}
      >
        <div className="celebration-sparkles" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} style={{ ['--i' as string]: i }} />
          ))}
        </div>

        <div style={{ fontSize: 64, lineHeight: 1, margin: '8px 0 12px' }}>{def?.emoji ?? '🎉'}</div>

        <div className="page-kicker" style={{ color: 'var(--accent)' }}>
          {t('achievements.unlocked')}
        </div>
        <h2 className="panel-title" style={{ marginTop: 6, marginBottom: 8 }}>
          {t(`achievements.items.${code}.title`, code)}
        </h2>
        <p className="panel-copy" style={{ marginBottom: 18 }}>
          {t(`achievements.items.${code}.desc`, '')}
        </p>

        {codes.length > 1 ? (
          <div className="panel-copy" style={{ fontSize: 13, marginBottom: 12 }}>
            {index + 1} / {codes.length}
          </div>
        ) : null}

        <button
          className="cta"
          type="button"
          style={{ width: '100%' }}
          onClick={() => (isLast ? onClose() : setIndex((i) => i + 1))}
        >
          {isLast ? t('achievements.awesome') : t('achievements.next')}
        </button>
      </div>
    </div>
  );
}
