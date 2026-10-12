# CASE-004 — RUN-001 Record

`RUN-001` de CASE-004 a commencé au premier `ccr start` du cas.

```text
CASE EXECUTION = COMPLETE
CCR RUN        = COMPLETE
```

## Identité

```text
CCR RUN ID          = CCR-20260907-002
DATE                = 2026-09-07
CCR SYSTEM          = v1.1.0
CCR SYSTEM COMMIT   = c9de52b223ee13e79863e9747f08e88938d59579
ANCRE PRÉ-RUN       = 40a280d6cbd7ae6ab5136c24a46e460adccfdc3d
                      identité d'origine 7fb102758e6966a2340859ca8d5c65e3fa0beec9,
                      réécrite le 2026-09-08 par git filter-repo
WORKSPACE           = workspace jetable, hors du dépôt du Lab
PRODUCTEUR          = AGENT CCR LAB #6
MAX INVOCATIONS     = 32
```

## Aiguillage de session

```text
SESSION DE PRODUCTION CCR                 = fraîche et indépendante
DISTINCTE DE LA SESSION BASELINE          = OUI
INFORMATION BASELINE SUBSTANTIELLE REÇUE  = AUCUNE
```

Le paquet participant lui a été remis par extraction directe de l'objet Git du
commit publié, vérifiée byte-à-byte sur les huit fichiers, dans un workspace
distinct de celui du bras aveugle et de son snapshot.

## Provenance des fournisseurs

```text
PROVIDER ≠ ROLE   ·   PROVIDER ≠ CCR SYSTEM RUNTIME   ·   PROVIDER ≠ SEMANTIC ORIGIN

author      fournisseur = Claude
            client      = Claude Code 2.1.263
            modèle sémantique = UNKNOWN
            backend           = UNKNOWN

challenger  fournisseur = Codex
            client      = 0.146.0
            modèle sémantique = UNKNOWN
            backend           = UNKNOWN
```

## Déroulement procédural — Layer B

```text
DECLARED MAX INVOCATIONS      = 32
INVOCATIONS USED              = 32
TERMINATION OBSERVED          = CCR_INVOCATION_QUOTA_EXCEEDED
PENDING TRANSFER              = YES
HUMAN_SEND                    = 0
SECOND CCR RUN                = 0
BUDGET CHANGE                 = 0
POST-RUN CANDIDATE REMEDIATION = 0
```

La production CCR a consommé le budget déclaré de 32 invocations.

CCR v1.1.0 n'expose aucun état terminal canonique natif atteignable sur le
chemin d'exécution natif audité.

La politique d'orchestration attendait précisément un tel événement terminal
natif.

Le pas suivant a été refusé par le quota alors qu'un transfert restait en
attente.

Le candidat gelé atteint néanmoins le succès logiciel officiel complet.

```text
CCR PROCEDURAL SUCCESS
= NOT CLAIMED

PROCEDURAL NON-TERMINATION   ≠ SOFTWARE FAILURE
SOFTWARE SUCCESS             ≠ PROCEDURAL TERMINATION
```

## Candidat gelé

```text
FINAL SRC FILE COUNT   = 1
MODIFIED SRC PATHS     = src/stable-rank.ts
ADDED / DELETED        = AUCUN

CCR AGGREGATE IDENTITY
= 5abc5c324a0186ae15461ded31365a42dff9a11f24677f9c5faacf7c3e9a76e1

PARTICIPANT NON-SOURCE INPUTS  = 7/7 unchanged
CHANGEMENTS HORS src/**        = 0
POST-PRODUCTION SOURCE MODIFICATION = 0
```

```text
CANDIDATE IDENTITY ≠ CORRECTNESS
```

Artefacts hors candidat relevés sans suppression et non copiés dans le
snapshot : `node_modules/` et un répertoire `probes/` de neuf fichiers.
Ces sondes sont une activité participante, non officielle et hors candidat.

## Frictions et déviations consignées

```text
CCR #6 INTERMEDIATE RETURN DISCIPLINE DEVIATION
= YES · MINOR
SUBSTANTIVE CONTAMINATION
= NONE DEMONSTRATED
```

```text
AUTO-MODE CLASSIFIER REFUSALS                      = observés
IDENTICAL COMMAND RETRIES THROUGH ALTERNATE SHELL  = observées
CCR SYSTEM DEFECT                                  = NOT DEMONSTRATED
```

L'origine du refus se nomme elle-même dans son message : le classificateur du
mode auto du harnais d'exécution. Ce n'est pas CCR System.

```text
CASE-004 MATERIALIZATION AUTO-REMEDIATION DEVIATION
= occurred · unauthorized at the time
= later explicitly human-accepted · not erased
```

Détail dans `FREEZE-MANIFEST.md` §7.

## Résultat officiel

Voir `EVALUATION.md`. Rappel non interprété :

```text
CCR   AXE A 17/17 · AXE B 9/9 · TOTAL 26/26 · T1 PASS
      FULL CASE SUCCESS = YES
```
