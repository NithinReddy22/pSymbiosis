import React from 'react';

interface DonutSlice { label: string; value: number; color: string; pct: number; }
interface DonutChartProps {
  slices: DonutSlice[];
  centerLabel?: string;
  centerValue?: string | number;
  size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  slices,
  centerLabel = 'Overall',
  centerValue = '',
  size = 160,
}) => {
  const r = 54, cx = size / 2, cy = size / 2;
  let cumulativeAngle = -90;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s, i) => {
        const angle = (s.pct / 100) * 360;
        const startAngle = cumulativeAngle;
        const endAngle = cumulativeAngle + angle;
        cumulativeAngle += angle + 2; // small gap
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        const x1 = cx + r * Math.cos(startRad);
        const y1 = cy + r * Math.sin(startRad);
        const x2 = cx + r * Math.cos(endRad);
        const y2 = cy + r * Math.sin(endRad);
        const largeArc = angle > 180 ? 1 : 0;
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
            fill="none"
            stroke={s.color}
            strokeWidth="16"
            strokeLinecap="round"
          />
        );
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="22" fontWeight="700" fill="#111827" fontFamily="Outfit">{centerValue}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#9ca3af" fontFamily="Inter">{centerLabel}</text>
    </svg>
  );
};
