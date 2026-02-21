# Security Policy

## Supported Versions

The following versions of the DSA Study Hub are currently being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < 1.0.0 | :x:                |

## Security Advisories

We maintain transparency regarding security improvements. The following vulnerabilities have been addressed in recent updates:

| ID | Description | Severity | Fixed Version |
| --- | --- | --- | --- |
| DSA-2025-001 | **Transitive Dependency Vulnerability (`minimatch`)** - Fixed ReDoS via package overrides. | High | Latest |
| DSA-2025-002 | **Insecure Admin Authentication** - Removed sensitive data from GET query parameters. | High | Latest |
| DSA-2025-003 | **Clear-Text Storage of Sensitive Data** - Implemented symmetric encryption for JWT cookies. | High | Latest |
| DSA-2025-004 | **Missing CSRF Protection** - Implemented `lusca` CSRF middleware and frontend token handling. | High | Latest |
| DSA-2025-005 | **NoSQL Injection Vulnerability** - Implemented input validation and casting for database queries. | High | Latest |

## Reporting a Vulnerability

We take the security of DSA Study Hub seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

Please report security vulnerabilities by opening a new issue in the GitHub repository.

- **Do not** disclose the vulnerability publicly until it has been addressed.
- Provide as much detail as possible to help us reproduce and fix the issue.

We will investigate all legitimate reports and do our best to quickly fix the problem.

### Response Timeline

We aim to acknowledge receipt of vulnerability reports within 48 hours. We strive to provide regular status updates during the investigation and remediation process.

### Disclosure Policy

We follow a coordinated disclosure policy:

- Please do not share vulnerability details publicly until we have released a fix.
- We request a 90-day embargo period for vulnerabilities (or until a fix is released, whichever is sooner) to give us time to address the issue.

### Scope

The following assets are **in scope** for security testing:

- The DSA Study Hub web application
- The public API endpoints (if applicable)
- Source code in this repository

The following activities are **out of scope**:

- Denial of Service (DoS) or Distributed Denial of Service (DDoS) attacks
- Social engineering (phishing, vishing, etc.) against project maintainers or users
- Physical security attacks against our infrastructure providers

### Safe Harbor

We consider security research conducted in accordance with this policy to be authorized. We will not take legal action against researchers who:

- Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our service.
- Only interact with accounts they own or with explicit permission from the account holder.
- Report any vulnerabilities they discover to us promptly.
