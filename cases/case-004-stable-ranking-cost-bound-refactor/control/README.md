# CASE-004 — Pack control

**MATÉRIEL AVEUGLE.** Rien de ce répertoire n'est visible du participant, ni
transmis à une session baseline, ni à une session de production CCR, jusqu'à la
clôture intellectuelle du travail principal et le gel des candidats.

## Contenu

```text
holdout-axis-a.mjs          A-H1..A-H8, paramétrés par un chargeur paresseux
holdout-axis-b.mjs          H9..H15, tailles, graines et générateurs privés
candidate-holdout.test.mjs  les 15 holdouts contre le candidat gelé
reference-visible.test.mjs  les 11 contrôles visibles contre les deux références
reference-holdout.test.mjs  les 15 holdouts contre les deux références
reference-1.ts              REF-1, fusion descendante récursive
reference-2.ts              REF-2, fusion ascendante itérative
negative/nc1..nc7.ts        contrôles négatifs de préqualification
t1.mjs                      détecteur T1 de délégation directe
t1-probes/                  13 sondes syntaxiques qualifiant la portée de T1
```

## Indépendance des deux références

```text
REF-1   découpage récursif par tranches, fusion par concaténation
REF-2   itérative ascendante, double tampon permuté, sans récursion

NOYAU DE TRI PARTAGÉ ENTRE REF-1 ET REF-2
= AUCUN
```

Les deux ne partagent que la sémantique publiée.

## Exécution

Les références se qualifient sur place :

```text
node --test reference-visible.test.mjs
node --test reference-holdout.test.mjs
```

`candidate-holdout.test.mjs` suppose d'être placé dans un répertoire directement
enfant du workspace candidat, de sorte que `../src/` désigne ses sources.

`t1.mjs` résout TypeScript par la résolution de modules ordinaire depuis son
propre emplacement : dans un workspace de run, le `node_modules` du candidat est
trouvé sans chemin codé en dur.

## Pureté de l'axe B

Chaque row B n'affirme que `comparison_count <= n * ceil(log2 n)`. Aucune
assertion d'ordre, de stabilité, d'identité ni de mutation n'y figure. Une
implémentation qui ne comparerait rien passerait l'axe B — et c'est l'axe A qui
l'arrête, comme NC4 le démontre.

## Trois dimensions, aucune redondante

```text
sans l'axe A   → NC1 NC2 NC3 NC4 NC7 passent
sans l'axe B   → le point de départ passe
sans T1        → NC5 passe
```

## Contrôles négatifs

```text
NC1  efficace mais instable
NC2  efficace mais mute l'entrée et rend le conteneur d'entrée
NC3  efficace mais clone les éléments objets
NC4  triche à travail comparateur nul
NC5  délégation au tri de l'hôte
NC6  dérive de signature publique
NC7  résultat troué
```

```text
LIGNES DE VÉRITÉ OFFICIELLE   = 26
CONTRÔLES NÉGATIFS            = preuve de préqualification et de control
                              ≠ lignes officielles supplémentaires
```

## Portée de T1

```text
T1
= détecteur borné de délégation directe, sur AST TypeScript

T1 ANTI-OBFUSCATION COMPLETENESS
= NOT CLAIMED
```

Un nom de membre calculé échappe à T1 : la sonde `p13-obfuscated.ts` le
démontre, et cette limite est déclarée plutôt qu'écartée.
