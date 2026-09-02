# Vercel deploy fix

This package is prepared for a clean Linux/Vercel install.

## Why the previous deployment failed

The previous archive contained `node_modules` installed on Windows and Vite is a development dependency. In an environment that omitted dev dependencies, `vite build` failed with `vite: command not found`. Reusing the Windows `node_modules` on Linux also fails because Rollup/esbuild/Tailwind native binaries are platform-specific.

## Fixed configuration

- Do **not** upload/commit `node_modules`.
- Vercel install command: `npm ci --include=dev`.
- Vercel build command: `npm run build`.
- Build script invokes Vite directly through Node: `node ./node_modules/vite/bin/vite.js build`.
- Output directory: `dist`.
- Node runtime: `20.x`.

If Vercel Project Settings contain custom Install/Build commands, set them to the same values above or remove the overrides so `vercel.json` is used.
