# Déploiement — Rebranding K1000 Studio

Ce fichier documente les étapes manuelles restantes après le rebranding
NOVA Studio → K1000 Studio effectué le 20/07/2026. Tout ce qui pouvait être
automatisé l'a été ; ce qui suit nécessite un accès à des comptes externes
(Vercel, registrar DNS) que cet environnement n'a pas.

## ✅ Déjà fait automatiquement

- **Code et contenu** : toutes les mentions "NOVA"/"NOVA Studio" remplacées
  par "K1000"/"K1000 Studio" dans le code, le contenu, les métadonnées
  (title, OG, Twitter Card, JSON-LD), `package.json`, la documentation
  interne (`README.md`, `CHANGELOG.md`, `INSPIRATION.md`, etc.) et les
  pages archivées (`_archive/v2`, `_archive/signature`, `_archive/v3-layout`).
  Recherche exhaustive confirmée vide (voir `CHANGELOG.md`).
- **Dépôt GitHub** : renommé de `SabakuMansa/NOVA` vers
  `SabakuMansa/k1000-studio`. Le remote local (`git remote -v`) a été mis à
  jour automatiquement par `gh repo rename`.
- **Build de production** : `npm run build` vérifié sans erreur après le
  rebranding.
- **Push** : les changements ont été poussés sur `origin/main` (voir statut
  en bas de ce document).

## ⚠️ À faire manuellement — Vercel

L'outil `vercel` (CLI) n'est pas installé/authentifié dans cet
environnement — impossible d'automatiser cette partie. À faire sur
[vercel.com](https://vercel.com), dans le projet lié à ce dépôt :

### 1. Renommer le projet Vercel

**Project Settings → General → Project Name** → renommer en `k1000-studio`
(ou équivalent) pour cohérence avec le nouveau nom du dépôt GitHub.

> Le lien entre Vercel et GitHub se fait par l'identifiant interne du
> dépôt, pas par son nom — le renommage GitHub déjà effectué ne devrait
> **pas** casser le déploiement automatique. À vérifier tout de même après
> le prochain push (un déploiement doit se déclencher normalement).

### 2. Ajouter le domaine principal

**Project Settings → Domains → Add** :

```
k1000studio.fr
```

Le définir comme domaine de production principal (bouton "Set as Primary"
si plusieurs domaines sont rattachés au projet).

### 3. Ajouter les deux domaines secondaires en redirection

Toujours dans **Domains**, ajouter :

```
k1000.fr
k1000studio.com
```

Pour **chacun des deux**, une fois ajouté : cliquer sur le domaine dans la
liste → option **"Redirect to k1000studio.fr"** → choisir **redirection
301 (permanente)**, pas une réponse dupliquée du même site sous deux noms
(mauvais pour le SEO — un seul domaine canonique).

## ⚠️ À faire manuellement — DNS chez le registrar

Une fois les 3 domaines ajoutés au projet Vercel (étape précédente), Vercel
affiche pour **chacun** les enregistrements DNS exacts à créer (généralement
un enregistrement `A` pointant vers `76.76.21.21` pour le domaine racine, ou
un `CNAME` vers `cname.vercel-dns.com` pour un sous-domaine — Vercel indique
la valeur précise au moment de l'ajout, à copier telle quelle).

1. Se connecter à l'interface du registrar où `k1000.fr` et `k1000studio.fr`
   (et `k1000studio.com` si acheté séparément) ont été enregistrés.
2. Pour chacun des 3 domaines, ouvrir la zone DNS et ajouter l'enregistrement
   indiqué par Vercel (ne pas improviser une valeur — copier celle affichée
   dans l'interface Vercel pour ce domaine précis).
3. Attendre la propagation DNS — de quelques minutes à 24–48h selon le
   registrar et le TTL configuré. Vercel affiche un statut "Valid
   Configuration" une fois la propagation détectée ; en attendant, le
   domaine peut afficher une erreur de certificat SSL le temps que Vercel
   provisionne le certificat (automatique, aucune action requise une fois
   le DNS propagé).

## Statut au moment de la rédaction

- Push GitHub : voir `CHANGELOG.md` (entrée du 20/07/2026) et l'historique
  `git log` pour le hash du commit poussé.
- Déploiement Vercel : déclenché automatiquement par le push si l'intégration
  GitHub → Vercel est active sur ce dépôt ; à vérifier sur le dashboard
  Vercel (statut du dernier déploiement pour le commit du rebranding).
