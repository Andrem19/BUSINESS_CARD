# Remart Business Card

Minimal static portfolio card for Remart. It highlights selected public projects,
contact details, and a compact overview of the development focus.

## Contents
- Responsive static HTML/CSS/JavaScript site
- Light/dark theme toggle
- Featured project cards rendered from `assets/js/projects.js`
- GitHub Actions deployment workflow for a VPS target

## Local development

Serve the root directory with any static server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in the browser.

## Deployment

On every push to the `main` branch, a GitHub Actions workflow connects to the VPS over SSH and uses `rsync` to sync the repository contents to `/var/www/remart.com` (the Nginx web root). Secrets for SSH host, user, and key are stored in GitHub Actions secrets.

### Required repository secrets

Add these in Settings → Secrets and variables → Actions:

- `DEPLOY_HOST` — server IP or domain
- `DEPLOY_USER` — deploy user on the server
- `DEPLOY_PORT` — SSH port (usually 22)
- `DEPLOY_SSH_KEY` — private key for the deploy user (no passphrase)
- `DEPLOY_PATH` — deploy path, e.g. `/var/www/remart.com`
