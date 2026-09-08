# CASE-005 — Matrice de vérité

**CONTROL-PRIVATE.** Ce document n'appartient pas au paquet participant et n'est
transmis à aucune session de production. Il est révélé après le gel des
candidats.

```text
AXE A   invocation, bornage, ordre des résultats     9 lignes    3 visibles + 6 cachées
AXE B   borne de concurrence et recharge             8 lignes    2 visibles + 6 cachées
AXE C   échec de tâche, cause d'arrêt, quiescence    6 lignes    2 visibles + 4 cachées
AXE D   sémantique d'AbortSignal                     5 lignes    2 visibles + 3 cachées
AXE E   validation d'entrée                          2 lignes    1 visible  + 1 cachée
TOTAL                                               30 lignes   10 visibles + 20 cachées

SUBJECTIF = 0

T1 / T2 / T3 = portes de validité, HORS des 30 lignes
```

Aucune ligne ne dépend du comportement attendu de CCR.
Aucune ligne n'impose de durée, de seuil ou de phase de boucle d'événements.

## Règle de score

```text
SCORE = lignes réussies / 30      uniquement si les 30 lignes sont concluantes

nombre de lignes strictement supérieur   →  SOFTWARE WINNER
nombre égal                              →  SOFTWARE WINNER NONE

SUCCÈS LOGICIEL COMPLET = 30/30 + T1 PASS + T2 PASS + T3 PASS
SUCCÈS ≠ WINNER
```

Une seule ligne non concluante suffit à rendre l'évaluation **INCOMPLETE** :
le score final n'est pas établi et la comparaison de vainqueur est interdite.

## Axe A — invocation, bornage, ordre des résultats (9)

| ID | Visibilité | Scénario | Assertion |
|----|-----------|----------|-----------|
| A01 | visible | `tasks = []`, `limit 3` | résolution avec `[]`, 0 invocation |
| A02 | visible | 1 tâche, `limit 1` | `['a']` à la position 0 |
| A03 | holdout | 3 tâches, `limit 5`, règlement en ordre d'index | `limit > n` : les 3 démarrent, résultat `a b c` |
| A04 | holdout | 3 tâches, `limit 5`, règlement `2 0 1` | résultat toujours `a b c` — ordre d'index, pas de règlement |
| A05 | visible | 4 tâches, `limit 1`, règlement 0,1,2,3 | journal d'invocation `[0,1,2,3]` ; valeurs en ordre d'index. **La borne n'est pas notée ici** — elle l'est par l'axe B ; le pic n'est qu'un diagnostic |
| A06 | holdout | 5 tâches, `limit 2`, règlement `1 0 3 2 4` | résultat `0..4` en ordre d'index |
| A07 | holdout | 200 tâches, `limit 7` ; fenêtres consécutives **fixes** `W0 = 0..6`, `W1 = 7..13`, …, `W28 = 196..199`, traitées en ordre croissant ; chaque fenêtre est attendue entièrement démarrée puis réglée en index **strictement décroissant**, aucune tâche de la fenêtre suivante n'étant réglée avant l'achèvement de la courante | **seule vérité notée** : les 200 résultats sont en ordre d'index d'origine. Le pic n'est qu'un diagnostic |
| A08 | holdout | 3 tâches, valeurs `undefined`, `null`, `0` | aucune coalescence : les trois occupent leur position |
| A09 | holdout | 3 promesses déjà résolues, `limit 2` | résultat `a b c`, pic ≤ 2 |

**L'axe A ne note jamais la borne de concurrence.** A05 et A07 l'observent et la
journalisent en diagnostic, mais leur verdict ne porte que sur le journal
d'invocation et sur l'ordre des résultats. La borne est notée par l'axe B, dont
c'est l'objet. Aucune ligne n'est ainsi comptée deux fois.

## Axe B — borne de concurrence et recharge (8)

Discipline d'observation tenue partout dans cet axe :

```text
assertion POSITIVE de progression  →  attendue DIRECTEMENT (waitForStart)
                                      aucune échéance, aucun délai
assertion NÉGATIVE de borne        →  constatée à une barrière du harnais
```

| ID | Visibilité | Scénario | Assertion |
|----|-----------|----------|-----------|
| B01 | visible | 5 tâches, `limit 2` | remplissage initial `{0,1}` exactement, pic ≤ 2 |
| B02 | visible | 5 tâches, `limit 2`, la tâche 0 se règle, la 1 reste en vol | la tâche 2 démarre ; la 3 ne démarre pas ; pic ≤ 2 |
| B03 | holdout | idem, mais c'est la tâche **1** qui libère le créneau | la tâche 2 démarre quand même — la recharge ne dépend pas de l'identité du libérateur |
| B04 | holdout | 6 tâches, `limit 3`, deux règlements | deux recharges (`3` et `4`), la `5` reste en file, pic ≤ 3 |
| B05 | holdout | 3 tâches, `limit 1` | la tâche 1 ne démarre pas tant que 0 est en vol, pic ≤ 1 |
| B06 | holdout | 3 tâches, `limit 5` | les 3 démarrent, aucune quatrième invocation possible |
| B07 | holdout | 12 tâches, `limit 4` ; règlements **entrelacés avec les recharges** — chaque règlement est suivi d'une recharge avant le suivant ; l'ordre de règlement reste l'ordre d'index | **seule vérité notée** : pic mesuré exactement `4`, jamais `5` |
| B08 | holdout | 4 tâches, `limit 2` ; la tâche 1 reste **délibérément** en vol | la tâche 2 démarre après le règlement de 0 ; la tâche 3 reste en file |

