# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public issue. Instead, please email security@bearops.com with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and work with you to address the issue.

## Security Best Practices

### For Developers

1. **Never commit secrets** - Use environment variables
2. **Keep dependencies updated** - Run `npm audit` regularly
3. **Validate all inputs** - Never trust user input
4. **Use HTTPS** - Always in production
5. **Follow principle of least privilege** - Minimal permissions

### For Deployment

1. **Use environment variables** for all secrets
2. **Enable security headers** (already configured)
3. **Run as non-root user** (Docker already configured)
4. **Keep containers updated**
5. **Monitor for vulnerabilities**

## Security Features

- ✅ Security headers (CSP, HSTS, X-Frame-Options, etc.)
- ✅ Input sanitization utilities
- ✅ Rate limiting
- ✅ HTTPS enforcement
- ✅ Dependency scanning
- ✅ Docker security hardening

## Security Checklist

Before deploying to production:

- [ ] All environment variables set
- [ ] No secrets in code
- [ ] Dependencies audited (`npm audit`)
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Error messages sanitized
- [ ] Logging configured (no sensitive data)
- [ ] Docker image scanned
- [ ] Access controls implemented

## Known Security Considerations

### HTML Files with OAuth

Some HTML files in `process/sales-playbook-hub/` contain OAuth implementations that store tokens in localStorage. These are:

- **NOT for production use** without backend proxy
- **For demonstration purposes only**
- **Should be refactored** to use server-side OAuth flow

See `docs/SECURITY_AUDIT.md` for details.

## Updates

Security updates are released as needed. Subscribe to security advisories or check this repository regularly.

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)

