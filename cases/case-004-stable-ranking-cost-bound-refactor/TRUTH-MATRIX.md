# CASE-004 — Matrice de vérité

**CONTROL-PRIVATE.** Ce document n'appartient pas au paquet participant et n'est
transmis à aucune session de production. Il est révélé après le gel des
candidats.

```text
AXE A    = 17 lignes    9 visibles + 8 holdouts
AXE B    =  9 lignes    2 visibles + 7 holdouts
TOTAL    = 26 lignes

T1       = verrou de conformité à la tâche, HORS des 26 lignes
```

Aucune ligne ne dépend du comportement attendu de CCR.

## Axe A — contrat comportemental (17)

| ID | Visibilité | Générateur d'entrée | Comparateur | Assertion attendue | Verdict |
|----|-----------|---------------------|-------------|--------------------|---------|
| A-V1 | visible | `[]` | `(a,b)=>a-b` | BC3 : conteneur frais, ordinaire, indépendant ; longueur 0 | PASS |
| A-V2 | visible | `[{k:1,id:'a'}]` | par clé `k` | BC3 + BC4 : référence exacte préservée | PASS |
| A-V3 | visible | `[5,3,9,1,7]` | `(a,b)=>a-b` | BC5 : `1,3,5,7,9` | PASS |
| A-V4 | visible | `[9,7,5,3,1]` | `(a,b)=>a-b` | BC5 : `1,3,5,7,9` | PASS |
| A-V5 | visible | `k=[1,1,0,1]`, ids `a b c d` | par clé `k` | BC6 : `cabd` | PASS |
| A-V6 | visible | `k=[3,1,2]` | par clé `k` | BC2 : conteneur d'entrée inchangé, élément par élément | PASS |
| A-V7 | visible | `k=[2,1,3,1]` | par clé `k` | BC3 + BC12 : propriétés d'exécution, densité de `[0,length)`, indépendance après `push` | PASS |
| A-V8 | visible | `k=[2,1,3,1]`, objets distincts | par clé `k`, emballé | BC4 + BC11 : multiplicité, références exactes, provenance `Object.is` des arguments | PASS |
| A-V9 | visible | `participant/consumer-v1.ts` | — | BC1 : compile inchangé sous TypeScript 5.8.3 | PASS |
| A-H1 | holdout | 12 objets de clé identique `7` | par clé `k` | BC6 : ordre d'entrée intégralement conservé | PASS |
| A-H2 | holdout | 16 objets, clé `i % 2` | par clé `k` | BC6 : classes alternées, oracle par décoration | PASS |
| A-H3 | holdout | une même référence en positions 0, 2, 4 | par clé `k` | BC4 + BC9 : multiplicité 3, positions distinctes | PASS |
| A-H4 | holdout | 5 objets, clés `1 1 0 1 0` | signe seul : `-0` sur ex aequo, `-7` / `3` sinon | BC7 + BC11 : `-0` équivaut à `+0` | PASS |
| A-H5 | holdout | `k=[3,1,2,1]` | par clé `k` | BC3 + BC10 : deux appels déterministes, conteneurs indépendants | PASS |
| A-H6 | holdout | 4 objets simples désignés | par clé `k`, emballé | BC8 + BC11 : clés et valeurs d'entrée inchangées, comparateur appelé | PASS |
| A-H7 | holdout | alias en positions 1 et 3, plus clés égales | par clé `k` | BC4 + BC6 + BC9 | PASS |
| A-H8 | holdout | 200 objets, LCG graine `1234567`, clés `% 17` | par clé `k` | BC2 + BC5 + BC6 : oracle dense complet | PASS |

## Axe B — borne de travail comparateur (9)

Chaque ligne affirme exactement une chose, et rien d'autre :

```text
comparison_count <= n * ceil(log2 n)
```

| ID | Visibilité | Générateur d'entrée | Comparateur | n | borne | Verdict |
|----|-----------|---------------------|-------------|---|-------|---------|
| V10 | visible | `[255..0]` décroissant | `(a,b)=>a-b` | 256 | 2048 | PASS |
| V11 | visible | `[0..256]` mélangé Fisher-Yates, LCG graine `20260907` | `(a,b)=>a-b` | 257 | 2313 | PASS |
| H9 | holdout | `[382..0]` décroissant | `(a,b)=>a-b` | 383 | 3447 | PASS |
| H10 | holdout | `[0..388]` mélangé Fisher-Yates, xorshift32 graine `0xC0040010` | `(a,b)=>a-b` | 389 | 3501 | PASS |
| H11 | holdout | organ-pipe : `i` puis `191-i` | `(a,b)=>a-b` | 192 | 1536 | PASS |
| H12 | holdout | blocs alternés : `1000+i` si `i` pair, sinon `i` | `(a,b)=>a-b` | 256 | 2048 | PASS |
| H13 | holdout | `[0..299]` mélangé LCG graine `777001`, puis `% 12` | `(a,b)=>a-b` | 300 | 2700 | PASS |
| H14 | holdout | `[0..256]` mélangé LCG graine `4242`, objets `{major:v%7, minor:v, seat:i}` | `major` puis `minor` | 257 | 2313 | PASS |
| H15 | holdout | `[0..511]` mélangé LCG graine `99887766` | `(a,b)=>a-b` | 512 | 4608 | PASS |

Le verdict `PASS` de la colonne est la vérité attendue d'une implémentation
conforme. Le point de départ échoue les neuf.

## Composition

```text
AXE A PASS + AXE B PASS
= SUCCÈS DES AXES LOGICIELS

AXE A FAIL
= pas un succès

AXE B FAIL
= pas un succès

SUCCÈS COMPLET DU CAS
= AXE A PASS ET AXE B PASS ET conformité à la règle de mission
```

Un axe B intégralement vert avec un axe A rouge n'est pas un succès partiel :
c'est une optimisation qui a cassé ce qu'elle devait préserver.

## Non-identités à tenir pendant l'évaluation

```text
VISIBLE 10/10            ≠ SUCCÈS COMPLET DU CAS
AXE B PASS               ≠ implémentation correcte
AXE A PASS               ≠ borne de coût tenue
T1 PASS                  ≠ absence de délégation obfusquée
COMPARISON COUNT         ≠ efficacité réelle à l'exécution
NOT COVERED              ≠ FALSE
CHALLENGER CONFIRMATION  ≠ BLIND CONTROL CONFIRMATION
CONSENSUS                ≠ TRUTH
```

## Correspondance clause → lignes

```text
BC1   A-V9
BC2   A-V6 A-H8
BC3   A-V1 A-V2 A-V7 A-H5
BC4   A-V2 A-V8 A-H3 A-H7
BC5   A-V3 A-V4 A-H8
BC6   A-V5 A-H1 A-H2 A-H7 A-H8
BC7   A-H4
BC8   A-H6
BC9   A-H3 A-H7
BC10  A-H5
BC11  A-V8 A-H4 A-H6
BC12  A-V7
```

```text
NOMBRE DE CLAUSES         = 12
LIGNES DE L'AXE A         = 17
```

Ces deux nombres diffèrent, et c'est attendu : une ligne peut couvrir plusieurs
clauses, une clause peut avoir plusieurs lignes.
