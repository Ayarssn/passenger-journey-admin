import React, { useState } from 'react';
import ProfileForm from '../components/ProfileForm';
import { Navigation } from '../components/Navigation';
import { StatusBadge } from '../components/StatusBadge';
import { StatsCard } from '../components/StatsCard';
import { useTowing } from '../context/Towing';

function MonthlyResolutionRate() {
  const { getMonthlyResolutionRate, loading } = useTowing();
  const rate = getMonthlyResolutionRate();
  return (
    <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--success)' }}>
      {loading ? '...' : `${rate}%`}
    </div>
  );
}

function formatDuration(minutes) {
  if (minutes == null || isNaN(minutes)) return 'N/A';
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return `${seconds} sec`;
  } else if (minutes < 60) {
    return `${Math.round(minutes * 10) / 10} min`;
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h${mins > 0 ? ' ' + mins + 'm' : ''}`;
  } else {
    const days = Math.floor(minutes / 1440);
    const hours = Math.round((minutes % 1440) / 60);
    return `${days}d${hours > 0 ? ' ' + hours + 'h' : ''}`;
  }
}

function MonthlyAverageResponseTime() {
  const { getMonthlyAverageResponseTime, loading } = useTowing();
  const avg = getMonthlyAverageResponseTime();
  return (
    <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--primary)' }}>
      {loading ? '...' : formatDuration(avg)}
    </div>
  );
}

// Enhanced Status Badge Component
function EnhancedStatusBadge({ status }) {
  const statusConfig = {
    pending: {
      color: '#6b7280',
      bgColor: '#f9fafb',
      borderColor: '#d1d5db',
      icon: '',
      text: 'Pending'
    },
    accepted: {
      color: '#1f2937',
      bgColor: '#f3f4f6',
      borderColor: '#9ca3af',
      icon: '',
      text: 'Accepted'
    },
    completed: {
      color: '#059669',
      bgColor: '#f0fdf4',
      borderColor: '#86efac',
      icon: '',
      text: 'Completed'
    },
    cancelled: {
      color: '#dc2626',
      bgColor: '#fef2f2',
      borderColor: '#fca5a5',
      icon: '',
      text: 'Cancelled'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '6px',
      backgroundColor: config.bgColor,
      border: `1px solid ${config.borderColor}`,
      color: config.color,
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      minWidth: '100px',
      justifyContent: 'center'
    }}>
      <span style={{ fontSize: '14px' }}>{config.icon}</span>
      {config.text}
    </div>
  );
}

// Enhanced Action Button Component
function ActionButton({ request, onStatusUpdate }) {
  const getButtonConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          text: 'Assign',
          icon: '',
          color: '#1890ff',
          bgColor: '#e6f7ff',
          borderColor: '#91d5ff',
          hoverColor: '#096dd9'
        };
      case 'accepted':
        return {
          text: 'Complete',
          icon: '',
          color: '#52c41a',
          bgColor: '#f6ffed',
          borderColor: '#b7eb8f',
          hoverColor: '#389e0d'
        };
      default:
        return null;
    }
  };

  const config = getButtonConfig(request.status);

  if (!config) {
    return (
      <div style={{
        padding: '8px 16px',
        borderRadius: '20px',
        backgroundColor: '#f5f5f5',
        color: '#8c8c8c',
        fontSize: '12px',
        fontWeight: '500',
        textAlign: 'center'
      }}>
        {request.status === 'completed' ? '✅ Completed' : 'No Action'}
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        const newStatus = request.status === 'pending' ? 'accepted' : 'completed';
        onStatusUpdate(request._id, newStatus);
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        borderRadius: '20px',
        backgroundColor: config.bgColor,
        border: `2px solid ${config.borderColor}`,
        color: config.color,
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = config.hoverColor;
        e.target.style.color = 'white';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = config.bgColor;
        e.target.style.color = config.color;
      }}
    >
      <span style={{ fontSize: '14px' }}>{config.icon}</span>
      {config.text}
    </button>
  );
}

function DetailsModal({ open, onClose, request }) {
  if (!open || !request) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.35)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', borderRadius: 8, minWidth: 340, maxWidth: 420, padding: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Request Details</h2>
        <div style={{ marginBottom: 18 }}>
          <strong>Request ID:</strong> #{request._id}<br/>
          <strong>Status:</strong> {request.status}<br/>
          <strong>Created At:</strong> {new Date(request.createdAt).toLocaleString()}<br/>
          <strong>Updated At:</strong> {new Date(request.updatedAt).toLocaleString()}<br/>
          
        </div>
        <div style={{ marginBottom: 18 }}>
          <strong>Vehicle Type:</strong> {request.vehicleType}<br/>
          <strong>Problem Category:</strong> {request.problemCategory}<br/>
          <strong>Location:</strong> {request.location}<br/>
          <strong>Description:</strong> {request.description || '-'}<br/>
        </div>
        <button onClick={onClose} style={{ padding: '8px 24px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Close</button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { requests, updateRequestStatus, getRequestStats, loading } = useTowing();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('recent'); // 'recent' or 'oldest'
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsRequest, setDetailsRequest] = useState(null);

  const stats = getRequestStats();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    const assignedTo = newStatus === 'accepted' ? 'Auto-assigned technician' : null;
    const result = await updateRequestStatus(requestId, newStatus, assignedTo);
    
    if (result.success) {
      alert('Status updated successfully!');
    } else {
      alert('Error while updating status');
    }
  };

  const getFilteredRequests = () => {
    let filtered = requests;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(req => req.status === selectedStatus);
    }

    // Filter by vehicle type
    if (selectedVehicleType !== 'all') {
      filtered = filtered.filter(req => req.vehicleType === selectedVehicleType);
    }

    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      
      filtered = filtered.filter(req => {
        const requestDate = new Date(req.createdAt);
        return requestDate >= start && requestDate <= end;
      });
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  // Get unique vehicle types for filter
  const vehicleTypes = [...new Set(requests.map(req => req.vehicleType))].filter(Boolean);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Navigation />
      <DetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} request={detailsRequest} />
      
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            Admin Dashboard 
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Manage all towing requests and supervise operations.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 mb-8">
          <StatsCard
            title="Total Requests"
            value={stats.total}
            description="All requests"
            icon={() => <span style={{ fontSize: '16px' }}>📊</span>}
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            description="To be prioritized"
            icon={() => <span style={{ fontSize: '16px' }}>⏳</span>}
          />
          <StatsCard
            title="Accepted"
            value={stats.accepted}
            description="Active interventions"
            icon={() => <span style={{ fontSize: '16px' }}>🔧</span>}
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            description="Completed interventions"
            icon={() => <span style={{ fontSize: '16px' }}>✅</span>}
          />
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
              Requests Management
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              style={{
                padding: '12px 0',
                borderBottom: activeTab === 'analytics' ? '2px solid var(--primary)' : '2px solid transparent',
                color: activeTab === 'analytics' ? 'var(--primary)' : 'var(--muted-foreground)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {(activeTab === 'overview' || activeTab === 'requests') && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <h3 className="card-title">Filters</h3>
              <p className="card-description">
                Filter requests by status, vehicle type, and date range
              </p>
            </div>
            <div className="card-content">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {/* Status Filter */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      fontSize: '14px'
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Vehicle Type Filter */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                    Vehicle Type
                  </label>
                  <select
                    value={selectedVehicleType}
                    onChange={(e) => setSelectedVehicleType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      fontSize: '14px'
                    }}
                  >
                    <option value="all">All Vehicle Types</option>
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Order Filter */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                    Sort Order
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      fontSize: '14px'
                    }}
                  >
                    <option value="recent">Recent to Oldest</option>
                    <option value="oldest">Oldest to Recent</option>
                  </select>
                </div>

                {/* Start Date Filter */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* End Date Filter */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {/* Clear Filters Button */}
              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <button
                  onClick={() => {
                    setSelectedStatus('all');
                    setSelectedVehicleType('all');
                    setStartDate('');
                    setEndDate('');
                    setSortOrder('recent');
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--muted-foreground)',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div>
            {/* Recent Requests */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Requests ({filteredRequests.length})</h3>
                <p className="card-description">
                  Latest requests based on current filters
                </p>
              </div>
              <div className="card-content">
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th style={{ width: 120, minWidth: 120 }}>Actions</th>
                        <th style={{ width: 130, minWidth: 130 }}>Date</th>
                        <th style={{ width: 170, minWidth: 170 }}>Client</th>
                        <th style={{ width: 120, minWidth: 120 }}>Vehicle</th>
                        <th style={{ width: 120, minWidth: 120 }}>Location</th>
                        <th style={{ width: 210, minWidth: 210 }}>Description</th>
                        <th style={{ width: 120, minWidth: 120 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.slice(0, 5).map(request => (
                        <tr key={request._id}>
                          <td style={{ width: 120, minWidth: 120 }}>
                            <ActionButton request={request} onStatusUpdate={handleStatusUpdate} />
                          </td>
                          <td style={{ width: 130, minWidth: 130, fontSize: '14px' }}>
                            {formatDate(request.createdAt)}
                          </td>
                          <td style={{ width: 170, minWidth: 170, fontSize: '14px' }}>
                            {typeof request.userId === 'object' ? (request.userId?.email || request.userId?._id || '-') : (request.userId || '-')}
                          </td>
                          <td style={{ width: 120, minWidth: 120, fontSize: '14px' }}>
                            {request.vehicleType} / {request.problemCategory}
                          </td>
                          <td style={{ width: 120, minWidth: 120, fontSize: '14px' }}>
                            {request.location}
                          </td>
                          <td style={{ width: 210, minWidth: 210, fontSize: '14px', position: 'relative' }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ flex: 1 }}>{request.description}</span>
                              <span
                                style={{ cursor: 'pointer', color: '#1890ff', fontSize: 18, marginLeft: 4 }}
                                title="More Info"
                                aria-label="More Info"
                                onClick={() => { setDetailsOpen(true); setDetailsRequest(request); }}
                              >
                                ℹ️
                              </span>
                            </div>
                          </td>
                          <td style={{ width: 120, minWidth: 120 }}>
                            <EnhancedStatusBadge status={request.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600' }}>
                Requests Management ({filteredRequests.length})
              </h3>
            </div>

            <div className="card">
              <div className="card-content">
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th style={{ width: 120, minWidth: 120 }}>Actions</th>
                        <th style={{ width: 130, minWidth: 130 }}>Date</th>
                        <th style={{ width: 170, minWidth: 170 }}>Client</th>
                        <th style={{ width: 120, minWidth: 120 }}>Vehicle</th>
                        <th style={{ width: 120, minWidth: 120 }}>Location</th>
                        <th style={{ width: 210, minWidth: 210 }}>Description</th>
                        <th style={{ width: 120, minWidth: 120 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map(request => (
                        <tr key={request._id}>
                          <td style={{ width: 120, minWidth: 120 }}>
                            <ActionButton request={request} onStatusUpdate={handleStatusUpdate} />
                          </td>
                          <td style={{ width: 130, minWidth: 130, fontSize: '14px' }}>
                            {formatDate(request.createdAt)}
                          </td>
                          <td style={{ width: 170, minWidth: 170, fontSize: '14px' }}>
                            {typeof request.userId === 'object' ? (
                              <div style={{ lineHeight: '1.3' }}>
                                <div><strong>Email:</strong> {request.userId.email || '-'}</div>
                                <div><strong>Phone:</strong> {request.userId.phone || '-'}</div>
                                <div><strong>CIN:</strong> {request.userId.cin || request.userId.CIN || '-'}</div>
                                <div><strong>First Name:</strong> {request.userId.firstName || request.userId.nom || '-'}</div>
                                <div><strong>Last Name:</strong> {request.userId.lastName || request.userId.prenom || '-'}</div>
                              </div>
                            ) : (
                              <span>-</span>
                            )}
                          </td>
                          <td style={{ width: 120, minWidth: 120, fontSize: '14px' }}>
                            {request.vehicleType} / {request.problemCategory}
                          </td>
                          <td style={{ width: 120, minWidth: 120, fontSize: '14px' }}>
                            {request.location}
                          </td>
                          <td style={{ width: 210, minWidth: 210, fontSize: '14px', position: 'relative' }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ flex: 1 }}>{request.description}</span>
                              <span
                                style={{ cursor: 'pointer', color: '#1890ff', fontSize: 18, marginLeft: 4 }}
                                title="More Info"
                                aria-label="More Info"
                                onClick={() => { setDetailsOpen(true); setDetailsRequest(request); }}
                              >
                                ℹ️
                              </span>
                            </div>
                          </td>
                          <td style={{ width: 120, minWidth: 120 }}>
                            <EnhancedStatusBadge status={request.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
              Analytics & Reports
            </h3>
        
            <div className="grid grid-cols-2 mb-6">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Monthly Performance</h4>
                </div>
                <div className="card-content">
                  <MonthlyResolutionRate />
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
                    Request resolution rate this month
                  </p>
                </div>
              </div>
        
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Average Response Time</h4>
                </div>
                <div className="card-content">
                  <MonthlyAverageResponseTime />
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
                    Average first intervention time
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
