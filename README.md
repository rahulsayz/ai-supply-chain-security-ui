# 🛡️ Supply Chain Defender - Enterprise SOC Platform

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-38B2AC)](https://tailwindcss.com/)

A modern, enterprise-ready Supply Chain Security application built with Next.js, React, and Tailwind CSS. This platform provides real-time AI-powered threat detection and response capabilities for supply chain ecosystems.

## 📋 Table of Contents

- [🚀 Features](#-features)
- [📸 Screenshots](#-screenshots)
- [🎨 Modern UI/UX](#-modern-uiux-improvements)
- [🛠️ Tech Stack](#️-tech-stack)
- [📖 Documentation](#-documentation)
- [🚀 Getting Started](#-getting-started)
- [🔧 Configuration](#-configuration)
- [🏗️ Architecture](#️-architecture)
- [🧪 Testing](#-testing)
- [📊 Performance](#-performance)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🚀 Modern UI/UX Improvements

### Design System Enhancements
- **Enhanced Color Scheme**: Professional, security-focused color palette with improved contrast
- **Modern Typography**: Inter font family with optimized font weights and spacing
- **Improved Spacing**: Better visual hierarchy with consistent spacing scales
- **Enhanced Shadows**: Subtle shadows and hover effects for depth

### Component Modernization
- **Cards**: Rounded corners, improved borders, and hover animations
- **Buttons**: Enhanced variants including security-specific styles (threat, success, warning)
- **Badges**: Multiple variants for different threat levels and statuses
- **Inputs**: Larger touch targets, better focus states, and hover effects
- **Loading States**: Improved skeleton components with better visual feedback

### Layout Improvements
- **Sidebar**: Enhanced navigation with descriptions, badges, and system status
- **Header**: Improved search bar, system health indicators, and user menu
- **Dashboard**: Better grid layouts and responsive design
- **Spacing**: Increased spacing between components for better readability

### Visual Enhancements
- **Gradients**: Subtle gradient backgrounds for cards and buttons
- **Animations**: Smooth transitions and hover effects
- **Icons**: Better icon placement and sizing
- **Status Indicators**: Visual feedback for system health and connections

## 🎨 Design Features

### Enterprise-Ready Components
- **Security Cards**: Specialized card designs for threat information
- **Status Badges**: Color-coded indicators for different risk levels
- **System Health**: Real-time status indicators throughout the interface
- **Professional Layout**: Clean, organized interface suitable for enterprise use

### Accessibility Improvements
- **Focus States**: Clear focus indicators for keyboard navigation
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user preferences for motion
- **Screen Reader**: Proper semantic markup and ARIA labels

### Responsive Design
- **Mobile First**: Optimized for mobile and tablet devices
- **Flexible Grids**: Responsive layouts that adapt to screen sizes
- **Touch Friendly**: Appropriate touch targets for mobile devices

## 🛠️ Technical Improvements

### Performance Optimizations
- **Font Loading**: Optimized font loading with display swap
- **CSS Variables**: Efficient use of CSS custom properties
- **Animation Performance**: Hardware-accelerated animations
- **Bundle Optimization**: Efficient component imports

### Code Quality
- **TypeScript**: Full type safety throughout the application
- **Component Architecture**: Reusable, composable components
- **Consistent Styling**: Unified design system with Tailwind CSS
- **Modern React**: Latest React patterns and best practices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.0 with React 18.2.0
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS 3.3.3 with shadcn/ui components
- **State Management**: TanStack Query (React Query) 5.85.5
- **Data Visualization**: D3.js 7.9.0, Recharts 2.12.7, ReactFlow 11.11.4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React 0.446.0

### Backend Integration
- **API Client**: Axios 1.11.0 with custom API abstraction
- **Real-time**: EventSource (Server-Sent Events) for live analysis
- **WebSocket**: ws 8.18.3 for real-time communications
- **Forms**: React Hook Form 7.53.0 with Zod validation

### Development Tools
- **Linting**: ESLint with Next.js configuration
- **Build Tool**: Next.js built-in compiler
- **Package Manager**: npm with lock file

## 📖 Documentation

This project includes comprehensive documentation:

### API Documentation
- **[Complete Dashboard API Reference](./components/dashboard/dashboard-api.md)** - Full API contracts, endpoints, and integration guides for all dashboard features including AI-powered threat prediction, cost monitoring, and system health APIs.

### Implementation Guides
- **[API Updates Summary](./API_UPDATES_SUMMARY.md)** - Detailed implementation summary of BigQuery AI Status and Costs API updates, including new TypeScript interfaces, component updates, and technical improvements.

- **[Live Analysis Fix Summary](./LIVE_ANALYSIS_FIX_SUMMARY.md)** - Technical guide covering the migration from WebSocket to EventSource for real-time threat detection, including troubleshooting steps and testing procedures.

### Configuration Files
- **[Component Configuration](./components.json)** - shadcn/ui component configuration with custom aliases and styling setup
- **[Package Dependencies](./package.json)** - Complete list of project dependencies and scripts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API server (optional - includes mock data mode)

### Installation
```bash
# Clone the repository
git clone https://github.com/rahulsayz/ai-supply-chain-security-ui.git

# Navigate to project directory
cd ai-supply-chain-security-ui

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables
Create a `.env.local` file with your configuration:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_API_MODE=live  # or 'static' for mock data

# WebSocket Configuration (if using WebSocket features)
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```

## 🚀 Features

### Core Functionality
- **Real-time Threat Monitoring**: Live threat intelligence feed with AI-powered analysis
- **Vendor Risk Assessment**: Comprehensive vendor risk scoring and management
- **AI-Powered Analytics**: BigQuery ML integration for advanced threat prediction
- **System Health Monitoring**: Real-time system status and performance metrics
- **Network Graph Visualization**: Interactive supply chain network mapping
- **Live Analysis Theater**: Real-time threat detection and response automation

### Security Features
- **Threat Classification**: Automatic threat categorization and severity scoring
- **Risk Assessment**: AI-powered risk analysis with actionable recommendations
- **Incident Response**: Streamlined threat response workflows and playbooks
- **Compliance Monitoring**: Regulatory compliance tracking and reporting
- **Supply Chain Vulnerability Mapping**: Visual representation of security risks

### AI-Powered Capabilities
- **Predictive Threat Analysis**: ML-based threat prediction and early warning
- **Executive AI Briefings**: Automated executive summaries and insights
- **Impact Metrics**: AI-calculated business impact assessments
- **Cost Monitoring**: Real-time BigQuery AI processing cost tracking

## 📸 Screenshots

### Al Security Analytics Hub
![Al Security Analytics Hub](./images/Al%20Security%20Analytics%20Hub.png)

### Al Supply Chain Risk Predictor
![Al Supply Chain Risk Predictor](./images/Al%20Supply%20Chain%20Risk%20Predictor.png)

### Live BigQuery Al Analysis
![Live BigQuery Al Analysis](./images/Live%20BigQuery%20Al%20Analysis.png)

### Network Graph
![Network Graph](./images/Network%20Graph.png)

### Supply Chain Risk Assessment
![Supply Chain Risk Assessment](./images/Supply%20Chain%20Risk%20Assessment.png)

### Threat Intelligence Center
![Threat Intelligence Center](./images/Threat%20Intelligence%20Center.png)

## 🔧 Configuration

### API Modes
The application supports two operational modes:

#### Static Mode (Mock Data)
```env
NEXT_PUBLIC_API_MODE=static
```
- Uses mock data for development and testing
- No backend server required
- Includes realistic sample data for all features

#### Live Mode (Backend Integration)
```env
NEXT_PUBLIC_API_MODE=live
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```
- Connects to actual backend API
- Real-time data and threat detection
- Requires backend server running

### Backend Server Setup
The project includes a Node.js backend server in the `/server` directory:

```bash
# Navigate to server directory
cd server

# Install server dependencies
npm install

# Start the backend server
npm start
```

## 🏗️ Architecture

### Project Structure
```
├── app/                          # Next.js 13+ App Router
│   ├── analytics/               # Analytics dashboard page
│   ├── api-test/               # API testing utilities
│   ├── live-analysis/          # Real-time threat analysis
│   ├── network-graph/          # Supply chain visualization
│   ├── settings/               # Application settings
│   ├── threats/                # Threat management
│   └── vendors/                # Vendor risk management
├── components/                  # Reusable React components
│   ├── analytics/              # Analytics-specific components
│   ├── dashboard/              # Dashboard widgets and layouts
│   ├── layout/                 # App layout components
│   ├── live-analysis/          # Live analysis components
│   ├── network-graph/          # Network visualization components
│   ├── settings/               # Settings components
│   ├── threats/                # Threat management components
│   ├── ui/                     # shadcn/ui components
│   └── vendors/                # Vendor management components
├── hooks/                      # Custom React hooks
├── lib/                        # Utility libraries and API client
├── public/                     # Static assets and mock data
└── server/                     # Backend API server
```

### Key Components

#### Dashboard System
- **Enhanced Dashboard Overview**: Main dashboard with AI-powered widgets
- **AI Executive Brief**: Automated executive summaries
- **Risk Predictor**: ML-based threat prediction
- **Live Analysis Theater**: Real-time threat monitoring

#### API Client Architecture
- **Unified API Client**: Single source for all API communications
- **Automatic Fallbacks**: Graceful degradation to mock data
- **Type Safety**: Full TypeScript interfaces for all API responses
- **Real-time Integration**: EventSource for live threat feeds

## 🧪 Testing

### API Testing
The application includes a built-in API testing suite:

1. **Navigate to API Test Page**:
   ```
   http://localhost:3000/api-test
   ```

2. **Available Tests**:
   - Health check endpoints
   - BigQuery AI status and costs
   - EventSource connection testing
   - Threat detection APIs
   - Vendor risk assessment APIs

### Development Testing
```bash
# Run linting
npm run lint

# Build the application
npm run build

# Start production server
npm start
```

### Mock Data Testing
- Switch to static mode for consistent testing
- Comprehensive mock data for all features
- Realistic threat scenarios and vendor data

## 🎯 Target Audience

This application is designed for:
- **Security Operations Centers (SOC)**
- **Supply Chain Security Teams**
- **Enterprise Risk Management**
- **Compliance Officers**
- **Security Analysts**
- **IT Operations Teams**
- **Executive Leadership** (via AI briefings)

## 🔧 Customization

### Theme Configuration
The application supports both light and dark themes with:
- Customizable color schemes
- Configurable component styles
- Flexible layout options

### Component Variants
Multiple variants available for:
- Buttons (security, threat, success, warning)
- Badges (risk levels, status indicators)
- Cards (enterprise, security, threat)

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ across all categories
- **Core Web Vitals**: Optimized for performance
- **Accessibility**: WCAG 2.1 AA compliant
- **SEO**: Optimized meta tags and structure

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:
- Code style and standards
- Testing requirements
- Pull request process
- Community guidelines

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Radix UI** for accessible component primitives
- **Lucide Icons** for the beautiful icon set

## 🚀 Deployment

### Production Build
```bash
# Create production build
npm run build

# Start production server
npm start
```

### Environment Setup
Ensure the following environment variables are configured:
```env
# Required for production
NEXT_PUBLIC_API_BASE_URL=https://your-api-server.com
NEXT_PUBLIC_API_MODE=live

# Optional WebSocket configuration
NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com/ws
```

### Docker Support
The application can be containerized using standard Next.js Docker practices:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 Troubleshooting

### Common Issues

#### API Connection Issues
1. Verify backend server is running on correct port
2. Check CORS configuration on backend
3. Ensure environment variables are properly set
4. Use API test page to diagnose connectivity

#### EventSource Connection Problems
1. Check browser console for EventSource errors
2. Verify `/api/bigquery-ai/live-analysis` endpoint accessibility
3. Use the debug button in Live Analysis for connection details
4. Refer to [Live Analysis Fix Summary](./LIVE_ANALYSIS_FIX_SUMMARY.md)

#### Build Issues
1. Clear node_modules and reinstall dependencies
2. Check Node.js version compatibility (18+)
3. Verify all environment variables are set

### Debug Mode
Enable debug mode for additional logging:
```env
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

## 📞 Support

For support and questions:
- **Documentation**: Check our [comprehensive documentation](#-documentation)
- **Issues**: [Report bugs via GitHub issues](https://github.com/rahulsayz/ai-supply-chain-security-ui/issues)
- **API Reference**: See [Dashboard API Documentation](./components/dashboard/dashboard-api.md)
- **Implementation Guides**: Check [API Updates](./API_UPDATES_SUMMARY.md) and [Live Analysis Fix](./LIVE_ANALYSIS_FIX_SUMMARY.md)

## 🌟 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use existing component patterns
- Add appropriate documentation
- Test in both static and live modes
- Ensure accessibility compliance

### Code Style
- Use Prettier for code formatting
- Follow ESLint configuration
- Use semantic commit messages
- Add JSDoc comments for complex functions

---

**Built with ❤️ for the security community**

*Protecting supply chains through intelligent automation and AI-powered threat detection.*
