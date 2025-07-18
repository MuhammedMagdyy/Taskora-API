# Taskora TODO List

## Features to Implement

- [x] Soft delete refresh tokens
- [ ] Add rate limiting to endpoints
- [x] Make OTP table to track generated OTPs
- [x] Make OTP valid for 15m instead of 5m
- [ ] Enhance constants to be interfaces or types
- [x] Create googleId and githubId instead of providerId
- [x] Migrate OTP table to Prisma
- [x] Search by token instead userUUID in verify email
- [x] Integrate with SMTP server to send emails
- [x] Rename files to be more descriptive
- [x] Add more security
- [ ] Learn how to link local account with social account
- [x] Handle transactions correctly
- [x] Handle SRP correctly
- [ ] Handle if github account is private
- [ ] Create a decorator for less use of try-catch blocks
- [ ] Handle AxiosErrors in OAuth2 Clients
- [ ] Migrate to a Docker container with Nginx
- [x] Enhance parameters to be as interfaces or types
- [x] Fix deployment issues
- [x] Created Eid competition
- [x] Remove Ramadan challenge
- [x] Notify winner of Eid competition
- [ ] Hash OTP in redis
- [x] OTP expiration must be less than 15m. Decide on the exact duration (e.g., 5m)
- [ ] Add middleware to check if user is deleted
- [ ] Centralize error messages

## Improvements

- [x] Add logging
- [x] Enhance API documentation
  - [x] Postman
  - [x] Swagger
- [x] Close port 3000 in production `app.listen(PORT, '127.0.0.1');`

## Testing

- [ ] Unit tests for all endpoints
- [ ] Integration tests if possible

## Deployment

- [x] Set up CI/CD pipeline
- [ ] Containerize application with Docker
- [x] Deploy to cloud provider (e.g., AWS, Azure, GCP)
