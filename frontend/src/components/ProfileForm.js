import React, { useState } from 'react';

export default function ProfileForm({ initialValues = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    firstName: initialValues.firstName || '',
    lastName: initialValues.lastName || '',
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    onSubmit({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420, margin: '0 auto', background: '#18181b', padding: 24, borderRadius: 10, color: '#fff' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 18 }}>Profile</h2>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>First Name</label>
        <input
          type="text"
          value={form.firstName}
          onChange={e => handleChange('firstName', e.target.value)}
          style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #333', background: '#232326', color: '#fff' }}
          required
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>Last Name</label>
        <input
          type="text"
          value={form.lastName}
          onChange={e => handleChange('lastName', e.target.value)}
          style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #333', background: '#232326', color: '#fff' }}
          required
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={e => handleChange('email', e.target.value)}
          style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #333', background: '#232326', color: '#fff' }}
          required
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>Phone Number</label>
        <input
          type="text"
          value={form.phone}
          onChange={e => handleChange('phone', e.target.value)}
          style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #333', background: '#232326', color: '#fff' }}
          required
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={e => handleChange('password', e.target.value)}
          style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #333', background: '#232326', color: '#fff' }}
          placeholder="Enter your password"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>Confirm Password</label>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={e => handleChange('confirmPassword', e.target.value)}
          style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #333', background: '#232326', color: '#fff' }}
          placeholder="Confirm password"
        />
      </div>
      {error && <div style={{ color: '#ff4d4f', marginBottom: 16 }}>{error}</div>}
      <button type="submit" style={{ width: '100%', padding: 12, background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 16 }} disabled={loading}>
        {loading ? 'Updating...' : 'Update my account'}
      </button>
      <p style={{ color: '#aaa', fontSize: 13, marginTop: 18, textAlign: 'center' }}>
        By confirming your email, you agree to our <b>Terms of Use</b> and acknowledge that you have read and understood our <b>Privacy Policy</b>.
      </p>
    </form>
  );
}
