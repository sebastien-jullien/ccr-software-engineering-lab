# CASE-001 — Truth Matrix

Ce document résume la vérité externe fixée avant le run.

| ID | Propriété | Résultat attendu |
|---|---|---|
| V1 | intervalle valide | accepté + UTC canonical |
| V2 | adjacency | accepté |
| V3 | overlap actif | `OVERLAP` |
| V4 | annulation | libère l'intervalle, conserve la réservation |
| V5 | ordre list | start, end, id |
| V6 | start == end | `INVALID_INTERVAL` |
| V7 | duplicate actif | `DUPLICATE_ID` |
| H1 | même instant via offsets | overlap détecté |
| H2 | adjacency via offsets | accepté |
| H3 | duplicate après annulation | `DUPLICATE_ID` |
| H4 | deuxième annulation | `ALREADY_CANCELLED` |
| H5 | annulation inconnue | `NOT_FOUND` |
| H6 | identifiant invalide | `INVALID_ID` prioritaire |
| H7 | date impossible | `INVALID_TIMESTAMP` |
| H8 | 2028-02-29 | valide |
| H9 | tie-break list | end puis id |
| H10 | mutation snapshot | aucun effet interne |
| H11 | fraction | normalisée en millisecondes |
| H12 | timestamp invalide + duplicate | `INVALID_TIMESTAMP` |
| H13 | ordre UTC contraire aux heures locales | `INVALID_INTERVAL` |
| H14 | offset > 14:00 | `INVALID_TIMESTAMP` |

La matrice ne prédit aucune erreur d'agent. Elle fixe uniquement les résultats fonctionnels contre lesquels les affirmations pourront être confrontées après le run.
