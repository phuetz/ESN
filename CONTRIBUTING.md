# Contributing to ESN Manager Pro

First off, thank you for considering contributing to ESN Manager Pro! It's people like you that make ESN Manager Pro such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by respect, professionalism, and collaboration. By participating, you are expected to uphold these values.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain the behavior you expected to see instead**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

### Setup Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/ESN.git
   cd ESN
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start development servers**
   ```bash
   npm run dev:full
   ```

### Code Style

- **TypeScript**: Follow the existing TypeScript patterns in the codebase
- **React**: Use functional components with hooks
- **Naming**: Use camelCase for variables/functions, PascalCase for components/classes
- **Comments**: Write clear, concise comments for complex logic
- **Formatting**: Run `npm run lint` before committing

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**
```
feat(auth): add JWT authentication system
fix(api): resolve CORS issue in production
docs(readme): update installation instructions
```

### Testing

- **Unit Tests**: Run `npm test`
- **E2E Tests**: Run `npx playwright test`
- **Backend Tests**: Run tests for controllers and services
- **Frontend Tests**: Run React component tests

### Pull Request Process

1. **Update documentation** for any changes in functionality
2. **Add tests** for new features
3. **Update CHANGELOG.md** with your changes
4. **Ensure all tests pass** before submitting
5. **Request review** from maintainers
6. **Address feedback** promptly

### Branch Naming

- `feature/description` - For new features
- `fix/description` - For bug fixes
- `docs/description` - For documentation changes
- `refactor/description` - For refactoring
- `test/description` - For test additions/changes

## Project Structure

```
ESN/
├── server/           # Backend TypeScript code
│   ├── config/      # Configuration
│   ├── controllers/ # Route controllers
│   ├── dto/         # Data Transfer Objects
│   ├── entity/      # Database entities
│   ├── middleware/  # Express middleware
│   ├── routes/      # API routes
│   └── utils/       # Utility functions
├── src/             # Frontend React code
│   ├── components/  # React components
│   ├── hooks/       # Custom hooks
│   ├── modules/     # Feature modules
│   └── services/    # API services
└── tests/           # Test files
```

## Database Changes

When making database changes:

1. **Create migrations** for schema changes
2. **Update seed data** if necessary
3. **Update entity types** in TypeScript
4. **Document changes** in CHANGELOG.md

## API Changes

When modifying APIs:

1. **Update Swagger documentation** in route files
2. **Update DTOs** for validation
3. **Update API client** if adding new endpoints
4. **Update README.md** with new endpoints
5. **Increment API version** if breaking changes

## Documentation

- Update README.md for user-facing changes
- Update code comments for complex logic
- Update API documentation in Swagger
- Update CHANGELOG.md for all changes

## Security

If you discover a security vulnerability, please email security@esn-manager.com instead of using the issue tracker.

## Questions?

Feel free to create an issue with the `question` label or reach out to the maintainers.

## Recognition

Contributors will be recognized in:
- CHANGELOG.md for specific contributions
- README.md contributors section
- GitHub contributors page

Thank you for contributing! 🎉
