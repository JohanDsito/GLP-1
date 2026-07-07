export interface TrendPoint {
  label: string;
  value: number;
}

interface TrendChartProps {
  data: TrendPoint[];
  color?: string;
  yMin?: number;
  yMax?: number;
  height?: number;
  formatValue?: (value: number) => string;
}

const WIDTH = 320;
const PAD_X = 10;
const PAD_TOP = 16;
const PAD_BOTTOM = 22;

export function TrendChart({
  data,
  color = 'var(--primary-strong)',
  yMin,
  yMax,
  height = 140,
  formatValue = (value) => String(Math.round(value * 10) / 10),
}: TrendChartProps) {
  if (data.length === 0) {
    return null;
  }

  const values = data.map((point) => point.value);
  const min = yMin ?? Math.min(...values);
  const max = yMax ?? Math.max(...values);
  const range = max - min || 1;

  const innerW = WIDTH - PAD_X * 2;
  const innerH = height - PAD_TOP - PAD_BOTTOM;

  const x = (index: number) => (data.length === 1 ? WIDTH / 2 : PAD_X + (index / (data.length - 1)) * innerW);
  const y = (value: number) => PAD_TOP + innerH - ((value - min) / range) * innerH;

  const linePoints = data.map((point, index) => `${x(index)},${y(point.value)}`).join(' ');
  const areaPath =
    data.length === 1
      ? ''
      : `M ${x(0)},${y(data[0].value)} ` +
        data.map((point, index) => `L ${x(index)},${y(point.value)}`).join(' ') +
        ` L ${x(data.length - 1)},${PAD_TOP + innerH} L ${x(0)},${PAD_TOP + innerH} Z`;

  const last = data[data.length - 1];
  const lastX = x(data.length - 1);
  const lastY = y(last.value);

  const gradientId = `trend-grad-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${height}`}
      width="100%"
      height={height}
      role="img"
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* baseline */}
      <line
        x1={PAD_X}
        y1={PAD_TOP + innerH}
        x2={WIDTH - PAD_X}
        y2={PAD_TOP + innerH}
        stroke="var(--border)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />

      {areaPath ? <path d={areaPath} fill={`url(#${gradientId})`} /> : null}

      {data.length > 1 ? (
        <polyline
          points={linePoints}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}

      {/* last point marker + direct label */}
      <circle cx={lastX} cy={lastY} r="4" fill={color} vectorEffect="non-scaling-stroke" />
      <text
        x={lastX}
        y={Math.max(lastY - 8, 10)}
        textAnchor={data.length === 1 ? 'middle' : 'end'}
        fontSize="12"
        fontWeight="700"
        fill="var(--text)"
      >
        {formatValue(last.value)}
      </text>

      {/* x range labels */}
      <text x={PAD_X} y={height - 6} fontSize="10" fill="var(--text-muted)">
        {data[0].label}
      </text>
      {data.length > 1 ? (
        <text x={WIDTH - PAD_X} y={height - 6} textAnchor="end" fontSize="10" fill="var(--text-muted)">
          {last.label}
        </text>
      ) : null}
    </svg>
  );
}
