# CASE-003 — RUN-001 Record

Document mutable, destiné à recevoir les faits du run. Rien n'est prérempli.

```text
CASE EXECUTION
= NOT STARTED

CCR RUN
= NOT STARTED
```

## Identité

```text
CCR RUN ID          = —
DATE                = —
CCR VERSION         = —
CCR HEAD            = —
TITLE               = —
WORKSPACE           = —
AUTHOR              = —
CHALLENGER          = —
MAX INVOCATIONS     = —
```

## Provenance de CCR System

À remplir depuis `RUNBOOK.md` §3, niveau par niveau.

```text
A — dépôt canonique                        = —
B — point d'entrée exécuté                 = —
C — chaîne de chargement                   = —
D — provenance des artefacts chargés       = —

CCR SYSTEM IMPLEMENTATION RUNTIME PROVENANCE       = —
```

## Provenance des fournisseurs

Fait expérimental séparé.

```text
PROVIDER ≠ CCR SYSTEM RUNTIME

author    exécutable = —   version = —   relevé le —
challenger exécutable = —  version = —   relevé le —
```

## Vérification du gel avant lancement

```text
PARTICIPANT FREEZE MATCH   = —
control/ dans le workspace = —
package-lock.json inchangé = —
npx tsc --version          = —
```

## Chronologie

```text
—
```

## Candidat gelé

```text
FROZEN CANDIDATE   = —
empreintes         = —
fichiers gelés modifiés = —
```

## Révélation du control

```text
VISIBLE        = —
HOLDOUTS       = —
TRUTH MATRIX   = —
AXE A          = —
AXE B          = —
V10            = —
```

## Observations CCR

```text
—
```
