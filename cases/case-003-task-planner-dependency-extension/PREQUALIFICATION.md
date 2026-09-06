# CASE-003 — Préqualification

Exécutée avant tout run CCR, sur des copies jetables dérivées de `participant/`
et de `control/`, jamais sur les paquets eux-mêmes. La vérité consignée provient
exactement des fichiers gelés.

```text
CCR START
= NOT RUN

QUALIFICATION WORKSPACES
= jetables et frais, hors du dépôt du Lab

DATE
= 2026-09-06
```

## 1. Chaîne d'outils

```text
node --version      = v22.18.0
npm --version       = 10.9.3
npx tsc --version   = Version 5.8.3
```

```text
TYPESCRIPT
= 5.8.3 exact, déclaré sans plage dans participant/package.json

INSTALL
= npm ci depuis package-lock.json gelé

LOCKFILE APRÈS npm ci
= inchangé — vérifié par comparaison au pack gelé
```

Il n'y a pas d'étape de build. Node ≥ 22.18 strippe les types nativement : la
source EST l'artefact exécuté, et `tsconfig.json` porte `noEmit`,
`allowImportingTsExtensions` et `erasableSyntaxOnly`.

## 2. Fixture de départ

```text
TYPECHECK DU PROJET
= exit 0, zéro diagnostic
= couvre src/** et consumer-v1.ts

STARTING FIXTURE TYPECHECK
= PASS

V10 AGAINST LEGACY FIXTURE
= PASS
```

Zéro diagnostic sur l'ensemble du projet : aucune erreur ne peut être imputée à
l'un des deux ensembles, donc chacun est propre.

```text
VISIBLE RUNTIME BASELINE
= 4 PASS / 5 EXPECTED FAIL
= code de sortie 1

V1 V2 V3 V4
= PASS — le comportement legacy est présent et correct

V5 V6 V7 V8 V9
= EXPECTED FAIL — la capacité nouvelle est absente

STARTING FIXTURE VISIBLE STATUS
= EXPECTED RED
```

Ce n'est pas un défaut du fixture. Aucun défaut n'a été semé.

```text
SEEDED DEFECT
= NONE

DEPENDENCY FEATURE IN STARTING FIXTURE
= ABSENT
```

## 3. Validité du harness visible

Le module additif n'est jamais importé au niveau du fichier de test. Il est
chargé paresseusement dans le corps de chaque contrôle qui en dépend.

```text
VECTEUR INDIVIDUEL OBSERVABLE
= OUI — 9 contrôles rapportés un par un

INFRASTRUCTURE FAILURE
= NONE — les quatre contrôles legacy s'exécutent et passent
         alors que src/dependency-planner.ts n'existe pas

VISIBLE TEST HARNESS
= VALID
```

## 4. Qualification de l'oracle

```text
REFERENCE VISIBLE RUNTIME
= 9/9 PASS — V1..V9, code de sortie 0

REFERENCE HOLDOUTS
= 17/17 PASS — H1..H17, code de sortie 0

REFERENCE FAILURE
= 0
```

`V10` n'est pas un contrôle de l'oracle : c'est une sonde de compilation
TypeScript, et l'oracle est en JavaScript.

```text
RUNTIME EVIDENCE
≠ TYPE-LEVEL EVIDENCE
```

## 5. Sensibilité de la sonde V10

Cinq contrôles négatifs, chacun appliqué seul à une copie jetable du fixture,
puis annulé. `consumer-v1.ts` n'a jamais été modifié.

```text
`after` ajouté à Task           exit 2  TS2578 ligne 48 + TS2322 ligne 53
plan() élargi en union d'échec  exit 2  TS2339 « Property 'order' does not exist »
PlanFailureReason ≠ never       exit 2  TS2322 ligne 44
membre public ajouté            exit 2  TS2322 ligne 58
signature de add modifiée       exit 2  TS2322 ligne 63
fixture restaurée               exit 0
```

Chaque contrôle négatif échoue sur la ligne d'assertion qui le vise, et sur elle
seule.

```text
BOUNDED SOURCE-COMPATIBILITY EVIDENCE
= YES

UNIVERSAL TYPESCRIPT COMPATIBILITY
= NOT CLAIMED
```

## 6. Sensibilité du control

Contrôle supplémentaire : les 17 holdouts exécutés contre le fixture legacy,
c'est-à-dire contre une implémentation dépourvue de la capacité nouvelle.

```text
HOLDOUTS CONTRE LE FIXTURE LEGACY
= 1 PASS / 16 FAIL

H14
= PASS — seul holdout qui ne requiert que TaskPlanner

H1..H13 H15 H16 H17
= FAIL — requièrent le module additif
```

Les deux chargeurs du control sont séparés, un par module : un module absent fait
échouer les holdouts qui en dépendent, un par un, sans empêcher les autres de
rendre un verdict. Le control distingue donc réellement ce qui est déjà correct
de ce qui ne l'est pas encore.

## 7. Résolubilité et non-sur-contrainte

Une sonde jetable, construite hors du cas et détruite après mesure, a implémenté
la surface additive depuis `SPEC.md` seule.

```text
PROBE RESULT
= typecheck exit 0
= visible 9/9
= holdouts 17/17
= consumer-v1.ts compile inchangé, à l'octet près
```

```text
SPECIFICATION SATISFIABLE
= demonstrated

CONTROL OVER-CONSTRAINT
= NONE demonstrated

ADDITIVE COMPATIBILITY
= demonstrated at type level and at runtime
```

La sonde ne constitue pas une solution proposée et n'a été conservée nulle part.
`participant/src/` ne contient que le contrat v1.

## 8. Étanchéité du paquet participant

```text
HOLDOUT FILES IN PARTICIPANT PACKAGE
= 0

TRUTH MATRIX IN PARTICIPANT PACKAGE
= 0

CONTROL ORACLE IN PARTICIPANT PACKAGE
= 0

RÉFÉRENCE À control/ DANS participant/
= NONE
```

`consumer-v1.ts` est délibérément visible du participant. Ce n'est pas une fuite :

```text
VISIBLE COMPATIBILITY EVIDENCE
≠ TRUTH LEAKAGE

V10
= VISIBLE
≠ HOLDOUT
```

## 9. Indépendance oracle / candidat

```text
CONSTRUCTION
= moteur de référence écrit directement depuis la sémantique publiée
= NOT derived from any participant implementation

FORME DE LA RÉFÉRENCE
= déclarations dans une table séparée indexée par identifiant
= inconnu établi par balayage de toutes les déclarations
= cycle établi par parcours en profondeur tricolore AVANT ordonnancement
= ordre produit par sélection linéaire répétée du minimum, sans tri
```

Le fixture de départ et la référence ne partagent que la sémantique publiée.

## 10. Verdict

```text
PREQUALIFICATION
= PASS
```
