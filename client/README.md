# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Environment Variables

Copy `.env.example` to one of the following (ignored by git) and adjust values:

```
cp client/.env.example client/.env.local
```

Variables:

| Name | Required | Description |
|------|----------|-------------|
| `VITE_API_URL` | Yes | Base API endpoint. May include or omit trailing `/api` (it will be normalized). Example: `https://api.convocationmedal.ccsuniversity.ac.in/api` |
| `VITE_UPLOADS_BASE_URL` | No | Explicit origin for uploaded file access. If unset, derived by stripping `/api` from `VITE_API_URL`. |

The frontend builds URLs for uploaded files with the pattern: `${uploadsBase}/uploads/<filename>`.

## GitHub Actions / CI

The repository contains:

* `deploy-frontend.yml` and `deploy-backend.yml` for production docker image pushes (branch `production`).
* `build.yml` for CI verification on PRs / pushes to `main`.

To override hardcoded defaults in `build.yml`, add repository secrets:

| Secret Name | Purpose |
|-------------|---------|
| `VITE_API_URL` | Overrides default API URL during CI build |
| `VITE_UPLOADS_BASE_URL` | Overrides uploads base |

Then modify the `Prepare env vars` step to export them (example):

```
echo "VITE_API_URL=${{ secrets.VITE_API_URL }}" >> $GITHUB_ENV
echo "VITE_UPLOADS_BASE_URL=${{ secrets.VITE_UPLOADS_BASE_URL }}" >> $GITHUB_ENV
```

## Local Development

```
cd client
npm install
npm run dev
```

Ensure the backend is running (default `http://localhost:5000`). Without env vars set, the app falls back to that origin.
