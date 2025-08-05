import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import { Navigation } from '../components/Navigation';

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',

  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn(formData.email, formData.password);
    
    if (result.success && result.token) {
      // Decode JWT to get user role
      try {
        const decoded = JSON.parse(atob(result.token.split('.')[1]));
        if (decoded.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } catch(err) {
        navigate('/dashboard'); // fallback
      }
    } else {
      setError(result.error || 'Login error');
      console.log('SignIn result:', result);

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
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="card">
            <div className="card-header text-center">
              <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                Sign In
              </h1>
              <p className="card-description">
                Access your personal space
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
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label">Password</label>
                  <input
                    type="password"
                    className="input"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                  style={{ marginTop: '16px' }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div style={{ 
                marginTop: '24px', 
                paddingTop: '16px', 
                borderTop: '1px solid var(--border)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}
                  >
                    Create an account
                  </Link>
                </p>
              </div>

              {/* Demo accounts */}
              <div style={{ 
                marginTop: '16px', 
                padding: '12px', 
                backgroundColor: 'var(--muted-background)',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px'
              }}>
                <strong>Demo accounts:</strong>
                <div style={{ marginTop: '8px' }}>
                  <div><strong>Admin:</strong> admin@gmail.com / admin123</div>
                  <div><strong>Passenger:</strong> passenger@gmail.com / passenger123</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
