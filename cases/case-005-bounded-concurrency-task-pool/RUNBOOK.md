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

## Phase 3 — matérialisation Git (À FAIRE)

Aucun `git add`, `git commit` ni `git push` n'a été exécuté pour ce cas.

## Phase 4 — bras témoin, sans CCR (NOT RUN)

```text
SESSION      AGENT CCR LAB #8 — non ouverte
QUARANTAINE  la sortie substantive ne doit jamais atteindre l'opérateur du bras CCR
ENTRÉE       participant/ — octet pour octet
SORTIE       une seule écriture : src/task-pool.ts
```

## Phase 5 — bras CCR (NOT STARTED)

```text
SESSION      AGENT CCR LAB #9 — non ouverte
ENTRÉE       participant/ — octet pour octet, identique à la phase 4
BUDGET       16 invocations natives de production, FROZEN
```

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

## Phase 6 — évaluation

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

## Phase 7 — consommation publique (Layer C)

```text
SESSION   AGENT CCR LAB #10 — non ouverte
```

## Discipline de preuve (R2)

Toute campagne canonique conserve :

```text
stdout complet · stderr complet · code de sortie capté indépendamment
commande exacte · identité de la source · début · fin · durée
identités de lignes · code de sortie et signal de chaque enfant
watchdogFired · requiredEventObserved · harnessFault · verdict
```

`tail`, `head` et `grep` servent à l'inspection, jamais de capture canonique.
