# Mission participant — CASE-002

Un moteur d'overlay de configuration existant présente un défaut de comportement rapporté.

Diagnostiquer la cause, produire la plus petite réparation justifiée, préserver l'ensemble du
comportement documenté par [`SPEC.md`](SPEC.md), et fournir des preuves reproductibles du
changement.

## Contraintes

- Ne pas réécrire le composant sans nécessité.
- Ne pas modifier `SPEC.md`.
- Ne pas modifier les tests visibles fournis.
- Ne pas ajouter de dépendance runtime.
- Ne pas ajouter de persistance, réseau ou interface utilisateur.
- Conserver l'API publique spécifiée.
- Ne signaler un défaut supplémentaire que s'il est démontré.
- Signaler explicitement toute ambiguïté réelle au lieu de l'inventer ou de la résoudre
  silencieusement.

## Travail attendu

1. lire la spécification ;
2. inspecter l'implémentation existante et les tests visibles ;
3. diagnostiquer la cause du défaut rapporté ;
4. appliquer la réparation minimale justifiée ;
5. produire les preuves locales jugées nécessaires ;
6. rapporter précisément :
   - fichiers modifiés ;
   - cause identifiée ;
   - portée réelle de la réparation ;
   - vérifications exécutées ;
   - limites ou inconnues restantes.

Le dossier de contrôle n'est pas disponible pendant cette mission.
