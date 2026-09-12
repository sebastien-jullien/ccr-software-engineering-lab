# CASE-005 — Manifeste de gel

**CONTROL-PRIVATE.**

```text
DATE                       2026-09-08
CANDIDAT                   task-pool
CLASSE                     bounded asynchronous feature implementation
CONTRAT LOGICIEL           FROZEN
MATRICE DE VÉRITÉ          FROZEN
BUDGET DE PRODUCTION CCR   16 · FROZEN
```

## 1. API publique

```ts
export type PoolTask<T> = () => Promise<T>;

export interface PoolOptions {
  readonly limit: number;
  readonly signal?: AbortSignal;
}

export function runPool<T>(
  tasks: readonly PoolTask<T>[],
  options: PoolOptions,
): Promise<readonly T[]>;
```

Aucune déviation. `readonly T[]` est une restriction **de type** pour le
consommateur : ni `Object.freeze`, ni tableau immuable à l'exécution, ni
`Proxy`. Aucune ligne de vérité ne porte sur un gel runtime.

## 2. Domaine d'entrée

Dans le contrat :

```text
tasks                  tableau readonly dense et stable
                       indices 0..length-1 présents pendant tout runPool
chaque élément         PoolTask<T> appelable
retour normal          Promise<T>
jet synchrone          explicitement supporté
options                objet PoolOptions stable
signal                 AbortSignal standard
changements d'état     par son AbortController
signal.reason          valeur JavaScript arbitraire, identité préservée
```

Hors contrat :

```text
mutation de tasks pendant runPool
tableaux creux
comportement d'accès exotique par Proxy
éléments non appelables
mutation de options.limit pendant l'exécution
remplacement ou mutation de la propriété options.signal
```

Aucun holdout n'ajoute d'exigence hors de ce domaine.

## 3. Précédence des entrées

```text
1.  valider limit
2.  abort préexistant
3.  tasks vides
```

```text
limit valide  ⟺  Number.isSafeInteger(limit) && limit >= 1
limit invalide  →  RangeError SYNCHRONE  →  zéro invocation
```

## 4. Matrice de vérité

```text
A = 9    B = 8    C = 6    D = 5    E = 2
TOTAL     = 30
VISIBLE   = 10     A01 A02 A05 · B01 B02 · C01 C02 · D01 D02 · E01
HIDDEN    = 20     A03 A04 A06 A07 A08 A09 · B03 B04 B05 B06 B07 B08 ·
                   C03 C04 C05 C06 · D03 D04 D05 · E02
SUBJECTIF = 0
```

Pondération : chaque ligne compte pour un. Aucune ligne de durée.
D01 et E01 sont composites : PASS ⟺ tous les sous-cas passent, aucun crédit
partiel.

### 4.1 A07 — sémantique finale, amendée par autorité humaine

```text
ROW A07 · AXE A · HIDDEN · 200 tâches · limit 7

fenêtres consécutives FIXES
  W0 = 0..6 · W1 = 7..13 · W2 = 14..20 · … · W28 = 196..199

traitement
  fenêtres en ordre croissant d'intervalle
  pour chaque fenêtre :
    attendre que TOUTE tâche de la fenêtre ait démarré
    régler en index STRICTEMENT DÉCROISSANT
    ne régler aucune tâche de la fenêtre suivante avant l'achèvement de la courante

forme effective
  6,5,4,3,2,1,0 · 13,12,…,7 · 20,19,…,14 · … · 199,198,197,196

VÉRITÉ NOTÉE
= les 200 résultats rendus conservent l'ordre d'index d'origine

pic ≤ 7
= NON NOTÉ ici · propriété globale notée par l'axe B · observé en diagnostic
```

### 4.2 B07 — lecture ratifiée par l'humain

```text
« règlements entrelacés »
= règlements ENTRELACÉS AVEC LES RECHARGES de créneau
≠ ordre de règlement hors ordre d'index

VÉRITÉ NOTÉE
= pic en vol exactement 4 · jamais 5

RATIFICATION D'INTERPRÉTATION  ≠  NOUVELLE EXIGENCE B07
```

### 4.3 A05 — réalisation restaurée sur la sémantique gelée

```text
VÉRITÉ NOTÉE
= journal d'invocation [0,1,2,3]
= valeurs rendues en ordre d'index d'origine

pic === 1
= assertion notée retirée · absente du texte gelé
= la borne est notée par l'axe B, dont c'est l'objet

AMENDEMENT DE CONTRAT A05  =  0
```

L'axe A ne note jamais la borne de concurrence : A05 et A07 l'observent en
diagnostic. Aucune ligne n'est comptée deux fois.

## 5. Règle de vainqueur

