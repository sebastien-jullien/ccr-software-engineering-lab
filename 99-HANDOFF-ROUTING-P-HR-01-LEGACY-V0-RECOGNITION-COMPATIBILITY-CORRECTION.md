# Handoff / routage — correction de compatibilité de P-HR-01 : reconnaissance du Mission Object V0 historique

```text
CE DOCUMENT MATÉRIALISE
= UNE CORRECTION SÉMANTIQUE NOUVELLE, RATIFIÉE PAR L'HUMAIN :
  C-1 RAFFINÉE — RECONNAISSANCE DU MISSION OBJECT V0 HISTORIQUE

IL CORRIGE
= LA SEULE RÈGLE DE DISCRIMINATION DE REPRÉSENTATION DE L'AUTORITÉ 98,
  POUR LE V0 HISTORIQUE

IL NE CHANGE AUCUNE AUTRE SÉMANTIQUE DE P-HR-01

IL N'EST PAS LE GEL DE LA TRANSACTION D'IMPLÉMENTATION
IL N'IMPLÉMENTE RIEN
IL NE CRÉE PAS DE MISSION 022
```

## 1. Statut et lignée

```text
AUTORITÉ 98
= 98-HANDOFF-ROUTING-P-HR-01-FINAL-NORMATIVE-SPECIFICATION-READINESS-AND-BOUNDED-IMPLEMENTATION-AUTHORIZATION.md
  blob   fe4be140f6a90e84d25f14119889b7642989f1d7
  sha256 79c68ba8354376ca52d7ab818577ccd83c82542c81b184657652537c89479b3b
= GOUVERNANTE · NON ÉDITÉE
= CORRIGÉE PAR LE PRÉSENT DOCUMENT SUR SA SEULE RÈGLE DE DISCRIMINATION
  DE REPRÉSENTATION POUR LE V0 HISTORIQUE

DÉCISIONS DE PROGRAMME AVANT MATÉRIALISATION
= 72 RATIFIÉES / 0 EN ATTENTE

MISSION 022                   AUCUNE
AGENT CCR LAB #64             NON ALLOUÉ
IMPLÉMENTATION DE P-HR-01     ABSENTE
```

## 2. Blocage découvert

L'inspection du code, au début de la transaction d'implémentation autorisée
par l'autorité 98, a établi, au HEAD 6c3c0aa73d7b3a9aa9dfd49fad755adac7bf4ea7 :

```text
AUTORITÉ 98 § 8
  REPRESENTATION VERSION IS DETERMINED ONLY BY representation.authority
  V0 iff authority identity = exact Mission Object V0 authority identity
  NO INFERENCE FROM field presence … caller context
  UNKNOWN REPRESENTATION AUTHORITY → REJECT

AUTORITÉ 98 § 9
  V1-capable tooling receives V0 → ACCEPT AS V0
```

```text
MISSION OBJECTS COMMIS PORTANT UN MEMBRE representation     0 SUR 28
SCHÉMA MISSION OBJECT V0                                     CLOS
  tooling/mission-object/mission-object.mjs  ROOT_ELEMENTS : 16 éléments,
  representation n'en fait pas partie
  tooling/mission-object/validate.mjs         « élément de premier niveau
  inconnu : le schéma est clos »
AUTORITÉ 14                                  AUCUNE AUTO-IDENTIFICATION
                                             DE L'OBJET DE MISSION
representation.authority                     PRÉSENT SEULEMENT DANS
                                             RESULT INSTANCE V0 (AUTORITÉ 23)
```

Un Mission Object V0 existant ne porte donc aucun representation.authority :
l'autorité 98 ne gouvernait pas sa classification. Le choix exigé était un choix
sémantique matériel nouveau, non gouverné par l'autorité 98. L'arrêt a été levé
avant toute mutation du dépôt.

```text
ARRÊT D'IMPLÉMENTATION
= CORRECTEMENT LEVÉ SUR UNE LACUNE DE COMPATIBILITÉ RÉELLE
```

## 3. Sélection humaine

```text
SELECTED
= C-1 REFINED

C-1 REFINED   SELECTED
C-2           missing representation → reject all               NOT SELECTED
C-3           rewrite V0 with embedded authority                NOT SELECTED
C-4           caller / context decides                          NOT SELECTED

GLOBAL OPTION EXHAUSTIVENESS
= NOT CLAIMED
```

La décision ne résout que le blocage de compatibilité concret découvert lors de
l'inspection d'implémentation.

## 4. Autorité V0 historique épinglée

