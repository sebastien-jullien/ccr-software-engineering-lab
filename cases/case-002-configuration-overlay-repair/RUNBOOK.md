# CASE-002 — Runbook

## 1. But

Faire traiter par **CCR System** un défaut de comportement rapporté dans un composant existant,
afin d'observer la dynamique de diagnostic, de contradiction, de preuve et de réparation bornée
sans utiliser un projet de développement réel.

La forme du cas est :

```text
existing imperfect codebase
→ diagnosis
→ bounded repair
```

## 2. Invariant d'exécution

RUN-001 de CASE-002 sera un **run CCR réel**.

```text
EXECUTION
= CCR native run

EXPERT ROLES
= author
= challenger

NATIVE SESSIONS
= created / maintained by CCR
```

Ne pas remplacer CCR par une reproduction manuelle d'un workflow externe.

En particulier :

```text
MANUAL IMPLEMENTER SESSION
→ MANUAL EXPERTISER SESSION
→ MANUAL COUNTER-EXPERTISER SESSION
```

n'est **pas** le protocole d'exécution du run.

Le document `../../06-EXTERNAL-INDUSTRIAL-WORKFLOW-CONTEXT.md` est contextuel uniquement.

## 3. Matériel visible pendant le travail

Donner au travail principal uniquement le dossier :

```text
participant/
```

Ne pas donner :

```text
control/
EVALUATION.md
PREQUALIFICATION.md
TRUTH-MATRIX.md
```

## 4. Phase 0 — Préparation

Statut de cette phase :

```text
PHASE 0
= COMPLETE
```

Ce qui a été fait, et ne doit pas être refait :

1. contenu de `participant/` et de `control/` figé ;
2. oracle qualifié avec les cas visibles et les holdouts ;
3. sensibilité du control démontrée contre la fixture initiale ;
4. empreintes SHA-256 des deux paquets enregistrées dans `FREEZE-MANIFEST.md` ;
5. résultats de préqualification enregistrés dans `PREQUALIFICATION.md`.

Le participant démarre volontairement avec une implémentation existante contenant un défaut
racine unique. Ce défaut n'est pas réparé avant le run : le baseline participant échoue
légitimement sur le symptôme rapporté.

```text
BASELINE VISIBLE TEST RESULT
= expected failure on the reported defect
```

## 5. Phase 1 — Lancement CCR

```text
CCR START
= NOT part of the foundation mission
```

Au lancement futur :

1. créer un espace de travail jetable contenant uniquement une copie de `participant/` ;
2. vérifier que `control/` en est absent ;
3. lancer un vrai `ccr start` depuis cet espace, avec `participant/MISSION.md` comme mission de
   départ et les rôles natifs `author` / `challenger`.

Forme attendue :

```text
ccr start
→ role author assigned to a provider
→ role challenger assigned to a provider
→ distinct native sessions managed by CCR
```

Les fournisseurs peuvent être choisis explicitement avec les options publiques de CCR ou
laissés aux valeurs prévues par l'environnement. Un éventuel plafond `--max-invocations` doit
être fixé au lancement s'il est utilisé.

CCR doit traiter cette mission comme du travail réel, pas comme un benchmark où une erreur
particulière serait attendue.

## 6. Phase 2 — Travail / contradiction dans CCR

Conduire le run avec les opérations CCR normales (`ccr step`, interventions humaines ciblées,
etc.) selon les besoins réellement observés.

Laisser **CCR** produire et persister les échanges entre `author` et `challenger`, ainsi que
les positions, objections, controverses, preuves et réconciliations matériellement nécessaires.

Ne pas injecter artificiellement :

- faux bug supplémentaire ;
- faux reviewer ;
- consigne contradictoire ;
- information cachée destinée à piéger ;
- indice sur la cause ou sur les manifestations non révélées ;
- workflow manuel externe destiné à remplacer les rôles natifs CCR.

En particulier, ne jamais nommer au participant la condition fautive ni les manifestations
`0` et `""`. Le diagnostic fait partie du travail mesuré.

## 7. Phase 3 — Sortie humaine

Sorties légitimes :

```text
ACCEPT
REQUEST CORRECTION
REQUEST MORE EVIDENCE
DEFER
HUMAN DECISION REQUIRED
```

La fin du run ne doit pas être forcée par le besoin de produire une conclusion agréable.

## 8. Phase 4 — Gel du candidat, puis révélation du control pack

Seulement après la clôture intellectuelle du travail principal :

1. figer le candidat issu du run avant toute lecture du control ;
2. construire le candidat et exécuter les holdouts contre lui ;
3. comparer les affirmations du run avec la matrice de vérité ;
4. classifier les findings, faux positifs, omissions, régressions et inconnues.

Toute étape de build ou d'installation mécaniquement nécessaire se fait sur une copie
d'évaluation dérivée du snapshot, jamais sur le snapshot ni sur `participant/`.

Le control pack est une preuve postérieure. Il ne doit pas être réinjecté rétroactivement comme
s'il avait été disponible plus tôt, ni renvoyé aux sessions natives.

Rappel de classification :

```text
DETECTION ≠ REMEDIATION
FINDING ≠ REMEDIATION
UNKNOWN ≠ ZERO
PLAUSIBLE ≠ DEMONSTRATED

D1a + D1b + D1c
= ONE ROOT DEFECT
```

## 9. Phase 5 — Consommation machine CCR

Après le run principal, un consommateur jetable doit tenter, avec les seules surfaces publiques
supportées de CCR, de :

```text
1. découvrir le run ;
2. lire les invocation outcomes ;
3. extraire les faits durables effectivement disponibles ;
4. produire un résumé machine minimal sans lire les internes CCR.
```

Objectif secondaire : observer les limites publiques réelles de CCR, pas reproduire tout le
raisonnement humain.

## 10. Phase 6 — Observation

Reporter chaque friction via le modèle `../../04-OBSERVATION-RECORD.md`.

Aucune friction ne sélectionne automatiquement une feature.
