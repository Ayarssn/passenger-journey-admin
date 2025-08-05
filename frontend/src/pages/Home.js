import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import truckIcon from '../images/truckIcon.png';
import clockIcon from '../images/clockIcon.png';
import securityLogo from '../images/securityLogo.png';
import availableIcon from '../images/availableIcon.png';
import phoneIcon from '../images/phoneIcon.webp';
import emailIcon from '../images/email.png';
import adressIcon from '../images/adressIcon.png';
import backgroundImage from '../images/background.jpg';

const features = [
  {
    icon: truckIcon,
    title: '24/7 Towing Service',
    description: 'Roadside assistance available 24/7 at Tanger Med port.'
  },
  {
    icon: clockIcon,
    title: 'Fast Response',
    description: 'Optimized response time to minimize your waiting.'
  },
  {
    icon: securityLogo,
    title: 'Secure Service',
    description: 'Professional teams and certified equipment for your safety.'
  },
  {
    icon: availableIcon,
    title: 'Full Coverage',
    description: 'Service available throughout the Tanger Med port area.'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero" style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)',
          zIndex: 1
        }}></div>
        
        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="text-center">
            {/* Main Title with Enhanced Styling */}
            <div style={{
              marginBottom: '32px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <h1 className="hero-title" style={{
                fontSize: '3.5rem',
                fontWeight: '700',
                marginBottom: '16px',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                letterSpacing: '1px'
              }}>
                <span style={{ 
                  color: '#ffffff',
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '3rem',
                  fontWeight: '800'
                }}>
                  Towing Service
                </span>
                <span style={{ 
                  color: '#fbbf24',
                  display: 'block',
                  fontSize: '2.2rem',
                  fontWeight: '600',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)'
                }}>
                  Tanger Med
                </span>
              </h1>
            </div>

            {/* Subtitle with Glass Effect */}
            <div style={{
              marginBottom: '40px',
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              maxWidth: '800px',
              margin: '0 auto 40px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
            }}>
              <p className="hero-subtitle" style={{
                fontSize: '1.2rem',
                color: '#ffffff',
                fontWeight: '400',
                lineHeight: '1.6',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                margin: 0
              }}>
                Your trusted partner for all your towing and roadside assistance needs 
                at Tanger Med port. Professional and fast service available 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--muted-background)' }}>
        <div className="container">
          <div className="text-center mb-8">
            <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px' }}>
              Why Choose Our Service?
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--muted-foreground)', maxWidth: '600px', margin: '0 auto' }}>
              We offer superior quality service with an experienced team and modern equipment.
            </p>
          </div>
          
          <div className="grid grid-cols-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {features.map((feature, index) => (
              <div key={index} className="card text-center" style={{ transition: 'transform 0.3s ease' }}>
                <div className="card-header">
                  <div style={{ 
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src={feature.icon} 
                      alt={feature.title}
                      style={{ width: '48px', height: '48px' }}
                    />
                  </div>
                  <h3 className="card-title">{feature.title}</h3>
                </div>
                <div className="card-content">
                  <p className="card-description">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '80px 0', 
        background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            marginBottom: '24px',
            color: '#fbbf24'
          }}>
            Need Immediate Assistance?
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            marginBottom: '40px', 
            opacity: 0.9, 
            maxWidth: '600px', 
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Our team is available 24/7 to respond to your emergencies. 
            Contact us now!
          </p>
          
          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Link 
              to="/signup" 
              className="btn btn-lg"
              style={{ 
                background: '#fbbf24',
                color: '#1f2937',
                border: 'none',
                padding: '16px 32px',
                fontSize: '1.1rem',
                fontWeight: '600',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
            >
              Create an Account
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: '64px 0', backgroundColor: 'var(--background)' }}>
        <div className="container">
          <div className="grid grid-cols-3">
            <div className="text-center">
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={phoneIcon} 
                  alt="Phone" 
                  style={{ width: '32px', height: '32px' }}
                />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Phone</h3>
              <p style={{ color: 'var(--muted-foreground)' }}>+212539337163</p>
            </div>
            <div className="text-center">
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={emailIcon} 
                  alt="Email" 
                  style={{ width: '32px', height: '32px' }}
                />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Email</h3>
              <p style={{ color: 'var(--muted-foreground)' }}>helpdesk.pcs@tangermed.ma</p>
            </div>
            <div className="text-center">
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={adressIcon} 
                  alt="Address" 
                  style={{ width: '32px', height: '32px' }}
                />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Address</h3>
              <p style={{ color: 'var(--muted-foreground)' }}>Port Tanger Med, Oued Rmel,<br />Province Fahs Anjra,<br />Tanger - Maroc</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}