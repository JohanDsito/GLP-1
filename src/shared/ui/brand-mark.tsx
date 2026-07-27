type BrandMarkProps = {
  /** Visual size. 'sm' for the topbar, 'lg' for hero/onboarding screens. */
  size?: 'sm' | 'lg';
  className?: string;
};

/**
 * Lumea logotype (image includes the name), used wherever the app brand
 * previously showed an icon + the app name text.
 */
export function BrandMark({ size = 'sm', className }: BrandMarkProps) {
  return (
    <img
      src="/logo-512.svg"
      alt="Lumea"
      className={`brand-logo brand-logo--${size}${className ? ` ${className}` : ''}`}
    />
  );
}
