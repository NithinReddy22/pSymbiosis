import React from 'react';

interface SprintTrendPoint {
  sprint: string;
  storyPoints: number;
  prsMerged: number;
  reworkBounces: number;
}

interface SprintTrendChartProps {
  data?: SprintTrendPoint[];
  height?: number;
}

export const SprintTrendChart: React.FC<SprintTrendChartProps> = ({
  data = [
    { sprint: 'Sprint 21 (Jan 1-14)', storyPoints: 34, prsMerged: 12, reworkBounces: 2 },
    { sprint: 'Sprint 22 (Jan 15-28)', storyPoints: 42, prsMerged: 15, reworkBounces: 1 },
    { sprint: 'Sprint 23 (Jan 29-Feb 11)', storyPoints: 38, prsMerged: 14, reworkBounces: 3 },
    { sprint: 'Sprint 24 (Feb 12-25)', storyPoints: 48, prsMerged: 18, reworkBounces: 0 },
    { sprint: 'Sprint 25 (Feb 26-Mar 11)', storyPoints: 52, prsMerged: 19, reworkBounces: 2 },
    { sprint: 'Sprint 26 (Mar 12-25)', storyPoints: 46, prsMerged: 16, reworkBounces: 1 }
  ],
  height = 200
}) => {
  const maxPoints = Math.max(...data.map(d => d.storyPoints), 60);
  const width = 600;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - (val / maxPoints) * chartHeight;

  // Velocity points path
  const pointsPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.storyPoints)}`).join(' ');
  const areaPath = `${pointsPath} L ${getX(data.length - 1)} ${paddingTop + chartHeight} L ${getX(0)} ${paddingTop + chartHeight} Z`;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', minWidth: '480px' }}>
        <defs>
          <linearGradient id="velocityAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines */}
        {[0, 20, 40, 60].map(val => {
          const y = getY(val);
          return (
            <g key={val}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="3,3"
              />
              <text
                x={paddingLeft - 8}
                y={y}
                textAnchor="end"
                dominantBaseline="central"
                fill="var(--text-dim)"
                fontSize="10"
                fontFamily="JetBrains Mono"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#velocityAreaGrad)" />

        {/* Line */}
        <path d={pointsPath} fill="none" stroke="#6366f1" strokeWidth="2.5" />

        {/* Points & Labels */}
        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.storyPoints);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="#fff" stroke="#6366f1" strokeWidth="2" />
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                fill="#fff"
                fontSize="10"
                fontWeight="700"
                fontFamily="Outfit"
              >
                {d.storyPoints} pts
              </text>
              <text
                x={x}
                y={height - 10}
                textAnchor="middle"
                fill="var(--text-dim)"
                fontSize="9"
                fontFamily="Inter"
              >
                {d.sprint.split(' ')[0]} {d.sprint.split(' ')[1]}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '6px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1' }} />
          <span>Sprint Story Points Delivered</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Zero critical regression drops</span>
        </div>
      </div>
    </div>
  );
};
