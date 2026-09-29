import React from 'react';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, size = 'md', showLabel = false }) => {
  let colorClass = 'green';
  let label = 'Exceeding';

  if (score >= 90) {
    colorClass = 'green';
    label = 'Exceeding';
  } else if (score >= 80) {
    colorClass = 'blue';
    label = 'Strong';
  } else if (score >= 68) {
    colorClass = 'amber';
    label = 'Meeting';
  } else {
    colorClass = 'rose';
    label = 'Developing';
  }

  const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600 },
    md: { padding: '4px 12px', fontSize: '0.85rem', fontWeight: 700 },
    lg: { padding: '8px 18px', fontSize: '1.25rem', fontWeight: 800 }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span className={`pill-badge ${colorClass}`} style={sizeStyles[size]}>
        {score}
        <span style={{ opacity: 0.7, fontSize: '0.7em', fontWeight: 500 }}>/100</span>
      </span>
      {showLabel && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {label}
        </span>
      )}
    </div>
  );
};
