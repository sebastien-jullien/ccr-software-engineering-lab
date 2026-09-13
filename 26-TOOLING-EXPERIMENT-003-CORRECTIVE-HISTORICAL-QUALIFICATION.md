# TOOLING-EXPERIMENT-003 — qualification historique corrective

## 1. Statut et autorité

```text
TYPE
= correction de qualification, ratifiée par l'humain

EXPÉRIENCE
= TOOLING-EXPERIMENT-003

CE DOCUMENT
= autorité de qualification corrective, COURANTE
= GELÉ

AUTORITÉ SÉMANTIQUE
= 23-…-RESULT-INSTANCE-V0.md
= blob 1676b3de4546b40a801d0a400b4c47ddd9b82062
= INCHANGÉE

AUTORITÉ DE DESIGN D'IMPLÉMENTATION
= 24-…-IMPLEMENTATION-DESIGN.md
= blob 9efe619e2872ed275d73897ff6444d90ef1b03d7
= INCHANGÉE

AUTORITÉ DE QUALIFICATION ANTÉRIEURE
= 25-…-IMPLEMENTATION-QUALIFICATION.md
= blob 0c71fb0c5810a272535f0fb64a769880529244da
= PRÉSERVÉE / SUPERSÉDÉE EN PORTÉE EXACTE

TE003
= OUVERTE
= NON CONCLUE

PREMIÈRE TÂCHE DE DOGFOOD RÉELLE
= NON SÉLECTIONNÉE
```

Ce document corrige une revendication, pas une conception. Rien du logiciel
n'y change.

## 2. La décision humaine

```text
DESIGN SÉMANTIQUE — AUTORITÉ 23
= INCHANGÉ

CŒUR DU DESIGN D'IMPLÉMENTATION — AUTORITÉ 24
= INCHANGÉ

IMPLÉMENTATION D'EXÉCUTION
= AUCUN DÉFAUT DE CONCEPTION DÉMONTRÉ
= INCHANGÉE

ANCIENNE QUALIFICATION HISTORIQUE
= DÉFECTUEUSE
```

## 3. Le recensement complet

```text
ENTRÉES SYNTHÉTIQUES RECENSÉES
= 49

SÉMANTIQUES DE RETOUR HISTORIQUES SOUTENUES
= 3

NON-PRODUCTIONS STRUCTURELLES HISTORIQUES SOUTENUES
= 0

ENTRÉES NON SOUTENUES COMME SÉMANTIQUE DE RETOUR
= 46
```

Répartition par cas :

```text
A  DOGFOOD-001     12 entrées   1 soutenue    11 non soutenues
B  DOGFOOD-002     12 entrées   2 soutenues   10 non soutenues
C  DOGFOOD-003     13 entrées   0 soutenue    13 non soutenues
D  TE001 PHASE D   12 entrées   0 soutenue    12 non soutenues
```

Classes de la preuve non soutenante :

```text
VALEUR PRÉDÉTERMINÉE                       10
FAIT D'EXÉCUTION SEULEMENT                 27
VÉRIFICATION POSTÉRIEURE SEULEMENT          2
SILENCE / ABSENCE SEULEMENT                  1
MIXTE / INSUFFISANT                          6
```

## 4. Les trois sémantiques survivantes

```text
A / DOGFOOD-001 / rf-outcome
= BLOCKED
= autorité 15, section 3, ligne 69
= « RÉSULTAT TERMINAL RETOURNÉ PAR #15 »

B / DOGFOOD-002 / rf-push-realized
= NO
= autorité 17, section 3, ligne 87
= « tel que retourné par l'instance de mission »

B / DOGFOOD-002 / rf-remote-main-head
= NOT_MEASURED
= autorité 17, section 3
= « VALEUR DE RETOUR DU DISTANT »
```

La troisième repose sur la formule « valeur de retour », qui désigne la valeur
retournée. C'est une lecture idiomatique, et l'humain l'a explicitement
ratifiée comme suffisante. Ce point n'est pas rouvert. La section 6 de
l'autorité 17 la reprend (« Le retour NOT_MEASURED ») sans l'établir autrement.

```text
push.realized = NO
= PRÉSERVÉ TEL QUE RAPPORTÉ
```

DF002-01 a établi plus tard que cette valeur était sémantiquement fausse. Elle
n'est pas corrigée, et c'est exactement le sens de la couche : une instance
conserve ce qui a été rapporté, pas ce qui aurait dû l'être.

## 5. La cause du défaut

Les quatre autorités du corpus déclarent leur registre factuel dans des termes
équivalents, et aucune ne parle de retour :

```text
autorité 15 section 1   FAITS OBSERVÉS DE L'EXÉCUTION
                        = ce que L'EXÉCUTION a produit

autorité 17 section 1   même formulation

autorité 19 section 1   même formulation

RESULT-001 sections 1–2 FAITS BRUTS DE L'ESSAI
                        = consignés tels que L'ESSAI les a produits
```

Les trois autorités de dogfood ajoutent que le transcript brut de l'exécutant
n'est pas un artefact durable du dépôt.

