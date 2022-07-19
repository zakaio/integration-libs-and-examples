#!/bin/sh
if test -n "$APPDIR"
then
  echo cd $APPDIR
  cd $APPDIR
fi
pm2 restart ecosystem.config.js
