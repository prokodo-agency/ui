# Change risk

- **LOW:** documentation, copy, isolated compatible styling and semantically unchanged tests.
- **MEDIUM:** additive compatible components/internal refactors with a Changeset where public behavior changes.
- **HIGH:** removed/changed exports, peer dependency changes, breaking behavior, release/publish/CI configuration and package metadata affecting consumers.
- **CRITICAL/BLOCKED:** credentials/secrets, publishing-key operations, bypassed tests/security, removed assertions or reduced coverage/accessibility/visual gates.

The highest signal wins. Breaking changes always identify Portal and Website as affected and require human approval.
