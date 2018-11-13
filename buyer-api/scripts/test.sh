#!/usr/bin/env bash

# TODO: take these values from the environment
ganache_port=8545
signing_service_port=9101
signing_service_url="http://localhost:$signing_service_port/health"

# Script based on:
# https://github.com/OpenZeppelin/openzeppelin-solidity/blob/0b33d29e411893b134ad67ca92043e8629c44325/scripts/test.sh

# Exit script as soon as a command fails.
set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the ganache instance that we started (if we started one and if it's still running).
  if [ -n "$ganache_pid" ] && ps -p "$ganache_pid" > /dev/null; then
    kill -9 "$ganache_pid"
  fi

  if [ -n "$signing_service_pid" ] && ps -p "$signing_service_pid" > /dev/null; then
    kill -9 "$signing_service_pid"
  fi
}

is_service_running() {
  nc -z localhost "$1"
}

start_ganache() {
  echo -ne "Ganache is starting...\r"
  node_modules/.bin/ganache-cli --gasLimit 0xfffffffffff --port "$ganache_port" > /dev/null &
  ganache_pid=$!
  echo "Ganache is starting... DONE (pid: ${ganache_pid})"
}

start_signing_service() {
  echo -e "\rSigning Service is starting..."

  currentDir=`pwd`
  cd ../buyer-signing-service
  npm start > /dev/null &

  set +o errexit
  i=0
  health=""
  while [ $i -lt 10 ] && [ -z $health ]; do
    echo -e "\rHealth check ${i} / 10"
    health=`curl --silent --fail $signing_service_url`
    i=$[$i+1]
    sleep 1
  done
  set -o errexit

  if [[ -z $health ]]; then
    echo -e "\rSigning Service could not start"
    exit 1
  else
    signing_service_pid=`cat ./service.pid`
    echo -e "\rSigning Service is starting... DONE (pid: ${signing_service_pid})"
  fi

  cd $currentDir
}

if is_service_running $ganache_port; then
  echo "Ganache is already running"
else
  start_ganache
fi

if is_service_running $signing_service_port; then
  echo "Signing Service is already running"
else
  start_signing_service
fi

node_modules/.bin/ava --tap | tap-spec
