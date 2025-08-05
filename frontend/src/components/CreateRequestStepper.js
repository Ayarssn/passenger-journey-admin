import React, { useState } from 'react';
import { useTowing } from '../context/Towing';
import { useAuth } from '../context/Auth';

const STEPS = [
  { id: 1, title: 'Vehicle Information' },
  { id: 2, title: 'Location' },
  { id: 3, title: 'Problem Description' },
  { id: 4, title: 'Confirmation' }
];

export const CreateRequestStepper = ({ onComplete, onCancel }) => {
  const { createRequest, loading } = useTowing();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    vehicleType: '', // NEW: vehicle type selection
    vehicleInfo: '',
    vehicleMake: '',
    vehicleModel: '',
    licensePlate: '',
    location: '',
    terminal: '',
    zone: '',
    description: '',
    problemCategory: '', // NEW: problem category selection
    urgency: 'normal'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Build request payload to match backend MongoDB schema
    const requestData = {
      vehicleType: formData.vehicleType,
      problemCategory: formData.problemCategory,
      description: formData.description,
      status: 'pending',
      paymentStatus: 'unpaid',
      location: `${formData.terminal}, ${formData.zone}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await createRequest(requestData);
    
    if (result.success) {
      onComplete && onComplete(result.requestId);
    } else {
      alert('Error while creating the request. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Your Vehicle Information</h3>

            {/* Vehicle Type Dropdown */}
            <div className="form-group">
              <label className="label">Vehicle Type *</label>
              <select
                className="input"
                value={formData.vehicleType}
                onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                required
              >
                <option value="">Select vehicle type</option>
                <option value="car">Car</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">Vehicle Make *</label>
              <input
                type="text"
                className="input"
                value={formData.vehicleMake}
                onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                placeholder="E.g.: Renault, Peugeot..."
                required
              />
            </div>
            <div className="form-group">
              <label className="label">Model *</label>
              <input
                type="text"
                className="input"
                value={formData.vehicleModel}
                onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                placeholder="E.g.: Clio, 208..."
                required
              />
            </div>
            <div className="form-group">
              <label className="label">License Plate *</label>
              <input
                type="text"
                className="input"
                value={formData.licensePlate}
                onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                placeholder="AA-123-45"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Where are you located?</h3>
            <div className="form-group">
              <label className="label">Terminal *</label>
              <select
                className="input"
                value={formData.terminal}
                onChange={(e) => handleInputChange('terminal', e.target.value)}
                required
              >
                <option value="">Select a terminal</option>
                <option value="Terminal 1">Terminal 1</option>
                <option value="Terminal 2">Terminal 2</option>
                <option value="Terminal 3">Terminal 3</option>
                <option value="Freight Zone">Freight Zone</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">Specific Area *</label>
              <input
                type="text"
                className="input"
                value={formData.zone}
                onChange={(e) => handleInputChange('zone', e.target.value)}
                placeholder="E.g.: Zone A, East Parking, Dock 5..."
                required
              />
            </div>
            <div className="form-group">
              <label className="label">Landmark (optional)</label>
              <input
                type="text"
                className="input"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="E.g.: Near customs office, in front of the restaurant..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Describe the problem</h3>
            {/* Problem Category Dropdown - FIXED */}
            <div className="form-group">
              <label className="label">Problem Category *</label>
              <select
                className="input"
                value={formData.problemCategory}
                onChange={(e) => handleInputChange('problemCategory', e.target.value)}
                required
              >
                <option value="">Select problem category</option>
                <option value="battery">Battery</option>
                <option value="engine">Engine</option>
                <option value="tire">Tire</option>
                <option value="accident">Accident</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">Problem Type</label>
              <select
                className="input"
                value={formData.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
              >
                <option value="normal">Not urgent</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency (immediate danger)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">Detailed Description *</label>
              <textarea
                className="input"
                style={{ minHeight: '120px', resize: 'vertical' }}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the problem in detail: engine failure, flat tire, minor accident, dead battery, etc."
                required
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Request Confirmation</h3>
            <div className="card" style={{ backgroundColor: 'var(--muted-background)', padding: '16px' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--primary)' }}>Summary</h4>
              <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                <div><strong>Vehicle:</strong> {formData.vehicleMake} {formData.vehicleModel} ({formData.licensePlate})</div>
                <div><strong>Location:</strong> {formData.terminal}, {formData.zone}</div>
                <div><strong>Urgency:</strong> {formData.urgency === 'normal' ? 'Normal' : formData.urgency === 'urgent' ? 'Urgent' : 'Critical'}</div>
                <div><strong>Problem:</strong> {formData.description}</div>
                <div><strong>Requester:</strong> {user?.name || 'User'}</div>
              </div>
            </div>
            <div style={{ 
              padding: '12px', 
              backgroundColor: 'rgba(245, 158, 11, 0.1)', 
              borderRadius: 'var(--radius-md)', 
              marginTop: '16px',
              fontSize: '14px'
            }}>
              ℹ️ A technician will be assigned to your request as soon as possible. You will receive a notification with their contact details.
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.vehicleType &&
          formData.vehicleMake &&
          formData.vehicleModel &&
          formData.licensePlate
        );
      case 2:
        return formData.terminal && formData.zone;
      case 3:
        return (
          formData.problemCategory
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Progress indicator */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          {STEPS.map((step) => (
            <div
              key={step.id}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '8px 4px',
                fontSize: '12px',
                color: currentStep >= step.id ? 'var(--primary)' : 'var(--muted-foreground)'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: currentStep >= step.id ? 'var(--primary)' : 'var(--border)',
                  color: currentStep >= step.id ? 'white' : 'var(--muted-foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 4px',
                  fontWeight: '600'
                }}
              >
                {step.id}
              </div>
              {step.title}
            </div>
          ))}
        </div>
        <div style={{ 
          width: '100%', 
          height: '4px', 
          backgroundColor: 'var(--border)', 
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div
            style={{
              width: `${(currentStep / STEPS.length) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--primary)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Step content */}
      <div style={{ minHeight: '300px', marginBottom: '32px' }}>
        {renderStepContent()}
      </div>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          {currentStep > 1 && (
            <button onClick={handlePrev} className="btn btn-secondary">
              Previous
            </button>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel} className="btn btn-outline">
            Cancel
          </button>
          
          {currentStep < STEPS.length ? (
            <button 
              onClick={handleNext} 
              className="btn btn-primary"
              disabled={!isStepValid()}
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              className="btn btn-primary"
              disabled={loading || !isStepValid()}
            >
              {loading ? 'Sending...' : 'Confirm Request'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
