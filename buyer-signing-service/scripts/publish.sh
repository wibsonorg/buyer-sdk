#!/usr/bin/env bash

package_name=$1

rm -rf artifacts
mkdir artifacts package
cp -r contracts package/
cp -r dist package/
cp -r config package/
cp -r node_modules package/
cp package.json package/
cp .env.example package/
tar -zcf artifacts/$package_name.tar.gz -C package .
rm -r package
