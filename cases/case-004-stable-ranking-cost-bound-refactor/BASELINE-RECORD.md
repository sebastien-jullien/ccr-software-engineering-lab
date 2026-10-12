# CASE-004 — Baseline aveugle non-CCR

Bras de comparaison distinct, conduit sans CCR sur le même pack participant
gelé, dans son propre workspace jetable.

```text
BLIND BASELINE = COMPLETE
CANDIDAT       = FROZEN
```

```text
BASELINE
≠ run CCR
≠ préqualification des références ou du point de départ
```

## Identité

```text
DATE           = 2026-09-07
PRODUCTEUR     = AGENT CCR LAB #5
SESSION        = fraîche et indépendante
WORKSPACE      = workspace jetable, hors du dépôt du Lab
ANCRE PRÉ-RUN  = 40a280d6cbd7ae6ab5136c24a46e460adccfdc3d
                 identité d'origine 7fb102758e6966a2340859ca8d5c65e3fa0beec9,
                 réécrite le 2026-09-08 par git filter-repo
```

Le paquet participant a été remis par extraction directe de l'objet Git du
commit publié, vérifiée byte-à-byte sur les huit fichiers, dans un workspace
neuf sans `.git`, sans `control/` et sans `node_modules`.

## Provenance du fournisseur

```text
PROVIDER FAMILY                   = Claude
CLIENT                            = Claude Code 2.1.263
SEMANTIC MODEL                    = claude-opus-5
BACKEND                           = UNKNOWN
```

```text
PROVIDER ≠ ROLE   ·   PROVIDER ≠ CCR SYSTEM RUNTIME   ·   PROVIDER ≠ SEMANTIC ORIGIN
```

## Quarantaine

```text
PRODUIT AVANT LE GEL DU CANDIDAT CCR       = OUI
CONTENU CONSULTÉ AVANT LE GEL CCR          = NON
OUVERTURE DE LA QUARANTAINE                = après gel du candidat CCR
```

L'aiguillage des deux bras appartenait à l'humain : la session qui a produit ce
témoin n'est pas celle qui a conduit la production CCR, et aucune information
substantielle du bras aveugle n'a été routée vers elle.

## Candidat gelé

```text
FINAL SRC FILE COUNT   = 1
MODIFIED SRC PATHS     = src/stable-rank.ts
ADDED / DELETED        = AUCUN

BASELINE AGGREGATE IDENTITY
= 085cfddff2a2a8af8d4f430d92d62b770583f6bd98c509d4b4cde7fab91be50a

PARTICIPANT NON-SOURCE INPUTS       = 7/7 unchanged
CHANGEMENTS HORS src/**             = 0
POST-PRODUCTION REMEDIATION         = 0
```

```text
CANDIDATE IDENTITY ≠ CORRECTNESS
```

Artefacts hors candidat relevés sans suppression et non copiés dans le
snapshot : `node_modules/` seul. Aucune sonde, aucun script, aucun log.

## Résultat officiel

Voir `EVALUATION.md`. Rappel non interprété :

```text
BASELINE   AXE A 17/17 · AXE B 9/9 · TOTAL 26/26 · T1 PASS
           FULL CASE SUCCESS = YES
```
