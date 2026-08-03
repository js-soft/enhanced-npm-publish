set -e
set -x

npm ci
npm run lint:prettier
npx license-check
npx better-npm-audit audit
