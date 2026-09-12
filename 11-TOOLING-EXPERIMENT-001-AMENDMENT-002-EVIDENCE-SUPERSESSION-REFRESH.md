# TOOLING-EXPERIMENT-001 — Amendement 002 : supersession et rafraîchissement du soutien

## 1. Statut

```text
TYPE
= amendement de conception, ratifié par l'humain

ORIGINE
= constats 002 et 003 du dogfood réel

PRÉDÉCLARATION D'ORIGINE
= 09-TOOLING-EXPERIMENT-001-PROGRAM-STATE.md
= INCHANGÉE

AMENDEMENT 001
= 10-TOOLING-EXPERIMENT-001-AMENDMENT-001-DECISION-CREATION.md
= INCHANGÉ, TOUJOURS VALIDE

CE DOCUMENT
= autorité de l'amendement 002
= GELÉ AVANT IMPLÉMENTATION

IMPLÉMENTATION DE L'AMENDEMENT 002
= NON COMMENCÉE
```

Au moment où ce document est écrit, l'arbre de travail est **volontairement
sale** : l'implémentation de l'amendement 001 et le point de reprise portant la
décision réelle nouvellement créée existent sur disque, hors de tout commit.
Cet état est mis en quarantaine, non réparé (§ 9).

## 2. Constat 002 — supersession du soutien courant

```text
CONSTAT 002
= ÉCART DE SUPERSESSION DU SOUTIEN COURANT
```

Comportement démontré :

```text
champ substantiel ANCIEN → NOUVEAU

nouveau soutien
= ajouté

ancien soutien du même sujet + même champ
= reste actif

résultat
= les deux valeurs sont soutenues indépendamment
→ contradiction
```

Cible concrètement observée :

```text
next_action.value
```

Le constat n'est pas élargi au-delà de ce qui a été mesuré. Il a été vérifié sur
une copie hors dépôt, précisément pour ne pas placer le point de reprise réel
dans l'état contradictoire qu'il décrit.

Aucun chemin légitime ne l'évitait : `value` est substantiel, donc `update`
exige une preuve, et l'ancienne entrée demeure. Toute seconde modification
substantielle du même champ contredisait donc la première, de façon permanente.

## 3. Constat 003 — rafraîchissement de provenance

```text
CONSTAT 003
= ÉCART DE RAFRAÎCHISSEMENT DE PROVENANCE
```

Ce qu'il ne faut **pas** enregistrer :

```text
un point de reprise qui épingle l'empreinte de son propre outil
= défaut

  → LECTURE ERRONÉE
```

L'interprétation correcte :

```text
SOURCE_CHANGED
= DÉTECTION CORRECTE
```

Le détecteur a fait exactement ce pour quoi il a été conçu. L'écart réel est
ailleurs :

```text
l'affirmation sémantique reste vraie

la source qui la soutient change légitimement

l'ancien observed_blob devient périmé

la v0 n'offre aucun mécanisme supporté pour rafraîchir la provenance ACTIVE
```

Exemple concrètement observé :

```text
flux                    tooling-experiment-001
état                    IMPLEMENTED
valeur sémantique       inchangée
source de soutien       code de l'outil, légitimement amendé
ancien blob observé     ≠ blob courant de la source
check                   → SOURCE_CHANGED
```

Que la source soit ici l'outil lui-même n'est pas la cause : c'est seulement le
chemin le plus court vers le symptôme. Toute source de preuve qui évolue
légitimement, tout en laissant l'affirmation vraie, produit le même écart.

## 4. Cause commune

```text
POINT DE REPRISE COURANT
= INSTANTANÉ COURANT

INSTANTANÉ COURANT
= affirmations courantes actives
+ soutien courant actif

INSTANTANÉ COURANT
≠ accumulation de toutes les relations de soutien historiques
```

L'écart commun aux deux constats :

```text
LE SOUTIEN ACTIF
= n'a aucune sémantique de supersession ni de rafraîchissement
```

`update` n'a jamais su qu'ajouter. Un instantané qui ne sait qu'accumuler cesse
d'être un instantané.

## 5. Amendement 002 — supersession du soutien actif

Sémantique ratifiée pour une mise à jour substantielle ordinaire d'un champ
existant :

```text
CIBLE
= sujet exact + champ exact

lorsque la valeur passe de ANCIEN à NOUVEAU :

1.  identifier les relations de soutien ACTIVES de ce sujet + ce champ
2.  les retirer de l'instantané candidat
3.  ajouter la ou les relations de preuve nouvellement fournies
4.  chaque nouvelle relation doit soutenir exactement :
      le sujet exact · le champ exact · la NOUVELLE valeur
5.  valider le point de reprise candidat ENTIER
6.  sérialiser canoniquement
7.  remplacer atomiquement
```

Portée, et elle est étroite :

```text
preuve soutenant un AUTRE champ du même sujet
= PRÉSERVÉE

preuve soutenant un AUTRE sujet
= PRÉSERVÉE
```

Aucune suppression indiscriminée de preuves.

