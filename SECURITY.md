# Security Policy

## How to Report a Security Issue
If you discover a security vulnerability in this system, please report it to us privately by sending a message. **Please do not disclose the security issue publicly** before it has been resolved.

Please include the following information when reporting an issue:
- The type of security vulnerability (e.g., XSS, SQLi, etc.).
- Steps to reproduce the vulnerability.
- Any supporting evidence (Screenshots or Logs).

## Incident Response Plan
If it is discovered that the system has been compromised or a major security incident has occurred, the administration must take the following immediate actions:

1. **Revoke Tokens:**
   - Immediately revoke all active JWT tokens by adding them to the blocklist or changing the `JWT_SECRET_KEY` to terminate all current sessions.

2. **Block IP:**
   - Check the Audit Logs to identify the IPs launching the attack.
   - Add those IPs to the Firewall or server's Blacklist to prevent further requests.

3. **Backup Restore:**
   - If data has been deleted or tampered with, stop the server and restore the latest clean database backup.
   - Ensure the system is clean before restarting the service.

4. **Investigation:**
   - Scan the code for the entry point of the breach, and apply a patch before reopening the system.

---
*This file is intended to guide the immediate response to security incidents.*
