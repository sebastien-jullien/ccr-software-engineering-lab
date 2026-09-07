# CASE-004 — Préqualification

Résumé borné et **non sensible**. L'évidence détaillée — tailles privées,
graines, générateurs, comptages exacts et identités des holdouts — appartient au
control privé et ne figure pas ici.

```text
CCR START
= NOT RUN

WORKSPACES DE QUALIFICATION
= jetables et frais, hors du dépôt du Lab

DATE
= 2026-09-07
```

## 1. Chaîne d'outils

```text
node --version                                  = v22.18.0
node node_modules/typescript/bin/tsc --version  = Version 5.8.3

TYPESCRIPT       5.8.3 exact, déclaré sans plage
INSTALL          npm ci depuis le lockfile gelé
TÉLÉCHARGEMENT OPPORTUNISTE   = AUCUN
```

Il n'y a pas d'étape de build : Node ≥ 22.18 strippe les types nativement, et
`tsconfig.json` porte `noEmit`, `allowImportingTsExtensions` et
`erasableSyntaxOnly`.

## 2. Point de départ

```text
DÉFAUT SEMÉ
= AUCUN

TYPECHECK
= propre, exit 0, zéro diagnostic

AXE A
= 17/17 PASS

AXE B
= 0/9 — chaque ligne dépasse la borne

RÈGLE DE MISSION
= respectée
```

Le point de départ est comportementalement correct. Son incapacité à tenir la
borne **est** l'exigence d'optimisation, pas un défaut préexistant.

## 3. Deux références indépendantes

```text
REF-1   fusion descendante récursive
REF-2   fusion ascendante itérative, double tampon

NOYAU DE TRI PARTAGÉ   = AUCUN
```

```text
RÉFÉRENCES : AXE A     = 17/17 PASS chacune
RÉFÉRENCES : AXE B     = 9/9 PASS chacune
RÈGLE DE MISSION       = respectée par les deux
```

Aucune référence ne s'approche de la borne : sur chaque ligne officielle, la
marge exigée par la règle de sélection était tenue avec réserve.

## 4. Sélection du coefficient

La règle de sélection a été **déclarée avant toute mesure** :

```text
C RETENU
= le plus petit C de {1,2,3,4} tel que, sur CHAQUE ligne officielle de l'axe B :
    comptage du point de départ  >  borne(C)
    comptage de REF-1            <= 0,95 × borne(C)
    comptage de REF-2            <= 0,95 × borne(C)
```

```text
C = 1   QUALIFIE
C = 2   QUALIFIE
C = 3   QUALIFIE
C = 4   QUALIFIE

C RETENU   = 1
FORMULE    = comparison_count <= n * ceil(log2 n)
```

La règle n'a pas été modifiée après observation des données.

Robustesse : le pire cas théorique du tri fusion reste sous le seuil de 95 % sur
chaque ligne officielle, et une **troisième famille algorithmique**,
structurellement distincte des deux références, y reste également — le
coefficient n'est donc pas ajusté sur les deux seules références retenues.

## 5. Contrôles négatifs et non-redondance des dimensions

Sept contrôles négatifs ont été construits et exécutés.

```text
NC1  efficace mais instable            → échec comportemental
NC2  efficace mais mute l'entrée       → échec comportemental
NC3  efficace mais clone les éléments  → échec comportemental
NC4  travail comparateur nul           → axe B vert, axe A rouge
NC5  délégation au tri de l'hôte       → axes verts, règle de mission violée
NC6  dérive de signature publique      → seule la sonde de types le voit
NC7  résultat troué                    → échec de densité
```

```text
sans l'axe A   → NC1 NC2 NC3 NC4 NC7 passeraient
sans l'axe B   → le point de départ passerait
sans le verrou de tâche → NC5 passerait

NON-REDONDANCE DES TROIS DIMENSIONS
= démontrée
```

## 6. Traçabilité du contrat

```text
CLAUSES BC1..BC12
= 12/12 tracées

COUVERTURE PAR CLAUSE
= au moins une ligne officielle ET au moins un contrôle négatif
```

## 7. Détecteur de conformité à la tâche

```text
PORTÉE
= détecteur borné de délégation directe, sur AST TypeScript
= déterministe sur sa portée syntaxique déclarée, éprouvée par sondes dédiées

IMPORT RUNTIME NON RELATIF
= n'échoue PAS par principe
= le paquet participant gelé est sans dépendance runtime

ANTI-OBFUSCATION COMPLETENESS
= NOT CLAIMED
= un nom de membre calculé échappe au détecteur, et c'est déclaré
```

## 8. Étanchéité

```text
DÉTAILS PRIVÉS DES HOLDOUTS DANS participant/
= 0

MATÉRIEL DE CONTROL DANS participant/
= 0
```

## 9. Verdict

```text
PREQUALIFICATION
= PASS

UNRESOLVED IN-CONTRACT AMBIGUITIES
= 0
```
