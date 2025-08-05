import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import ProfileFormModal from './ProfileFormModal';
import { useTheme } from '../context/Theme';
import { useNotification } from '../context/Notification';
import { useTowing } from '../context/Towing';
import truckLight from '../images/truck.png';
import truckDark from '../images/truck (1).png';
import profileIconLight from '../images/profilIcon(light).png';
import profileIconDark from '../images/profilIcon(dark).png';

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { notifications, markAsSeen, loading, fetchNotifications } = useNotification();
  const { setNotificationRefreshCallback } = useTowing();
  const [showNotifications, setShowNotifications] = useState(false);

  // Set up the callback to refresh notifications when requests are updated
  useEffect(() => {
    if (setNotificationRefreshCallback && fetchNotifications) {
      setNotificationRefreshCallback(() => fetchNotifications);
    }
  }, [setNotificationRefreshCallback, fetchNotifications]);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <nav className="nav" style={{ backgroundColor: 'var(--card-background)', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', height: '48px', width: '100%' }}>
          {/* Left - Logo (Far Left) */}
          <div style={{ flex: '0 0 250px', display: 'flex', alignItems: 'center' }}>
            <Link to="/" className="nav-brand" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img 
                src={theme === 'light' ? truckLight : truckDark} 
                alt="TowingMed Truck Logo" 
                style={{ height: '24px', width: 'auto' }}
              />
              <span style={{ fontSize: '20px', fontWeight: '700', color: theme === 'light' ? '#000000' : '#ffffff' }}>
                TowingMed
              </span>
            </Link>
          </div>

          {/* Center - Navigation Links (Much More Space) */}
          <div style={{ flex: '1', display: 'flex', justifyContent: 'center', padding: '0 80px' }}>
            <ul className="nav-links" style={{ display: window.innerWidth <= 768 ? 'none' : 'flex', alignItems: 'center', gap: '32px', margin: 0, padding: 0, listStyle: 'none' }}>
              <li>
                <Link to="/" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '500', padding: '8px 16px', borderRadius: '6px', transition: 'all 0.2s', fontSize: '15px' }}>
                  Home
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => {
                    // If we're not on home page, navigate to home first then scroll
                    if (window.location.pathname !== '/') {
                      window.location.href = '/#contact';
                    } else {
                      // If on home page, scroll to contact section
                      const contactSection = document.getElementById('contact') || document.querySelector('[id*="contact"]') || document.querySelector('.contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        // Fallback: scroll to bottom of page where contact info usually is
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                      }
                    }
                  }}
                  className="nav-link" 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'var(--text)', 
                    fontWeight: '500', 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    transition: 'all 0.2s', 
                    fontSize: '15px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Contact
                </button>
              </li>
              {user && (
                <li>
                  <Link 
                    to={user.userType === 'admin' ? '/admin' : '/dashboard'} 
                    className="nav-link"
                    style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: '500', padding: '8px 16px', borderRadius: '6px', transition: 'all 0.2s', fontSize: '15px' }}
                  >
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Right - Auth Buttons + Account (Far Right) */}
          <div style={{ flex: '0 0 250px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
            {/* Auth Buttons or User Actions */}
            {!user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link 
                  to="/signin" 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'var(--primary)', 
                    fontWeight: '500', 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    border: '1px solid var(--primary)', 
                    transition: 'all 0.2s',
                    fontSize: '14px'
                  }}
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'white', 
                    fontWeight: '600', 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    background: 'var(--primary)', 
                    transition: 'all 0.2s',
                    fontSize: '14px'
                  }}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-secondary btn-sm"
              style={{ padding: '8px', borderRadius: '6px', border: 'none', background: 'var(--secondary)', cursor: 'pointer', transition: 'background 0.2s' }}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn btn-secondary btn-sm"
              style={{ display: window.innerWidth <= 768 ? 'block' : 'none', padding: '8px', borderRadius: '6px', border: 'none', background: 'var(--secondary)', cursor: 'pointer' }}
              aria-label="Open menu"
            >
              ☰
            </button>

            {/* Notifications */}
            {user && (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  aria-label="Notifications"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '8px', borderRadius: '6px', transition: 'background 0.2s' }}
                  onClick={() => setShowNotifications((prev) => !prev)}
                >
                  <span role="img" aria-label="bell" style={{ fontSize: 20 }}>🔔</span>
                  {notifications.filter(n => !n.seen).length > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: '#ff4d4f',
                        color: 'white',
                        borderRadius: '50%',
                        width: 16,
                        height: 16,
                        fontSize: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      {notifications.filter(n => !n.seen).length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      background: 'var(--card-background)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      minWidth: 300,
                      maxWidth: 400,
                      zIndex: 1000,
                      marginTop: 8
                    }}
                  >
                    {loading ? (
                      <div style={{ padding: 16 }}>Loading...</div>
                    ) : notifications.length === 0 ? (
                      <div style={{ padding: 16 }}>No notifications</div>
                    ) : (
                      notifications.filter(n => !n.seen).length === 0 ? (
                      <div style={{ padding: 16 }}>No new notifications</div>
                    ) : (
                      notifications.filter(n => !n.seen).map(n => (
                        <div key={n._id} style={{ padding: 12, borderBottom: '1px solid var(--border)', background: 'var(--accent)', color: 'var(--text)' }}>
                          <div style={{ color: 'var(--text)' }}>{n.message}</div>
                          <button onClick={() => markAsSeen(n._id)} style={{ fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}>Mark as seen</button>
                        </div>
                      ))
                    )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Profile & Sign out */}
            {user ? (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <button
                    aria-label="Profile"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', borderRadius: '50%', padding: '8px', transition: 'background 0.2s' }}
                    onClick={() => setShowProfile(!showProfile)}
                  >
                    <img 
                      src={theme === 'light' ? profileIconLight : profileIconDark} 
                      alt="Profile" 
                      style={{ width: '20px', height: '20px' }}
                    />
                  </button>
                  
                  {/* User Info Dropdown */}
                  {showProfile && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        background: 'var(--card-background)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        minWidth: 280,
                        zIndex: 1000,
                        marginTop: 8,
                        padding: 16
                      }}
                    >
                      {/* Debug: Log user object */}
                      {console.log('User object:', user)}
                      <div style={{ marginBottom: 12 }}>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text)', marginBottom: 8 }}>
                          User Profile
                        </h4>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            First Name
                          </label>
                          <div style={{ fontSize: '14px', color: 'var(--text)', marginTop: 2, padding: '4px 0' }}>
                            {user.firstName || user.nom || user.first_name || user.prenom || 'N/A'}
                          </div>
                        </div>
                        
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Last Name
                          </label>
                          <div style={{ fontSize: '14px', color: 'var(--text)', marginTop: 2, padding: '4px 0' }}>
                            {user.lastName || user.last_name || user.nom || user.surname || 'N/A'}
                          </div>
                        </div>
                        
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Email
                          </label>
                          <div style={{ fontSize: '14px', color: 'var(--text)', marginTop: 2, padding: '4px 0' }}>
                            {user.email || user.emailAddress || 'N/A'}
                          </div>
                        </div>
                        
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Phone
                          </label>
                          <div style={{ fontSize: '14px', color: 'var(--text)', marginTop: 2, padding: '4px 0' }}>
                            {user.phone || user.phoneNumber || user.mobile || user.telephone || 'N/A'}
                          </div>
                        </div>
                        
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: '500', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            CIN
                          </label>
                          <div style={{ fontSize: '14px', color: 'var(--text)', marginTop: 2, padding: '4px 0' }}>
                            {user.cin || user.CIN || user.nationalId || user.idNumber || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={handleSignOut}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '14px', fontWeight: '500' }}
                >
                  Sign out
                </button>
              </div>
            ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            style={{ 
              marginTop: '16px', 
              paddingTop: '16px', 
              borderTop: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)} style={{ padding: '8px 0', textDecoration: 'none', color: 'var(--text)' }}>
              Home
            </Link>
            {user ? (
              <>
                <Link 
                  to={user.userType === 'admin' ? '/admin' : '/dashboard'} 
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ padding: '8px 0', textDecoration: 'none', color: 'var(--text)' }}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ alignSelf: 'flex-start', marginTop: '8px' }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/signin" 
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ padding: '8px 0', textDecoration: 'none', color: 'var(--text)' }}
                >
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  className="btn btn-primary btn-sm"
                  style={{ alignSelf: 'flex-start', marginTop: '8px' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};