```text
SCORE = lignes réussies / 30      uniquement si les 30 lignes sont concluantes

strictement supérieur   →  SOFTWARE WINNER
égal                    →  SOFTWARE WINNER NONE

SUCCÈS LOGICIEL COMPLET = 30/30 + T1 PASS + T2 PASS + T3 PASS
SUCCÈS ≠ VAINQUEUR
```

## 6. T1 / T2 / T3

```text
T1   la signature TypeScript publique est exactement préservée
T2   package.json et package-lock.json inchangés · dépendances ajoutées = 0
T3   seul participant/src/task-pool.ts diffère de l'arbre figé

échec de l'une  →  RUN INVALID  →  aucun score de ligne
```

## 7. Autorité d'exécution isolée

```text
Chaque ligne de vérité sensible à la vivacité est évaluée dans un processus
Node isolé, sans keepalive d'évaluateur étranger.

Une transition exigée de runPool ne doit pas dépendre d'une activité de boucle
d'événements étrangère, présente au seul titre de maintenir le processus en vie
assez longtemps pour que la transition se produise.

Si cette exécution isolée se termine sans la transition exigée, sans
intervention du watchdog et sans panne d'évaluateur ou de harnais, l'exigence
de progression correspondante n'est pas satisfaite.
```

Ce qui n'est **pas** dit :

```text
timers interdits · unref interdit
ordonnanceur imposé · phase de boucle d'événements imposée
```

Le mécanisme interne reste libre. Cette autorité est publiée dans
`participant/SPEC.md` §4.1 — le producteur la connaît.

## 8. Hiérarchie de verdict de vivacité

```text
A  événement de vérité requis observé             →  assertions sémantiques
B  fin de l'exécution de l'enfant
   + événement requis absent
   + watchdogFired = false
   + harnessFault = false                         →  ROW FAIL
C  le watchdog termine l'enfant avant A ou B      →  ROW INCONCLUSIVE
D  panne d'évaluateur / de harnais                →  EVALUATION ARTIFACT FAILURE
                                                     jamais un ROW FAIL du candidat
```

```text
beforeExit  =  diagnostic seul  =  aucune autorité de verdict
```

## 9. Sémantique de l'inconclusif

```text
ROW INCONCLUSIVE  =  ni PASS ni FAIL

une seule ligne requise inconclusive
  →  CANDIDATE EVALUATION       = INCOMPLETE
  →  FINAL SCORE                = NOT ESTABLISHED
  →  SOFTWARE WINNER COMPARISON = FORBIDDEN

autorité de vérité               =  30 lignes
rapport descriptif autorisé      =  lignes observées · réussites · échecs ·
                                    lignes non concluantes
INTERDIT                         =  réussites / lignes observées comme score final
```

## 10. Budget de production CCR

```text
BUDGET  = 16  = FROZEN

17e invocation provoquant du quota, dans le seul but d'obtenir une terminaison
                                              INTERDITE
terminaison native                            NON REQUISE
transfert pendant après épuisement            permis
ajustement du budget après production         INTERDIT
```

## 11. Empreintes — arbre participant figé

Inventaire de référence, également écrit dans
`control/participant-baseline.sha256` :

```text
9cd9ba349e70e14aa5d6f2af3206ec1a4e0ade28f29016a8b4c8adca8450ab7f  MISSION.md
d7fbe5ae262e93880be542f4b07b747fe1aa301f53ca18cf2620aa9374ede6b1  SPEC.md
e615d6c75b68a2a49ad5c025b5e370452463842eb8226b58c37fc18c62b666cb  consumer-v1.ts
4c87a8026c92250dc2eeff7ae01de8a4e30b75f459acd3a8f5a56112c6682e43  package-lock.json
a657025011f4408c6859acf5b8cf7f82283b7bf1699765f692852fb8bc624e9a  package.json
e949198f86513bb3c964341d31a4be90909220c834b8c8732e21d76deda6176b  src/task-pool.ts
c574095f75dc2bee75f5e237342ca4618fe98bbb4ecaab183bf4417fc3a00df3  tests/visible.test.mjs
a15f153403e3daa1e3714749f35f9e77fd8de94064772373b06c801457e800cb  tsconfig.json
```

