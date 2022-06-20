#!/usr/bin/env sh
# abort on errors
npm run build
# navigate into the build output directory
cd dist
# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME
git init
git add -A
git commit -m 'deploying project Team 3'
git push -f git@github.com:keshavDooleea/INF8808E_SportsAI_Team3.git master:gh-pages
cd -