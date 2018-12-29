#!/usr/bin/env bash

package_name=$1

rm -rf artifacts
mkdir artifacts
tar -zcf artifacts/${package_name}.tar.gz -C build .