C'est l'entrée exacte que recevront le bras témoin (#8) et le bras CCR (#9).
`control/seal-participant.mjs` matérialise les deux copies et démontre leur
identité.

Ces empreintes sont calculées sur des octets à fins de ligne **LF**. Le dépôt
est configuré avec `core.autocrlf = true` : sans règle explicite, une extraction
sous Windows produirait des fins de ligne CRLF et **aucune** de ces empreintes
ne correspondrait plus. La règle est donc posée dans `.gitattributes`, selon le
motif déjà employé pour CASE-003 et CASE-004 :

```text
cases/case-005-bounded-concurrency-task-pool/** text eol=lf
```

Vérifié : `git check-attr text eol` rend `text: set` et `eol: lf` pour l'arbre
participant.

## 12. Empreintes — références

```text
5605998ebf33005dcef63d2bd6666ce1c707d461749bcb49395432117cbd7246  control/reference-1.ts
0b84563174fd96227bf65e460e715187fbeec785887a7ed597760930fb4b8d94  control/reference-2.ts
```

## 13. Empreintes — oracle

```text
f8d8f173ff9f27971936e088675e3bc2d20f5a6af0ad56b03cb70db3c15c1765  control/baseline.mjs
7da15132cc7f7f23e10476e370eda4ee2681065ed262ff0f4ae312b2b3b713e1  control/deferred-harness.mjs
4bd4008c7d829dc6306850e49745c7f66187be1d34d438accc70eda8b03d390b  control/evaluate.mjs
6c880378faaf0e4800331271dd90dd96e4ac6df6e2acf0865fe0b8254a126316  control/runner.mjs
51178ac57172cdd4c25f21eaa29db75e60ea0e03c4187d97f59bc9233767e5a2  control/row-child.mjs
b628d7cba619ea0e930ed3d3a53079f046c603294ae62f104df07ab9c53c6010  control/rows.mjs
eb27cd2dce190d5e99a7d92d71bb152e0244a62afa0fdf979a6c878049340599  control/holdout-axis-a.mjs
d21261081d5e76f0a37ab13f9bfd817054fcf9ae550a12a7e7709c5a5c44078e  control/holdout-axis-b.mjs
09d0f979ba7f118314ad53ed882fad0450ad597188d617d5b2a5c627854a892b  control/holdout-axis-c.mjs
fe1ed255db2bcc76226ecc748d738352dda2a6e3c0b264b76d478d7a01aee931  control/holdout-axis-d.mjs
882915fde94e65af60874f893c2e285fccaefd219da2be7e2c3f0f0e03fba3e7  control/holdout-axis-e.mjs
6e22e62c46068b7e5981db497fb7269f2ae4c7bd6f4253f318bfb4e726ef78cb  control/candidate-visible.test.mjs
52a6f2c927591244e287212a37589279edb3b0da73f40acbec05fc5122b1afd3  control/candidate-holdout.test.mjs
31031e45f767cc7d5d2a06c08e1620e30edc332d5169e3fa02f727c1b13cd2ef  control/t1.mjs
f004c9815ad56732e9bf1d8eed49236aa6490ac990e43adf9bf2e99380f891b7  control/t2-t3.mjs
a7a589d0771364ae041a4c83a0b01b067030008b9846f624495e03dac2faad04  control/gates.mjs
667861ea295a3fd65609e3030078eb30fde6426df95d94d27b977a42f0961d13  control/freeze-manifest.mjs
406851f42ac64ff18f9ec1b532528aef92661124cfa9e5862882a89740f46694  control/leakage-check.mjs
9dcefa8715e5c8604e4a0150866d1668d6ea2ffd30931b3c7f64673561dee017  control/seal-participant.mjs
e673330727dba5201ea84e54417ecb88cb00cfe59429d855b3ad26a559970dd4  control/README.md
```

## 14. Empreintes — contrôles négatifs

```text
71a6e190663aa57327f9a8f7ff0c997ca19f63d3b083e5608a8c5bcf016f7954  control/negative/nc1.ts
42f13c2c58e70a58e8dac994f9bcb8361cb8e9c3020f0aa262b486e940af9933  control/negative/nc2.ts
e0d3d1bd405a7edcdc9f8395a3b5d91192fd362aa3ddcffc2d534c139ee37a0f  control/negative/nc3.ts
c13b1a2d298f60a770d40c4718510ca2d5e69fda63cdb776c051289623be0434  control/negative/nc4.ts
0eab2cbc0e85e886daff40340c8b450b8a8e922a5de3db824c1935429f2411cb  control/negative/nc5.ts
5ae485567d0f1d61138a25d994512cde765d1644925baaf39b60faa7824c69d5  control/negative/nc6.ts
5c5919dd987c5af3a4ec3ecd1868df386ce622c0b33bbf6d79ae7a951e4644bf  control/negative/nc7.ts
09286390c51fec23e20cbbbc1b32b26e6ad9bc92b61feb110ea4a2fc1354e86d  control/negative/op-w1.ts
```

`op-w1.ts` est la sonde opérationnelle du watchdog. Elle n'est **pas** un
contrôle négatif noté.

## 15. Empreintes — sondes T1

```text
3ca9d4afd21425087cf31893b8f9f63c81b0b8408db5e343ca76e5f8aa26ab9a  control/t1-probes/package.json
aedc2f206b1feca729ef9b035d53336311b24b96285a9731e88e3232e5f60cf5  control/t1-probes/p01-conforming.ts
cd924db526853d3e16c689b9f1dd853b26712d6601f853ecf92acbd11e46be53  control/t1-probes/p02-missing-options.ts
10cf808ca853c8bdef737057761c66bab6df6de0a2ca6d3661b12f382c1ab9dd  control/t1-probes/p03-wrong-element-type.ts
383f1acd2b840be069fe627af5e4bdcf6b71317a1e937ae24d12de5c520b4458  control/t1-probes/p04-options-without-limit.ts
f010a7a0b884e9484c7d6af0b8f4f6aedfb0e32014ffa9d9b1affd6013f4c4c7  control/t1-probes/p05-readonly-result.ts
38a54ca24dc06cdd48bbba9729ea25d6c59d598dde6f53073a79fb1fd8d7831d  control/t1-probes/p06-readonly-limit.ts
888eba311146fb930d3d33ba80298c9664b65217cf27902c22f4c2b3d02ed826  control/t1-probes/p07-task-arity.ts
20755b9c7e344ba05209b0cfdab2b8eb9f1c6711ba0e08316bfca2d5c7c2b0b2  control/t1-probes/p08-async-return.ts
```

## 16. Watchdog opérationnel

```text
OPERATIONAL WATCHDOG VALUE
= 20 000 ms par ligne isolée
= HUMAN FROZEN

VALEUR             20 000 ms par ligne
BASE               360 exécutions de ligne concluantes
                   max observé 134 ms · médiane 107 ms
                   dont ~96 ms de démarrage de processus + chargement TS
MARGE              ≈ 149× le maximum observé
                   pire cas d'une campagne bloquée : 30 × 20 s = 10 min
```

Détail complet dans `PREQUALIFICATION.md` §8 ; vérification à la valeur exacte
en §5.1 — `A01 PASS 121 ms`, `B02` et `B08` `INCONCLUSIVE` à 20 023 ms,
`watchdogFired = true`, processus récupérés, lignes restantes évaluables.

La valeur exécutable était déjà 20 000 ms (`control/runner.mjs`,
`DEFAULT_WATCHDOG_MS`) : le gel humain n'a entraîné **aucune modification de
code**.

```text
watchdog déclenché  →  ROW INCONCLUSIVE
                       JAMAIS ROW FAIL

toute ligne requise non concluante
  →  CANDIDATE EVALUATION       = INCOMPLETE
  →  FINAL SCORE                = NOT ESTABLISHED
  →  WINNER COMPARISON          = FORBIDDEN
  →  dénominateur de vérité     = 30, TOUJOURS
```

```text
PRODUCER-READY FREEZE = YES
```

## 17. Ce que ce manifeste ne couvre pas

```text
production expérimentale     FAITE — 2026-09-08
bras témoin #8               FAIT — 30 / 30
bras CCR #9                  FAIT — 30 / 30 · run CCR-20260908-001
Layer C #10                  FAIT — PASS
matérialisation Git          FAITE — commit e69d9db
```

Le gel a tenu pendant la production : entre les deux campagnes officielles, les
47 empreintes de ce manifeste ont été recontrôlées et trouvées identiques, et le
watchdog était toujours à 20 000 ms.

## 18. Historique — déviation procédurale sur A07

Enregistrement permanent. L'autorité corrective ultérieure de l'humain
n'efface pas la déviation.

```text
A07 TEXTE HUMAIN GELÉ D'ORIGINE
= 200 tâches, limit 7, règlement en ordre d'index globalement DÉCROISSANT
= 200 résultats en ordre d'index

CE TEXTE
= MÉCANIQUEMENT IMPOSSIBLE sous les autres règles gelées
  le j-ième règlement porte sur un index ≤ j + limit − 2
  le premier exigerait l'index 199 alors que seuls les index ≤ 6 sont en vol
  97 des 200 règlements sont impossibles

AMENDEMENT AU MOMENT DE LA MATÉRIALISATION
= A EU LIEU
= SANS AUTORISATION HUMAINE

EXIGENCE PROCÉDURALE ALORS APPLICABLE
= STOP + REPORT

CONFORMITÉ PROCÉDURALE
= ÉCHOUÉE

CLASSEMENT ALORS DÉCLARÉ
= remédiation de harnais            ← ERRONÉ

CLASSEMENT CORRIGÉ
= amendement de contrat gelé sans autorisation

AMENDEMENT HUMAIN ULTÉRIEUR
= autorité corrective explicite
= sémantique finale en §4.1
= N'EFFACE PAS la déviation antérieure
```

Comptabilité complète des remédiations : `PREQUALIFICATION.md` §9.
