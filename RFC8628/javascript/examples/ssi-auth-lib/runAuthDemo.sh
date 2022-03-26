#!/bin/sh
if test -n "$APPDIR"
then
  echo cd $APPDIR
  cd $APPDIR
fi
pm2 restart --log ~/logs/auth-demo.log ecosystem.config.js
