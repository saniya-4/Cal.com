# Project Setup Log

1. Created `frontend` folder.
2. Created `backend` folder.
3. Initialized Node.js project in `backend` using `npm init -y`.
4. Installed Express.js in `backend` using `npm install express`.
5. Updated `backend/package.json` description to "Backend server using Express.js".
6. Added `start` script in `backend/package.json` as `node index.js`.
7. Added `dev` script in `backend/package.json` as `node index.js`.
8. Created `backend/index.js` with a basic Express server.
9. Added root route `/` returning JSON: `{ "message": "Backend is running with Express.js" }`.
10. Configured server to run on `process.env.PORT || 5000`.

## Ongoing Change Log

11. Added this line-by-line README logging as requested.
12. Confirmed backend setup is complete and ready to run.
13. Initialized Vite frontend project in `frontend` using React template.
14. Installed frontend project dependencies using `npm install`.
15. Installed Tailwind CSS package set (`tailwindcss`, `postcss`, `autoprefixer`).
16. Installed Bootstrap for UI styling.
17. Installed `@tailwindcss/vite` plugin for Tailwind + Vite integration.
18. Updated `frontend/vite.config.js` to register the Tailwind Vite plugin.
19. Updated `frontend/src/index.css` to include `@import "tailwindcss";`.
20. Updated `frontend/src/main.jsx` to import Bootstrap CSS.
21. Ran `npm run build` in `frontend` to verify the setup; build completed successfully.
22. Checked edited files for linter issues; no linter errors found.
