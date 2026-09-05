# CASE-002 — Freeze Manifest

Les deux paquets sont figés après préqualification et avant tout run CCR.

```text
FREEZE DATE
= 2026-09-05

PARTICIPANT
= FROZEN

CONTROL
= FROZEN

CCR START
= NOT RUN
```

Après ce gel :

```text
participant changes
= 0

control changes
= 0
```

jusqu'au lancement futur de RUN-001, où seul un workspace frais dérivé de `participant/` sera
confié à CCR. Le `control/` original restera aveugle pendant le travail principal.

## Participant pack

```text
   1328  182da288f97ecb68d90a88c00f7a20ea24c1f65bc4ab98f1ae6e69658f72dc59  participant/MISSION.md
   3763  ec0539ecce9069f5ce0597ca995974816b39c0561a0a37c997b1d0f390658bf5  participant/SPEC.md
    342  3ddfd5c65dcbc8ba2f84e3759fe8822805b7a502d951d195bc93fb8e5ec5b20e  participant/package.json
   2074  6f4b3564b9d5ed86263fad0c813415ebbc6f6ae3428672883dad7ec61d7534fa  participant/src/config-overlay.ts
   1662  f32a5a8830cf0848efaca5d8ec3972dc61d835e136c5f83c6f4193ce5c4e252e  participant/tests/visible.test.mjs
    339  67f7b97738e0eaece2691fe8963d9df6420fda53bcf5facf5813c38c15322082  participant/tsconfig.json

PARTICIPANT AGGREGATE
= 501ab89352b7955e5e34cd9a2e608d3269ba203b89839d687c1f1a49d52cf5e1
```

Le paquet ne contient ni `dist/`, ni `node_modules/`, ni lockfile : la construction est
effectuée par le run, dans son propre workspace.

## Control pack

```text
   1645  27b09655dbaf4d5ef160d96de0023784db1fbe5a920f6e2207e70f7572b5a9f9  control/README.md
   3620  262e08265a7094a3c6ef07b6fced1657b500163ada1a963cb499f6ac9ad91ac3  control/TRUTH-MATRIX.md
    203  a69cee1b72a70513a90ab23c7236e34c2fd78e291970ded32f2955ec4c387c88  control/candidate-holdout.test.mjs
   5206  c39f99425481e0c684cf8b4982cfa28a4e9c691c6752f4839642d7fe41a881b6  control/holdout-suite.mjs
   1524  573a90a900851a1cbb4bb4c7799fa216ba460daf851bffa68e01e9b4d14e449e  control/reference-engine.mjs
    206  db5d9ee4722a4a11ae2713812fef3acdc51524d20b97462841600d777876f4f7  control/reference-holdout.test.mjs
   1894  27b9b5ee72b5a5b65e5a8ed4df19f6063109f0608c9fa0a021c12fb66848ccbd  control/reference-visible.test.mjs

CONTROL AGGREGATE
= cc12dac40148816efac98a4cbbdc4b3915e0ba2f41887e9de3edfb107191df25
```

## Empreinte agrégée

Les empreintes agrégées sont le SHA-256 de la liste `sha256sum` des fichiers du paquet, triée
par chemin. Recalcul :

```text
find participant -type f | sort | xargs sha256sum | sha256sum
find control     -type f | sort | xargs sha256sum | sha256sum
```

## Vérification avant RUN-001

Avant le futur `ccr start`, recalculer les deux agrégats et les comparer à ce manifeste. Un
écart signifie qu'un paquet a bougé depuis le gel et invalide la préqualification enregistrée
dans `PREQUALIFICATION.md`.
