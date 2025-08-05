#  Passenger Journey Admin - Towing Service Management System

A comprehensive web application for managing towing and roadside assistance services at Tanger Med Port. This system provides real-time request management, user authentication, and administrative oversight for emergency vehicle assistance.

##  Features

### **For Passengers**
-  **Request Creation**: Multi-step form for creating towing requests
-  **Dashboard**: View request history and status updates
-  **Real-time Notifications**: Instant updates on request status changes
-  **Emergency Contact**: Direct access to emergency services
-  **Profile Management**: Update personal information and contact details

### **For Administrators**
-  **Request Management**: View, filter, and manage all towing requests
-  **Status Updates**: Accept, complete, or cancel requests
-  **Analytics Dashboard**: Overview of request statistics and trends
-  **Advanced Filtering**: Filter by status, vehicle type, date range, and sort order
-  **User Management**: Monitor passenger accounts and activities
-  **Notification System**: Send updates to passengers

### **System Features**
-  **Secure Authentication**: JWT-based user authentication
-  **Real-time Updates**: Socket.io for live status updates
-  **Responsive Design**: Works on desktop and mobile devices
-  **Dark/Light Theme**: User preference theme switching
-  **Real-time Communication**: WebSocket integration for live updates

## 🏗️ Architecture

### **Frontend (React)**
```
frontend/src/
├── components/          # Reusable UI components
│   ├── Navigation.js    # Main navigation bar
│   ├── CreateRequestStepper.js  # Multi-step request form
│   ├── StatusBadge.js   # Status display components
│   ├── StatsCard.js     # Statistics display
│   └── ProfileForm.js   # User profile management
├── pages/              # Main application pages
│   ├── Home.js         # Landing page with service info
│   ├── SignIn.js       # User authentication
│   ├── SignUp.js       # User registration
│   ├── PassengerDashboard.js  # Passenger interface
│   ├── AdminDashboard.js      # Admin interface
│   └── NotFound.js     # 404 error page
├── context/            # React Context for state management
│   ├── Auth.js         # Authentication context
│   ├── Theme.js        # Theme management
│   ├── Notification.js # Notification system
│   └── Towing.js       # Request management context
└── hooks/              # Custom React hooks
    └── useWebSocket.js # WebSocket connection management
```

### **Backend (Node.js/Express)**
```
backend/
├── config/
│   └── db.js          # MongoDB connection configuration
├── controllers/        # Business logic handlers
│   ├── auth.js        # Authentication controllers
│   └── request.js     # Request management controllers
├── middleware/         # Express middleware
│   ├── auth.js        # JWT authentication middleware
│   └── authorizeRole.js # Role-based access control
├── models/            # MongoDB schemas
│   ├── user.js        # User model with password hashing
│   ├── request.js     # Towing request model
│   └── notification.js # Notification model
├── routes/            # API route definitions
│   ├── auth.js        # Authentication routes
│   ├── request.js     # Request management routes
│   └── notification.js # Notification routes
└── utils/
    └── constants.js   # Application constants
```

##  Getting Started

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ayarssn/passenger-journey-admin.git
   cd passenger-journey-admin
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/passenger-journey-admin
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

4. **Start the application**
   ```bash
   # Start backend server (from root directory)
   npm run dev
   
   # Start frontend (in a new terminal, from frontend directory)
   cd frontend
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

##  Database Schema

### **User Model**
```javascript
{
  email: String (required, unique),
  password: String (hashed),
  role: String (enum: ['admin', 'passenger']),
  cin: String (required, unique),
  phone: String (required),
  firstName: String (required),
  lastName: String (required)
}
```

### **Request Model**
```javascript
{
  userId: ObjectId (ref: User),
  vehicleType: String (required),
  problemCategory: String (required),
  description: String,
  status: String (enum: ['pending', 'accepted', 'completed', 'cancelled']),
  paymentStatus: String (default: 'unpaid'),
  location: String (required),
  assignedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

##  API Endpoints

### **Authentication**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/profile` - Get user profile

### **Request Management**
- `GET /api/requests` - Get all requests (admin)
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id/status` - Update request status
- `DELETE /api/requests/:id` - Cancel request

### **Notifications**
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/seen` - Mark notification as seen

##  UI/UX Features

### **Design System**
- **Color Scheme**: Professional dark/light theme
- **Typography**: Clean, readable fonts
- **Components**: Reusable, consistent design elements
- **Responsive**: Mobile-first design approach

### **Key Pages**
- **Home Page**: Service introduction with hero section and contact information
- **Dashboard**: Role-based interfaces for passengers and administrators
- **Request Forms**: Step-by-step request creation process
- **Status Tracking**: Real-time status updates with visual indicators

##  Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Role-based Access**: Admin and passenger role separation
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Secure cross-origin requests

##  Technology Stack

### **Frontend**
- **React 19.1.0** - Modern UI framework
- **React Router DOM 7.7.0** - Client-side routing
- **Socket.io Client 4.8.1** - Real-time communication
- **CSS-in-JS** - Component-based styling

### **Backend**
- **Node.js** - JavaScript runtime
- **Express 5.1.0** - Web framework
- **MongoDB 8.16.3** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.io 4.8.1** - Real-time communication
- **JWT 9.0.2** - Authentication tokens
- **bcrypt 6.0.0** - Password hashing

## Deployment

### **Development**
```bash
# Backend development
npm run dev

# Frontend development
cd frontend && npm start
```

## Contact Information

- **Email**: raissouniaya05@gmail.com


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

