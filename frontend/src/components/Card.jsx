import React from 'react';
const Card = ({
  children,
  className = '',
  hoverEffect = true,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-6 rounded-xl transition-all duration-300 ${
        hoverEffect ? 'hover:-translate-y-1 hover:border-slate-700/50 hover:shadow-primary-500/5' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
export const StatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendType = 'up', // 'up' | 'down' | 'neutral'
  className = ''
}) => {
  const trendColors = {
    up: 'text-emerald-400 bg-emerald-500/10',
    down: 'text-rose-400 bg-rose-500/10',
    neutral: 'text-slate-400 bg-slate-500/10'
  };
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-extrabold mt-2 text-slate-100 glow-text-primary tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className="p-3 bg-primary-500/10 text-primary-400 rounded-lg border border-primary-500/20">
            {Icon}
          </div>
        )}
      </div>
      {(description || trend) && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${trendColors[trendType]}`}>
              {trend}
            </span>
          )}
          {description && <span className="text-xs text-slate-400 font-medium">{description}</span>}
        </div>
      )}
    </Card>
  );
};
export default Card;
