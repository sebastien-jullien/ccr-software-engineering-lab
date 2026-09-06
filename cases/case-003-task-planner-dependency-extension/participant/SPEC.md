# CASE-003 — Spécification

Ce document est la seule autorité normative du cas. Un comportement qu'il ne
prescrit pas n'est pas exigé ; un comportement qu'il prescrit l'est
intégralement.

## 1. Contrat v1 existant

Module `src/task-planner.ts`. Ce contrat est **déjà implémenté** et **ne doit
pas changer**.

### 1.1 Types publics

```ts
type TaskId = string;
type Priority = 'high' | 'normal' | 'low';
interface Task { id: TaskId; priority: Priority; }
type AddFailureReason = 'INVALID_ID' | 'INVALID_PRIORITY' | 'DUPLICATE_ID';
type PlanFailureReason = never;
type AddResult = { ok: true } | { ok: false; reason: AddFailureReason };
type PlanResult = { ok: true; order: readonly TaskId[] };
class TaskPlanner { add(task: Task): AddResult; plan(): PlanResult; }
```

### 1.2 `add()`

Un identifiant valide est une chaîne dont le premier caractère est
alphanumérique, suivie d'au plus 63 caractères alphanumériques, `_` ou `-`.
Une priorité valide est `high`, `normal` ou `low`.

Les motifs de refus sont évalués dans cet ordre strict, et le premier qui
s'applique est celui qui est rendu :

```text
INVALID_ID  →  INVALID_PRIORITY  →  DUPLICATE_ID
```

Un `add()` refusé ne modifie pas l'état du planificateur. En particulier il
n'occupe aucun rang d'insertion.

### 1.3 `plan()` et règle d'ordre

`plan()` ne peut pas échouer : `PlanFailureReason` vaut `never`, et rien ne doit
l'élargir. La règle d'ordre v1 est :

```text
1. rang de priorité croissant      high < normal < low
2. puis rang d'insertion croissant
```

`plan()` est pur : il ne modifie pas l'état, et deux appels successifs rendent le
même ordre. Son résultat est un instantané : le muter n'affecte pas les appels
suivants.

## 2. Extension demandée

Nouveau module `src/dependency-planner.ts`, exportant exactement :

```ts
interface DependencyTask extends Task { after?: readonly TaskId[]; }
type DependencyPlanFailureReason = 'UNKNOWN_DEPENDENCY' | 'CYCLIC_DEPENDENCY';
type DependencyPlanResult =
  | { ok: true; order: readonly TaskId[] }
  | { ok: false; reason: DependencyPlanFailureReason };
class DependencyTaskPlanner extends TaskPlanner {
  add(task: DependencyTask): AddResult;
  planWithDependencies(): DependencyPlanResult;
}
```

`after` déclare les tâches qui doivent être émises **avant** celle qui les
déclare.

## 3. Clauses normatives

```text
N1  La règle d'ordre v1 (§1.3) est inchangée et reste la seule règle de
    comparaison entre deux tâches.

N2  À chaque pas de planWithDependencies(), parmi les tâches dont toutes les
    dépendances déclarées sont déjà émises, la tâche émise est celle qui vient
    en premier au sens de N1.

N3  Une dépendance dont la valeur ne pourrait pas être un TaskId valide au sens
    de §1.2 est traitée comme UNKNOWN_DEPENDENCY. Ce n'est ni une erreur d'ajout,
    ni une exception.

N4  Une tâche qui dépend d'elle-même est un cycle, et donne CYCLIC_DEPENDENCY.

N5  Si le graphe contient à la fois une dépendance inconnue et un cycle, le
    résultat est UNKNOWN_DEPENDENCY. L'inconnu l'emporte toujours.

N6  Un `after` absent ou vide signifie « aucune dépendance ».

N7  Les doublons dans `after` sont absorbés. Ce n'est pas une erreur, et l'ordre
    produit est celui qu'aurait donné la déclaration dédoublonnée.

N8  L'ordre des appels à add() ne contraint pas les déclarations : une tâche peut
    déclarer une dépendance vers une tâche ajoutée plus tard. Seule
    l'appartenance au moment de la planification compte.

N9  Lors d'un add() réussi, la déclaration de dépendance est capturée comme
    instantané. Une mutation ultérieure du tableau fourni par l'appelant, ou une
    réassignation ultérieure de `task.after`, ne doit pas altérer l'état de
    dépendance du planificateur. Un add() refusé ne capture rien.
```

`planWithDependencies()` est pur et rend un instantané, exactement au sens de
§1.3.

## 4. Frontière de préservation

```text
TaskPlanner
= inchangé

surface publique de TaskPlanner
= exactement add et plan

signature de add
= (task: Task) => AddResult

signature de plan
= () => PlanResult

PlanFailureReason
= never

Task
= exactement { id, priority }
= `after` n'appartient pas à Task

plan() hérité par DependencyTaskPlanner
= rend l'ordre legacy
≠ ordre tenant compte des dépendances

add() hérité et surchargé
= même validation, même précédence de refus, même effet sur l'état legacy
```

Un consommateur TypeScript écrit contre la v1 doit continuer à compiler sans une
seule modification. `consumer-v1.ts` en est la sonde gelée.

## 5. Ambiguïtés connues

```text
KNOWN SPECIFICATION AMBIGUITIES
= NONE
```

Toute question de comportement soulevée pendant le travail doit trouver sa
réponse dans les clauses ci-dessus. Si elle n'en trouve pas, c'est un fait à
signaler, pas une latitude à exercer silencieusement.

## 6. Hors périmètre

```text
valeurs d'exécution malformées hors du contrat TypeScript déclaré
= OUT OF SCOPE
```

Sont hors périmètre, par exemple : une tâche qui n'est pas un objet, un `after`
qui n'est pas un tableau, une dépendance qui n'est pas une chaîne. La validation
de `id` et de `priority` par `add()` n'est **pas** hors périmètre : elle fait
partie du contrat v1, et c'est la raison d'être de `AddFailureReason`.

## 7. Liberté d'implémentation

```text
IMPLEMENTATION FREEDOM
= architecture interne
= registre parallèle ou remaniement interne
= algorithme et structures de données
= représentation interne de l'instantané N9
```

Les champs `#private` de `TaskPlanner` ne sont pas lisibles depuis une
sous-classe. Répondre à cette contrainte par un registre parallèle ou par un
remaniement interne est un choix libre, tant que §4 est respecté.
