# Module Commande & Livraison (marque blanche)

Module **isolé et optionnel** : le site fonctionne normalement s'il n'est pas
configuré. Rien dans le cœur du projet n'en dépend.

Technique sous-jacente : **Uber Direct** (réseau de coursiers en marque blanche).
> Ce nom reste **interne** : il n'apparaît **jamais** dans le texte visible du
> site public. Côté commerçant/marketing, on parle de « livraison de proximité,
> sans commission de plateforme ».

## Deux modes — `DELIVERY_MODE`

| Valeur              | Comportement                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `demo` (par défaut) | Données factices locales, instantanées. Aucun appel réseau externe. |
| `live`              | Vrai client Uber Direct (nécessite des credentials).                |

Si `DELIVERY_MODE` est **absent**, le module se comporte comme en `demo`
(fallback sans erreur).

## Passer en mode `live` — prérequis

⚠️ **K1000 Studio ne peut pas activer le mode live unilatéralement.** Le passage
en `live` suppose que **le commerçant lui-même** a validé son inscription
Uber Direct :

1. Remplir le **formulaire d'intake** Uber Direct.
2. **Onboarding** avec un compte manager Uber (validation du commerce, zone de
   livraison, moyens de paiement).
3. Récupérer les credentials de l'espace développeur.

Tant que ces étapes ne sont pas faites, on reste en `demo`.

## Configuration (mode live)

Créer un fichier **`.env.local`** (jamais commité — déjà couvert par
`.gitignore`) :

```bash
DELIVERY_MODE=live
UBER_DIRECT_CUSTOMER_ID=...      # fourni par Uber
UBER_DIRECT_CLIENT_ID=...
UBER_DIRECT_CLIENT_SECRET=...
```

Voir `.env.example` pour le gabarit (sans valeurs réelles).

## Architecture

```
lib/delivery/
  types.ts               Types partagés + interface DeliveryProvider
  mock-provider.ts       Mode démo (statut qui évolue tout seul, sans réseau)
  uber-direct-client.ts  Mode live (auth OAuth2 + quote/create/status)
  index.ts               Sélection du fournisseur selon DELIVERY_MODE
app/api/delivery/
  quote/route.ts         POST — devis (coût + délai)
  create/route.ts        POST — création de course
  status/route.ts        GET  — suivi de statut
app/api/webhooks/
  uber-direct/route.ts   POST — réception des maj de statut (inactif en démo)
components/delivery/
  DeliveryOptionSelector  Choix retrait / livraison + devis
  DeliveryTracker         Timeline Préparation → Coursier → Livré
app/demo/livraison/       Page sandbox de démonstration (non reliée à la nav)
```

## Fonctionnalités

1. **Devis** (`getQuote`) — coût et délai estimés à partir des deux adresses.
2. **Création** (`createDelivery`) — déclenchée après validation de la commande.
3. **Suivi** (`getStatus`) — timeline temps réel + ETA.
4. **Webhooks** — endpoint `/api/webhooks/uber-direct` prêt (à sécuriser par
   vérification de signature HMAC en live ; inactif en démo).

## Démo locale

`DELIVERY_MODE` non défini (ou `demo`) → ouvrir **`/demo/livraison`**. Le statut
passe de « En préparation » à « Livré » en ~20 s, sans aucune vraie course.

## Sécurité

- Aucune credential n'est codée en dur : tout vient de l'environnement.
- Les clés ne sont lues que côté serveur (routes API), jamais exposées au client.
- En `live`, si les credentials manquent, le module renvoie une erreur claire —
  il ne casse jamais le reste du site.
