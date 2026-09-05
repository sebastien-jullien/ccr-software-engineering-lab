# CASE-001 — Runbook

## 1. But

Faire traiter un micro-projet logiciel vérifiable **par CCR System** afin d'observer la dynamique de contradiction, de preuve et de correction sans utiliser un projet de développement réel.

## 2. Invariant d'exécution

RUN-001 est un **run CCR réel**.

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

n'est **pas** le protocole d'exécution de RUN-001.

Le document `06-EXTERNAL-INDUSTRIAL-WORKFLOW-CONTEXT.md` est contextuel uniquement.

## 3. Matériel visible pendant le travail

Donner au travail principal uniquement le dossier :

```text
participant/
```

Ne pas donner :

```text
control/
EVALUATION.md
```

## 4. Phase 0 — Préparation

Avant le vrai run CCR :

1. figer le contenu de `participant/` et de `control/` ;
2. vérifier l'oracle avec les cas visibles et holdouts ;
3. enregistrer les hashes des fichiers de contrôle si une traçabilité forte est souhaitée ;
4. créer un espace de travail jetable contenant uniquement `participant/` ;
5. placer/mettre à disposition la mission participant dans cet espace sans y copier le control pack.

Le participant démarre volontairement avec une implémentation squelette incomplète.

## 5. Phase 1 — Lancement CCR

Mission fonctionnelle minimale :

> Implémenter `ReservationEngine` conformément à `SPEC.md`. Ne pas modifier la spécification ni les tests visibles. Produire les preuves d'exécution nécessaires et signaler explicitement toute ambiguïté ou impossibilité.

Lancer cette mission via CCR, depuis le workspace participant, avec un vrai `ccr start`.

Forme attendue :

```text
ccr start
→ role author assigned to a provider
→ role challenger assigned to a provider
→ distinct native sessions managed by CCR
```

Les fournisseurs peuvent être choisis explicitement avec les options publiques de CCR ou laissés aux valeurs prévues par l'environnement. Un éventuel plafond `--max-invocations` doit être fixé au lancement s'il est utilisé.

CCR doit traiter cette mission comme du travail réel, pas comme un benchmark où une erreur particulière serait attendue.

## 6. Phase 2 — Travail / contradiction dans CCR

Conduire le run avec les opérations CCR normales (`ccr step`, interventions humaines ciblées, etc.) selon les besoins réellement observés.

Laisser **CCR** produire et persister les échanges entre `author` et `challenger`, ainsi que les positions, objections, controverses, preuves et réconciliations matériellement nécessaires.

Ne pas injecter artificiellement :

- faux bug ;
- faux reviewer ;
- consigne contradictoire ;
- information cachée destinée à piéger ;
- workflow manuel externe destiné à remplacer les rôles natifs CCR.

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

## 8. Phase 4 — Révélation du control pack

Seulement après la clôture intellectuelle du travail principal :

1. construire le candidat issu du run CCR ;
2. exécuter les holdouts contre le candidat ;
3. comparer les affirmations du run avec la matrice de vérité ;
4. classifier les findings, faux positifs, omissions et inconnues.

Le control pack est une preuve postérieure. Il ne doit pas être réinjecté rétroactivement comme s'il avait été disponible plus tôt.

## 9. Phase 5 — Consommation machine CCR

Après le run principal, un consommateur jetable doit tenter, avec les seules surfaces publiques supportées de CCR, de :

```text
1. découvrir le run ;
2. lire les invocation outcomes ;
3. extraire les faits durables effectivement disponibles ;
4. produire un résumé machine minimal sans lire les internes CCR.
```

Objectif secondaire : observer les limites publiques réelles de CCR, pas reproduire tout le raisonnement humain.

## 10. Phase 6 — Observation

Reporter chaque friction via le modèle `../../04-OBSERVATION-RECORD.md`.

Aucune friction ne sélectionne automatiquement une feature.