```text
ATTRIBUTION DE NIVEAU SECTION
= AUCUNE
```

Preuve interne du mélange : l'autorité 17 marque UNE seule ligne « tel que
retourné par l'instance de mission ». Ce marqueur serait redondant si la
section entière était un groupe retourné ; sa présence prouve qu'elle ne l'est
pas.

La construction fautive consistait à traiter un registre de faits d'exécution
comme une transcription de retour. C'est une erreur de provenance, pas une
erreur de modèle.

## 6. Ce que le corpus n'établit pas

```text
DOGFOOD-003 — PROVENANCE DE RETOUR HISTORIQUE
= NON ÉTABLIE
= l'autorité 19 ne contient AUCUNE attribution de retour, nulle part

TE001 PHASE D — PROVENANCE DE RETOUR HISTORIQUE
= NON ÉTABLIE
= RESULT-001 n'attribue aucune ligne de sa section 2 à un retour de la
  session ; ses réponses (section 3) sont celles du jeu de questions

REPRÉSENTABILITÉ HISTORIQUE ADOSSÉE À UN PROTOCOLE
= NON ÉTABLIE

NON-PRODUCTION STRUCTURELLE HISTORIQUE
= NON ÉTABLIE
= 0 occurrence dans le corpus
```

```text
FAIT BRUT DE L'ESSAI
≠ FAIT ATTRIBUÉ COMME RETOURNÉ PAR LA SESSION DE PHASE D
```

L'absence de non-production historique ne remet en cause aucune exigence des
autorités 23 et 24. La capacité reste requise, et elle reste éprouvée par des
objets purement synthétiques.

## 7. Artefacts corrigés

```text
tooling/result-instance/representability/a.json
= 1 entrée · rf-outcome = BLOCKED

tooling/result-instance/representability/b.json
= 2 entrées · rf-push-realized = NO · rf-remote-main-head = NOT_MEASURED

tooling/result-instance/representability/c.json
= SUPPRIMÉ

tooling/result-instance/representability/d.json
= SUPPRIMÉ

tooling/result-instance/tests/provenance-manifest.json
= 3 éléments, tous en attribution ITEM_EXPLICIT

tooling/result-instance/tests/result-instance.test.mjs
= section historique corrigée · couverture structurelle synthétique ajoutée
```

```text
VALEUR DEVINÉE POUR REMPLACER UNE ENTRÉE RETIRÉE
= AUCUNE

INSTANCE DE RÉSULTAT VIDE
= AUCUNE

CAS CONSERVÉ POUR PRÉSERVER UN COMPTE DE FICHIERS
= AUCUN
```

## 8. Couverture structurelle préservée

Retirer C et D ne retire aucune capacité éprouvée. Ce que ces fixtures
exerçaient à tort au nom de l'histoire est désormais exercé par des objets
explicitement fabriqués :

```text
instance adossée à un protocole            objet synthétique dédié
identité de fait portée par l'exécutant    objets synthétiques
identité définie par le protocole          objet synthétique
non-production structurelle                objet synthétique
réalisation réussie adossée au contrat     objet synthétique
rapporté n'est pas vrai                    objets synthétiques
états de domaine et types clos             objets synthétiques
pare-feu de qualification                  objets synthétiques
```

```text
OBJET SYNTHÉTIQUE ÉTIQUETÉ « RETOUR HISTORIQUE »
= AUCUN
= un test vérifie qu'aucun objet fabriqué ne porte un identifiant
  « representability- »
```

```text
TEST STRUCTUREL SYNTHÉTIQUE
= AUTORISÉ

REVENDICATION HISTORIQUE SYNTHÉTIQUE
= INTERDITE
```

## 9. Autorité 25 — préservée, supersédée en portée exacte

```text
25-…-IMPLEMENTATION-QUALIFICATION.md
= NON MODIFIÉE
= blob 0c71fb0c5810a272535f0fb64a769880529244da
= record durable de ce qui a été fait à ce moment-là
```

Faits qu'elle établit et qui restent vrais :

```text
identités d'artefacts d'implémentation d'origine
5 runs de développement
un seul run formel d'origine
67 / 67 PASS, sur les octets d'alors
l'écart de conformité trouvé et corrigé avant le gel
conformité structurelle du logiciel d'exécution
résultat du pare-feu de qualification
distinction rapporté / vrai
CAPTURE EN USAGE RÉEL = PAS ENCORE ÉPROUVÉE
RECONSTRUCTION DEPUIS UN TRANSCRIPT = 0
```

Supersédée, et seulement là :

```text
« A · B · C · D = PASS » comme revendication de provenance historique
« le modèle représente toutes les sémantiques factuelles durablement
  démontrées par A/B/C/D »
les descriptions par cas attribuant à un exécutant des faits rapportés
  pour A, C et D
la conclusion « QUALIFIÉE POUR LA REPRÉSENTABILITÉ HISTORIQUE » dans sa
  portée d'alors
```

