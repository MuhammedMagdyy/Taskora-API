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
- [ ] Rename files to be more descriptive
- [x] Add more security
- [ ] Learn how to link local account with social account
- [x] Handle transactions correctly
- [x] Handle SRP correctly
- [ ] Handle if github account is private
- [ ] Create a decorator for less use of try-catch blocks
- [ ] Handle AxiosErrors in OAuth2 Clients
- [ ] Migrate to a Docker container with Nginx

## Improvements

- [x] Add logging
- [ ] Enhance API documentation
  - [x] Postman
  - [ ] Swagger

## Testing

- [ ] Unit tests for all endpoints
- [ ] Integration tests if possible

## Deployment

- [x] Set up CI/CD pipeline
- [ ] Containerize application with Docker
- [x] Deploy to cloud provider (e.g., AWS, Azure, GCP)