**B08 — étrier de nettoyage.** Le PASS est enregistré d'abord, sur le seul fait
que `2` a démarré et que `3` n'a pas démarré. Le règlement de nettoyage de la
tâche 1 vient ensuite, et n'entre pas dans la preuve.

**Lecture ratifiée de « règlements entrelacés » (B07).** L'expression désigne des
règlements **entrelacés avec les recharges de créneau** — un règlement, puis une
recharge, puis le règlement suivant — et non un ordre de règlement hors ordre
d'index. B07 ne note que le pic. La divergence entre ordre de règlement et ordre
d'index est l'objet de l'axe A, pas de B07.

## Axe C — échec de tâche, cause d'arrêt, quiescence (6)

| ID | Visibilité | Scénario | Assertion |
|----|-----------|----------|-----------|
| C01 | visible | 1 tâche, rejet `R` | rejet externe avec `R` **à l'identité** |
| C02 | visible | 4 tâches, `limit 2`, la 0 rejette, la 1 reste en vol | aucun démarrage après l'échec ; la promesse externe reste **en attente** ; rejet après règlement de 1 |
| C03 | holdout | idem, puis la tâche 1 se règle | le rejet survient alors, avec `R0` — jamais avant |
| C04 | holdout | la tâche 1 rejette (`R1`), puis la tâche 0 rejette (`R0`) | la cause retenue reste `R1` : le second échec ne la remplace pas |
| C05 | holdout | la tâche 0 **jette synchroniquement** `E`, `limit 2` | `0` invoquée une fois ; `1` et `2` jamais invoquées ; `runPool` rend une promesse — rien ne s'échappe synchroniquement — qui rejette avec `E`, non enveloppé |
| C06 | holdout | la tâche 0 rejette (`R0`), puis `abort(A)` | la cause reste `R0` : l'avortement postérieur ne la remplace pas |

## Axe D — sémantique d'AbortSignal (5)

| ID | Visibilité | Scénario | Assertion |
|----|-----------|----------|-----------|
| D01 | visible · **composite** | abort **préexistant** — sous-cas 1 : 3 tâches ; sous-cas 2 : `tasks = []` | rejet avec la raison à l'identité, 0 invocation ; sur tâches vides l'abort **prime** sur la résolution `[]` |
| D02 | visible | 4 tâches, `limit 2`, `abort(A)` en cours de route | aucun démarrage après l'abort ; externe en attente ; rejet avec `A` après quiescence |
| D03 | holdout | la tâche 0 appelle `controller.abort(A)` **synchroniquement** pendant son invocation, puis reste en vol | `1` et `2` jamais invoquées ; externe en attente jusqu'au règlement de 0 ; rejet avec `A` à l'identité |
| D04 | holdout | `abort(A)` puis la tâche 0 rejette (`R0`) | la cause retenue reste `A` |
| D05 | holdout | 2 tâches, les deux se règlent, **puis** `abort(A)` | l'avortement postérieur au succès est **inerte** : aucune rétroaction, la promesse externe reste résolue |

**D01 et E01 sont composites.** Chaque sous-cas est une invocation fraîche.
PASS composite ⟺ tous les sous-cas passent. Aucun crédit partiel.

**D03 n'impose aucune architecture.** Écouteur, lecture de `signal.aborted`, ou
tout autre mécanisme valide : la ligne mesure l'effet, jamais le moyen.

## Axe E — validation d'entrée (2)

| ID | Visibilité | Scénario | Assertion |
|----|-----------|----------|-----------|
| E01 | visible · **composite** | `limit ∈ { 0, -1, 1.5, NaN, +∞, 2^53 }` | `RangeError` **synchrone** pour chacune, 0 invocation, aucune promesse rendue |
| E02 | holdout | `limit 0` **et** signal déjà avorté | la validation de `limit` prime : `RangeError` synchrone, pas un rejet d'abort |

E02 verrouille la précédence gelée par `SPEC.md` §2 :

```text
1. valider limit
2. abort préexistant
3. tasks vides
```

## Isolement

```text
chaque ligne  =  un processus enfant
              =  une invocation fraîche de runPool
              =  des tâches fraîches, des différés frais
              =  un AbortController frais
              =  des journaux frais

état runtime partagé entre lignes = 0
```

Mesuré : les 30 lignes exécutées individuellement rendent le même verdict qu'en
suite complète, et la suite en ordre inversé rend le même verdict qu'en ordre
direct. Voir `PREQUALIFICATION.md`.
