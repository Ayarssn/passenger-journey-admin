import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--muted-background)' }}>
      <div className="text-center">
        <div style={{ fontSize: '72px', marginBottom: '24px' }}>🚧</div>
        <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px' }}>404</h1>
        <p style={{ fontSize: '20px', color: 'var(--muted-foreground)', marginBottom: '32px' }}>
          Oops! Page not found
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;