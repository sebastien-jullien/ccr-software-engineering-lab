# CASE-005 — Runbook

Procédure d'exécution du cas. Chaque phase est un gel : rien n'est produit
avant que la phase précédente soit close.

## Prérequis

```text
Node          22.x   (retrait de types natif ; mesuré sur v22.18.0)
chaîne outils typescript 5.8.3 · @types/node 22.15.0 — épinglées exactement
installation  npm ci  dans participant/
réseau        aucun
```

`node_modules/` n'est pas versionné.

Aucune version de CCR n'a été déclarée à l'avance pour ce cas. La provenance
réellement observée au démarrage du bras CCR est consignée dans
[`RUN-001-RECORD.md`](RUN-001-RECORD.md), qui en est la seule autorité.

Le bras témoin n'utilise pas CCR.

## Phase 0 — gel (FAITE)

```text
contrat logiciel        FROZEN
matrice de vérité       FROZEN   30 lignes · 10 visibles · 20 cachées
budget de production CCR   16    FROZEN
```

## Phase 1 — préqualification de l'oracle (FAITE)

```bash
node control/gates.mjs --label reference-1 --impl control/reference-1.ts
node control/evaluate.mjs --impl control/reference-1.ts --label reference-1 --out <preuves>
node control/evaluate.mjs --impl control/reference-2.ts --label reference-2 --out <preuves>
node control/leakage-check.mjs
```

Critères tenus : voir `PREQUALIFICATION.md`.

## Phase 2 — ratification humaine du watchdog (FAITE)

```text
WATCHDOG OPÉRATIONNEL   20 000 ms par ligne isolée
STATUT                  HUMAN FROZEN
```

La valeur exécutable était déjà celle-là (`control/runner.mjs`,
`DEFAULT_WATCHDOG_MS`) : le gel n'a entraîné aucune modification de code.
Chemin de récupération vérifié à cette valeur exacte — `PREQUALIFICATION.md`
§5.1.

Rôle du watchdog, inchangé :

```text
récupération de l'évaluateur, uniquement
≠ vérité sémantique     ≠ autorité de ROW FAIL
≠ score de performance  ≠ critère de vainqueur

watchdog déclenché  →  ROW INCONCLUSIVE, JAMAIS ROW FAIL
```

Toute ligne requise non concluante :

```text
CANDIDATE EVALUATION       = INCOMPLETE
FINAL SCORE                = NOT ESTABLISHED
WINNER COMPARISON          = FORBIDDEN
dénominateur de vérité     = 30, TOUJOURS
```

## Phase 3 — matérialisation Git (FAITE)

```text
COMMIT    e69d9db  test: materialize CASE-005 bounded concurrency experiment
CONTENU   participant/ · control/ · documents du cas
PUSH      effectué
```

La matérialisation publie le matériel gelé. Elle ne produit aucun résultat
expérimental, et n'en préjuge aucun.

## Phase 4 — bras témoin, sans CCR (FAITE)

```text
SESSION      AGENT CCR LAB #8 — ouverte, close
DATE         2026-09-08
QUARANTAINE  tenue — aucune sortie substantive n'a atteint le bras CCR
ENTRÉE       participant/ — octet pour octet
SORTIE       une seule écriture : src/task-pool.ts
RÉSULTAT     30 / 30
```

Détail dans [`BASELINE-RECORD.md`](BASELINE-RECORD.md).

## Phase 5 — bras CCR (FAITE)

```text
SESSION      AGENT CCR LAB #9 — ouverte, close
DATE         2026-09-08
RUN CCR      CCR-20260908-001
ENTRÉE       participant/ — octet pour octet, identique à la phase 4
BUDGET       16 invocations natives de production, FROZEN
CONSOMMÉ     12 / 16 — arrêt volontaire · 17e invocation = 0
RÉSULTAT     30 / 30
```

Détail dans [`RUN-001-RECORD.md`](RUN-001-RECORD.md).

Règles de budget gelées :

```text
17e invocation provoquant du quota, dans le seul but d'obtenir une terminaison
   = INTERDITE
terminaison native
   = NON REQUISE
transfert pendant après épuisement du budget
   = permis
ajustement du budget après production
   = INTERDIT
```

## Phase 6 — évaluation (FAITE)

Conduite le 2026-09-08, bras témoin puis bras CCR, dans l'ordre prédéclaré.
Résultat officiel dans [`EVALUATION.md`](EVALUATION.md).

Pour chaque bras, dans cet ordre :

```bash
# 1. portes de validité, sur l'arbre RENDU
node control/gates.mjs --label <bras> --delivered <arbre rendu>

# 2. matrice complète, en processus isolés
node control/evaluate.mjs --impl <arbre rendu>/src/task-pool.ts \
     --label <bras> --out <preuves>          # watchdog gelé = 20 000 ms
```

Lecture du résultat :

```text
T1 ou T2 ou T3 en échec        →  RUN INVALID, aucun score de ligne
une ligne INCONCLUSIVE         →  ÉVALUATION INCOMPLETE
                                  score final NON ÉTABLI
                                  comparaison de vainqueur INTERDITE
30 lignes concluantes          →  score = lignes réussies / 30
```

Toute panne d'évaluateur (`EVALUATION ARTIFACT FAILURE`) est un défaut du
harnais, **jamais** un échec du candidat : réparer et relancer la ligne.

## Phase 7 — consommation publique (Layer C) (FAITE)

```text
SESSION   AGENT CCR LAB #10 — ouverte, close
DATE      2026-09-08
RÉSULTAT  PASS
```

Détail dans [`PUBLIC-CONSUMPTION.md`](PUBLIC-CONSUMPTION.md).

## Discipline de preuve (R2)

Toute campagne canonique conserve :

```text
stdout complet · stderr complet · code de sortie capté indépendamment
commande exacte · identité de la source · début · fin · durée
identités de lignes · code de sortie et signal de chaque enfant
watchdogFired · requiredEventObserved · harnessFault · verdict
```

`tail`, `head` et `grep` servent à l'inspection, jamais de capture canonique.
