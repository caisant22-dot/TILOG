#!/bin/sh
cd /Users/mac/Documents/Projetos/Tilog
export PATH="/Users/mac/.nvm/versions/node/v24.15.0/bin:$PATH"
exec node node_modules/.bin/next dev --webpack
