# Module Relance avis Google (marque blanche)

Module **isolé et optionnel** : le site fonctionne normalement s'il n'est pas
configuré. Rien dans le cœur du projet n'en dépend.

Principe : quand un client réserve et laisse son email, un email automatique
part quelques heures après l'heure de la réservation pour lui demander un
avis Google — lien direct vers la fenêtre de notation du commerce, jamais
générique.

## ⚠️ Règle de conformité — ne jamais contourner

**Le même email, avec le même unique bouton vers Google, part pour TOUS les
clients ayant réservé.** Jamais de question de satisfaction en amont pour
orienter les clients mécontents vers un canal privé plutôt que Google —
c'est du *review gating*, interdit par les conditions d'utilisation de
Google et risqué juridiquement. Un seul chemin, pour tout le monde, toujours.
Ce principe est rappelé en commentaire au-dessus du template
(`lib/reviews/templates/review-request.tsx`) : n'y touchez pas.

## Deux réglages indépendants

| Variable            | Valeurs               | Rôle                                                  |
| -------------------- | --------------------- | ------------------------------------------------------ |
| `EMAIL_MODE`         | `demo` (défaut) / `live` | Envoie-t-on un vrai email ?                          |
| `REVIEWS_STORE_MODE` | `memory` (défaut) / `supabase` | Où vivent les jobs planifiés en attendant l'envoi ? |

Absentes → comportement `demo` / `memory`, sans erreur.

## Mode `EMAIL_MODE`

| Valeur              | Comportement                                                        |
| ------------------- | --------------------------------------------------------------------- |
| `demo` (par défaut) | Aucun envoi réel. Log console clair (`[reviews:demo] ...`), statut `simulated`. |
| `live`              | Vrai envoi via **Resend**, appelé en REST brut (`fetch`, pas de SDK — même logique que le client Uber Direct du module livraison). |

## Passer en mode `live` — prérequis

⚠️ **K1000 Studio ne peut pas activer le mode live unilatéralement.** Avant de
basculer `EMAIL_MODE=live` :

1. Créer un compte [Resend](https://resend.com) (le commerçant, ou l'agence
   pour son compte).
2. **Vérifier un domaine d'envoi** auprès de Resend (enregistrements DNS
   SPF/DKIM sur le domaine du commerçant, ou un sous-domaine dédié type
   `mail.son-domaine.fr`). Sans domaine vérifié, les emails partiront en
   spam ou seront purement et simplement bloqués par Resend.
3. Récupérer la clé API et l'adresse d'envoi vérifiée.

Cette étape prend en général quelques heures à 48h (propagation DNS) — ce
n'est **pas activable en un clic**, exactement comme l'onboarding Uber Direct
du module livraison.

### Configuration (mode live)

Dans `.env.local` (jamais commité) :

```bash
EMAIL_MODE=live
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL="La Table du Marché <avis@mail.la-table-du-marche.fr>"
```

Voir `.env.example` pour le gabarit complet.

## Mode `REVIEWS_STORE_MODE` — persistance des jobs planifiés

C'est le point le plus important à comprendre avant un vrai déploiement.

| Valeur                | Comportement                                                                 |
| ---------------------- | ------------------------------------------------------------------------------ |
| `memory` (par défaut) | Un tableau en mémoire (process Node). **Parfait en développement local** (`next dev` garde un seul process vivant entre les requêtes). **Ne survit PAS à un déploiement serverless multi-instances** (Vercel prod) : la création de la réservation et le passage du cron peuvent atterrir sur des instances différentes, sans mémoire partagée — les jobs se perdraient. |
| `supabase`            | Vraie persistance (`lib/reviews/supabase-store.ts`, déjà écrit et fonctionnel). **Nécessaire dès qu'on quitte le poste de développement.** |

### Passer en mode `supabase`

1. Créer un projet Supabase, puis la table :

   ```sql
   create table review_jobs (
     id uuid primary key,
     business_id text not null,
     customer_email text not null,
     customer_name text,
     reservation_at timestamptz not null,
     send_at timestamptz not null,
     status text not null default 'scheduled',
     created_at timestamptz not null default now(),
     sent_at timestamptz,
     error text,
     mode text not null,
     unsubscribed boolean not null default false
   );
   create index review_jobs_due_idx on review_jobs (status, send_at);
   ```

2. Dans `.env.local` :

   ```bash
   REVIEWS_STORE_MODE=supabase
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=...   # clé SERVICE ROLE, jamais la clé anon
   ```

