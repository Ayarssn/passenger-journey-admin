import React from 'react';

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: '⏳',
    className: 'badge-warning',
    style: { background: '#fffbe6', color: '#faad14', border: '1px solid #faad14', fontWeight: 600, fontSize: 13, padding: '4px 14px', borderRadius: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }
  },
  accepted: {
    label: 'Accepted',
    icon: '🔄',
    className: 'badge-pending',
    style: { background: '#e6f7ff', color: '#1890ff', border: '1px solid #1890ff', fontWeight: 600, fontSize: 13, padding: '4px 14px', borderRadius: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }
  },
  completed: {
    label: 'Completed',
    icon: '✅',
    className: 'badge-success',
    style: { background: '#f6ffed', color: '#52c41a', border: '1px solid #52c41a', fontWeight: 600, fontSize: 13, padding: '4px 14px', borderRadius: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }
  },
  cancelled: {
    label: 'Cancelled',
    icon: '❌',
    className: 'badge-error',
    style: { background: '#fff1f0', color: '#ff4d4f', border: '1px solid #ff4d4f', fontWeight: 600, fontSize: 13, padding: '4px 14px', borderRadius: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }
  }
};

export const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`badge ${config.className}`} style={config.style}>
      <span style={{ fontSize: 16 }}>{config.icon}</span>
      {config.label}
    </span>
  );
};