# Security Policy

## Supported Versions

| Version         | Supported      |
| --------------- | -------------- |
| Latest (`main`) | ✅             |
| Previous minors | ⚠️ Best-effort |
| Older majors    | ❌             |

We recommend always using the latest published version from npm (`@prokodo/ui`).

---

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities via public GitHub issues.**

If you believe you have found a security vulnerability in prokodo-ui, please
report it through **GitHub's private vulnerability reporting** feature:

> <https://github.com/prokodo-agency/ui/security/advisories/new>

Include the following in your report:

- A description of the vulnerability and its potential impact.
- A minimal reproduction case (code snippet, repository, or steps to reproduce).
- The affected version(s).
- Any suggested mitigations if you have them.

### What to expect

- **Acknowledgement** within 5 business days of receipt.
- **Initial triage assessment** within 10 business days.
- We will work with you to understand and address the issue before any public
  disclosure.
- We will credit you in the security advisory unless you prefer to remain
  anonymous.

### Scope

This policy covers the `prokodo-ui` npm package and the source code in this
repository. It does not cover the prokodo hosted platform, other prokodo
products, or third-party dependencies (report those upstream).

---

## Dependency Vulnerabilities

We use Dependabot to receive automated alerts for dependency vulnerabilities.
If you notice a transitive dependency issue not yet captured by Dependabot,
please open a regular GitHub issue referencing the relevant CVE.
