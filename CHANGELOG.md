# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Complete TypeScript backend migration
- JWT-based authentication system
- User entity and authentication endpoints
- Project entity for mission management
- API versioning (v1)
- Comprehensive API documentation with Swagger/OpenAPI
- Docker support with docker-compose
- Winston logger with file rotation
- Rate limiting middleware
- Error handling middleware
- Request validation with DTOs
- Soft deletes for all entities
- Health check endpoint
- Toast notification system
- Error boundary component
- Confirmation dialog component
- Skeleton loading components
- Pagination component
- Protected route component
- API client service
- Authentication hooks and context
- E2E testing setup with Playwright
- Enhanced seed data with realistic information
- Environment configuration system
- Comprehensive documentation

### Changed
- Backend completely converted to TypeScript
- Enhanced Consultant and Client entities with additional fields
- Updated API responses with consistent format
- Improved CORS configuration
- Updated npm scripts for TypeScript workflow

### Security
- Added bcrypt password hashing
- Implemented JWT tokens with expiration
- Added rate limiting on API routes
- Enhanced security headers with Helmet.js
- Added input validation on all endpoints

### Fixed
- TypeScript compilation errors in controllers
- Entity relations properly configured
- Logger formatting issues

## [1.0.0] - 2025-01-14

### Added
- Initial release with basic CRUD functionality
- Consultant management
- Client management
- React frontend with TypeScript
- Express backend
- SQLite database with TypeORM
- Basic API endpoints

[Unreleased]: https://github.com/your-repo/ESN/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/your-repo/ESN/releases/tag/v1.0.0
