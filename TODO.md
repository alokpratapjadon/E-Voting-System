# E-Voting System Backend Migration: Supabase to Node.js + MongoDB

## Backend Setup
- [ ] Create server/ directory structure
- [ ] Initialize Node.js project with package.json
- [ ] Install dependencies: express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, express-validator
- [ ] Create server/app.js with basic Express setup
- [ ] Set up MongoDB connection with Mongoose
- [ ] Create middleware for authentication (JWT verification)
- [ ] Create models: User, Candidate, Vote, Setting

## API Endpoints Implementation
- [ ] Auth routes: POST /api/auth/signup, POST /api/auth/login, POST /api/auth/logout, POST /api/auth/verify-phone, POST /api/auth/request-phone-verification, POST /api/auth/reset-password
- [ ] Candidates routes: GET /api/candidates, POST /api/candidates (admin), PUT /api/candidates/:id (admin), DELETE /api/candidates/:id (admin)
- [ ] Votes routes: POST /api/votes (cast vote)
- [ ] Settings routes: GET /api/settings, PUT /api/settings (admin)
- [ ] Admin routes: GET /api/admin/users, POST /api/admin/reset-votes

## Database Setup
- [ ] Set up MongoDB (local or Atlas)
- [ ] Create database and collections
- [ ] Seed initial data (admin user, default settings)

## Frontend Updates
- [ ] Create src/lib/api.ts to replace supabase.ts
- [ ] Update src/stores/authStore.ts to use new API
- [ ] Update src/stores/electionStore.ts to use new API
- [ ] Update package.json to add proxy for dev server
- [ ] Handle JWT tokens in localStorage

## Testing and Integration
- [ ] Start backend server
- [ ] Test API endpoints with Postman/curl
- [ ] Update frontend and test full integration
- [ ] Fix any CORS or authentication issues
