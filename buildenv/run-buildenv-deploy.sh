#!/usr/bin/env bash

trap 'exit' ERR

ROOT_DIR=$(pwd)
cd buildenv/deploy
docker build -t buildenv-deploy .

env | ( grep EB_ > $TMPDIR/.ebbuildenvs || true )

cd $ROOT_DIR
docker run\
 --rm\
 -w /work\
 -v $(pwd):/work\
 -v ~/.aws/credentials:/root/.aws/credentials\
 --env-file $TMPDIR/.ebbuildenvs\
 buildenv-deploy $@