3. **Vercel Cron** (voir `vercel.json`, déjà prêt : appelle
   `/api/reviews/run` une fois par jour à 9h). Sur le plan **Hobby**
   gratuit de Vercel, les Cron Jobs sont limités à **une exécution par
   jour** — c'est pour ça que le cron est réglé sur ce rythme, pas plus
   fréquent : un déploiement avec une fréquence supérieure (ex. toutes les
   10 minutes) est **rejeté au déploiement** par Vercel sur ce plan (vécu
   en prod le 14/07 : tous les déploiements bloqués silencieusement tant
   que ce n'était pas corrigé). Conséquence : une relance peut partir avec
   jusqu'à ~24h de décalage par rapport à l'heure exacte prévue — acceptable
   pour un email de relance avis, pas pour un cas nécessitant une précision
   à la minute. Un plan **Pro** est nécessaire pour repasser à un cron plus
   fréquent.

Sans cette bascule, **rester en mode démo local est parfaitement sain** pour
faire des démonstrations client — c'est justement ce que ce module permet de
tester de bout en bout dès aujourd'hui.

## Délai avant envoi — configurable, jamais codé en dur

Trois niveaux, du plus spécifique au plus général :

1. `business.reviewDelayHours` dans `lib/reviews/businesses.ts` — propre à
   CE commerce (un restaurant n'a pas le même rythme idéal qu'une boutique
   ou un bar à jeux).
2. `REVIEW_REQUEST_DELAY_HOURS` (variable d'environnement, défaut **3**) si
   le commerce n'a pas de valeur propre.
3. `delayMinutesOverride` dans la requête — prioritaire sur les deux
   précédents, utilisé uniquement par la page de démo pour tester en
   quelques minutes plutôt qu'en heures.

## Architecture

```
lib/reviews/
  types.ts                Types partagés + interfaces EmailProvider / ReviewJobStore
  businesses.ts           Registre des commerces (brand tokens + lien avis Google)
  store.ts                Sélection memory/supabase selon REVIEWS_STORE_MODE
  supabase-store.ts       Persistance réelle (mode "supabase")
  email-provider.ts       Sélection demo/live selon EMAIL_MODE
  scheduler.ts            scheduleReviewRequest() + processDueJobs() + poller de dev
  templates/
    review-request.tsx    Template HTML de l'email (styles inline, tables)
app/api/
  reservations/route.ts        POST — crée une réservation, planifie la relance
  reviews/run/route.ts         GET/POST — envoie tout ce qui est dû (cron)
  reviews/status/route.ts      GET — liste des jobs (suivi commerçant)
  reviews/unsubscribe/route.ts GET — désinscription (lien depuis l'email)
app/demo/avis/            Page sandbox : créer une réservation fictive + suivi live
vercel.json               Config Vercel Cron → /api/reviews/run 1x/jour (9h, limite plan Hobby)
```

## Fonctionnalités

1. **Planification** (`scheduleReviewRequest`) — calcule `sendAt`, vérifie la
   désinscription, persiste le job.
2. **Envoi** (`processDueJobs`) — appelée par la route cron ET par un petit
   poller local (dev uniquement, `setInterval` 15s, jamais actif en
   production) pour que la démo tourne toute seule sans curl manuel.
3. **Statut** (`/api/reviews/status`) — un statut par job
   (`scheduled`/`sent`/`simulated`/`error`/`canceled`), horodaté. Simplification
   volontaire par rapport à une table `email_log` séparée : la relation
   réservation ↔ email est 1:1 ici, un job EST son propre log.
4. **Désinscription** (`/api/reviews/unsubscribe?id=...`) — lien présent
   dans chaque email, marque le job + empêche toute future relance pour ce
   couple commerce/email. ⚠️ Simplification démo : le token est l'id du job
   en clair — en production, préférer un token opaque signé (HMAC).
5. **Ouverture trackée** — non implémentée (structure prête : il suffirait
   d'un pixel de tracking dans le template + un champ `openedAt` sur
   `ReviewJob`/la table Supabase).

## Démo locale

`EMAIL_MODE` non défini (ou `demo`) → ouvrir **`/demo/avis`** :

1. Remplir le formulaire (délai en **minutes**, pas en heures, pour tester
   vite) et cliquer sur *Créer la réservation*.
2. Le job apparaît dans la liste, statut *Planifiée*.
3. Sans rien faire d'autre, il passe à *Simulée* au bout du délai choisi (le
   poller local vérifie toutes les 15s) — ou cliquer sur *Forcer la
   vérification* pour ne pas attendre.
4. La console du serveur affiche la ligne `[reviews:demo] Email simulé → ...`.

## Sécurité

- Aucune credential codée en dur : tout vient de l'environnement.
- Clés lues uniquement côté serveur (routes API / lib), jamais exposées au client.
- En `live`/`supabase`, si les credentials manquent, le module renvoie une
  erreur claire — il ne casse jamais le reste du site.
- `/api/reviews/status` et `/api/reviews/run` n'ont aucune authentification
  pour l'instant (démo) — à protéger (secret partagé en en-tête, vérifié
  contre une variable d'environnement) avant tout déploiement public.
