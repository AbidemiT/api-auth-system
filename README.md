# Authentication API

![Tests](https://github.com/AbidemiT/api-auth-system/workflows/Run%20Tests/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-83.7%25-brightgreen)

Production-ready REST API with user authentication, built with Node.js, Express, TypeScript, and Prisma.

## Features

- ✅ User registration & login
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation (Zod)
- ✅ Rate limiting
- ✅ Security headers (helmet)
- ✅ Error handling
- ✅ Request logging
- ✅ **83.7% test coverage**
- ✅ **CI/CD with GitHub Actions**
- ✅ **16 passing tests**

## Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL, Prisma ORM
- **Auth:** JWT, bcrypt
- **Testing:** Jest, Supertest
- **CI/CD:** GitHub Actions
- **Security:** Helmet, express-rate-limit

## Test Coverage
```
----------------------------|---------|----------|---------|---------|-------------------
File                        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------------------------|---------|----------|---------|---------|-------------------
All files                   |    83.7 |    47.61 |     100 |   83.07 |                   
 config                     |     100 |      100 |     100 |     100 |                   
  index.ts                  |     100 |      100 |     100 |     100 |                   
 controllers                |   94.59 |    71.42 |     100 |   94.59 |                   
  auth.controller.ts        |     100 |       80 |     100 |     100 | 42,84             
  user.controller.ts        |      80 |       50 |     100 |      80 | 12,28             
 libs                       |     100 |       50 |     100 |     100 |                   
  PrismaClient.ts           |     100 |       50 |     100 |     100 | 7                 
  index.ts                  |     100 |      100 |     100 |     100 |                   
 middleware                 |   71.64 |    33.33 |     100 |   69.84 |                   
  auth.middleware.ts        |     100 |      100 |     100 |     100 |                   
  error.middleware.ts       |      55 |    16.66 |     100 |   52.63 | 38-64             
  rateLimiter.middleware.ts |     100 |      100 |     100 |     100 |                   
  validate.middleware.ts    |    90.9 |       50 |     100 |      90 | 20                
 routes                     |   94.11 |       50 |     100 |   94.11 |                   
  auth.routes.ts            |    90.9 |       50 |     100 |    90.9 | 12                
  user.routes.ts            |     100 |      100 |     100 |     100 |                   
 utils                      |     100 |      100 |     100 |     100 |                   
  validation.ts             |     100 |      100 |     100 |     100 |                   
----------------------------|---------|----------|---------|---------|-------------------
Test Suites: 4 passed, 4 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        5.485 s
Ran all test suites.
Done in 5.88s.
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

#### Refresh Token 
- `POST /api/v1/auth/refresh-token`

#### Logout
- `POST /api/v1/auth/logout` - Invalidates the refresh token.

#### Logout On All Devices
- `POST /api/v1/auth/logout-all-devices` - Invalidates all refresh tokens for the user.

### User
- `GET /api/v1/user/profile` - Get current user (protected)

### Health
- `GET /health` - API health check

## Running Tests
```bash
# Run all tests with coverage
yarn test

# Run tests in watch mode
yarn test:watch

# Run integration tests only
yarn test:integration
```

## CI/CD

Tests run automatically on every push via GitHub Actions.

## Tech Stack
- Node.js + Express
- Typescript
- PostgresSQL + Prisma
- JWT Authentication
- Zod Validation

## Features
- [x] User registration with email/password
- [x] User login with JWT tokens
- [x] Token refresh mechanism
- [x] Password hashing with bcrypt
- [x] Input validation
- [x] Error handling middleware
- [x] Rate limiting
- [ ] API documentation

## Security Features

- **Helmet**: Secure HTTP headers
- **Rate Limiting**: 
  - Auth endpoints: 5 requests per 15 minutes
  - API endpoints: 100 requests per 15 minutes
- **Input Validation**: Zod schemas for all inputs
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Error Handling**: Centralized error middleware

## Running Locally
```bash
# Install dependencies
yarn

# Setup environment
cp .env.example .env
# Add your DATABASE_URL and JWT_SECRET

# Setup database
npx prisma generate
npx prisma db push

# Run development server
yarn dev

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch
```

## Running Tests
```bash
# All tests with coverage
yarn test

# Watch mode
yarn test:watch

# Integration tests only
yarn test:integration

# Unit tests only
yarn test:unit
```

## CI/CD

Tests run automatically on every push via GitHub Actions.

- ✅ Automated testing
- ✅ Code coverage reporting
- ✅ PostgreSQL service in CI
- ✅ Deployment checks

## Environment Variables
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=development
```

## Progress
- [x] Project setup
- [x] Database schema
- [x] Auth endpoints
- [x] Testing
- [ ] Deployment

Built as part of my full-stack engineer challenge
## License

MIT

---