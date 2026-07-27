type BrandMarkProps = {
  /** Visual size. 'sm' for the topbar, 'lg' for hero/onboarding screens. */
  size?: 'sm' | 'lg';
  /**
   * Show the "Lumea" wordmark next to the emblem. Defaults on for 'sm'
   * (the emblem's own text is unreadable at topbar size) and off for 'lg'
   * (the large emblem already shows the name clearly).
   */
  showName?: boolean;
  className?: string;
};

/**
 * Lumea brand mark. The emblem is a self-contained circular logo; at small
 * sizes we pair it with a legible "Lumea" wordmark.
 */
export function BrandMark({ size = 'sm', showName, className }: BrandMarkProps) {
  const withName = showName ?? size === 'sm';
  return (
    <>
      <img
        src="/logo-512.svg"
        alt="Lumea"
        className={`brand-logo brand-logo--${size}${className ? ` ${className}` : ''}`}
      />
      {withName && <span className="brand-wordmark">Lumea</span>}
    </>
  );
}
