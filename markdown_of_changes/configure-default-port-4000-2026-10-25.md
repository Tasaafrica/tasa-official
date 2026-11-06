# Date: 2026-10-25

## Summary
Configured the application to default to port 4000 by adding the `-p 4000` flag to the `dev` and `start` scripts in `package.json`, and updating `PORT`, `NEXTAUTH_URL`, and `AUTH_COOKIE_DOMAINS` in `.env`.

## Modifications
- `package.json`: Lines 6, 8
- `.env`: Lines 2, 3, 16

## Commit Draft - Short
chore: configure default application port to 4000

## Commit Draft - Long
chore: configure default application port to 4000

Updated the `dev` and `start` scripts in `package.json` to include the `-p 4000` CLI flag, allowing Next.js to run on port 4000 by default. Also synchronized the development environment configuration in `.env` with `PORT=4000`, `NEXTAUTH_URL=http://localhost:4000`, and updated cookie domain entries to maintain authentication integrity.
