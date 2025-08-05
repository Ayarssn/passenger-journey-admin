import React from 'react';

export const StatsCard = ({ title, value, description, icon: Icon, trend }) => {
  return (
    <div className="card">
      <div className="card-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', color: 'var(--muted-foreground)' }}>
            {title}
          </h3>
          {Icon && (
            <div style={{ padding: '8px', backgroundColor: 'rgba(30, 64, 175, 0.1)', borderRadius: 'var(--radius-sm)' }}>
              <Icon size={16} style={{ color: 'var(--primary)' }} />
            </div>
          )}
        </div>
        
        <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
          {value}
        </div>
        
        {description && (
          <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
            {description}
          </p>
        )}
        
        {trend && (
          <div style={{ 
            fontSize: '12px', 
            color: trend > 0 ? 'var(--success)' : 'var(--error)',
            marginTop: '8px'
          }}>
            {trend > 0 ? '↗️' : '↘️'} {Math.abs(trend)}% this month
          </div>
        )}
      </div>
    </div>
  );
};