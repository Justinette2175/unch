#!/bin/sh -e

( cd font-end-template && npm install && npm run build )
rsync -av --delete --filter 'protect .gitignore' font-end-template/build/* srv/
