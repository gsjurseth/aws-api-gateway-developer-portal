#!/usr/bin/env bash

trap 'exit' ERR
ROOT_DIR=$(pwd)

EB_AWS_ACCOUNT=${EB_AWS_ACCOUNT:-cco-dev}

# Activate clean virtualenv.
VENV=.venv-deploy
if [ ! -d $VENV ]; then
  virtualenv $VENV
fi
if [ -f $VENV/bin/activate ]; then
  . $VENV/bin/activate
else
  # On Windows, not bin for some reason.
  . $VENV/Scripts/activate
fi

# Install golem.
pip install \
  --upgrade \
  --extra-index-url=https://pypi.ebuilder.io/simple \
  golemtools

# Deploy service infrastructure
cd $ROOT_DIR
golem deploy \
  --profile $EB_AWS_ACCOUNT:deploy \
  --traceback \
  -vvv \
  .