```text
MISSION OBJECT V0 HISTORICAL AUTHORITY — PINNED
  REPO_PATH   14-TOOLING-EXPERIMENT-002-MISSION-OBJECT-V0.md
  GIT_BLOB    7d634c855ab9de8c66a21c134b03de8f118c3de4
  SHA256      3db7c7298a4fc1109a99ac832770899d3fbb74a38acb14253f1fe7f578581912
  octets      35435 · CR 0
  établie mécaniquement au HEAD canonique inchangé
  6c3c0aa73d7b3a9aa9dfd49fad755adac7bf4ea7 ; inchangée depuis sa création
  (commit 89bc9c7)
```

Cette identité est une valeur factuelle du dépôt, non un choix sémantique.
L'autorité 14 n'est pas modifiée. Aucune autorité de remplacement n'est
inventée.

Fait consigné, non normatif : l'implémentation de validation V0 existante du
dépôt est tooling/mission-object/validate.mjs, blob
8dd06a2a1a2b7869f11456cf6a809dfad69f1a79, inchangée depuis le commit ad74ed8.

## 5. Règle de reconnaissance du V0 historique

```text
LEGACY MISSION OBJECT V0
IFF ALL ARE TRUE:

1. representation
   = ABSENT
AND
2. the exact Mission Object bytes validate under
   the ONE PINNED HISTORICAL Mission Object V0
   schema / normative authority
AND
3. no V1-only field is present,
   including:
   handoff_contract

Then and only then:
REPRESENTATION
= LEGACY V0
```

```text
CECI EST UNE RÈGLE EXPLICITE DE COMPATIBILITÉ PRODUIT
CE N'EST PAS UNE DEVINETTE DE SCHÉMA PAR L'IMPLÉMENTEUR
```

## 6. Reconnaissance du Mission Object V1

```text
MISSION OBJECT V1
IFF:
representation.authority
= EXACT SUPPORTED MISSION OBJECT V1 AUTHORITY IDENTITY

AUTHORITY IDENTITY
= REPO_PATH + GIT_BLOB

V1 RECOGNITION DOES NOT FALL BACK TO LEGACY VALIDATION
```

## 7. Table de discrimination complète

```text
CASE A   representation ABSENT
         + exact legacy V0 validation PASS
         + no V1-only field
         → LEGACY V0
         → ACCEPT UNDER V0 SEMANTICS

CASE B   representation ABSENT
         + legacy V0 validation FAIL
         → REJECT

CASE C   representation ABSENT
         + any V1-only field present
         → REJECT

CASE D   representation PRESENT
         + representation.authority exactly matches supported V1 authority
         → V1
         → apply V1 semantics

CASE E   representation PRESENT
         + authority unknown / mismatched / unsupported
         → REJECT

CASE F   representation PRESENT
         + attempts to identify V0
         → REJECT
```

```text
LEGACY V0
= IDENTIFIÉ DE L'EXTÉRIEUR PAR L'AUTORITÉ HISTORIQUE ÉPINGLÉE

V1
= AUTO-IDENTIFIÉ PAR SON representation.authority EMBARQUÉ

UNKNOWN / AMBIGUOUS
= REJECT
```

## 8. La reconnaissance du V0 historique n'est pas une devinette de schéma

```text
LEGACY-V0 RECOGNITION
≠ SCHEMA GUESSING
```

parce que :

```text
exactly ONE historical schema / authority is pinned
no competing schema is searched
the validator is the exact historical V0 validator semantics
successful exact validation is mandatory
failed validation means REJECT
V1-only fields are forbidden
no automatic upgrade occurs
no caller / context decides representation
```

## 9. Préservation de l'identité historique

```text
V0 HISTORICAL BYTES                              UNCHANGED
HISTORICAL MISSION BLOBS                         UNCHANGED
HISTORICAL RESULT-INSTANCE SOURCE BINDINGS       UNCHANGED
V0 → V1 AUTOMATIC CONVERSION                     FORBIDDEN
V1 → V0 AUTOMATIC CONVERSION                     FORBIDDEN
HISTORICAL MISSION REWRITE                       FORBIDDEN
ADDING representation.authority
TO HISTORICAL V0 OBJECTS                         FORBIDDEN
C-3                                              NOT SELECTED
```

## 10. Relation de supersession à l'autorité 98

L'autorité 98 n'est pas éditée. Elle demeure gouvernante, sauf sa règle de
discrimination de représentation, corrigée ici pour le V0 historique :

