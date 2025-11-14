# ESN Manager Pro

A comprehensive Enterprise Service Network (ESN) management application for managing consultants, clients, projects, and business operations.

## 🚀 Features

### Core Features
- **Consultant Management**: Track consultants, their skills, availability, and assignments
- **Client Management**: Manage client relationships, contacts, and project history
- **Project Management**: Full project lifecycle management with consultant assignments
- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control
- **Dashboard & Analytics**: Real-time business insights and KPIs
- **REST API**: Full-featured RESTful API with comprehensive documentation

### Technical Features
- **TypeScript Backend**: Fully typed backend with Express.js
- **React Frontend**: Modern React 18 with TypeScript
- **Database**: TypeORM with SQLite (development) / PostgreSQL (production)
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Docker Support**: Full containerization with Docker Compose
- **Logging**: Structured logging with Winston
- **Security**: Rate limiting, CORS protection, helmet.js security headers
- **Validation**: Request validation with class-validator and DTOs
- **Error Handling**: Centralized error handling with proper error responses
- **Soft Deletes**: Data preservation with soft delete functionality
- **Health Checks**: API health monitoring endpoint

## 📋 Prerequisites

- Node.js >= 20.x
- npm >= 10.x
- Docker & Docker Compose (optional, for containerized deployment)
- PostgreSQL (for production deployment)

## 🛠️ Installation

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ESN
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev:full

   # Or start them separately:
   npm run server:dev  # Backend with auto-reload
   npm run dev         # Frontend only
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api-docs
   - Health Check: http://localhost:3001/health

### Production Deployment with Docker

1. **Build and start containers**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Application: http://localhost
   - API: http://localhost:3001

## 📚 API Documentation

Interactive API documentation is available at `/api-docs` when the server is running.

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile (protected)

#### Consultants
- `GET /api/v1/consultants` - List all consultants (with filters, pagination)
- `GET /api/v1/consultants/:id` - Get consultant by ID
- `POST /api/v1/consultants` - Create new consultant
- `PUT /api/v1/consultants/:id` - Update consultant
- `DELETE /api/v1/consultants/:id` - Delete consultant (soft delete)

#### Clients
- `GET /api/v1/clients` - List all clients (with filters, pagination)
- `GET /api/v1/clients/:id` - Get client by ID
- `POST /api/v1/clients` - Create new client
- `PUT /api/v1/clients/:id` - Update client
- `DELETE /api/v1/clients/:id` - Delete client (soft delete)

#### Projects
- `GET /api/v1/projects` - List all projects (with filters, pagination)
- `GET /api/v1/projects/:id` - Get project by ID
- `POST /api/v1/projects` - Create new project
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project (soft delete)

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npx playwright test

# Run E2E tests with UI
npx playwright test --ui

# Show test report
npx playwright show-report
```

## 📁 Project Structure

```
ESN/
├── server/                 # Backend (TypeScript)
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── dto/              # Data Transfer Objects
│   ├── entity/           # TypeORM entities
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── data-source.ts    # Database configuration
│   ├── index.ts          # Server entry point
│   └── seed.ts           # Database seeding
├── src/                   # Frontend (React + TypeScript)
│   ├── components/       # React components
│   │   ├── client/      # Client-related components
│   │   ├── consultant/  # Consultant-related components
│   │   └── ui/          # Reusable UI components
│   ├── modules/         # Feature modules
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── tests/
│   └── e2e/             # End-to-end tests
├── .env                  # Environment variables
├── .env.example         # Example environment variables
├── docker-compose.yml   # Docker Compose configuration
├── Dockerfile           # Docker image definition
└── package.json         # Project dependencies
```

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example` for complete list):

```env
# Server
NODE_ENV=development
PORT=3001

# Database
DB_TYPE=sqlite
DB_DATABASE=./server/db.sqlite

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🎨 Frontend Components

### UI Components
- **Toast Notifications**: `useToast()` hook for displaying notifications
- **Error Boundary**: Automatic error catching and display
- **Confirmation Dialog**: `useConfirmDialog()` hook for user confirmations
- **Skeleton Loaders**: Loading state components
- **Pagination**: Reusable pagination component

### Usage Examples

```tsx
// Toast notifications
import { useToast } from '@/components/ui/Toast';

const { showToast } = useToast();
showToast('Operation successful!', 'success');

// Confirmation dialog
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';

const { confirm, ConfirmDialog } = useConfirmDialog();

const handleDelete = async () => {
  const confirmed = await confirm(
    'Delete Consultant',
    'Are you sure you want to delete this consultant?',
    { variant: 'danger' }
  );
  if (confirmed) {
    // Perform delete operation
  }
};

// Skeleton loading
import { CardSkeleton, TableSkeleton } from '@/components/ui/Skeleton';

{loading ? <TableSkeleton rows={5} columns={4} /> : <DataTable />}
```

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Helmet.js security headers
- Input validation with DTOs
- SQL injection protection (TypeORM)
- XSS protection
- Soft deletes for data preservation

## 📊 Database Schema

### Main Entities

- **User**: Authentication and user management
- **Consultant**: Consultant profiles and information
- **Client**: Client information and contacts
- **Project**: Project management with relationships

### Entity Relationships

- One Client → Many Projects
- One Consultant → Many Projects (optional assignment)
- One User → One Consultant (optional link)

## 🚀 Deployment

### Production Build

```bash
# Build frontend
npm run build

# Build backend
npm run build:server

# Start production server
NODE_ENV=production npm run server
```

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Scripts

- `npm run dev` - Start frontend development server
- `npm run dev:full` - Start both frontend and backend
- `npm run server` - Start backend server
- `npm run server:dev` - Start backend with auto-reload
- `npm run build` - Build frontend for production
- `npm run build:server` - Build backend TypeScript
- `npm test` - Run unit tests
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## 🐛 Troubleshooting

### Database Issues

If you encounter database issues, try:
```bash
# Remove existing database
rm server/db.sqlite

# Reseed database
npm run seed
```

### Port Already in Use

If ports 3001 or 5173 are in use, update the `.env` file or docker-compose.yml to use different ports.

## 📄 License

This project is licensed under the MIT License.

## 👥 Default Users

After seeding the database:

- **Admin User**
  - Email: admin@esn-manager.com
  - Password: admin123
  - Role: Administrator

## 🔄 API Versioning

The API uses URL-based versioning. Current version: `v1`

Base URL: `/api/v1/`

## 📈 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Email notifications
- [ ] Document management (file uploads)
- [ ] Advanced analytics and reporting
- [ ] Invoice generation
- [ ] Calendar integration
- [ ] Export to Excel/PDF
- [ ] Multi-language support (i18n)
- [ ] Dark mode
- [ ] Mobile app

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact: support@esn-manager.com

---

Built with ❤️ using React, TypeScript, Express, and TypeORM
