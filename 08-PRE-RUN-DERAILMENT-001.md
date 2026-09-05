# PRE-RUN-DERAILMENT-001 — Simulation manuelle du workflow externe

## Statut

```text
TYPE
= pre-run orchestration error

CCR RUN
= NOT STARTED

CCR-SIDE FINDING
= NO

CASE-001 FINDING
= NO
```

## Résumé

Avant le premier vrai run CCR, le handoff externe vers l'Orchestrateur a transformé par erreur le workflow industriel de contexte en méthode d'exécution de CASE-001.

Au lieu de :

```text
CASE-001
→ CCR start
→ author / challenger
→ CCR-managed native sessions
```

la conduite a dérivé vers une reproduction manuelle :

```text
Orchestrateur
→ Implémentateur
→ Expertiseur
→ Contre-Expertiseur
```

Cette séquence n'est pas RUN-001.

## Cause identifiée

Le point de rupture principal est le handoff externe qui a demandé de reprendre le workflow habituel de contre-expertise **pendant l'exécution de RUN-001**, au lieu de l'utiliser uniquement pour contrôler la conduite de l'expérience CCR.

Le document historique `06-REFERENCE-CROSS-EXPERTISE-WORKFLOW.md` favorisait également cette confusion en présentant le workflow industriel comme « pattern opérationnel de référence du Lab », même si sa fin le bornait comme application possible de CCR.

## Réparation

La fondation v3 :

- rebaptise et reborde ce document en contexte industriel externe uniquement ;
- rend explicite que CASE-001 doit être exécuté dans CCR ;
- utilise les rôles natifs CCR `author` / `challenger` ;
- interdit de remplacer CCR par une simulation manuelle du workflow externe ;
- définit `RUN-001` comme commençant au premier vrai `ccr start`.

## Portée

Les erreurs de routage observées pendant la tentative manuelle peuvent informer la compréhension du coût du transport manuel, mais elles ne sont pas des observations de RUN-001 sur CCR et ne doivent pas générer de CCR requirement.
