#!/bin/bash

rm -f payload.zip

npm i

zip -r payload.zip *
