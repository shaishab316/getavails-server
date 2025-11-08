# Security Policy

## Supported Versions

We take security seriously and provide security updates for the following versions of GetAvails:

| Version | Supported          | Status                    |
| ------- | ------------------ | ------------------------- |
| 1.9.x   | :white_check_mark: | Current stable release    |
| 1.8.x   | :white_check_mark: | Receives security updates |
| 1.7.x   | :warning:          | Critical fixes only       |
| < 1.7   | :x:                | No longer supported       |

## Security Features

GetAvails implements multiple layers of security:

- **Authentication**: JWT-based authentication with access and refresh tokens
- **Authorization**: Role-based access control (RBAC) for multi-role system
- **Password Security**: Bcrypt hashing with salt rounds
- **OTP Verification**: Time-based one-time passwords for sensitive operations
- **Rate Limiting**: Protection against brute force and DoS attacks
- **Input Validation**: Zod schema validation for all requests
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **XSS Protection**: Input sanitization and output encoding
- **CSRF Protection**: Token-based protection for state-changing operations
- **Secure Headers**: CORS configuration and security headers
- **File Upload Security**: File type and size validation
- **Payment Security**: PCI-compliant Stripe integration

## Reporting a Vulnerability

We appreciate the security research community's efforts in helping us maintain the security of GetAvails. If you discover a security vulnerability, please follow these guidelines:

### Where to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Please report security vulnerabilities by emailing:

- **Email**: security@getavails.com
- **Subject**: [SECURITY] Brief description of the vulnerability

### What to Include

Please provide the following information in your report:

1. **Description**: Clear description of the vulnerability
2. **Impact**: Potential impact and severity assessment
3. **Steps to Reproduce**: Detailed steps to reproduce the issue
4. **Proof of Concept**: PoC code or screenshots (if applicable)
5. **Affected Versions**: Which versions are affected
6. **Suggested Fix**: If you have recommendations (optional)
7. **Your Contact Information**: How we can reach you for follow-up

### Response Timeline

- **Initial Response**: Within 48 hours of report submission
- **Status Updates**: Every 5 business days until resolution
- **Vulnerability Assessment**: Within 1 week of initial report
- **Fix Development**: Timeline depends on severity:
  - **Critical**: 1-3 days
  - **High**: 1-2 weeks
  - **Medium**: 2-4 weeks
  - **Low**: Next scheduled release

### What to Expect

#### If Accepted

- Acknowledgment of your report
- Regular updates on progress
- Credit in security advisory (unless you prefer anonymity)
- Invitation to verify the fix before public disclosure
- Coordinated disclosure timeline (typically 90 days)

#### If Declined

- Explanation of why the report was declined
- Suggestions for alternative reporting channels if applicable
- Feedback on improving future reports

## Vulnerability Disclosure Policy

We follow coordinated vulnerability disclosure:

1. **Private Disclosure**: Reporter submits vulnerability privately
2. **Acknowledgment**: We confirm receipt within 48 hours
3. **Investigation**: We investigate and validate the report
4. **Fix Development**: We develop and test a fix
5. **Security Advisory**: We publish a security advisory
6. **Coordinated Disclosure**: Public disclosure after fix deployment (typically 90 days from report)

## Security Checklist

Before deploying to production:

- [x] All secrets are stored in environment variables
- [x] HTTPS is enabled with valid SSL certificate
- [x] CORS is properly configured
- [x] Rate limiting is enabled
- [x] File upload restrictions are in place
- [x] Database credentials are secure
- [x] Redis is properly secured
- [x] Stripe webhook signing is verified
- [x] Input validation is implemented
- [x] Error messages don't leak sensitive information
- [ ] Security headers are configured
- [x] Logging is enabled for security events
- [ ] Regular backups are configured
- [ ] Monitoring and alerting is set up

## Known Security Considerations

### Session Management

- JWT tokens are stateless (logout requires client-side token deletion)
- Refresh tokens have 30-day expiration
- Consider implementing token blacklisting for high-security scenarios

### File Uploads

- Files are stored in local filesystem (`/uploads` directory)
- Consider using cloud storage (S3, Cloudinary) for production
- Implement virus scanning for uploaded files

### Payment Processing

- All payments processed through Stripe
- No credit card data stored on our servers
- PCI compliance handled by Stripe

### Rate Limiting

- Default rate limits may need adjustment based on usage
- Consider implementing per-user rate limiting
- Monitor for legitimate traffic patterns

## Security Updates and Advisories

Security advisories will be published:

1. **GitHub Security Advisories**: https://github.com/shaishab316/getavails-server/security/advisories
2. **Release Notes**: Check CHANGELOG.md for security fixes
3. **Email Notifications**: Subscribe to security updates (coming soon)

## Security Contact

For security concerns and vulnerability reports:

- **Email**: security@getavails.com
- **PGP Key**: Available upon request
- **Response Time**: Within 48 hours

## Bug Bounty Program

We are currently evaluating a bug bounty program. For now, we offer:

- Public acknowledgment in security advisories
- Credit in release notes
- Direct communication with the development team
- Advance notification of security fixes

## Compliance

GetAvails aims to comply with:

- OWASP Top 10 security standards
- PCI DSS (via Stripe)
- GDPR data protection requirements
- SOC 2 principles (in progress)

## Legal

This security policy is subject to our Terms of Service. By reporting vulnerabilities, you agree to:

- Not publicly disclose the vulnerability before coordinated disclosure
- Not exploit the vulnerability beyond what is necessary for demonstration
- Not access, modify, or delete data belonging to others
- Follow responsible disclosure guidelines

---

**Last Updated**: November 8, 2025  
**Version**: 1.9.0

Thank you for helping keep GetAvails and our users safe!