```text
67 / 67
= FAIT HISTORIQUE PRÉSERVÉ
≠ PREUVE QUE L'ANCIENNE PROVENANCE ÉTAIT JUSTE
```

Aucun test d'alors ne vérifiait la provenance de la reportedness, et
l'autorité 25 le disait déjà à sa section 13 : cette fidélité n'est pas
mécanisable. La contrainte de revue était juste ; c'est la revue qui ne l'avait
pas été.

## 10. Autorité 24 — porte supersédée en portée exacte

```text
24-…-IMPLEMENTATION-DESIGN.md
= NON MODIFIÉE
= cœur sémantique et cœur d'implémentation INCHANGÉS
```

Supersédée uniquement en ceci : sa porte d'usage réel exigeait une
qualification de représentabilité historique positive sur A/B/C/D. Porte de
remplacement :

```text
le logiciel d'exécution est conforme aux autorités 23 et 24
les artefacts de qualification corrigés sont véridiques
les sémantiques de retour historiquement soutenues sont fidèlement représentées
aucune reportedness historique non soutenue n'est revendiquée
les tests passent
aucune reconstruction depuis un transcript n'est employée
aucune sémantique de qualification n'entre dans Result Instance
la capture en usage réel reste non revendiquée
```

C'est une correction de la preuve de qualification, pas une refonte.

## 11. Logiciel d'exécution inchangé

```text
tooling/result-instance/result-instance.mjs
= 644ca8baa035392d22a5787c85f421123f231935
= INCHANGÉ

tooling/result-instance/validate.mjs
= 485be3b5a8f3e5fefa4b9672035ecf8da4e89de6
= INCHANGÉ

.gitattributes
= a939da0c08a22f4612b4c046b78ed0deb98420a5
= INCHANGÉ
```

```text
VALIDATION AFFAIBLIE POUR FAIRE PASSER DES FIXTURES RÉDUITES
= AUCUNE
```

## 12. Qualification formelle corrective

```text
COMMANDE
= node --test tooling/result-instance/tests/result-instance.test.mjs

RUNS FORMELS CORRECTIFS
= 1

exit      = 0
tests     = 71
pass      = 71
fail      = 0
skip      = 0
todo      = 0
duration  = 258.7272 ms
```

```text
RUNS DE DÉVELOPPEMENT
= 1
= node --test tooling/result-instance/tests/result-instance.test.mjs

ÉDITIONS APRÈS LE GEL CORRECTIF
= 0
```

Ce que la suite corrigée établit mécaniquement :

```text
A valide avec exactement 1 sémantique de retour historique
B valide avec exactement 2
la valeur NO est préservée, et le domaine contenait NOT_ATTEMPTED
aucun cas historique pour DOGFOOD-003 ni pour la phase D
le manifeste couvre exactement les 3 éléments, sans trace orpheline
chaque élément tracé porte une attribution ITEM_EXPLICIT
non-productions structurelles historiques = 0
aucun objet fabriqué ne porte un identifiant de représentabilité
```

## 13. Conclusion bornée corrigée

```text
RESULT INSTANCE v0
= STRUCTURELLEMENT QUALIFIÉE

QUALIFICATION DE PROVENANCE DE RETOUR HISTORIQUE
= POSITIVE MAIS ÉTROITE
= 3 sémantiques soutenues
= 2 exécutions adossées à Mission Object

PROVENANCE DE RETOUR HISTORIQUE ADOSSÉE À UN PROTOCOLE
= NON ÉTABLIE

NON-PRODUCTION STRUCTURELLE HISTORIQUE
= NON ÉTABLIE

CAPTURE PAR UN EXÉCUTANT EN USAGE RÉEL
= PAS ENCORE ÉPROUVÉE
```

```text
TOOLING-EXPERIMENT-003
= OUVERTE
= NON RÉUSSIE
= NON ÉCHOUÉE
```

Un mot sur ce que cet épisode montre, et qui n'est pas promu en constat : pour
quatre exécutions réelles, le dépôt conserve trois attributions de retour. La
correction affaiblit la qualification rétrospective et mesure une seconde fois,
par un autre chemin, la prémisse même de l'expérience.

## 14. Ce que ce document ne fait pas

```text
TE003 CONCLUE                             NON
SUCCÈS EXPÉRIMENTAL REVENDIQUÉ            NON
DOGFOOD RÉEL SÉLECTIONNÉ                  NON
README SÉLECTIONNÉ COMME DOGFOOD          NON
OBJET OU ENVELOPPE DE DOGFOOD CRÉÉ        AUCUN
EXÉCUTANT ALLOUÉ                          AUCUN
AUTORITÉ 23 MODIFIÉE                      NON
AUTORITÉ 24 MODIFIÉE                      NON
AUTORITÉ 25 MODIFIÉE                      NON
LOGICIEL D'EXÉCUTION MODIFIÉ              NON
README CORRIGÉ                            NON
RESULT-001 MODIFIÉ                        NON
MISSION OBJECT MODIFIÉ                    NON
HISTOIRE RÉÉCRITE                         NON
```
