# Security Policy

## DSA Study Hub Supported Versions

The following versions of the DSA Study Hub are currently being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < 1.0.0 | :x:                |

## Security Advisories

We maintain transparency regarding security improvements. The following vulnerabilities have been addressed in recent updates:

| ID               | GHSA Reference                                                                                             | Description                                                                                 | Severity | Fixed Version |
| ---------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------- | ------------- |
| **DSA-2025-001** | [GHSA-m69m-chmq-63q6](https://github.com/toxicbishop/DSA-with-tsx/security/advisories/GHSA-m69m-chmq-63q6) | **minimatch ReDoS (CVE-2022-3517)** - Fixed via transitive dependency update.               | High     | Latest        |
| **DSA-2025-002** | [GHSA-j993-m84j-9994](https://github.com/toxicbishop/DSA-with-tsx/security/advisories/GHSA-j993-m84j-9994) | **Insecure Admin Authentication** - Removed static plaintext password in favor of JWT.      | Critical | Latest        |
| **DSA-2025-003** | [GHSA-vmxr-562h-rcgg](https://github.com/toxicbishop/DSA-with-tsx/security/advisories/GHSA-vmxr-562h-rcgg) | **Insecure JWT Storage** - Implemented AES-256 encryption for session cookies.              | High     | Latest        |
| **DSA-2025-004** | [GHSA-gc39-qc6j-5jmx](https://github.com/toxicbishop/DSA-with-tsx/security/advisories/GHSA-gc39-qc6j-5jmx) | **Missing CSRF Protection** - Implemented anti-CSRF tokens for all state-changing routes.   | Moderate | Latest        |
| **DSA-2025-005** | [GHSA-v76q-57r5-h6fq](https://github.com/toxicbishop/DSA-with-tsx/security/advisories/GHSA-v76q-57r5-h6fq) | **NoSQL Injection Vulnerability** - Implemented strict type validation for profile updates. | High     | Latest        |

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
