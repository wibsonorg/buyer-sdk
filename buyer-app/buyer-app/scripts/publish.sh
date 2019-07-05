#!/usr/bin/env bash

package_name=$1
package_version=$2

rm -rf artifacts
mkdir artifacts
tar -zcf artifacts/${package_name}-bda-v${package_version}.tar.gz -C build-bda .
tar -zcf artifacts/${package_name}-jampp-v${package_version}.tar.gz -C build-jampp .
