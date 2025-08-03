# RoTrust Frontend Components Documentation

This document provides a comprehensive overview of the frontend components of the RoTrust platform. It outlines the architecture, key modules, and their interactions to help developers understand and contribute to the system.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [Pages](#pages)
4. [Reusable Components](#reusable-components)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Routing](#routing)
8. [Styling](#styling)
9. [Authentication](#authentication)

## Architecture Overview

The RoTrust frontend is built using React, a popular JavaScript library for building user interfaces. The architecture follows a component-based design with clear separation of concerns:

```
frontend/
├── public/            # Static assets
├── src/
│   ├── assets/        # Images, icons, and other assets
│   ├── components/    # Reusable UI components
│   ├── context/       # React Context for state management
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── services/      # API service integrations
│   ├── styles/        # Global styles and themes
│   ├── utils/         # Utility functions
│   ├── App.js         # Main application component
│   └── index.js       # Application entry point
└── package.json       # Dependencies and scripts
```

The frontend follows a modular architecture:

1. **Pages**: Top-level components that represent different routes
2. **Components**: Reusable UI elements used across pages
3. **Context**: Global state management using React Context API
4. **Services**: API integration and data fetching
5. **Hooks**: Custom React hooks for shared logic
6. **Utils**: Utility functions and helpers

## Core Components

### Main Application (App.js)

The entry point for the React application that sets up routing, global state, and theme:

- Configures React Router for navigation
- Sets up authentication context
- Applies global theme and styling
- Handles global error boundaries

### Index (index.js)

The application bootstrap file that renders the App component to the DOM:

- Configures React strict mode
- Sets up any required polyfills
- Initializes any global libraries or services

## Pages

The application is organized into several page components, each representing a different route:

### Home Page (pages/HomePage.js)

The landing page for the application:

- Overview of the platform
- Featured properties
- Quick search functionality
- Call-to-action sections

### Authentication Pages

Handles user authentication:

- **Login Page (pages/LoginPage.js)**: User login form
- **Register Page (pages/RegisterPage.js)**: User registration form
- **Forgot Password Page (pages/ForgotPasswordPage.js)**: Password recovery

### Property Pages

Manages property-related functionality:

- **Property List Page (pages/PropertyListPage.js)**: Lists properties with filtering and sorting
- **Property Detail Page (pages/PropertyDetailPage.js)**: Displays detailed property information
- **Property Registration Page (pages/PropertyRegistrationPage.js)**: Form for registering new properties
- **Property Edit Page (pages/PropertyEditPage.js)**: Form for editing property details

### Transaction Pages

Handles property transactions:

- **Transaction List Page (pages/TransactionListPage.js)**: Lists user's transactions
- **Transaction Detail Page (pages/TransactionDetailPage.js)**: Displays transaction details
- **Transaction Creation Page (pages/TransactionCreationPage.js)**: Form for initiating new transactions

### User Pages

Manages user profiles and settings:

- **Profile Page (pages/ProfilePage.js)**: Displays and edits user profile
- **Dashboard Page (pages/DashboardPage.js)**: User dashboard with overview of activities
- **Settings Page (pages/SettingsPage.js)**: User settings and preferences

## Reusable Components

The application includes several reusable components:

### Layout Components

- **Header (components/layout/Header.js)**: Main navigation header
- **Footer (components/layout/Footer.js)**: Page footer with links and information
- **Sidebar (components/layout/Sidebar.js)**: Sidebar navigation for dashboard
- **PageContainer (components/layout/PageContainer.js)**: Consistent page layout wrapper

### Form Components

- **TextField (components/form/TextField.js)**: Text input field with validation
- **SelectField (components/form/SelectField.js)**: Dropdown selection field
- **DatePicker (components/form/DatePicker.js)**: Date selection component
- **FileUpload (components/form/FileUpload.js)**: File upload component
- **FormContainer (components/form/FormContainer.js)**: Form wrapper with validation

### Property Components

- **PropertyCard (components/property/PropertyCard.js)**: Card displaying property summary
- **PropertyFilter (components/property/PropertyFilter.js)**: Filtering options for properties
- **PropertyGallery (components/property/PropertyGallery.js)**: Image gallery for properties
- **PropertyMap (components/property/PropertyMap.js)**: Map display for property location

### Transaction Components

- **TransactionCard (components/transaction/TransactionCard.js)**: Card displaying transaction summary
- **TransactionStatus (components/transaction/TransactionStatus.js)**: Status indicator for transactions
- **TransactionTimeline (components/transaction/TransactionTimeline.js)**: Timeline of transaction events

### UI Components

- **Button (components/ui/Button.js)**: Customized button component
- **Card (components/ui/Card.js)**: Card container component
- **Modal (components/ui/Modal.js)**: Modal dialog component
- **Notification (components/ui/Notification.js)**: Notification toast component
- **Spinner (components/ui/Spinner.js)**: Loading spinner component
- **Tabs (components/ui/Tabs.js)**: Tabbed interface component

## State Management

The application uses React Context API for state management:

### Authentication Context (context/AuthContext.js)

Manages user authentication state:

- Current user information
- Login and logout functions
- Token management
- Authentication status

### Property Context (context/PropertyContext.js)

Manages property-related state:

- Property listings
- Property filtering and sorting
- Property creation and editing

### Transaction Context (context/TransactionContext.js)

Manages transaction-related state:

- Transaction listings
- Transaction creation and updates
- Transaction status tracking

### UI Context (context/UIContext.js)

Manages UI-related state:

- Theme settings
- Notification messages
- Modal visibility
- Loading states

## API Integration

The application integrates with the backend API using Axios:

### API Service (services/api.js)

Base API configuration:

- Axios instance setup
- Request and response interceptors
- Authentication token handling
- Error handling

### Authentication Service (services/authService.js)

Handles authentication API calls:

- `login`: Authenticates user credentials
- `register`: Registers new users
- `logout`: Logs out current user
- `refreshToken`: Refreshes authentication token
- `forgotPassword`: Initiates password recovery

### Property Service (services/propertyService.js)

Handles property-related API calls:

- `getProperties`: Retrieves property listings
- `getProperty`: Retrieves property details
- `createProperty`: Creates new property
- `updateProperty`: Updates property details
- `deleteProperty`: Deletes property

### Transaction Service (services/transactionService.js)

Handles transaction-related API calls:

- `getTransactions`: Retrieves transaction listings
- `getTransaction`: Retrieves transaction details
- `createTransaction`: Creates new transaction
- `updateTransactionStatus`: Updates transaction status
- `cancelTransaction`: Cancels transaction

### User Service (services/userService.js)

Handles user-related API calls:

- `getCurrentUser`: Retrieves current user profile
- `updateUserProfile`: Updates user profile
- `getUserById`: Retrieves user by ID
- `getUsers`: Retrieves user listings

## Routing

The application uses React Router for navigation:

### Router Configuration (App.js)

- Route definitions for different pages
- Protected routes for authenticated users
- Route parameters for dynamic content
- Nested routes for complex page hierarchies

### Route Guards

- `PrivateRoute`: Protects routes that require authentication
- `AdminRoute`: Protects routes that require admin privileges
- `PublicOnlyRoute`: Routes accessible only to unauthenticated users

## Styling

The application uses Material UI for styling:

### Theme Configuration (styles/theme.js)

- Custom color palette
- Typography settings
- Component style overrides
- Responsive breakpoints

### Global Styles (styles/global.js)

- Reset styles
- Base typography
- Common utility classes
- Animation definitions

### Component Styles

- Styled components using Material UI's styling system
- Responsive design for different screen sizes
- Consistent styling across components

## Authentication

The application implements JWT-based authentication:

### Token Management

- Storage of JWT tokens in localStorage or cookies
- Token expiration handling
- Token refresh mechanism

### Authentication Flow

- Login process with credentials
- Registration process for new users
- Password recovery flow
- Automatic logout on token expiration

### Authorization

- Role-based access control
- Permission checking for protected actions
- UI adaptation based on user role

## Error Handling

The application implements comprehensive error handling:

- Global error boundary for catching React errors
- API error handling with user-friendly messages
- Form validation errors with clear feedback
- Network error detection and retry mechanisms

## Performance Optimization

The application includes several performance optimizations:

- Code splitting for route-based chunking
- Lazy loading of components
- Memoization of expensive calculations
- Optimized rendering with React.memo and useMemo

## Accessibility

The application follows accessibility best practices:

- Semantic HTML structure
- ARIA attributes for complex components
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

## Browser Compatibility

The application supports modern browsers:

- Chrome, Firefox, Safari, Edge
- Polyfills for older browsers
- Responsive design for different devices
- Touch support for mobile devices

## Testing

The frontend includes comprehensive tests:

- Unit tests for components and utilities
- Integration tests for component interactions
- End-to-end tests for critical user flows
- Snapshot tests for UI components

## Deployment

The frontend is deployed using AWS services:

- S3 for static file hosting
- CloudFront for content delivery
- Route 53 for domain management
- Certificate Manager for SSL