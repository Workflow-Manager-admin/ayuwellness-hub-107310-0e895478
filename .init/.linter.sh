#!/bin/bash
cd /home/kavia/workspace/code-generation/ayuwellness-hub-107310-0e895478/reactjs_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

