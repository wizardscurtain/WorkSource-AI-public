# WorkSource-AI-public

Automated deployment to GitHub Pages with custom domain `kabam.worksource.ai`.

## Development

```bash
npm install
npm start
```

## Deploy (GitHub Actions)

Push to `main` triggers the workflow `.github/workflows/deploy.yml` which:

1. Installs dependencies (Node 20)
2. Builds the React app (`npm run build`)
3. Injects `CNAME` and creates `404.html` for SPA routing
4. Publishes the `build/` folder to GitHub Pages

Manual trigger: Actions tab -> Deploy Kabam Site -> Run workflow.

## Changing the Domain

Update `package.json` `homepage` field and adjust `echo 'your.domain' > build/CNAME` step in the workflow if the domain changes. Also update DNS CNAME to point to `wizardscurtain.github.io`.

## Local Production Preview

```bash
npm run build
npx serve -s build
```

## Notes

- `docs/` folder no longer needed for deployment; Pages uses the artifact from the action.
- 404 fallback ensures React Router / SPA deep links work.