## 6. L'histoire n'est pas effacée

```text
ANCIEN SOUTIEN ACTIF
= retiré de l'instantané courant

ANCIEN SOUTIEN HISTORIQUE
= conservé par l'historique Git
```

Le point de reprise est suivi : `git log -p -- PROGRAM-STATE.json` conserve
chaque relation de soutien qui a été active, avec sa date et le message qui
l'explique. Rien ne justifie de garder l'ancien soutien actif dans l'instantané
pour préserver l'histoire.

```text
JOURNAL ÉVÉNEMENTIEL PARALLÈLE   = NON
TABLEAUX D'HISTORIQUE DANS LE JSON = NON
```

## 7. Rafraîchissement de provenance à valeur égale

```text
MISE À JOUR À VALEUR ÉGALE
= rafraîchissement explicite et valide de la provenance
```

Exemple :

```text
stream.state            IMPLEMENTED → IMPLEMENTED
affirmation sémantique  inchangée
ancien soutien          ancien blob de l'outil
nouveau soutien         blob nouvellement vérifié
```

Comportement exigé :

```text
remplacer le soutien actif du sujet exact + champ exact
par la ou les relations nouvellement fournies

la valeur reste inchangée
```

Ce cas ne doit **pas** être traité comme une opération vide lorsque la
provenance diffère. Une valeur identique avec une provenance nouvelle est un
acte réel : c'est la seule façon d'affirmer « je l'ai revérifié contre la source
d'aujourd'hui ».

## 8. Le détecteur de dérive est préservé

Rien ici n'affaiblit la détection.

```text
observed_blob enregistré
!= identité de contenu courante
→ SOURCE_CHANGED
```

et cela reste vrai jusqu'à ce qu'un rafraîchissement autorisé ait lieu. Après un
rafraîchissement valide à valeur égale contre la nouvelle source :

```text
nouveau observed_blob enregistré
= identité de contenu courante

ancien soutien périmé
= n'est plus actif
```

La leçon est :

```text
DÉTECTER LA DÉRIVE      → CONSERVER
RAFRAÎCHIR UNE PROVENANCE VÉRIFIÉE → AJOUTER
```

et non :

```text
DÉTECTER MOINS
```

## 9. Quarantaine de l'état sale

L'implémentation de l'amendement 001 et le point de reprise portant la décision
réelle restent sur disque, non commités, non modifiés.

```text
PROGRAM-STATE.json                             AUCUN CHANGEMENT D'OCTET
tooling/program-state/program-state.mjs        AUCUN CHANGEMENT D'OCTET
tooling/program-state/tests/program-state.test.mjs   AUCUN CHANGEMENT D'OCTET
```

La décision nouvellement créée n'est pas retirée, `next_action` n'est pas
avancé, et les octets NUL ne sont pas réparés. La quarantaine préserve la
mesure : c'est l'état exact dans lequel les constats 002 et 003 ont été
produits.

## 10. Ce que l'amendement 002 ne touche pas

```text
COMMANDES EXPOSÉES
= resume / check / update
= INCHANGÉES

NOUVELLE COMMANDE                 = NON
ÉDITEUR DE PREUVES GÉNÉRIQUE      = NON
COMMANDE DE SUPPRESSION DE PREUVE = NON
SÉPARATION ACTIF / HISTORIQUE GÉRÉE PAR L'UTILISATEUR = NON
```

L'amendement étend la sémantique d'`update` **pour le champ mis à jour ou
rafraîchi**, et pour lui seul. Aucune manipulation manuelle arbitraire
d'`evidence[]` n'est autorisée.

L'amendement 001 est préservé exactement :

```text
création explicite d'une décision   = AUTORISÉE
mutation ordinaire d'un id inconnu  = REJET
upsert implicite                    = NON
création de flux                    = TOUJOURS INTERDITE
création générique de collection    = TOUJOURS INTERDITE
```

Les constats 002 et 003 ne démontrent aucun de ces besoins.

La relation typée est inchangée :

```text
supports : subject · field · value

UNE RÉFÉRENCE EXISTE
≠ L'AFFIRMATION EST ÉTABLIE
```

Une relation de remplacement doit correspondre exactement à l'affirmation
résultante.

Le modèle d'accessibilité est inchangé :

```text
VERIFIABLE · OPAQUE_BUT_ESTABLISHED · SEALED

UNREACHABLE
= issue de vérification courante
≠ politique permanente
≠ fausseté historique
```

## 11. Atomicité

Supersession et rafraîchissement suivent le principe déjà gelé :

```text
construire le candidat complet en mémoire
retirer, dans le candidat seul, le soutien actif du sujet + champ visés
insérer le ou les soutiens de remplacement
valider le candidat ENTIER
sérialiser canoniquement
remplacer atomiquement
```

```text
si la validation ou le remplacement échoue
→ octets du point de reprise = INCHANGÉS
```

Aucun point de reprise intermédiaire, non soutenu ou contradictoire, ne peut
être persisté.

