# Critical component flows

Cypress Component Testing plus axe and Chromatic Light/Dark remain the authoritative component UX gates. Critical families include forms/validation, dialogs/drawers, navigation/links, OTP/input, feedback/snackbar and responsive content components.

Every public behavior change needs the nearest Jest/Cypress spec, keyboard/focus/accessibility evidence and a Changeset. Chromatic changes are review findings, not automatic proof of correctness.

Portal and Website product journeys remain in their repositories. This repository emits affected consumers but does not create cross-repository imports or silently upgrade their package versions.
