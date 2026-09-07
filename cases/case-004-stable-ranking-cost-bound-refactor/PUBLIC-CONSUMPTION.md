# CASE-004 — Consommation machine public-only

Surfaces publiques de CCR uniquement. Aucune lecture d'interne.

```text
PUBLIC MACHINE CONSUMPTION = NOT STARTED
```

## Cadre

```text
SESSION                 = fraîche, consommateur public
SOURCE D'IDENTIFICATION = titre sémantique public uniquement
RUN_ID PRIVÉ            = jamais employé comme entrée
```

## Surfaces à consommer

```text
ccr list --format json
ccr run-descriptors --format json
ccr run-activity <run_id> --format json
```

## Résultats

```text
—
```

## Non-identités à tenir

```text
F2 ACTIVITY        ≠ INVOCATION OUTCOME
F2                 ≠ TRANSCRIPT
COMPLETED          ≠ substantive success
facts: []          ≠ absence d'activité
MISSING HISTORY    ≠ EMPTY HISTORY
ROLE               ≠ PROVIDER
```

## Consommabilité

```text
PUBLIC CONSUMABILITY = —
```
