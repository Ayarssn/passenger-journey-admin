import React, { useEffect } from 'react';
import ProfileForm from './ProfileForm';

export default function ProfileFormModal({ open, onClose, initialValues, onSubmit, loading }) {
  // Lock background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.16)',
        zIndex: 9998
      }} onClick={onClose} />
      <div style={{
        position: 'fixed',
        top: 56,
        right: 16,
        zIndex: 9999,
        background: 'transparent',
        width: 'auto',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}>
        <div style={{
          background: 'var(--card-background)',
          borderRadius: 18,
          minWidth: 340,
          maxWidth: 370,
          maxHeight: '90vh',
          padding: 12,
          boxShadow: '0 6px 24px rgba(0,0,0,0.13)',
          color: 'var(--foreground)',
          position: 'relative',
          marginTop: 0,
          marginRight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          overflowY: 'auto',
        }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', color: 'var(--foreground)', fontSize: 22, cursor: 'pointer' }}>&times;</button>
          <ProfileForm initialValues={initialValues} onSubmit={onSubmit} loading={loading} />
        </div>
      </div>
    </>
  );
}
