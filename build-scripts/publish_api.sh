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

# Publish every apigw api.
cd $ROOT_DIR/apigw
for APIGW_DIR in */; do
  s3 upload \
    --profile $EB_AWS_ACCOUNT:deploy \
    --traceback \
    -vvv \
    ebuilder-swaggers-$EB_AWS_ACCOUNT.ebuilder.io \
    $APIGW_DIR \
    $APIGW_DIR
done
