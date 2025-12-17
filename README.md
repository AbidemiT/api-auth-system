# Authentication API

Production-ready REST API with user authentication, built with Node.js, Express, Typescript

## Tech Stack
- Node.js + Express
- Typescript
- PostgresSQL + Prisma
- JWT Authentication
- Zod Validation

## Features
- [x] User registration with email/password
- [x] User login with JWT tokens
- [ ] Token refresh mechanism
- [x] Password hashing with bcrypt
- [ ] Input validation
- [ ] Error handling middleware
- [ ] Rate limiting
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

## Setup

\`\`\`bash
yarn
cp .env.example .env # Add your DATABASE_URL
npx prisma migrate dev
yarn dev

\`\`\`

## Progress
- [x] Project setup
- [x] Database schema
- [x] Auth endpoints
- [ ] Testing
- [ ] Deployment

Built as part of my full-stack engineer challenge
```

---

## Deliverables for the initial sprint:

1. ✅ Project Initialized with Typescript + Express
2. ✅ Prisma connected to database
3. ✅ Server running at localhost:3000
4. ✅ Code pushed to GitHub
5. ✅ `/health` endpoint working

--- 

```
