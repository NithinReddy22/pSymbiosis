import React from 'react';

interface RadarChartProps {
  dimensions: {
    delivery: number;
    quality: number;
    review: number;
    documentation: number;
    reliability: number;
  };
  benchmarkTargets?: {
    delivery: number;
    quality: number;
    review: number;
    documentation: number;
    reliability: number;
  };
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  dimensions,
  benchmarkTargets = { delivery: 80, quality: 80, review: 75, documentation: 70, reliability: 80 },
  size = 320
}) => {
  const center = size / 2;
  const radius = (size / 2) - 45;

  const axes = [
    { key: 'delivery', label: 'Delivery', angle: -Math.PI / 2 },
    { key: 'quality', label: 'Quality', angle: -Math.PI / 2 + (2 * Math.PI / 5) },
    { key: 'review', label: 'Review Rigor', angle: -Math.PI / 2 + (4 * Math.PI / 5) },
    { key: 'documentation', label: 'Architecture', angle: -Math.PI / 2 + (6 * Math.PI / 5) },
    { key: 'reliability', label: 'Reliability', angle: -Math.PI / 2 + (8 * Math.PI / 5) }
  ];

  // Concentric polygon grid levels: 25%, 50%, 75%, 100%
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (value: number, angle: number) => {
    const normalized = Math.min(100, Math.max(0, value)) / 100;
    const r = normalized * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Associate polygon points
  const points = axes.map(axis => {
    const val = (dimensions as any)[axis.key] || 0;
    const { x, y } = getCoordinates(val, axis.angle);
    return `${x},${y}`;
  }).join(' ');

  // Benchmark polygon points
  const benchPoints = axes.map(axis => {
    const val = (benchmarkTargets as any)[axis.key] || 75;
    const { x, y } = getCoordinates(val, axis.angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="radarFillGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.15" />
          </radialGradient>
        </defs>

        {/* Concentric Grid Polygons */}
        {levels.map((lvl, idx) => {
          const polyPoints = axes.map(axis => {
            const r = lvl * radius;
            return `${center + r * Math.cos(axis.angle)},${center + r * Math.sin(axis.angle)}`;
          }).join(' ');

          return (
            <polygon
              key={idx}
              points={polyPoints}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Spokes */}
        {axes.map((axis, idx) => {
          const endX = center + radius * Math.cos(axis.angle);
          const endY = center + radius * Math.sin(axis.angle);

          // Label placement offset
          const labelDist = radius + 24;
          const labelX = center + labelDist * Math.cos(axis.angle);
          const labelY = center + labelDist * Math.sin(axis.angle);

          return (
            <g key={idx}>
              <line
                x1={center}
                y1={center}
                x2={endX}
                y2={endY}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeDasharray="2,2"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--text-muted)"
                fontSize="11"
                fontWeight="600"
                fontFamily="Inter, sans-serif"
              >
                {axis.label}
              </text>
            </g>
          );
        })}

        {/* Benchmark Silhouette Polygon */}
        <polygon
          points={benchPoints}
          fill="transparent"
          stroke="rgba(6, 182, 212, 0.6)"
          strokeWidth="1.5"
          strokeDasharray="4,3"
        />

        {/* Actual Associate Score Polygon */}
        <polygon
          points={points}
          fill="url(#radarFillGrad)"
          stroke="#818cf8"
          strokeWidth="2.5"
        />

        {/* Score Data Dots */}
        {axes.map((axis, idx) => {
          const val = (dimensions as any)[axis.key] || 0;
          const { x, y } = getCoordinates(val, axis.angle);
          return (
            <g key={idx}>
              <circle
                cx={x}
                cy={y}
                r="4.5"
                fill="#fff"
                stroke="#6366f1"
                strokeWidth="2"
              />
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                fill="#fff"
                fontSize="10"
                fontWeight="700"
                fontFamily="Outfit, sans-serif"
              >
                {val}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '18px', marginTop: '8px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(99, 102, 241, 0.5)', border: '1px solid #818cf8' }} />
          <span>Actual Score</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '2px', background: 'var(--accent-cyan)', borderTop: '1px dashed var(--accent-cyan)' }} />
          <span>Calibrated Target</span>
        </div>
      </div>
    </div>
  );
};
