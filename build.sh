#!/usr/bin/env bash

mkdir -p ./dist

rm -rf ./dist/*

cp ./index.html ./dist/index.html
cp ./package.json ./dist/package.json

cp -R ./assets/ ./dist/assets
