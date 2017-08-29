#!/bin/bash

rm -rf content/*
cd ../../dev-portal
rm -rf build
npm run build
cd -
cp -a ../../dev-portal/build/* content
touch content/error.html
