# CASE-004 — Consommation machine public-only

Surfaces publiques de CCR uniquement. Aucune lecture d'interne.

```text
LAYER C = PASS
```

## Cadre

```text
CONSOMMATEUR            = AGENT CCR LAB #7
SESSION                 = fraîche, consommateur public
CCR SYSTEM              = v1.1.0
                        = c9de52b223ee13e79863e9747f08e88938d59579
SOURCE D'IDENTIFICATION = titre sémantique public uniquement
RUN_ID PRIVÉ            = jamais employé comme entrée
```

## F1 — découverte sémantique

```text
F1 CONTRACT              = PASS
F1 SEMANTIC TITLE MATCH  = unique
DISCOVERED RUN ID        = CCR-20260907-002
                         = origine publique F1 seule
PRIVATE RUN-ID RESCUE    = NO
```

Le run visé a été trouvé par correspondance exacte et unique sur son titre
sémantique public, sans qu'aucun identifiant privé n'ait servi d'entrée.

## F2 — activité durable

```text
F2 READ 1               = AVAILABLE
F2 READ 2               = AVAILABLE
F2 ACTIVITY COUNT       = 31
F2 TWO-READ STABILITY   = PASS
```

Deux lectures indépendantes rendent la même projection.

```text
31 ACTIVITÉS DURABLES F2   ≠ 32 INVOCATIONS CCR
ACTIVITY                   ≠ INVOCATION OUTCOME
F2                         ≠ TRANSCRIPT
COMPLETED                  ≠ substantive success
MISSING HISTORY            ≠ EMPTY HISTORY
ROLE                       ≠ PROVIDER
```

Les deux comptes ne mesurent pas la même chose et n'ont pas à coïncider.

## Incident de syntaxe à la première invocation

```text
FIRST F1 INVOCATION   = échec de syntaxe de chemin Windows/POSIX côté consommateur
RETRY                 = même point d'entrée canonique, correction de syntaxe seule
CCR SYSTEM FAILURE    = NO
```

## Limitation observée du consommateur public

```text
PUBLIC DURABLE INTENTIONAL-END FACT   = NOT REPRESENTED
PUBLIC QUOTA-EXHAUSTION FACT          = NOT REPRESENTED
PUBLIC PENDING-TRANSFER FACT          = NOT REPRESENTED
```

```text
AVEC LES SEULES SURFACES PUBLIQUES F1/F2,
UN CONSOMMATEUR FRAIS PEUT-IL DISTINGUER

  une fin de production intentionnelle
  d'une cessation d'émission de pas par l'opérateur
  d'un run procéduralement ouvert

= NO
```

Portée exacte de ce constat :

```text
PUBLIC CONSUMER LIMITATION   = démontrée sur les surfaces F1/F2 de CCR v1.1.0
CONTRACT VIOLATION           = NO
CCR DEFECT                   = NOT AUTOMATICALLY INFERRED
```

Ce qui est établi est que la représentation publique observée ne contient aucun
fait capable d'opérer cette distinction. Il n'est **pas** affirmé que trois
situations contrefactuelles produiraient des représentations identiques à
l'octet près : cela n'a pas été mesuré.

## Conséquence — P3

```text
P3 PUBLIC-CONSUMER CONSEQUENCE   = DEMONSTRATED
SCOPE                            = surfaces machine publiques F1/F2 de v1.1.0
```

Suite produit et statut de décision : voir `EVALUATION.md` §7.

## Consommabilité

```text
PUBLIC CONSUMABILITY = OUI pour l'identité et l'activité durable
                     = NON pour la nature de la fin de production
```
