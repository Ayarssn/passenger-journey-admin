import React, { useState } from 'react';
import ProfileForm from '../components/ProfileForm';
import { Navigation } from '../components/Navigation';
import { CreateRequestStepper } from '../components/CreateRequestStepper';
import { StatusBadge } from '../components/StatusBadge';
import { StatsCard } from '../components/StatsCard';
import { useTowing } from '../context/Towing';
import { useAuth } from '../context/Auth';

export default function PassengerDashboard() {
  // ...existing hooks and variables
  const handleCancelRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      const result = await cancelRequest(requestId);
      if (!result.success) {
        alert(result.error || 'Failed to cancel the request.');
      }
    }
  };
  const { user } = useAuth();
  const { requests, getRequestStats, cancelRequest } = useTowing();
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const userRequests = requests.filter(req => 
    req.customerName === user?.name || req.customerName.includes(user?.name?.split(' ')[0] || '')
  );

  const stats = {
    total: userRequests.length,
    pending: userRequests.filter(r => r.status === 'pending').length,
    accepted: userRequests.filter(r => r.status === 'accepted').length,
    completed: userRequests.filter(r => r.status === 'completed').length
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleRequestComplete = (requestId) => {
    setShowCreateRequest(false);
    setActiveTab('requests');
    alert(`Your request #${requestId} was created successfully! A technician will be assigned soon.`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Navigation />
      
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            Hello 👋
          </h1>
        </div>

        {showCreateRequest ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <button
                onClick={() => setShowCreateRequest(false)}
                className="btn btn-outline btn-sm"
                style={{ marginRight: '16px' }}
              >
                ← Back
              </button>
              <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
                New Towing Request
              </h2>
            </div>
            
            <CreateRequestStepper
              onComplete={handleRequestComplete}
              onCancel={() => setShowCreateRequest(false)}
            />
          </div>
        ) : (
          <>
            {/* Create New Request Button */}
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '120px' }}>
              <button
                className="btn btn-primary"
                style={{ fontSize: 18, padding: '12px 32px', borderRadius: 8 }}
                onClick={() => setShowCreateRequest(true)}
              >
                Create New Request
              </button>
            </div>

            {/* Navigation tabs */}
            <div style={{ borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '32px' }}>
                <button
                  onClick={() => setActiveTab('overview')}
                  style={{
                    padding: '12px 0',
                    borderBottom: activeTab === 'overview' ? '2px solid var(--primary)' : '2px solid transparent',
                    color: activeTab === 'overview' ? 'var(--primary)' : 'var(--muted-foreground)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('requests')}
                  style={{
                    padding: '12px 0',
                    borderBottom: activeTab === 'requests' ? '2px solid var(--primary)' : '2px solid transparent',
                    color: activeTab === 'requests' ? 'var(--primary)' : 'var(--muted-foreground)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  My Requests
                </button>
              </div>
            </div>

            {activeTab === 'overview' && (
              <div>
                {/* Quick Actions */}
                <div className="card mb-6">
                  <div className="card-header">
                    <h3 className="card-title">Quick Actions</h3>
                    <p className="card-description">
                      Quickly access main features
                    </p>
                  </div>
                  <div className="card-content">
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setShowCreateRequest(true)}
                        className="btn btn-primary btn-lg"
                      >
                        🚨 New Emergency Request
                      </button>
                      <button
                        onClick={() => setActiveTab('requests')}
                        className="btn btn-outline btn-lg"
                      >
                        📋 View My Requests
                      </button>
                      <a href="tel:+212539337163" className="btn btn-secondary btn-lg">
                        📞 Emergency Call
                      </a>
                    </div>
                  </div>
                </div>

                {/* Recent Requests */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Recent Requests</h3>
                  </div>
                  <div className="card-content">
                    {userRequests.length === 0 ? (
                      <div className="text-center" style={{ padding: '32px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚛</div>
                        <h4 style={{ marginBottom: '8px' }}>No requests yet</h4>
                        <p style={{ color: 'var(--muted-foreground)', marginBottom: '16px' }}>
                          Create your first towing request
                        </p>
                        <button
                          onClick={() => setShowCreateRequest(true)}
                          className="btn btn-primary"
                        >
                          Create a Request
                        </button>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Vehicle</th>
                              <th>Location</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userRequests.slice(0, 5).map(request => (
                              <tr key={request._id || request.id}>
                                <td style={{ fontSize: '14px' }}>
                                  {formatDate(request.createdAt)}
                                </td>
                                <td style={{ fontSize: '14px' }}>
                                  {[request.vehicleType, request.vehicleMake, request.vehicleModel, request.licensePlate].filter(Boolean).join(' - ') || request.vehicleType || 'N/A'}
                                </td>
                                <td style={{ fontSize: '14px' }}>
                                  {request.location}
                                </td>
                                <td>
                                  <StatusBadge status={request.status} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600' }}>
                    All My Requests ({userRequests.length})
                  </h3>
                  <button
                    onClick={() => setShowCreateRequest(true)}
                    className="btn btn-primary"
                  >
                    + New Request
                  </button>
                </div>

                <div className="card">
                  <div className="card-content">
                    {userRequests.length === 0 ? (
                      <div className="text-center" style={{ padding: '48px' }}>
                        <div style={{ fontSize: '64px', marginBottom: '24px' }}>📝</div>
                        <h4 style={{ marginBottom: '12px' }}>No requests found</h4>
                        <p style={{ color: 'var(--muted-foreground)', marginBottom: '24px' }}>
                          You haven't made any towing requests yet.
                        </p>
                        <button
                          onClick={() => setShowCreateRequest(true)}
                          className="btn btn-primary"
                        >
                          Create my first request
                        </button>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Date & Time</th>
                              <th>Vehicle</th>
                              <th>Location</th>
                              <th>Description</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userRequests.map(request => (
                              <tr key={request._id || request.id}>
                                <td style={{ fontSize: '14px' }}>
                                  {formatDate(request.createdAt)}
                                </td>
                                <td style={{ fontSize: '14px' }}>
                                  <div>{[request.vehicleType, request.vehicleMake, request.vehicleModel, request.licensePlate].filter(Boolean).join(' - ') || request.vehicleType || 'N/A'}</div>
                                </td>
                                <td style={{ fontSize: '14px' }}>
                                  {request.location}
                                </td>
                                <td style={{ fontSize: '14px', maxWidth: '200px' }}>
                                  <div style={{ 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    whiteSpace: 'nowrap' 
                                  }}>
                                    {request.description}
                                  </div>
                                </td>
                                <td>
                                  <StatusBadge status={request.status} />
                                  {/* Cancel button for pending requests */}
                                  {request.status === 'pending' && (
                                    <div style={{ marginTop: '8px' }}>
                                      <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleCancelRequest(request._id || request.id)}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}