## 12. Amendement 001 : ce que 41 / 41 établit, et ce qu'il n'établit pas

```text
IMPLÉMENTATION EN QUARANTAINE DE L'AMENDEMENT 001
= techniquement qualifiée 41 / 41
= POUR CES OCTETS EXACTS
```

```text
41 / 41
≠ qualification finale des octets futurs
```

L'implémentation future exigera **une** nouvelle qualification formelle, après
que toutes les modifications de l'amendement 002 et la réparation d'hygiène
soient finales.

## 13. Constat d'hygiène — octets NUL littéraux

Enregistré séparément de la sémantique de l'amendement 002.

```text
CONSTAT D'HYGIÈNE D'IMPLÉMENTATION
= 5 octets U+0000 littéraux dans la source program-state.mjs

CONSTAT DE CONCEPTION
= NON
```

Le comportement est correct et cohérent avec lui-même — le séparateur est le
même à l'écriture et à la lecture — mais la source se lit comme un binaire pour
`grep` et pour les éditeurs.

Réparation future autorisée :

```text
remplacer les caractères NUL littéraux de la source
par une représentation d'échappement JavaScript textuelle, par exemple
l'échappement unicode à quatre chiffres,
en préservant exactement la sémantique de séparateur à l'exécution
```

Propriétés futures exigées :

```text
octets NUL littéraux dans la source           = 0
sémantique du séparateur de clé à l'exécution = INCHANGÉE
comportement                                  = couvert par régression
```

Cette réparation n'est pas faite dans la mission documentaire.

## 14. Qualification future de l'amendement 002

Couverture ciblée minimale, prédéclarée :

```text
mise à jour substantielle ANCIEN → NOUVEAU
  → ancien soutien du sujet + champ exacts retiré
  → nouveau soutien actif
  → aucune contradiction

mise à jour à valeur égale avec provenance nouvelle
  → acceptée
  → ancien soutien retiré
  → nouveau soutien actif

soutien d'un autre champ du même sujet        → préservé
soutien d'un autre sujet                      → préservé

preuve de remplacement invalide               → point de reprise inchangé
échec de validation du candidat entier        → point de reprise inchangé

SOURCE_CHANGED avant rafraîchissement         → matériel
rafraîchissement valide à valeur égale        → SOURCE_CHANGED résolu

mutation ordinaire d'un id inconnu            → rejette toujours
création explicite d'une décision             → fonctionne toujours
création de flux                              → toujours indisponible

octets NUL littéraux dans la source           → 0 après réparation
comportement du séparateur à l'exécution      → inchangé
```

Tous les tests existants pertinents doivent rester verts.

```text
SUCCÈS DES TESTS UNITAIRES
≠ SUCCÈS DU DOGFOOD
```

## 15. Récupération future de l'état réel

La décision humaine déjà créée **ne doit pas être recréée** : elle existe dans
le point de reprise en quarantaine.

Séquence future, après implémentation et qualification finale :

```text
1.  CONSERVER la décision d'exception procédurale déjà présente

2.  rafraîchissement à valeur égale :
      stream:tooling-experiment-001
      state IMPLEMENTED → IMPLEMENTED
      avec une preuve portant le blob final de l'outil amendé

3.  avancer :
      next_action.value ANCIEN → NOUVEAU
      sous la sémantique de supersession

4.  exécuter un seul check réel
```

Nouvelle action suivante attendue, en substance :

```text
maintenir PROGRAM-STATE.json à travers des transitions réelles du Lab, selon le
protocole de dogfood gelé, jusqu'à une interruption réelle précédant la reprise
en contexte frais
```

Rien de tout cela n'est exécuté maintenant.

## 16. Chronologie du dogfood

```text
implémentation v0
→ première transition réelle
→ refus de création de décision
→ CONSTAT 001
→ AMENDEMENT 001
→ implémentation de l'amendement 001
→ création réelle de la décision, réussie
→ CONSTATS 002 et 003
→ AMENDEMENT 002
→ implémentation amendée, à venir
→ récupération de l'état courant, à venir
```

```text
MAINTENANCE NORMALE DU DOGFOOD
= PAS ENCORE OUVERTE

REPRISE EN CONTEXTE FRAIS
= NON EXÉCUTÉE

QUESTION EXPÉRIMENTALE DE REPRISE
= TOUJOURS SANS RÉPONSE
```

Trois constats en trois usages réels. Aucun ne porte encore sur la question
posée : ils portent tous sur la capacité de l'outil à suivre le programme. C'est
un résultat en soi, et il n'est pas celui que l'expérience cherche.

## 17. Ce que ce document ne fait pas

```text
IMPLÉMENTATION            AUCUNE
POINT DE REPRISE MODIFIÉ  NON
TESTS EXÉCUTÉS            0
CHECK RÉEL EXÉCUTÉ        0
DOGFOOD REJOUÉ            0
REPRISE FRAÎCHE           0
RESULT-001                NON CRÉÉ
DOCTRINE DU LAB           NON RÉÉCRITE
EXIGENCE CCR              AUCUNE
```
