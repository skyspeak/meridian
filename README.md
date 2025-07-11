# Meridian - Enterprise Compliance Platform

A comprehensive enterprise compliance platform designed to streamline AI project approvals and compliance workflows between legal and IT teams.

## Features

### 🏠 Dashboard
- **Overview Dashboard**: Real-time statistics and project metrics
- **Project Management**: Create, view, and manage AI compliance projects
- **User Assignment**: Tag and assign team members to projects
- **Workflow Tracking**: Visual progress tracking through approval stages

### 🔄 Workflow System
The platform implements a comprehensive 7-stage workflow:

1. **Initial Assessment** - Project evaluation and risk assessment
2. **Legal Review** - Legal compliance and regulatory review
3. **Technical Review** - Technical feasibility and security assessment
4. **Compliance Check** - Final compliance verification
5. **Final Approval** - Executive approval and sign-off
6. **Implementation** - Project implementation and deployment
7. **Monitoring** - Ongoing monitoring and compliance tracking

### 👥 User Management
- **Role-based Access**: Legal, IT, Admin, and Approver roles
- **User Assignment**: Assign team members to projects
- **Required Approvers**: Designate mandatory approvers for each stage
- **Department Organization**: Users organized by department

### 📋 Evidence & Documentation
- **Evidence Upload**: Support for documents, links, screenshots, certifications
- **Verification System**: Evidence verification with audit trail
- **Document Management**: Centralized storage and organization

### 🔍 Audit Trail
- **Complete Tracking**: Every action logged with timestamp and user
- **Stage Transitions**: Track workflow stage advancements
- **Evidence Changes**: Monitor document uploads and verifications
- **Approval History**: Complete approval decision history

## Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Heroicons
- **State Management**: In-memory store (easily replaceable with database)
- **UI Components**: Custom components with enterprise-grade design

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meridian-compliance-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
meridian-compliance-platform/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard component
│   ├── Header.tsx         # Application header
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── StatsCard.tsx      # Statistics cards
│   ├── ProjectCard.tsx    # Project display cards
│   ├── ProjectDetail.tsx  # Detailed project view
│   ├── WorkflowOverview.tsx # Workflow stage overview
│   └── CreateProjectModal.tsx # New project creation
├── lib/                   # Business logic
│   └── store.ts          # Data store and business logic
├── types/                 # TypeScript type definitions
│   └── index.ts          # Application types
└── public/               # Static assets
```

## Key Components

### Dashboard
The main dashboard provides:
- **Statistics Cards**: Total projects, active projects, pending approvals, completed projects
- **Recent Projects**: Quick view of latest projects with status indicators
- **Workflow Overview**: Visual representation of workflow stages and project distribution

### Project Management
- **Create Projects**: Modal form for creating new AI compliance projects
- **User Assignment**: Checkbox selection for assigned and required users
- **Priority Setting**: Low, Medium, High, Critical priority levels
- **Tagging System**: Comma-separated tags for project categorization

### Workflow Management
- **Stage Advancement**: One-click advancement to next workflow stage
- **Visual Progress**: Color-coded stage indicators
- **Stage Requirements**: Display of required evidence and approvers
- **Audit Logging**: Automatic logging of all stage transitions

### Evidence System
- **Multiple Types**: Documents, links, screenshots, certifications, assessments
- **Verification Workflow**: Evidence verification with user tracking
- **Upload Tracking**: Complete audit trail of evidence uploads

## Sample Data

The application includes sample data to demonstrate functionality:

### Users
- **Sarah Johnson** (Legal) - Legal compliance specialist
- **Mike Chen** (IT) - Technical reviewer and implementer
- **Emily Rodriguez** (Admin) - Compliance administrator
- **David Kim** (Approver) - Risk management approver
- **Lisa Wang** (Legal) - Legal team member

### Sample Projects
1. **AI-Powered Customer Service Bot** - Currently in Legal Review
2. **Data Analytics Platform** - Currently in Compliance Check

## Customization

### Adding New Workflow Stages
1. Update `types/index.ts` to add new stage types
2. Modify `lib/store.ts` to include new stage configuration
3. Update UI components to handle new stages

### Database Integration
Replace the in-memory store in `lib/store.ts` with your preferred database:
- PostgreSQL with Prisma
- MongoDB with Mongoose
- Firebase Firestore
- Any REST API

### Authentication
Add authentication by:
1. Implementing NextAuth.js or similar
2. Adding user session management
3. Implementing role-based access control

## Enterprise Features

### Security
- Role-based access control
- Audit trail for all actions
- Secure file upload handling
- Input validation and sanitization

### Scalability
- Component-based architecture
- Modular business logic
- Easy database integration
- API-first design

### Compliance
- Complete audit trail
- Evidence verification system
- Workflow stage tracking
- User action logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository. 