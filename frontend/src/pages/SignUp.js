import React, { useState } from 'react';    
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import { Navigation } from '../components/Navigation';

export default function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cin: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.cin) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    const result = await signUp({
      email: formData.email,
      password: formData.password,
      role: formData.role,
      cin: formData.cin,
      phone: formData.phone,
      firstName: formData.firstName,
      lastName: formData.lastName
    });
    
    if (result.success) {
      navigate(formData.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setError(result.error || 'Error creating account');
    }
    
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Navigation />
      
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="card">
            <div className="card-header text-center">
              <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                Create an Account
              </h1>
              <p className="card-description">
                Join us to access towing services
              </p>
            </div>
            
            <div className="card-content">
              {error && (
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                  color: 'var(--error)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="form-group">
                  <label className="label">First Name *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder=""
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label">Last Name *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder=""
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label">CIN *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.cin}
                    onChange={(e) => handleChange('cin', e.target.value)}
                    placeholder="AB123456"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label">Email *</label>
                  <input
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder=""
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label">Phone *</label>
                  <input
                    type="tel"
                    className="input"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+212 6XX XXX XXX"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label">Password *</label>
                  <input
                    type="password"
                    className="input"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label className="label">Confirm Password *</label>
                  <input
                    type="password"
                    className="input"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="Repeat your password"
                    required
                  />
                </div>

                <div style={{ 
                  padding: '12px', 
                  backgroundColor: 'var(--muted-background)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px',
                  color: 'var(--muted-foreground)',
                  marginBottom: '16px'
                }}>
                  By creating an account, you agree to our terms of use and privacy policy.
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                  style={{ marginTop: '8px' }}
                >
                  {loading ? 'Creating...' : 'Create my account'}
                </button>
              </form>

              <div style={{ 
                marginTop: '24px', 
                paddingTop: '16px', 
                borderTop: '1px solid var(--border)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                  Already have an account?{' '}
                  <Link 
                    to="/signin" 
                    style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
