#!/usr/bin/env sh

npm run build

cd dist

git init
git add -A
git commit -m 'deploying SportsAI project - Team 3'
git push -f git@github.com:keshavDooleea/INF8808E_SportsAI_Team3.git master:gh-pages

cd -