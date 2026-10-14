# Contribuer au CCR Software Engineering Lab

Les signalements, corrections et propositions de contribution sont bienvenus.

Ce dépôt est le **CCR Software Engineering Lab**, un laboratoire d'usage et
d'évaluation de [CCR System](https://github.com/sebastien-jullien/ccr-system).
Il ne définit pas la doctrine de CCR System et ne lui impose pas de changements.

## Repères du projet

Avant de proposer un changement, consultez les documents utiles à son périmètre :

- [`README.md`](README.md) — objet du Lab, cas, outillage et état publié ;
- [`00-CHARTER.md`](00-CHARTER.md) — mission, indépendance et autorité humaine ;
- [`01-RELATION-TO-CCR.md`](01-RELATION-TO-CCR.md) — frontière avec CCR System ;
- [`02-REAL-USE-PROTOCOL.md`](02-REAL-USE-PROTOCOL.md) — conduite des usages réels, si la contribution concerne une expérience ;
- les contrats, tests et documents propres au cas ou à l'outil concerné.

Il n'existe pas de `docs/doctrine.md` propre au Lab à importer ou à créer
pour contribuer. Les documents historiques et les autorités propres au Lab
conservent leur portée déclarée ; ils ne constituent pas une nouvelle doctrine
de CCR System.

## Signaler un problème

Indiquez le résultat attendu, le résultat observé, les étapes de reproduction,
le système d'exploitation, la version de Node.js et, si c'est pertinent, les
conditions d'exécution. Une reproduction minimale et non sensible est préférable.

Ne publiez ni secrets, ni identifiants de session, ni chemins personnels, ni
transcriptions ou matériaux privés d'experts. Vérifiez également qu'aucune
donnée de tiers non autorisée n'est incluse dans les pièces jointes.

Un constat peut être signalé sans proposer de solution.

## Proposer un changement

- **Un sujet par proposition.** Séparez une correction d'un réusinage ou d'une
  évolution de comportement sans rapport.
- **Distinguez maintenance et R&D.** Une correction d'environnement, de tests ou
  de documentation n'est pas, à elle seule, une nouvelle expérience CCR.
- **Annoncez toute conséquence observable.** Décrivez les effets sur les
  contrats, les fichiers produits, les résultats et les consommateurs éventuels.
- **Préservez les résultats historiques.** Ne réécrivez pas les preuves,
  empreintes, oracles, cas gelés ou décisions publiées pour faire passer un test.
  Une rectification nécessaire doit être explicite, vérifiable et examinée dans
  le périmètre approprié.
- **Respectez la frontière CCR System / Lab.** Une friction observée dans le Lab
  ne justifie pas automatiquement un changement de CCR System. Proposez les
  évolutions de CCR System dans son propre dépôt.
- **Documentez les changements pertinents.** Mettez à jour les indications
  d'utilisation et les tests lorsque le comportement observable change.

Le mainteneur peut demander des preuves complémentaires ou refuser un changement
qui contredit les contrats applicables. Une contribution ne sélectionne pas à
elle seule une direction R&D ou une décision d'autorité humaine.

## Tests

Utilisez les tests adaptés aux chemins modifiés. Le Lab ne fournit pas de
commande `npm test` globale à sa racine : ses suites d'outillage sont exécutées
directement avec Node.js, depuis la racine du dépôt.

Les huit suites utilisées pour qualifier l'outillage publié sont :

```bash
node --test tooling/program-state/tests/program-state.test.mjs
node --test tooling/mission-object/tests/mission-object.test.mjs
node --test tooling/mission-object/tests/qualification.test.mjs
node --test tooling/mission-object/tests/v0-compatibility.test.mjs
node --test tooling/mission-object/tests/v1.test.mjs
node --test tooling/mission-object/tests/p-hr-01.test.mjs
node --test tooling/result-instance/tests/result-instance.test.mjs
node --test tooling/console/tests/console.test.mjs
```

Les cas sous `cases/` possèdent aussi leurs propres tests et consignes. Exécutez
ceux qui concernent votre modification, sans confondre un test sur fixture avec
une observation de fournisseur réel. Certaines suites d'outillage utilisent
l'historique Git : travaillez dans un clone complet, pas dans un clone superficiel.

Indiquez les commandes réellement exécutées, leurs résultats et les limites de
votre vérification. N'affirmez pas avoir testé un parcours que vous n'avez pas
exercé.

## Attestation d'origine — DCO

Chaque nouveau commit doit porter une attestation **Developer Certificate of
Origin (DCO 1.1)**. Il n'y a pas de CLA ni de cession de droits exigée.

Ajoutez une ligne `Signed-off-by` à votre message de commit, par exemple avec
`git commit -s` :

```text
Signed-off-by: Prénom Nom <adresse@exemple.org>
```

En signant, vous certifiez avoir le droit de proposer votre contribution sous
la licence du dépôt. Voir <https://developercertificate.org/>.

**Historique préexistant.** Les commits jusqu'à
`418521f57064fa4f1bf599aaaf40bb05cb956d5b` inclus restent acceptés sans
sign-off rétroactif. Ils ne sont ni modifiés ni réécrits. L'exigence DCO
s'applique aux nouveaux commits, y compris celui qui ajoute ce document.

## Licence des contributions

Les contributions sont proposées sous la **Mozilla Public License 2.0**
([`LICENSE`](LICENSE)). Leurs auteurs conservent leurs droits ; aucune
cession de copyright n'est demandée.

## Décision

Le mainteneur principal est **Sébastien JULLIEN**. Aucune gouvernance
supplémentaire n'est déclarée pour les contributions à ce stade.