```text
ANCIENNE HYPOTHÈSE ABSTRAITE (AUTORITÉ 98 § 8)
= V0 iff embedded representation.authority = V0 authority

SUPERSEDED FOR LEGACY V0 BY
= representation ABSENT
  + exact validation under pinned historical V0 authority
  + no V1-only field
  → LEGACY V0
```

```text
L'INTERDICTION DE L'AUTORITÉ 98 D'INFÉRER LE V0 AUTREMENT QUE PAR
representation.authority EST SUPPLANTÉE SEULEMENT DANS LA MESURE NÉCESSAIRE
À CETTE RÈGLE EXPLICITE DE RECONNAISSANCE DU V0 HISTORIQUE

TOUS LES AUTRES PRINCIPES ANTI-DEVINETTE DEMEURENT
```

Demeurent inchangés, de l'autorité 98 :

```text
P-HR-01 core design
Mission Object V1 direction
field-presence P-HR-01 activation inside V1
all closed value domains
lifecycle profile
event-source model
RESULT_ADMISSION
fail-closed rules
implementation authorization
semantic-widening prohibition
```

## 11. Autorisation d'implémentation

```text
IMPLEMENTATION AUTHORIZATION
= REMAINS ACTIVE AFTER CORRECTION
```

La transaction d'implémentation déjà autorisée reprend sous la présente
correction. Son autorité de gel devient l'autorité 100, l'autorité 99 étant
employée par la présente correction ; aucune autre sémantique de transaction ne
change.

## 12. Ce que ce document ne fait pas

```text
IL NE CHANGE AUCUNE AUTRE SÉMANTIQUE DE P-HR-01
IL N'ÉDITE NI L'AUTORITÉ 98, NI L'AUTORITÉ 14, NI AUCUNE AUTORITÉ ANTÉRIEURE
IL NE MODIFIE AUCUN MISSION OBJECT HISTORIQUE
IL N'AJOUTE representation.authority À AUCUN OBJET V0
IL N'AUTORISE AUCUNE CONVERSION AUTOMATIQUE V0 → V1 NI V1 → V0
IL N'AUTORISE AUCUNE DISCRIMINATION PAR L'APPELANT OU LE CONTEXTE
IL N'AUTORISE AUCUNE DEVINETTE DE SCHÉMA GÉNÉRIQUE
IL NE GÈLE PAS LA TRANSACTION D'IMPLÉMENTATION
IL NE CRÉE PAS DE MISSION 022 ET N'ALLOUE PAS L'AGENT CCR LAB #64
IL N'IMPLÉMENTE RIEN ET NE MODIFIE AUCUNE AIRE D'OUTILLAGE
```

## 13. État matérialisé

```text
AUTORITÉ 99                                  CORRECTION SÉMANTIQUE HUMAINE RATIFIÉE ·
                                             GOUVERNANTE
BLOCAGE DE COMPATIBILITÉ                     RÉSOLU
SÉLECTION HUMAINE                            C-1 REFINED
C-2 / C-3 / C-4                              NOT SELECTED
EXHAUSTIVITÉ GLOBALE DES OPTIONS             NOT CLAIMED

V0 HISTORIQUE                                representation ABSENT
                                             + VALIDATION EXACTE SOUS L'AUTORITÉ 14
                                               ÉPINGLÉE, blob 7d634c85…
                                             + AUCUN CHAMP PROPRE À V1
V1                                           representation.authority EMBARQUÉ,
                                             IDENTITÉ V1 SUPPORTÉE EXACTE
INCONNU / AMBIGU                             REJECT

OCTETS V0 HISTORIQUES                        INCHANGÉS
CONVERSION AUTOMATIQUE                       INTERDITE DANS LES DEUX SENS

AUTORITÉ 98                                  GOUVERNANTE, SAUF SA RÈGLE DE
                                             DISCRIMINATION POUR LE V0 HISTORIQUE
AUTORISATION D'IMPLÉMENTATION                ACTIVE

NOUVELLE DÉCISION HUMAINE                    1
DÉCISIONS RATIFIÉES / EN ATTENTE             73 / 0

AUTORITÉS RACINE NUMÉROTÉES                  99 · 00..99 SANS 18
AIRES D'OUTILLAGE                            4

SUIVANT
= REPRENDRE LA TRANSACTION D'IMPLÉMENTATION DE P-HR-01 DÉJÀ AUTORISÉE,
  SOUS LA CORRECTION C-1 RAFFINÉE, SANS NOUVELLE PORTE HUMAINE
  NI NOUVELLE ÉTUDE DE CONCEPTION
```
