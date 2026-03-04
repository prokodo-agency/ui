# Trademark Policy for prokodo-ui

**"prokodo"** and the prokodo logo are trademarks of prokodo (Christian Salat).  
The Apache License 2.0 grants broad rights to the source code, but it does **not**
grant permission to use these trademarks except as described below.

---

## 1. What is permitted without prior written permission

| Use case                                                                                | Permitted?                    |
| --------------------------------------------------------------------------------------- | ----------------------------- |
| Stating that your project is "built with prokodo-ui"                                    | ✅ Yes                        |
| Linking to this repository or the npm package                                           | ✅ Yes                        |
| Using the `--pk-*` CSS custom-property namespace for theming / overrides                | ✅ Yes — it is the public API |
| Distributing a fork with a clearly different name and branding                          | ✅ Yes                        |
| Publishing screenshots or screencasts of the library for educational or review purposes | ✅ Yes                        |
| Referencing "prokodo-ui" in technical compatibility statements                          | ✅ Yes                        |

---

## 2. What is NOT permitted without prior written permission

- Using the name "prokodo" as (or as part of) the name of a competing product,
  service, or organisation in a way that could cause confusion with the prokodo brand.
- Distributing a fork or derivative product under the name "prokodo" or under a
  confusingly similar name (e.g. "prokodo-pro", "prokodo-enterprise").
- Using the prokodo logo or visual identity in your own product's UI, marketing
  materials, or brand assets without written consent.
- Presenting your product as the official prokodo offering, or implying
  endorsement by prokodo, without written consent.

> **Note on CSS variable prefixes:** The `--pk-*` prefix is the library's public
> theming API. Consumers are free to override, extend, or compose these variables.
> Restrictions above apply only to _branding and product identity_, not to CSS API
> compatibility.

---

## 3. Fork & redistribution guidance

If you fork this repository and ship a modified version:

1. **Rename the package** — do not publish to npm under `@prokodo/*` without
   authorisation. Choose a clearly distinct scope and name.
2. **Remove or replace brand assets** — do not ship prokodo logos, wordmarks, or
   signature visual elements (radial glows, brand illustrations) as part of the
   default theme.
3. **Add a clear attribution notice** — your README should state that the project
   is derived from `prokodo-ui` (linking this repository) per the Apache-2.0
   attribution requirement.
4. **Do not imply endorsement** — do not suggest that prokodo sponsors, certifies,
   or endorses your fork.

---

## 4. Requesting permission

To request permission for a use not covered above, open a GitHub issue in this
repository using the label **`trademark-request`** and describe your intended use
in detail. We aim to respond within 14 business days.

---

## 5. Enforcement intent

prokodo intends to enforce trademark rights proportionately and in good faith.  
We are primarily concerned with uses that could cause genuine consumer confusion
about the source or endorsement of a product — not with ordinary open-source
collaboration, attribution, or compatible implementations.

---

_Last updated: 2026. This policy may be updated; the version in the `main` branch
is authoritative._
