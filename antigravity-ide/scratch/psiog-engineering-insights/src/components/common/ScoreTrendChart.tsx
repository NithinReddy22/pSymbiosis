import React from 'react';

interface TrendPoint { label: string; value: number; }
interface ScoreTrendChartProps {
  data?: TrendPoint[];
  color?: string;
  height?: number;
}

export const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({
  data = [
    { label: 'Jul 2026', value: 48 },
    { label: 'Aug 2026', value: 60 },
    { label: 'Sep 2026', value: 65 },
    { label: 'Oct 2026', value: 68 },
    { label: 'Nov 2026', value: 76 },
    { label: 'Dec 2026', value: 82 },
  ],
  color = '#2DC4C2',
  height = 220,
}) => {
  const W = 540, H = height, PL = 40, PR = 20, PT = 20, PB = 36;
  const cw = W - PL - PR, ch = H - PT - PB;
  const maxVal = 100;
  const getX = (i: number) => PL + (i / (data.length - 1)) * cw;
  const getY = (v: number) => PT + ch - (v / maxVal) * ch;
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.value)}`).join(' ');
  const areaPath = `${linePath} L ${getX(data.length - 1)} ${PT + ch} L ${getX(0)} ${PT + ch} Z`;
  const gradId = `sg-${color.replace('#', '')}`;
  const gridVals = [0, 20, 40, 60, 80, 100];

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', minWidth: '320px' }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {gridVals.map(v => (
          <g key={v}>
            <line x1={PL} y1={getY(v)} x2={W - PR} y2={getY(v)} stroke="#e8edf2" strokeDasharray="3,4" />
            <text x={PL - 6} y={getY(v)} textAnchor="end" dominantBaseline="central"
              fill="#9ca3af" fontSize="10" fontFamily="Inter">{v}</text>
          </g>
        ))}
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(d.value)} r="5" fill="white" stroke={color} strokeWidth="2.5" />
            <text x={getX(i)} y={H - 8} textAnchor="middle" fill="#9ca3af" fontSize="11" fontFamily="Inter">{d.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};
