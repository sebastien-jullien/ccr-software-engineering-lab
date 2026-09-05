# CASE-001 — Plan d'exécution du premier usage réel

## Décision

Le premier usage post-1.0 du Lab est :

```text
CASE-001
= Reservation Interval Engine
```

Il s'agit d'un micro-projet jetable et autonome, sans lien avec CCR System ni avec un projet logiciel industriel réel.

## Invariant d'exécution

CASE-001 doit être traité **par CCR System lui-même**.

```text
CASE EXECUTION ENGINE
= CCR SYSTEM

CCR NATIVE EXPERT ROLES
= author
= challenger

SESSION MANAGEMENT
= CCR native sessions

MANUAL REPRODUCTION OF EXTERNAL WORKFLOW
= FORBIDDEN AS CASE EXECUTION METHOD
```

Le workflow externe décrit dans `06-EXTERNAL-INDUSTRIAL-WORKFLOW-CONTEXT.md` est un contexte d'application possible, pas le moteur de RUN-001.

Ne pas créer manuellement des sessions `Implémentateur → Expertiseur → Contre-Expertiseur` pour simuler ce workflow.

## Pourquoi ce cas

Le cas combine :

- une spécification objectivement vérifiable ;
- des cas frontières naturels ;
- une implémentation assez petite pour rester lisible ;
- plusieurs sources plausibles de faux positifs ou de défauts manqués ;
- une vérité externe indépendante ;
- un terrain permettant d'observer la contradiction et la correction entre les experts CCR.

Les erreurs ne sont pas injectées volontairement.

## Séparation expérimentale

```text
PARTICIPANT PACK
= visible during CCR main work

CONTROL PACK
= hidden until post-run evaluation
```

Le control pack n'est pas une autorité CCR. Il est l'oracle fonctionnel du micro-projet.

## Lancement attendu

Le lancement concret doit suivre les mécanismes publics de CCR :

```text
participant workspace
→ ccr start
→ author / challenger native sessions
→ ccr step / normal CCR interventions as justified
→ human decision when required
→ main-work closure
→ control reveal
```

L'affectation des fournisseurs (`--author-provider`, `--challenger-provider`) et un éventuel `--max-invocations` sont des paramètres du vrai run CCR à choisir au lancement, pas des rôles industriels à importer.

## Succès

Le cas est utile si :

```text
USEFUL WORK COMPLETED
OR
CONCRETE FRICTION DEMONSTRATED
```

Il n'est pas nécessaire que CCR échoue ni qu'une nouvelle feature soit sélectionnée.
